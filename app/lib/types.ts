// Shared type definitions for posts

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  draft: boolean;
}

export interface Post {
  meta: PostMeta;
  content: string;
  html: string;
}
