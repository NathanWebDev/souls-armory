import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const signOut = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: { signOut: (...args: unknown[]) => signOut(...args) },
}));

import { SidebarProvider } from "@/shad-components/ui/sidebar";
import { NavUser } from "./nav-user";

function renderNav(user: React.ComponentProps<typeof NavUser>["user"]) {
  render(
    <SidebarProvider>
      <NavUser user={user} />
    </SidebarProvider>
  );
}

describe("NavUser", () => {
  beforeEach(() => {
    signOut.mockReset();
    signOut.mockResolvedValue({});
    window.matchMedia ??= vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    Element.prototype.hasPointerCapture ??= vi.fn();
    Element.prototype.scrollIntoView ??= vi.fn();
  });

  it("shows the user's name and email with initials when there is no picture", () => {
    renderNav({ name: "Nathan Drake", email: "n@example.com", avatar: null });
    expect(screen.getByText("Nathan Drake")).toBeInTheDocument();
    expect(screen.getByText("n@example.com")).toBeInTheDocument();
    expect(screen.getByText("ND")).toBeInTheDocument();
  });

  it("offers sign in when nobody is signed in", () => {
    renderNav(null);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByText("ND")).not.toBeInTheDocument();
  });

  it("ends the session when Log out is chosen", async () => {
    renderNav({ name: "Nathan Drake", email: "n@example.com", avatar: null });
    await userEvent.click(screen.getByRole("button", { name: /Nathan Drake/ }));
    await userEvent.click(await screen.findByText("Log out"));

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
