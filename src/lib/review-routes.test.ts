import { beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";

const limit = vi.hoisted(() => vi.fn());
const orderBy = vi.hoisted(() => vi.fn(() => ({ limit })));

// Every builder call returns the same chain; `as` returns a stand-in subquery.
const chain: Record<string, unknown> = {};
const where = vi.fn(() => chain);
for (const m of ["from", "groupBy", "innerJoin", "leftJoin"]) chain[m] = () => chain;
chain.where = where;
chain.orderBy = orderBy;
chain.limit = limit;
chain.as = () => new Proxy({}, { get: () => ({}) });

vi.mock("@/db/drizzle", () => ({ db: { select: () => chain } }));

import { getReviews, getUserReviews, hasReviewed } from "./review-routes";

describe("getUserReviews", () => {
  it("returns the user's reviews, newest first", async () => {
    const rows = [{ id: "r1", itemId: "i1", itemTitle: "Dagger", rating: 4, title: "Nice" }];
    orderBy.mockClear();
    where.mockClear();
    (orderBy as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(Promise.resolve(rows));
    await expect(getUserReviews("u1")).resolves.toEqual(rows);
    const [filter] = where.mock.calls[0] as unknown as [never];
    const { sql, params } = new PgDialect().sqlToQuery(filter);
    expect(sql).toMatch(/"review"."user_id" = \$1/);
    expect(params).toEqual(["u1"]);
    const [newest] = orderBy.mock.calls[0] as unknown as [never];
    expect(new PgDialect().sqlToQuery(newest).sql).toMatch(/"created_at" desc/);
  });
});

describe("hasReviewed", () => {
  beforeEach(() => limit.mockReset());

  it("is true when the user has a review on the item", async () => {
    limit.mockResolvedValue([{ id: "r1" }]);
    await expect(hasReviewed("i1", "u1")).resolves.toBe(true);
  });

  it("is false when the user has no review on the item", async () => {
    limit.mockResolvedValue([]);
    await expect(hasReviewed("i1", "u1")).resolves.toBe(false);
  });
});

describe("getReviews ordering", () => {
  const dialect = new PgDialect();
  const firstOrder = (viewerId?: string) => {
    orderBy.mockClear();
    limit.mockReset();
    limit.mockResolvedValue([]);
    return getReviews("i1", viewerId).then(() => {
      const [viewerFirst, newest] = orderBy.mock.calls[0] as unknown as [never, never];
      return { viewerFirst: dialect.sqlToQuery(viewerFirst), newest: dialect.sqlToQuery(newest) };
    });
  };

  it("sorts the viewer's own review first, then newest first", async () => {
    const { viewerFirst, newest } = await firstOrder("u1");
    expect(viewerFirst.sql).toMatch(/"review"."user_id" = \$1 desc/);
    expect(viewerFirst.params).toEqual(["u1"]);
    expect(newest.sql).toMatch(/"created_at" desc/);
  });

  it("matches no real user when signed out, so order is newest first", async () => {
    const { viewerFirst } = await firstOrder();
    expect(viewerFirst.params).toEqual([""]);
  });

  it("sorts before the limit so the viewer's review is never cut off", async () => {
    await firstOrder("u1");
    expect(orderBy.mock.invocationCallOrder[0]).toBeLessThan(limit.mock.invocationCallOrder[0]);
  });
});
