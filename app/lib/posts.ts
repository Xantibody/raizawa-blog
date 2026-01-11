import { type Post, type PostMeta } from "./types";
// Import generated data (created by scripts/build-posts.ts)
import { posts } from "./posts-data";

const getAllPosts = (): PostMeta[] => posts.map((post) => post.meta);

const getPostBySlug = (slug: string): Post | null =>
  posts.find((post) => post.meta.slug === slug) ?? null;

// Re-export types
export type { Post, PostMeta } from "./types";
export { getAllPosts, getPostBySlug };
