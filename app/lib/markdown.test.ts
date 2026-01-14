import { describe, expect, it } from "vitest";
import renderMarkdown from "./markdown";

describe("markdown rendering", () => {
  describe("code blocks", () => {
    it("should render supported language with syntax highlighting", async () => {
      const markdown = "```rust\nfn main() {}\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain('class="shiki');
      expect(html).toContain('class="copy-button"');
    });

    it("should fallback to text for unsupported language", async () => {
      const markdown = "```unknownlang\nsome code\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain('class="shiki');
      expect(html).toContain("some code");
    });

    it("should handle code block without language", async () => {
      const markdown = "```\nplain code\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain('class="shiki');
      expect(html).toContain("plain code");
    });

    it("should parse title from meta string", async () => {
      const markdown = '```rust title="main.rs"\nfn main() {}\n```';
      const html = await renderMarkdown(markdown);
      expect(html).toContain('class="code-title"');
      expect(html).toContain("main.rs");
    });
  });

  describe("basic markdown", () => {
    it("should render headings", async () => {
      const markdown = "# Heading 1\n## Heading 2";
      const html = await renderMarkdown(markdown);
      expect(html).toContain("<h1>");
      expect(html).toContain("<h2>");
    });

    it("should render lists", async () => {
      const markdown = "- item 1\n- item 2";
      const html = await renderMarkdown(markdown);
      expect(html).toContain("<ul>");
      expect(html).toContain("<li>");
    });

    it("should render inline code without shiki", async () => {
      const markdown = "Use `const` for constants.";
      const html = await renderMarkdown(markdown);
      expect(html).toContain("<code>");
      expect(html).not.toContain('class="shiki');
    });
  });
});
