import { describe, expect, it } from "vitest";
import renderMarkdown from "./markdown";

const EXPECTED_LINE_COUNT = 3;

describe("markdown rendering", () => {
  describe("code blocks", () => {
    it("should render supported language with syntax highlighting", async () => {
      const markdown = "```rust\nfn main() {}\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain('class="shiki');
      expect(html).toContain("copy-button");
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

  describe("code block boundary cases (0-1-N)", () => {
    it("should handle empty code block (0)", async () => {
      const markdown = "```rust\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain('class="shiki');
    });

    it("should handle single line code (1)", async () => {
      const markdown = "```rust\nlet x = 1;\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain('class="shiki');
      // Shiki tokenizes code, so check for key parts
      expect(html).toContain("let");
      expect(html).toContain("x");
    });

    it("should handle multiple lines code (N)", async () => {
      const markdown = "```rust\nlet x = 1;\nlet y = 2;\nlet z = 3;\n```";
      const html = await renderMarkdown(markdown);
      // Each line creates a span.line element
      const lineCount = (html.match(/class="line"/g) ?? []).length;
      expect(lineCount).toBeGreaterThanOrEqual(EXPECTED_LINE_COUNT);
    });
  });

  describe("shiki transformers", () => {
    it("should render diff add notation", async () => {
      const markdown = "```rust\nlet x = 1; // [!code ++]\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain("diff add");
    });

    it("should render diff remove notation", async () => {
      const markdown = "```rust\nlet x = 1; // [!code --]\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain("diff remove");
    });

    it("should render highlight notation", async () => {
      const markdown = "```rust\nlet x = 1; // [!code highlight]\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain("highlighted");
    });

    it("should render error level notation", async () => {
      const markdown = "```rust\nlet x = 1; // [!code error]\n```";
      const html = await renderMarkdown(markdown);
      expect(html).toContain("error");
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

    it("should handle markdown without any code blocks", async () => {
      const markdown = "# Title\n\nJust some text.";
      const html = await renderMarkdown(markdown);
      expect(html).toContain("<h1>");
      expect(html).toContain("Just some text.");
      expect(html).not.toContain('class="shiki');
    });
  });
});
