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

  it("uses an empty description and no picture when none are saved", async () => {
    getSession.mockResolvedValue({
      user: { name: "Nathan", email: "n@example.com", image: null, description: null },
    });
    render(await Profile());
    expect(screen.getByTestId("form")).toHaveTextContent("Nathan||null");
  });
});
