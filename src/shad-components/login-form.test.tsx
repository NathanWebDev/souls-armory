import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const signInEmail = vi.hoisted(() => vi.fn());
const push = vi.fn();
const refresh = vi.fn();
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("sonner", () => ({ toast }));
vi.mock("better-auth/client", () => ({
  createAuthClient: () => ({
    signIn: { email: signInEmail, social: vi.fn() },
  }),
}));

import { LoginForm } from "./login-form";

async function submit() {
  await userEvent.type(screen.getByPlaceholderText("email@example.com"), "n@example.com");
  await userEvent.type(screen.getByPlaceholderText("***"), "password123");
  await userEvent.click(screen.getByRole("button", { name: "Login" }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    signInEmail.mockReset();
    push.mockReset();
    refresh.mockReset();
    toast.error.mockReset();
  });

  it("sends the user to the home page after a successful login", async () => {
    signInEmail.mockResolvedValue({ data: {}, error: null });
    render(<LoginForm />);
    await submit();

    await waitFor(() => expect(push).toHaveBeenCalledWith("/home"));
    expect(signInEmail).toHaveBeenCalledWith({ email: "n@example.com", password: "password123" });
    expect(refresh).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows the error and stays on the page when the login fails", async () => {
    signInEmail.mockResolvedValue({ data: null, error: { message: "Invalid email or password" } });
    render(<LoginForm />);
    await submit();

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Invalid email or password"));
    expect(push).not.toHaveBeenCalled();
  });
});
