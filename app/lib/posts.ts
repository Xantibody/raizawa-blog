import type { Post, PostMeta } from "./types";
// Import generated data (created by scripts/build-posts.ts)
import { posts } from "./posts-data";

const getAllPosts = (): PostMeta[] => {
  return posts.map((post) => post.meta);
};

const getPostBySlug = (slug: string): Post | null => {
  return posts.find((post) => post.meta.slug === slug) ?? null;
};

// Re-export types
export type { Post, PostMeta } from "./types";
export { getAllPosts, getPostBySlug };
