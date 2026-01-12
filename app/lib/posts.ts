import { type Post, type PostMeta } from "./types";
// Import generated data (created by scripts/build-posts.ts)
import { posts } from "./posts-data";

const getAllPosts = (): PostMeta[] => posts.map((post) => post.meta);

const getPostBySlug = (slug: string): Post | undefined =>
  posts.find((post) => post.meta.slug === slug);

const getPostsByCategory = (category: string): PostMeta[] =>
  posts.filter((post) => post.meta.category === category).map((post) => post.meta);

const getCategories = (): string[] => [...new Set(posts.map((post) => post.meta.category))];

const getPostsByTag = (tag: string): PostMeta[] =>
  posts.filter((post) => post.meta.tags.includes(tag)).map((post) => post.meta);

const getTags = (): string[] => [...new Set(posts.flatMap((post) => post.meta.tags))];

// Re-export types
export type { Post, PostMeta } from "./types";
export { getAllPosts, getPostBySlug, getPostsByCategory, getCategories, getPostsByTag, getTags };
