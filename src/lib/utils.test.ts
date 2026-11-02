import { describe, expect, it } from "vitest";

import { getInitials } from "./utils";

describe("getInitials", () => {
  it("uses the first letters of the first two words", () => {
    expect(getInitials("nathan drake")).toBe("ND");
    expect(getInitials("Ada Lovelace Byron")).toBe("AL");
  });

  it("handles a single word and extra spaces", () => {
    expect(getInitials("  solaire ")).toBe("S");
  });

  it("keeps an emoji whole instead of splitting it", () => {
    expect(getInitials("😀 Bob")).toBe("😀B");
  });

  it("falls back to a question mark for an empty name", () => {
    expect(getInitials("   ")).toBe("?");
  });
});
