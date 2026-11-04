import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const setTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({ setTheme }),
}));

import { SidebarProvider } from "@/shad-components/ui/sidebar";
import { ThemeSwitcher } from "./theme-switcher";

const items = [
  { title: "Light", action: "light", icon: () => <svg /> },
  { title: "Dark", action: "dark", icon: () => <svg /> },
];

function renderSwitcher() {
  render(
    <SidebarProvider>
      <ThemeSwitcher items={items} />
    </SidebarProvider>
  );
}

function mockReduceMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduce,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
}

describe("ThemeSwitcher", () => {
  const doc = document as unknown as { startViewTransition?: unknown };

  beforeEach(() => {
    setTheme.mockReset();
    mockReduceMotion(false);
  });

  afterEach(() => {
    delete doc.startViewTransition;
  });

  it("sets the theme inside a view transition when supported", async () => {
    const startViewTransition = vi.fn((update: () => void) => update());
    doc.startViewTransition = startViewTransition;
    renderSwitcher();

    await userEvent.click(screen.getByText("Dark"));

    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches instantly when view transitions are unsupported", async () => {
    renderSwitcher();

    await userEvent.click(screen.getByText("Light"));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("skips the transition when the user prefers reduced motion", async () => {
    const startViewTransition = vi.fn((update: () => void) => update());
    doc.startViewTransition = startViewTransition;
    mockReduceMotion(true);
    renderSwitcher();

    await userEvent.click(screen.getByText("Dark"));

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("does not navigate to # when a theme link is clicked", async () => {
    renderSwitcher();
    const link = screen.getByText("Dark").closest("a")!;
    const notPrevented = link.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );

    expect(notPrevented).toBe(false);
  });
});
