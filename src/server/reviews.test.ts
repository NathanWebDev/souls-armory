import { beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.hoisted(() => vi.fn());
const hasReviewed = vi.hoisted(() => vi.fn());
const values = vi.hoisted(() => vi.fn());
const insert = vi.hoisted(() => vi.fn(() => ({ values })));
const update = vi.hoisted(() => vi.fn(() => ({ set: () => ({ where: () => Promise.resolve() }) })));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/auth", () => ({ auth: { api: { getSession } } }));
vi.mock("@/lib/review-routes", () => ({ hasReviewed }));
vi.mock("@/db/drizzle", () => ({ db: { insert, update } }));

import { addReview } from "./reviews";

const input = { itemId: "i1", rating: 5, title: "Great", body: "Loved it" };

describe("addReview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSession.mockResolvedValue({ user: { id: "u1" } });
    hasReviewed.mockResolvedValue(false);
    values.mockResolvedValue(undefined);
  });

  it("rejects signed-out users", async () => {
    getSession.mockResolvedValue(null);
    await expect(addReview(input)).resolves.toMatchObject({ success: false });
    expect(insert).not.toHaveBeenCalled();
  });

  it("blocks a second review by the same user", async () => {
    hasReviewed.mockResolvedValue(true);
    await expect(addReview(input)).resolves.toEqual({
      success: false,
      message: "You have already reviewed this weapon.",
    });
    expect(hasReviewed).toHaveBeenCalledWith("i1", "u1");
    expect(insert).not.toHaveBeenCalled();
  });

  it("saves a first review and updates the item rating", async () => {
    await expect(addReview(input)).resolves.toEqual({ success: true });
    expect(values).toHaveBeenCalledWith({ ...input, userId: "u1" });
    expect(update).toHaveBeenCalled();
  });
});
