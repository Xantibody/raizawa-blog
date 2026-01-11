import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug } from "./posts";
import { renderMarkdown } from "./markdown";

const MINIMUM_POSTS = 0;
const CI_TIMEOUT_MS = 60_000;
const REGEX_CAPTURE_GROUP_INDEX = 1;

describe("posts", () => {
  it("should load all posts without error", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(MINIMUM_POSTS);
  });

  it("all posts should have required frontmatter fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.slug).toBeTruthy();
    }
  });

  it("each post should be loadable by slug", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      const loaded = getPostBySlug(post.slug);
      expect(loaded).not.toBeNull();
      expect(loaded?.meta.title).toBe(post.title);
    }
  });
});

describe("markdown rendering", () => {
  it("should render all posts without error", async () => {
    // Shiki initialization can be slow in CI
    const posts = getAllPosts();

    for (const postMeta of posts) {
      const post = getPostBySlug(postMeta.slug);
      if (post) {
        // This should not throw
        await expect(renderMarkdown(post.content)).resolves.toBeDefined();
      }
    }
  }, CI_TIMEOUT_MS);
});

describe("code blocks", () => {
  it("should not have uppercase language identifiers", () => {
    const posts = getAllPosts();
    const issues: string[] = [];

    for (const postMeta of posts) {
      const post = getPostBySlug(postMeta.slug);
      if (post) {
        // Find code blocks with uppercase language
        const matches = post.content.matchAll(/```([A-Z][a-zA-Z]*)/g);
        for (const match of matches) {
          const lang = match[REGEX_CAPTURE_GROUP_INDEX];
          if (lang) {
            issues.push(`${postMeta.slug}: \`\`\`${lang} should be \`\`\`${lang.toLowerCase()}`);
          }
        }
      }
    }

    expect(issues).toEqual([]);
  });
});
