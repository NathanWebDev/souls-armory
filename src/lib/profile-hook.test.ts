import { beforeEach, describe, expect, it, vi } from "vitest";

import { checkProfileUpdate } from "./profile-hook";

describe("checkProfileUpdate", () => {
  beforeEach(() => {
    vi.stubEnv("S3_BUCKET", "souls-bucket");
    vi.stubEnv("S3_REGION", "us-east-1");
    vi.stubEnv("S3_PUBLIC_URL_BASE", "");
  });

  it("passes the update data through for e-mail verification", async () => {
    const update = { emailVerified: true };
    await expect(checkProfileUpdate(update, { path: "/verify-email" })).resolves.toEqual({ data: update });
  });

  it("passes the update data through when there is no request context", async () => {
    const update = { image: "https://lh3.googleusercontent.com/a/photo" };
    await expect(checkProfileUpdate(update)).resolves.toEqual({ data: update });
  });

  it("lets a valid profile edit through unchanged", async () => {
    const update = { description: "Hunter" };
    await expect(checkProfileUpdate(update, { path: "/update-user" })).resolves.toEqual({ data: update });
  });

  it("rejects an oversized description on a profile edit", async () => {
    await expect(
      checkProfileUpdate({ description: "x".repeat(501) }, { path: "/update-user" })
    ).rejects.toThrow("Description must be 500 characters or fewer");
  });

  it("rejects a picture from outside the bucket on a profile edit", async () => {
    await expect(
      checkProfileUpdate({ image: "https://evil.example/pixel.png" }, { path: "/update-user" })
    ).rejects.toThrow("Profile picture must be uploaded through Souls Armory.");
  });
});
