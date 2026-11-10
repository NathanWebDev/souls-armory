import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn();
const redirect = vi.fn((path: string) => {
  throw new Error(`NEXT_REDIRECT:${path}`);
});

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => redirect(path) }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: (...args: unknown[]) => getSession(...args) } },
}));
vi.mock("@/shad-components/profile-form", () => ({
  ProfileForm: (props: { name: string; description: string; image: string | null }) => (
    <div data-testid="form">{`${props.name}|${props.description}|${props.image}`}</div>
  ),
}));

const getUserReviews = vi.fn(async (_id: string) => [] as unknown[]);
vi.mock("@/lib/review-routes", () => ({ getUserReviews: (id: string) => getUserReviews(id) }));
vi.mock("@/shad-components/my-reviews-card", () => ({
  MyReviewsCard: (props: { reviews: unknown[] }) => <div data-testid="reviews">{props.reviews.length}</div>,
}));

import Profile from "./page";

describe("Profile page", () => {
  beforeEach(() => {
    getSession.mockReset();
    redirect.mockClear();
  });

  it("sends a signed-out visitor to the login page", async () => {
    getSession.mockResolvedValue(null);
    await expect(Profile()).rejects.toThrow("NEXT_REDIRECT:/user/login");
  });

  it("passes the signed-in user's details to the form", async () => {
    getSession.mockResolvedValue({
      user: { name: "Nathan", email: "n@example.com", image: "https://x/y.png", description: "Hi" },
    });
    render(await Profile());
    expect(screen.getByTestId("form")).toHaveTextContent("Nathan|Hi|https://x/y.png");
  });

  it("loads the signed-in user's reviews into the reviews card", async () => {
    getUserReviews.mockResolvedValue([{}, {}]);
    getSession.mockResolvedValue({
      user: { id: "u1", name: "Nathan", email: "n@example.com", image: null, description: null },
    });
    render(await Profile());
    expect(getUserReviews).toHaveBeenCalledWith("u1");
    expect(screen.getByTestId("reviews")).toHaveTextContent("2");
  });

  it("uses an empty description and no picture when none are saved", async () => {
    getSession.mockResolvedValue({
      user: { name: "Nathan", email: "n@example.com", image: null, description: null },
    });
    render(await Profile());
    expect(screen.getByTestId("form")).toHaveTextContent("Nathan||null");
  });
});
