import { beforeEach, describe, expect, it, vi } from "vitest";

const signUpEmail = vi.hoisted(() => vi.fn());

vi.mock("@/lib/auth", () => ({ auth: { api: { signUpEmail } } }));

import { signUp } from "./users";

describe("signUp", () => {
  beforeEach(() => {
    signUpEmail.mockReset();
  });

  it("creates the account with the username as the name", async () => {
    signUpEmail.mockResolvedValue({});
    const result = await signUp("n@example.com", "password123", "nathan");

    expect(signUpEmail).toHaveBeenCalledWith({
      body: { email: "n@example.com", password: "password123", name: "nathan" },
    });
    expect(result).toMatchObject({ success: true, message: expect.stringContaining("verify") });
  });

  it("returns the error message instead of throwing", async () => {
    signUpEmail.mockRejectedValue(new Error("User already exists"));
    await expect(signUp("n@example.com", "password123", "nathan")).resolves.toEqual({
      success: false,
      message: "User already exists",
    });
  });

  it("falls back to a generic message when the error has none", async () => {
    signUpEmail.mockRejectedValue(new Error(""));
    await expect(signUp("n@example.com", "password123", "nathan")).resolves.toMatchObject({
      success: false,
      message: "An error occurred during sign up.",
    });
  });
});
