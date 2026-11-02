import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const updateUser = vi.fn();
const getAvatarUpload = vi.fn();
const refresh = vi.fn();
const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("sonner", () => ({ toast }));
vi.mock("@/lib/auth-client", () => ({
  authClient: { updateUser: (...args: unknown[]) => updateUser(...args) },
}));
vi.mock("@/server/profile", () => ({
  getAvatarUpload: (...args: unknown[]) => getAvatarUpload(...args),
}));

import { ProfileForm } from "./profile-form";

const fetchMock = vi.fn();

function renderForm(overrides: Partial<React.ComponentProps<typeof ProfileForm>> = {}) {
  render(
    <ProfileForm
      name="Nathan Drake"
      email="nathan@example.com"
      image={null}
      description="Hello"
      {...overrides}
    />
  );
}

function pictureInput() {
  return screen.getByLabelText("Profile picture file") as HTMLInputElement;
}

describe("ProfileForm", () => {
  beforeEach(() => {
    updateUser.mockReset();
    getAvatarUpload.mockReset();
    refresh.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    updateUser.mockResolvedValue({ error: null });
  });

  it("shows the username, email and initials without a picture", () => {
    renderForm();
    expect(screen.getByRole("heading", { name: "Nathan Drake" })).toBeInTheDocument();
    expect(screen.getByText("nathan@example.com")).toBeInTheDocument();
    expect(screen.getByText("ND")).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    renderForm();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/home");
  });

  it("starts with the saved description", () => {
    renderForm({ description: "Hunter of Souls" });
    expect(screen.getByLabelText("Description")).toHaveValue("Hunter of Souls");
  });

  it("saves an edited description", async () => {
    renderForm({ description: "" });
    await userEvent.type(screen.getByLabelText("Description"), "New bio");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(updateUser).toHaveBeenCalledWith({ description: "New bio" }));
    expect(toast.success).toHaveBeenCalledWith("Profile saved");
  });

  it("shows the error when saving fails", async () => {
    updateUser.mockResolvedValue({ error: { message: "Nope" } });
    renderForm();
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Nope"));
  });

  it("does not save a description over 500 characters", async () => {
    renderForm({ description: "x".repeat(501) });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Description must be 500 characters or fewer")).toBeInTheDocument();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("rejects a file type that is not allowed before uploading", async () => {
    renderForm();
    const gif = new File(["x"], "a.gif", { type: "image/gif" });
    await userEvent.upload(pictureInput(), gif, { applyAccept: false });

    expect(toast.error).toHaveBeenCalledWith("Please choose a PNG, JPEG or WebP image.");
    expect(getAvatarUpload).not.toHaveBeenCalled();
  });

  it("rejects a file over 2 MB before uploading", async () => {
    renderForm();
    const big = new File(["x"], "big.png", { type: "image/png" });
    Object.defineProperty(big, "size", { value: 2 * 1024 * 1024 + 1 });
    await userEvent.upload(pictureInput(), big);

    expect(toast.error).toHaveBeenCalledWith("Image must be 2 MB or smaller.");
    expect(getAvatarUpload).not.toHaveBeenCalled();
  });

  it("uploads the file and saves the new picture URL", async () => {
    getAvatarUpload.mockResolvedValue({
      success: true,
      url: "https://bucket.example",
      fields: { key: "avatars/u/1.png", "Content-Type": "image/png" },
      publicUrl: "https://bucket.example/avatars/u/1.png",
    });
    fetchMock.mockResolvedValue({ ok: true });
    renderForm();

    await userEvent.upload(pictureInput(), new File(["x"], "me.png", { type: "image/png" }));

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith({ image: "https://bucket.example/avatars/u/1.png" })
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://bucket.example");
    expect((init.body as FormData).get("key")).toBe("avatars/u/1.png");
    expect((init.body as FormData).get("file")).toBeInstanceOf(File);
    expect(toast.success).toHaveBeenCalledWith("Picture updated");
  });

  it("shows the server message and skips S3 when the upload cannot start", async () => {
    getAvatarUpload.mockResolvedValue({ success: false, message: "Picture uploads are not configured yet." });
    renderForm();

    await userEvent.upload(pictureInput(), new File(["x"], "me.png", { type: "image/png" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Picture uploads are not configured yet.")
    );
    expect(fetchMock).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("does not save the picture when the S3 upload fails", async () => {
    getAvatarUpload.mockResolvedValue({
      success: true,
      url: "https://bucket.example",
      fields: {},
      publicUrl: "https://bucket.example/x.png",
    });
    fetchMock.mockResolvedValue({ ok: false });
    renderForm();

    await userEvent.upload(pictureInput(), new File(["x"], "me.png", { type: "image/png" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Picture upload failed."));
    expect(updateUser).not.toHaveBeenCalled();
  });
});
