import { describe, expect, it } from "vitest";
import {
  getAdjacentPosts,
  getAllPosts,
  getCategories,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getTags,
} from "./posts";

const MINIMUM_POSTS = 0;

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

  it("should load post by slug", async () => {
    const [firstPost] = getAllPosts();
    if (firstPost === undefined) {
      throw new Error("No posts found");
    }
    const loaded = await getPostBySlug(firstPost.slug);
    expect(loaded).toBeDefined();
    expect(loaded?.meta.title).toBe(firstPost.title);
  });

  it("should return undefined for non-existent slug", async () => {
    const post = await getPostBySlug("non-existent-post-slug-12345");
    expect(post).toBeUndefined();
  });

  it("posts should be sorted by date descending", () => {
    const posts = getAllPosts();
    for (let idx = 1; idx < posts.length; idx++) {
      const prev = posts[idx - 1];
      const curr = posts[idx];
      if (prev !== undefined && curr !== undefined) {
        const prevDate = new Date(prev.date);
        const currDate = new Date(curr.date);
        expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
      }
    }
  });

  it("post meta should have correct types", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(typeof post.slug).toBe("string");
      expect(typeof post.title).toBe("string");
      expect(typeof post.date).toBe("string");
      expect(typeof post.category).toBe("string");
      expect(Array.isArray(post.tags)).toBe(true);
      expect(typeof post.draft).toBe("boolean");
    }
  });

  it("should not include draft posts in getAllPosts", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.draft).toBe(false);
    }
  });
});

describe("markdown rendering", () => {
  it("should render all posts without error", async () => {
    const posts = getAllPosts();

    await Promise.all(
      posts.map(async (postMeta) => {
        const post = await getPostBySlug(postMeta.slug);
        if (post !== undefined) {
          expect(post.html).toBeDefined();
        }
      }),
    );
  });
});

// Find uppercase language identifiers in code blocks
const findUppercaseLangIssues = (slug: string, content: string): string[] => {
  const issues: string[] = [];
  const matches = content.matchAll(/```([A-Z][a-zA-Z]*)/g);
  for (const match of matches) {
    const lang = match[REGEX_CAPTURE_GROUP_INDEX];
    if (lang !== undefined && lang !== "") {
      issues.push(`${slug}: \`\`\`${lang} should be \`\`\`${lang.toLowerCase()}`);
    }
  }
  return issues;
};

describe("categories", () => {
  it("should return all categories", () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should return posts for each category", () => {
    const categories = getCategories();
    for (const category of categories) {
      const posts = getPostsByCategory(category);
      expect(posts.length).toBeGreaterThan(0);
      for (const post of posts) {
        expect(post.category).toBe(category);
      }
    }
  });

  it("should return empty array for non-existent category", () => {
    const posts = getPostsByCategory("non-existent-category");
    expect(posts).toEqual([]);
  });
});

describe("tags", () => {
  it("should return all tags", () => {
    const tags = getTags();
    expect(tags.length).toBeGreaterThan(0);
  });

  it("should return posts for each tag", () => {
    const tags = getTags();
    for (const tag of tags) {
      const posts = getPostsByTag(tag);
      expect(posts.length).toBeGreaterThan(0);
      for (const post of posts) {
        expect(post.tags).toContain(tag);
      }
    }
  });

  it("should return empty array for non-existent tag", () => {
    const posts = getPostsByTag("non-existent-tag");
    expect(posts).toEqual([]);
  });
});

describe("code blocks", () => {
  it("should not have uppercase language identifiers", async () => {
    const posts = getAllPosts();

    const results = await Promise.all(
      posts.map(async (postMeta) => {
        const post = await getPostBySlug(postMeta.slug);
        if (post !== undefined) {
          return findUppercaseLangIssues(postMeta.slug, post.content);
        }
        return [];
      }),
    );

    expect(results.flat()).toEqual([]);
  });
});

describe("getAdjacentPosts", () => {
  it("should return adjacent posts without options", () => {
    const [newestPost, middlePost, olderPost] = getAllPosts();
    expect(middlePost).toBeDefined();
    if (middlePost === undefined) {
      return;
    }

    const { prev, next } = getAdjacentPosts(middlePost.slug);
    expect(next?.slug).toBe(newestPost?.slug);
    expect(prev?.slug).toBe(olderPost?.slug);
  });

  it("should return undefined for non-existent slug", () => {
    const { prev, next } = getAdjacentPosts("non-existent-slug");
    expect(prev).toBeUndefined();
    expect(next).toBeUndefined();
  });

  it("should filter by category", () => {
    const [category] = getCategories();
    if (category === undefined) {
      throw new Error("No categories found");
    }

    const [firstPost, secondPost] = getPostsByCategory(category);
    if (firstPost === undefined) {
      throw new Error("No posts in category");
    }

    const { prev, next } = getAdjacentPosts(firstPost.slug, { category });
    expect(next).toBeUndefined();
    expect(prev?.slug).toBe(secondPost?.slug);
  });

  it("should filter by tag", () => {
    const [tag] = getTags();
    if (tag === undefined) {
      throw new Error("No tags found");
    }

    const [firstPost, secondPost] = getPostsByTag(tag);
    if (firstPost === undefined) {
      throw new Error("No posts with tag");
    }

    const { prev, next } = getAdjacentPosts(firstPost.slug, { tag });
    expect(next).toBeUndefined();
    expect(prev?.slug).toBe(secondPost?.slug);
  });

  it("should return undefined for boundary posts", () => {
    const posts = getAllPosts();
    const [firstPost] = posts;
    const lastPost = posts.at(-1);
    expect(firstPost).toBeDefined();
    expect(lastPost).toBeDefined();
    if (firstPost === undefined || lastPost === undefined) {
      return;
    }

    expect(getAdjacentPosts(firstPost.slug).next).toBeUndefined();
    expect(getAdjacentPosts(lastPost.slug).prev).toBeUndefined();
  });
});
