import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const requestPasswordReset = vi.hoisted(() => vi.fn());
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock("sonner", () => ({ toast }));
vi.mock("better-auth/client", () => ({
  createAuthClient: () => ({ requestPasswordReset }),
}));

import { ForgotPasswordForm } from "./forgot-password-form";

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    requestPasswordReset.mockReset();
    requestPasswordReset.mockResolvedValue({ data: {}, error: null });
    toast.success.mockReset();
  });

  it("requests a reset link and tells the user to check their email", async () => {
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByPlaceholderText("email@example.com"), "n@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("If that email has an account, a reset link is on its way.")
    );
    expect(requestPasswordReset).toHaveBeenCalledWith({
      email: "n@example.com",
      redirectTo: "/user/reset-password",
    });
  });

  it("shows the same message when the email has no account", async () => {
    requestPasswordReset.mockResolvedValue({ data: null, error: { message: "User not found" } });
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByPlaceholderText("email@example.com"), "nobody@example.com");
    await userEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
    expect(toast.success.mock.calls[0][0]).not.toContain("not found");
  });

  it("does not send a request for an invalid email", async () => {
    render(<ForgotPasswordForm />);
    await userEvent.type(screen.getByPlaceholderText("email@example.com"), "x");
    await userEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(await screen.findByText("Please enter a valid email address")).toBeInTheDocument();
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });
});
