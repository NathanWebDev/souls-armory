import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const signUp = vi.hoisted(() => vi.fn());
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock("sonner", () => ({ toast }));
vi.mock("../server/users", () => ({ signUp }));
vi.mock("better-auth/client", () => ({
  createAuthClient: () => ({ signIn: { social: vi.fn() } }),
}));

import { SignUpForm } from "./signup-form";

async function submit() {
  await userEvent.type(screen.getByPlaceholderText("username"), "nathan");
  await userEvent.type(screen.getByPlaceholderText("email@example.com"), "n@example.com");
  await userEvent.type(screen.getByPlaceholderText("***"), "password123");
  await userEvent.click(screen.getByRole("button", { name: "Sign up" }));
}

describe("SignUpForm", () => {
  beforeEach(() => {
    signUp.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
  });

  it("creates the account and shows the server's success message", async () => {
    signUp.mockResolvedValue({ success: true, message: "Account created!" });
    render(<SignUpForm />);
    await submit();

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Account created!"));
    expect(signUp).toHaveBeenCalledWith("n@example.com", "password123", "nathan");
  });

  it("shows the server's error message when sign up fails", async () => {
    signUp.mockResolvedValue({ success: false, message: "User already exists" });
    render(<SignUpForm />);
    await submit();

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("User already exists"));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("rejects a too-short password before calling the server", async () => {
    render(<SignUpForm />);
    await userEvent.type(screen.getByPlaceholderText("username"), "nathan");
    await userEvent.type(screen.getByPlaceholderText("email@example.com"), "n@example.com");
    await userEvent.type(screen.getByPlaceholderText("***"), "short");
    await userEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("Password must be at least 8 characters")).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
  });
});
