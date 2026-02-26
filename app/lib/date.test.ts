import { describe, expect, it } from "vitest";
import { isSameDay, toLocalDate } from "./date";

describe("toLocalDate", () => {
  it("should format date without time", () => {
    expect(toLocalDate("2024-01-15")).toBe("2024/1/15");
  });

  it("should format JST early morning without shifting to previous day", () => {
    expect(toLocalDate("2024-01-15T02:00:00+09:00")).toBe("2024/1/15");
  });

  it("should format JST midnight without shifting to previous day", () => {
    expect(toLocalDate("2024-01-15T00:30:00+09:00")).toBe("2024/1/15");
  });

  it("should format JST start of day boundary", () => {
    expect(toLocalDate("2024-01-15T00:00:00+09:00")).toBe("2024/1/15");
  });

  it("should format JST end of day boundary", () => {
    expect(toLocalDate("2024-01-15T23:59:59+09:00")).toBe("2024/1/15");
  });
});

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

  it("should return true for same day in JST early morning", () => {
    expect(isSameDay("2024-12-29T02:00", "2024-12-29T02:30:00+09:00")).toBe(true);
  });

  it("should return true for createdAt without TZ and updatedAt with TZ on same day", () => {
    expect(isSameDay("2024-12-29T03:07", "2024-12-29T03:16:31+09:00")).toBe(true);
  });

  it("should return false for different days", () => {
    expect(isSameDay("2024-12-29T00:00", "2025-01-15T14:00:00+09:00")).toBe(false);
  });

  it("should return false for adjacent days across year boundary", () => {
    expect(isSameDay("2024-12-31T23:00:00+09:00", "2025-01-01T10:00:00+09:00")).toBe(false);
  });

  it("should return false for day boundary in JST", () => {
    expect(isSameDay("2024-12-31T23:30:00+09:00", "2025-01-01T00:30:00+09:00")).toBe(false);
  });

  it("should return false for dates years apart", () => {
    expect(isSameDay("2024-01-01T00:00", "2025-12-31T00:00:00+09:00")).toBe(false);
  });
});
