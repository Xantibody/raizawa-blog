import { describe, expect, it } from "vitest";
import { SHIKI_THEME, getHighlighter, shikiTransformers } from "./shiki";

describe("shiki", () => {
  describe("getHighlighter", () => {
    it("should return a highlighter instance", async () => {
      const highlighter = await getHighlighter();
      expect(highlighter).toBeDefined();
      expect(highlighter.codeToHtml).toBeDefined();
    });

    it("should cache the highlighter instance", async () => {
      const first = await getHighlighter();
      const second = await getHighlighter();
      expect(first).toBe(second);
    });

    it("should have loaded languages", async () => {
      const highlighter = await getHighlighter();
      const langs = highlighter.getLoadedLanguages();
      expect(langs).toContain("rust");
      expect(langs).toContain("nix");
      expect(langs).toContain("bash");
      expect(langs).toContain("json");
    });
  });

  describe("transformers", () => {
    it("should include copy button in output", async () => {
      const highlighter = await getHighlighter();
      const html = highlighter.codeToHtml("const x = 1;", {
        lang: "rust",
        theme: SHIKI_THEME,
        transformers: shikiTransformers,
      });
      expect(html).toContain('class="copy-button"');
      expect(html).toContain("Copy");
    });

    it("should include code title when meta contains title", async () => {
      const highlighter = await getHighlighter();
      const html = highlighter.codeToHtml("fn main() {}", {
        lang: "rust",
        meta: { __raw: 'title="example.rs"' },
        theme: SHIKI_THEME,
        transformers: shikiTransformers,
      });
      expect(html).toContain('class="code-title"');
      expect(html).toContain("example.rs");
    });

    it("should not include code title when meta is empty", async () => {
      const highlighter = await getHighlighter();
      const html = highlighter.codeToHtml("fn main() {}", {
        lang: "rust",
        theme: SHIKI_THEME,
        transformers: shikiTransformers,
      });
      expect(html).not.toContain('class="code-title"');
    });

    it("should handle single quotes in title", async () => {
      const highlighter = await getHighlighter();
      const html = highlighter.codeToHtml("{}", {
        lang: "json",
        meta: { __raw: "title='config.json'" },
        theme: SHIKI_THEME,
        transformers: shikiTransformers,
      });
      expect(html).toContain("config.json");
    });
  });
});
