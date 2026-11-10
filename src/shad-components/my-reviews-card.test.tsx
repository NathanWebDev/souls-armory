import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MyReviewsCard } from "./my-reviews-card";

describe("MyReviewsCard", () => {
  it("links each review to its weapon page", () => {
    render(
      <MyReviewsCard
        reviews={[
          { id: "r1", rating: 4, title: "Solid", itemId: "i1", itemTitle: "Dagger" },
          { id: "r2", rating: 2, title: "Meh", itemId: "i2", itemTitle: "Katana" },
        ]}
      />
    );
    expect(screen.getByRole("link", { name: /Dagger/ })).toHaveAttribute("href", "/item-card/i1");
    expect(screen.getByRole("link", { name: /Katana/ })).toHaveAttribute("href", "/item-card/i2");
    expect(screen.getByText("4/5")).toBeInTheDocument();
  });

  it("shows an empty state when there are no reviews", () => {
    render(<MyReviewsCard reviews={[]} />);
    expect(screen.getByText(/haven't reviewed any weapons/)).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });
});
