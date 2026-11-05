import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EmailTemplate from "./email-template";

const base = { heading: "Hi", username: "Nathan", message: "Body", footnote: "Ignore me" };

describe("EmailTemplate", () => {
  it("shows the greeting, message and footnote", () => {
    render(<EmailTemplate {...base} />);
    expect(screen.getByText("Hello Nathan,")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Ignore me")).toBeInTheDocument();
  });

  it("renders no link when there is no button", () => {
    render(<EmailTemplate {...base} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the button link with the default black colour", () => {
    render(<EmailTemplate {...base} button={{ label: "Go", link: "https://x.test/a" }} />);
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).toHaveAttribute("href", "https://x.test/a");
    expect(link).toHaveStyle({ background: "rgb(0, 0, 0)" });
  });

  it("uses a custom button colour", () => {
    render(<EmailTemplate {...base} button={{ label: "Go", link: "https://x.test/a", color: "#b91c1c" }} />);
    expect(screen.getByRole("link", { name: "Go" })).toHaveStyle({ background: "rgb(185, 28, 28)" });
  });
});
