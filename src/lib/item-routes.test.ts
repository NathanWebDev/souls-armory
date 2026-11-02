import { beforeEach, describe, expect, it, vi } from "vitest";

const where = vi.fn();
const from = vi.fn(() => ({ where }));
const select = vi.fn(() => ({ from }));

vi.mock("@/db/drizzle", () => ({
  db: { select: () => select() },
}));

import { getAllItems } from "./item-routes";

describe("getAllItems", () => {
  beforeEach(() => {
    where.mockReset();
    where.mockResolvedValue([]);
  });

  it("applies no filter when no game is given", async () => {
    await getAllItems();
    expect(where).toHaveBeenCalledWith(undefined);
  });

  it("applies a filter when a game is given", async () => {
    await getAllItems("Elden Ring");
    expect(where.mock.calls[0][0]).toBeDefined();
  });

  it("returns whatever rows the query yields", async () => {
    const rows = [{ id: "a", title: "A", imgUrl: "x", type: "t", rating: 5 }];
    where.mockResolvedValue(rows);
    await expect(getAllItems("Elden Ring")).resolves.toEqual(rows);
  });
});
