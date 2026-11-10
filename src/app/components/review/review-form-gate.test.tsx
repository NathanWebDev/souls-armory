import { beforeEach, describe, expect, it, vi } from "vitest";

const hasReviewed = vi.hoisted(() => vi.fn());

vi.mock("@/lib/review-routes", () => ({ hasReviewed }));
vi.mock("@/app/components/review/review-form", () => ({ default: () => null }));

import ReviewForm from "@/app/components/review/review-form";
import ReviewFormGate from "./review-form-gate";

describe("ReviewFormGate", () => {
  beforeEach(() => hasReviewed.mockReset());

  it("hides the form when the user already reviewed the item", async () => {
    hasReviewed.mockResolvedValue(true);
    await expect(ReviewFormGate({ itemId: "i1", userId: "u1" })).resolves.toBeNull();
    expect(hasReviewed).toHaveBeenCalledWith("i1", "u1");
  });

  it("shows the form when the user has not reviewed yet", async () => {
    hasReviewed.mockResolvedValue(false);
    const el = await ReviewFormGate({ itemId: "i1", userId: "u1" });
    expect(el?.type).toBe(ReviewForm);
    expect(el?.props).toEqual({ itemId: "i1", signedIn: true });
  });

  it("shows the sign-in prompt for signed-out visitors without querying", async () => {
    const el = await ReviewFormGate({ itemId: "i1" });
    expect(el?.props).toEqual({ itemId: "i1", signedIn: false });
    expect(hasReviewed).not.toHaveBeenCalled();
  });
});
