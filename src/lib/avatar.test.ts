import { beforeEach, describe, expect, it, vi } from "vitest";

import { validateProfileUpdate } from "./avatar";

describe("validateProfileUpdate", () => {
  beforeEach(() => {
    vi.stubEnv("S3_BUCKET", "souls-bucket");
    vi.stubEnv("S3_REGION", "us-east-1");
    vi.stubEnv("S3_PUBLIC_URL_BASE", "");
  });

  it("allows updates that touch neither field", () => {
    expect(validateProfileUpdate({})).toBeNull();
  });

  it("allows a description of 500 characters and rejects 501", () => {
    expect(validateProfileUpdate({ description: "x".repeat(500) })).toBeNull();
    expect(validateProfileUpdate({ description: "x".repeat(501) })).toBe(
      "Description must be 500 characters or fewer"
    );
  });

  it("allows a picture from the bucket's avatars folder", () => {
    const image = "https://souls-bucket.s3.us-east-1.amazonaws.com/avatars/user-1/avatar?v=1";
    expect(validateProfileUpdate({ image })).toBeNull();
  });

  it("allows removing the picture", () => {
    expect(validateProfileUpdate({ image: "" })).toBeNull();
  });

  it("rejects a picture from anywhere else", () => {
    expect(validateProfileUpdate({ image: "https://evil.example/pixel.png" })).toMatch(/uploaded through/);
    expect(
      validateProfileUpdate({ image: "https://souls-bucket.s3.us-east-1.amazonaws.com/other/file.png" })
    ).toMatch(/uploaded through/);
  });

  it("uses S3_PUBLIC_URL_BASE when it is set", () => {
    vi.stubEnv("S3_PUBLIC_URL_BASE", "https://cdn.example.com");
    expect(validateProfileUpdate({ image: "https://cdn.example.com/avatars/u/avatar?v=1" })).toBeNull();
    expect(
      validateProfileUpdate({ image: "https://souls-bucket.s3.us-east-1.amazonaws.com/avatars/u/avatar" })
    ).toMatch(/uploaded through/);
  });
});
