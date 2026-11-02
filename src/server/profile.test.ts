import { beforeEach, describe, expect, it, vi } from "vitest";

const getSession = vi.fn();
const createPresignedPost = vi.fn();

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: (...args: unknown[]) => getSession(...args) } },
}));
vi.mock("@aws-sdk/client-s3", () => ({ S3Client: class {} }));
vi.mock("@aws-sdk/s3-presigned-post", () => ({
  createPresignedPost: (...args: unknown[]) => createPresignedPost(...args),
}));

import { getAvatarUpload } from "./profile";

describe("getAvatarUpload", () => {
  beforeEach(() => {
    getSession.mockReset();
    createPresignedPost.mockReset();
    getSession.mockResolvedValue({ user: { id: "user-1" } });
    createPresignedPost.mockResolvedValue({ url: "https://bucket.example", fields: { key: "k" } });
    vi.stubEnv("S3_BUCKET", "souls-bucket");
    vi.stubEnv("S3_REGION", "us-east-1");
    vi.stubEnv("S3_PUBLIC_URL_BASE", "");
  });

  it("rejects a signed-out user", async () => {
    getSession.mockResolvedValue(null);
    const result = await getAvatarUpload("image/png");
    expect(result.success).toBe(false);
    expect(createPresignedPost).not.toHaveBeenCalled();
  });

  it("rejects a file type that is not allowed", async () => {
    const result = await getAvatarUpload("image/gif");
    expect(result).toMatchObject({ success: false, message: expect.stringContaining("PNG") });
    expect(createPresignedPost).not.toHaveBeenCalled();
  });

  it("reports that uploads are not configured when the bucket is missing", async () => {
    vi.stubEnv("S3_BUCKET", "");
    const result = await getAvatarUpload("image/png");
    expect(result).toMatchObject({ success: false, message: expect.stringContaining("not configured") });
  });

  it("signs an upload to the user's own fixed key with a size limit", async () => {
    const result = await getAvatarUpload("image/webp");

    expect(result.success).toBe(true)
    const options = createPresignedPost.mock.calls[0][1];
    expect(options.Key).toBe("avatars/user-1/avatar");
    expect(options.Conditions).toContainEqual(["content-length-range", 1, 2 * 1024 * 1024]);
    expect(options.Conditions).toContainEqual(["eq", "$Content-Type", "image/webp"]);
  });

  it("builds the public URL from the bucket, or from S3_PUBLIC_URL_BASE when set", async () => {
    const plain = await getAvatarUpload("image/png");
    expect(plain).toMatchObject({
      publicUrl: expect.stringMatching(/^https:\/\/souls-bucket\.s3\.us-east-1\.amazonaws\.com\/avatars\/user-1\/avatar\?v=\d+$/),
    });

    vi.stubEnv("S3_PUBLIC_URL_BASE", "https://cdn.example.com");
    const cdn = await getAvatarUpload("image/png");
    expect(cdn).toMatchObject({ publicUrl: expect.stringMatching(/^https:\/\/cdn\.example\.com\/avatars\/user-1\/avatar\?v=\d+$/) });
  });

  it("returns the error message when signing fails", async () => {
    createPresignedPost.mockRejectedValue(new Error("no credentials"));
    const result = await getAvatarUpload("image/png");
    expect(result).toEqual({ success: false, message: "no credentials" });
  });
});
