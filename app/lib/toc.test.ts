import { describe, expect, it } from "vitest";
import { shouldShowToc } from "../components/toc";
import { type TocItem } from "./toc";

const item = (id: string): TocItem => ({ id, level: 2, text: id });

describe("shouldShowToc (0-1-N)", () => {
  it("should return false for empty array (0)", () => {
    expect(shouldShowToc([])).toBe(false);
  });

  it("should return false for single item (1)", () => {
    expect(shouldShowToc([item("a")])).toBe(false);
  });

  it("should return true for two items (boundary)", () => {
    expect(shouldShowToc([item("a"), item("b")])).toBe(true);
  });

  it("should return true for many items (N)", () => {
    const items = Array.from({ length: 5 }, (_unused, idx) => item(`h${String(idx)}`));
    expect(shouldShowToc(items)).toBe(true);
  });
});
