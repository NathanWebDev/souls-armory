import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
let query = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(query),
}));

import { SidebarProvider } from "@/shad-components/ui/sidebar";
import { NavMain } from "./nav-main";

const items = [
  { title: "Elden Ring", url: "#" },
  { title: "Bloodborne", url: "#" },
];

function renderNav() {
  render(
    <SidebarProvider>
      <NavMain items={items} />
    </SidebarProvider>
  );
}

describe("NavMain", () => {
  beforeEach(() => {
    push.mockReset();
    query = "";
    window.matchMedia ??= vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("sets the game filter when a button is clicked", async () => {
    renderNav();
    await userEvent.click(screen.getByRole("button", { name: "Elden Ring" }));
    expect(push).toHaveBeenCalledWith("/home?game=Elden+Ring");
  });

  it("switches to another game", async () => {
    query = "game=Elden+Ring";
    renderNav();
    await userEvent.click(screen.getByRole("button", { name: "Bloodborne" }));
    expect(push).toHaveBeenCalledWith("/home?game=Bloodborne");
  });

  it("clears the filter when the active game is clicked again", async () => {
    query = "game=Elden+Ring";
    renderNav();
    await userEvent.click(screen.getByRole("button", { name: "Elden Ring" }));
    expect(push).toHaveBeenCalledWith("/home");
  });

  it("marks only the active game as active", () => {
    query = "game=Elden+Ring";
    renderNav();
    expect(screen.getByRole("button", { name: "Elden Ring" })).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("button", { name: "Bloodborne" })).toHaveAttribute("data-active", "false");
  });
});
