import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdmin = vi.hoisted(() => vi.fn());
const banUser = vi.hoisted(() => vi.fn());
const recomputeRating = vi.hoisted(() => vi.fn());
const rows = vi.hoisted(() => vi.fn());
const where = vi.hoisted(() => vi.fn());
const del = vi.hoisted(() => vi.fn(() => ({ where })));

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/admin", () => ({ requireAdmin }));
vi.mock("@/lib/auth", () => ({ auth: { api: { banUser } } }));
vi.mock("@/lib/recompute-rating", () => ({ recomputeRating }));
vi.mock("@/db/drizzle", () => ({
  db: {
    select: () => ({ from: () => ({ innerJoin: () => ({ where: rows }), where: vi.fn() }) }),
    delete: del,
  },
}));

import { banReportedUser, deleteReportedReview, ignoreReports } from "./admin";

const target = { id: "r1", title: "Bad", itemId: "i1", authorId: "u2", authorName: "Tarnished" };

describe("admin actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdmin.mockResolvedValue({ user: { id: "admin1" } });
    rows.mockResolvedValue([target]);
    where.mockResolvedValue(undefined);
    banUser.mockResolvedValue(undefined);
  });

  it.each([banReportedUser, deleteReportedReview, ignoreReports])("rejects non-admins", async (action) => {
    requireAdmin.mockResolvedValue(null);
    await expect(action("r1")).resolves.toMatchObject({ success: false });
    expect(del).not.toHaveBeenCalled();
    expect(banUser).not.toHaveBeenCalled();
  });

  it("fails when the review is gone", async () => {
    rows.mockResolvedValue([]);
    await expect(ignoreReports("r1")).resolves.toMatchObject({ success: false });
  });

  it("bans the author and names them", async () => {
    await expect(banReportedUser("r1")).resolves.toEqual({ success: true, message: 'Banned user "Tarnished".' });
    expect(banUser).toHaveBeenCalledWith(expect.objectContaining({ body: expect.objectContaining({ userId: "u2" }) }));
    expect(del).toHaveBeenCalled();
  });

  it("keeps the reports when the ban fails", async () => {
    banUser.mockRejectedValue(new Error("boom"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(banReportedUser("r1")).resolves.toMatchObject({ success: false });
    expect(del).not.toHaveBeenCalled();
  });

  it("won't let an admin ban themselves", async () => {
    requireAdmin.mockResolvedValue({ user: { id: "u2" } });
    await expect(banReportedUser("r1")).resolves.toMatchObject({ success: false });
    expect(banUser).not.toHaveBeenCalled();
  });

  it("deletes the review and recomputes the item rating", async () => {
    await expect(deleteReportedReview("r1")).resolves.toEqual({
      success: true,
      message: 'Deleted the review "Bad" by Tarnished.',
    });
    expect(recomputeRating).toHaveBeenCalledWith("i1");
  });

  it("ignores reports without touching the review rating", async () => {
    await expect(ignoreReports("r1")).resolves.toEqual({
      success: true,
      message: 'Ignored the reports on "Bad" by Tarnished.',
    });
    expect(recomputeRating).not.toHaveBeenCalled();
  });
});
