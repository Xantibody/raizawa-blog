// Re-export types
export type { Post, PostMeta } from "./types";
import type { Post, PostMeta } from "./types";

// Import generated data (created by scripts/build-posts.ts)
import { posts } from "./posts-data";

export function getAllPosts(): PostMeta[] {
  return posts.map((post) => post.meta);
}

export function getPostBySlug(slug: string): Post | null {
  return posts.find((post) => post.meta.slug === slug) || null;
}
