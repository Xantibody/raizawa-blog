import { describe, expect, it } from "vitest";
import { isSameDay } from "./date";

describe("isSameDay", () => {
  it("should return true for identical dates", () => {
    expect(isSameDay("2024-12-29T00:00", "2024-12-29T00:00")).toBe(true);
  });

  it("should return true for same day with different formats", () => {
    expect(isSameDay("2024-12-29T00:00", "2024-12-29T10:30:00+09:00")).toBe(true);
  });

  it("should return true for same day with different times", () => {
    expect(isSameDay("2024-12-29T00:00", "2024-12-29T23:59:59+09:00")).toBe(true);
  });

  it("should return false for different days", () => {
    expect(isSameDay("2024-12-29T00:00", "2025-01-15T14:00:00+09:00")).toBe(false);
  });

  it("should return false for adjacent days across year boundary", () => {
    expect(isSameDay("2024-12-31T23:00", "2025-01-01T10:00:00+09:00")).toBe(false);
  });

  it("should return false for dates years apart", () => {
    expect(isSameDay("2024-01-01T00:00", "2025-12-31T00:00:00+09:00")).toBe(false);
  });
});
