// Shared type definitions for posts

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  draft: boolean;
}

interface Post {
  meta: PostMeta;
  content: string;
  html: string;
}

export type { Post, PostMeta };
