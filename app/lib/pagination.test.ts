import { describe, expect, it } from "vitest";
import { getPageHref, getPageNumbers, getPrevHref } from "./pagination";

describe("getPrevHref", () => {
  it("should return / for page 2", () => {
    expect(getPrevHref(2)).toBe("/");
  });

  it("should return /page/{n-1} for page 3+", () => {
    expect(getPrevHref(3)).toBe("/page/2");
    expect(getPrevHref(5)).toBe("/page/4");
    expect(getPrevHref(100)).toBe("/page/99");
  });
});

describe("getPageHref", () => {
  it("should return / for page 1", () => {
    expect(getPageHref(1)).toBe("/");
  });

  it("should return /page/{n} for page 2+", () => {
    expect(getPageHref(2)).toBe("/page/2");
    expect(getPageHref(5)).toBe("/page/5");
    expect(getPageHref(100)).toBe("/page/100");
  });
});

describe("getPageNumbers", () => {
  describe("boundary cases (0-1-N)", () => {
    it("should return empty array for 0 pages", () => {
      expect(getPageNumbers(1, 0)).toEqual([]);
    });

    it("should return [1] for single page", () => {
      expect(getPageNumbers(1, 1)).toEqual([1]);
    });

    it("should return [1, 2] for two pages", () => {
      expect(getPageNumbers(1, 2)).toEqual([1, 2]);
      expect(getPageNumbers(2, 2)).toEqual([1, 2]);
    });

    it("should return [1, 2, 3] for three pages", () => {
      expect(getPageNumbers(1, 3)).toEqual([1, 2, 3]);
      expect(getPageNumbers(2, 3)).toEqual([1, 2, 3]);
      expect(getPageNumbers(3, 3)).toEqual([1, 2, 3]);
    });
  });

  describe("ellipsis placement with totalPages=10", () => {
    it("should show [1, 2, ..., 10] when currentPage=1", () => {
      expect(getPageNumbers(1, 10)).toEqual([1, 2, "...", 10]);
    });

    it("should show [1, 2, 3, ..., 10] when currentPage=2", () => {
      expect(getPageNumbers(2, 10)).toEqual([1, 2, 3, "...", 10]);
    });

    it("should show [1, ..., 4, 5, 6, ..., 10] when currentPage=5", () => {
      expect(getPageNumbers(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
    });

    it("should show [1, ..., 8, 9, 10] when currentPage=9", () => {
      expect(getPageNumbers(9, 10)).toEqual([1, "...", 8, 9, 10]);
    });

    it("should show [1, ..., 9, 10] when currentPage=10", () => {
      expect(getPageNumbers(10, 10)).toEqual([1, "...", 9, 10]);
    });
  });

  describe("no consecutive ellipsis", () => {
    it("should never have consecutive ellipsis", () => {
      for (let page = 1; page <= 100; page++) {
        const result = getPageNumbers(page, 100);
        for (let idx = 1; idx < result.length; idx++) {
          const prev = result[idx - 1];
          const curr = result[idx];
          expect(prev === "..." && curr === "...").toBe(false);
        }
      }
    });
  });

  describe("first and last always present", () => {
    it("should always include first page", () => {
      for (let page = 1; page <= 20; page++) {
        const result = getPageNumbers(page, 20);
        expect(result[0]).toBe(1);
      }
    });

    it("should always include last page", () => {
      for (let page = 1; page <= 20; page++) {
        const result = getPageNumbers(page, 20);
        expect(result.at(-1)).toBe(20);
      }
    });
  });

  describe("custom showRange", () => {
    it("should expand visible range with showRange=2", () => {
      expect(getPageNumbers(5, 10, 2)).toEqual([1, "...", 3, 4, 5, 6, 7, "...", 10]);
    });

    it("should show all pages when showRange covers everything", () => {
      expect(getPageNumbers(5, 10, 5)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });
});
