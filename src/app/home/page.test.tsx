import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getAllItems = vi.fn();

vi.mock("../../lib/item-routes", () => ({
  getAllItems: (...args: unknown[]) => getAllItems(...args),
}));
vi.mock("@/app/components/item/page", () => ({
  default: ({ itemTileData }: { itemTileData: { id: string }[] }) => (
    <div data-testid="tiles">{itemTileData.length}</div>
  ),
}));

import Home from "./page";

const item = { id: "a", title: "A", imgUrl: "x", type: "t", rating: 5 };

async function renderHome(params: { game?: string | string[] }) {
  render(await Home({ searchParams: Promise.resolve(params) }));
}

describe("Home", () => {
  beforeEach(() => {
    getAllItems.mockReset();
    getAllItems.mockResolvedValue([item]);
  });

  it("loads every item when no game is given", async () => {
    await renderHome({});
    expect(getAllItems).toHaveBeenCalledWith(undefined);
    expect(screen.getByTestId("tiles")).toHaveTextContent("1");
  });

  it("filters by a single game", async () => {
    await renderHome({ game: "Elden Ring" });
    expect(getAllItems).toHaveBeenCalledWith("Elden Ring");
  });

  it("uses the first value when the game is repeated in the URL", async () => {
    await renderHome({ game: ["Bloodborne", "Elden Ring"] });
    expect(getAllItems).toHaveBeenCalledWith("Bloodborne");
  });

  it("shows the empty message when nothing matches", async () => {
    getAllItems.mockResolvedValue([]);
    await renderHome({ game: "Demon Souls" });
    expect(screen.getByText("No items for this game yet.")).toBeInTheDocument();
    expect(screen.queryByTestId("tiles")).not.toBeInTheDocument();
  });
});
