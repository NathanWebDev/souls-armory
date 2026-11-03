import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const resetPassword = vi.hoisted(() => vi.fn());
const push = vi.fn();
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock("sonner", () => ({ toast }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams("token=abc123"),
}));
vi.mock("@/lib/auth-client", () => ({ authClient: { resetPassword } }));

import { ResetPasswordForm } from "./reset-password-form";

async function submit(password: string, confirm: string) {
  await userEvent.type(screen.getByLabelText("Password"), password);
  await userEvent.type(screen.getByLabelText("Confirm Password"), confirm);
  await userEvent.click(screen.getByRole("button", { name: "Reset Password" }));
}

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    resetPassword.mockReset();
    push.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
  });

  it("resets the password with the link's token and goes to login", async () => {
    resetPassword.mockResolvedValue({ error: null });
    render(<ResetPasswordForm />);
    await submit("password123", "password123");

    await waitFor(() => expect(push).toHaveBeenCalledWith("/user/login"));
    expect(resetPassword).toHaveBeenCalledWith({ newPassword: "password123", token: "abc123" });
    expect(toast.success).toHaveBeenCalledWith("Password reset successfully");
  });

  it("does not call the server when the passwords differ", async () => {
    render(<ResetPasswordForm />);
    await submit("password123", "password456");

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Passwords do not match"));
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("shows the error and stays on the page when the reset fails", async () => {
    resetPassword.mockResolvedValue({ error: { message: "Invalid token" } });
    render(<ResetPasswordForm />);
    await submit("password123", "password123");

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Invalid token"));
    expect(push).not.toHaveBeenCalled();
  });
});
