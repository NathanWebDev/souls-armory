import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const routingHandeler = vi.fn();
let query = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/home",
  useSearchParams: () => new URLSearchParams(query),
}));
vi.mock("@/shad-components/nav-user", () => ({
  routingHandeler: (...args: unknown[]) => routingHandeler(...args),
}));

import SearchBar from "./page";

const commands = [
  { value: "dark-moon-greatsword", label: "Dark Moon Greatsword", gameTitle: "Elden Ring" },
  { value: "saw-cleaver", label: "Saw Cleaver", gameTitle: "Bloodborne" },
  { value: "kirkhammer", label: "Kirkhammer", gameTitle: "Bloodborne" },
];

describe("SearchBar", () => {
  beforeEach(() => {
    push.mockReset();
    routingHandeler.mockReset();
    query = "";
    window.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    Element.prototype.scrollIntoView ??= vi.fn();
  });

  it("suggests items from every game when no filter is active", async () => {
    render(<SearchBar commands={commands} />);
    await userEvent.type(screen.getByPlaceholderText("Search for items..."), "a");
    expect(screen.getByText("Dark Moon Greatsword")).toBeInTheDocument();
    expect(screen.getByText("Saw Cleaver")).toBeInTheDocument();
  });

  it("limits suggestions to the active game", async () => {
    query = "game=Bloodborne";
    render(<SearchBar commands={commands} />);
    await userEvent.type(screen.getByPlaceholderText("Search for items..."), "a");
    expect(screen.getByText("Saw Cleaver")).toBeInTheDocument();
    expect(screen.queryByText("Dark Moon Greatsword")).not.toBeInTheDocument();
  });

  it("shows a tag for the active game and none otherwise", () => {
    const { unmount } = render(<SearchBar commands={commands} />);
    expect(screen.queryByLabelText(/Clear .* filter/)).not.toBeInTheDocument();
    unmount();
    query = "game=Bloodborne";
    render(<SearchBar commands={commands} />);
    expect(screen.getByLabelText("Clear Bloodborne filter")).toBeInTheDocument();
  });

  it("removes the game param when the tag is cleared, keeping other params", async () => {
    query = "game=Bloodborne&foo=1";
    render(<SearchBar commands={commands} />);
    await userEvent.click(screen.getByLabelText("Clear Bloodborne filter"));
    expect(push).toHaveBeenCalledWith("/home?foo=1");
  });

  it("goes to the item page by absolute path on select", async () => {
    render(<SearchBar commands={commands} />);
    await userEvent.type(screen.getByPlaceholderText("Search for items..."), "Kirk");
    await userEvent.click(screen.getByText("Kirkhammer"));
    expect(routingHandeler).toHaveBeenCalledWith("/item-card/kirkhammer");
  });
});
