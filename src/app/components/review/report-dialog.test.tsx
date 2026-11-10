import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const reportReview = vi.hoisted(() => vi.fn());

vi.mock("@/server/reviews", () => ({ reportReview }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { ReportDialog } from "./report-dialog";

const submit = () => screen.getByRole("button", { name: "Submit report" });

describe("ReportDialog", () => {
  it("stays disabled until a reason is chosen", async () => {
    render(<ReportDialog reviewId="r1" open onOpenChange={() => {}} />);
    expect(submit()).toBeDisabled();

    await userEvent.click(screen.getByLabelText("Inappropriate username"));
    expect(submit()).toBeEnabled();
  });

  it("needs a description for Other and sends it", async () => {
    reportReview.mockResolvedValue({ success: true });
    render(<ReportDialog reviewId="r1" open onOpenChange={() => {}} />);

    await userEvent.click(screen.getByLabelText("Other"));
    expect(submit()).toBeDisabled();

    await userEvent.type(screen.getByLabelText("Describe the problem"), "spam");
    await userEvent.click(submit());
    expect(reportReview).toHaveBeenCalledWith({ reviewId: "r1", reason: "other", details: "spam" });
  });
});
