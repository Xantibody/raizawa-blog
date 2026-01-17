import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import renderMarkdown from "../app/lib/markdown";

const fixturesDir = join(process.cwd(), "test/fixtures");

describe("markdown rendering with fixtures", () => {
  it("should render test-post.md correctly", async () => {
    const content = readFileSync(join(fixturesDir, "test-post.md"), "utf-8");
    const { content: markdown } = matter(content);

    const html = await renderMarkdown(markdown);

    // Check basic rendering
    expect(html).toContain("<h2>");
    expect(html).toContain("テスト記事です");

    // Check code blocks with Shiki
    expect(html).toContain('class="shiki');
    // Check copy button is present
    expect(html).toContain('class="copy-button"');

    // Check lists
    expect(html).toContain("<li>");
    expect(html).toContain("リスト1");

    // Check table
    expect(html).toContain("<table>");
    expect(html).toContain("Column1");

    // Check blockquote
    expect(html).toContain("<blockquote>");

    // Check OGP cards
    expect(html).toContain("ogp-card");
    expect(html).toContain("github.com");
  }, 60000);
});
