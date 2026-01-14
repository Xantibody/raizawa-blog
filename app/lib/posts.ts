import { load as yamlLoad } from "js-yaml";
import renderMarkdown from "./markdown";

// Type definitions
interface PostMeta {
  category: string;
  date: string;
  draft: boolean;
  slug: string;
  tags: string[];
  title: string;
}

interface Post {
  content: string;
  html: string;
  meta: PostMeta;
}

// Import all markdown files at build time
const markdownFiles = import.meta.glob<string>("../posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

// Parse frontmatter from markdown content
const parseFrontmatter = (
  fileContents: string,
): { content: string; data: Record<string, unknown> } => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContents.match(frontmatterRegex);

  if (match === null) {
    return { content: fileContents, data: {} };
  }

  const [, frontmatter, content] = match;
  const loaded = yamlLoad(frontmatter ?? "");
  const data = toRecord(loaded);

  return { content: content ?? "", data };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toRecord = (value: unknown): Record<string, unknown> => {
  if (isRecord(value)) {
    return value;
  }
  return {};
};

// Extract slug from file path
const getSlugFromPath = (path: string): string => {
  const filename = path.split("/").pop() ?? "";
  return filename.replace(/\.md$/, "");
};

const getStringField = (
  data: Record<string, unknown>,
  key: string,
  defaultValue: string,
): string => {
  const value = data[key];
  if (typeof value === "string") {
    return value;
  }
  return defaultValue;
};

const getBooleanField = (
  data: Record<string, unknown>,
  key: string,
  defaultValue: boolean,
): boolean => {
  const value = data[key];
  if (typeof value === "boolean") {
    return value;
  }
  return defaultValue;
};

const getTagsField = (data: Record<string, unknown>): string[] => {
  const value = data.tags;
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
};

// Parse post metadata from frontmatter
const parsePostMeta = (slug: string, data: Record<string, unknown>): PostMeta => {
  const category = getStringField(data, "category", "");
  const date = getStringField(data, "date", "");
  const draft = getBooleanField(data, "draft", false);
  const tags = getTagsField(data);
  const title = getStringField(data, "title", slug);

  return { category, date, draft, slug, tags, title };
};

// Build posts metadata (synchronous, no HTML rendering)
const postsMetaCache: PostMeta[] = [];
let metaCacheInitialized = false;

const initMetaCache = (): void => {
  if (metaCacheInitialized) {
    return;
  }

  for (const [path, content] of Object.entries(markdownFiles)) {
    const slug = getSlugFromPath(path);
    const { data } = parseFrontmatter(content);
    const meta = parsePostMeta(slug, data);

    if (!meta.draft) {
      postsMetaCache.push(meta);
    }
  }

  // Sort by date descending
  postsMetaCache.sort((postA, postB) => {
    const dateA = new Date(postA.date.replace(" ", "T"));
    const dateB = new Date(postB.date.replace(" ", "T"));
    return dateB.getTime() - dateA.getTime();
  });

  metaCacheInitialized = true;
};

// Public API
const getAllPosts = (): PostMeta[] => {
  initMetaCache();
  return postsMetaCache;
};

const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const path = `../posts/${slug}.md`;
  const content = markdownFiles[path];

  if (content === undefined) {
    return undefined;
  }

  const { content: markdownContent, data } = parseFrontmatter(content);
  const meta = parsePostMeta(slug, data);

  if (meta.draft) {
    return undefined;
  }

  const html = await renderMarkdown(markdownContent);

  return { content: markdownContent, html, meta };
};

const getPostsByCategory = (category: string): PostMeta[] => {
  initMetaCache();
  return postsMetaCache.filter((post) => post.category === category);
};

const getCategories = (): string[] => {
  initMetaCache();
  return [...new Set(postsMetaCache.map((post) => post.category))];
};

const getPostsByTag = (tag: string): PostMeta[] => {
  initMetaCache();
  return postsMetaCache.filter((post) => post.tags.includes(tag));
};

const getTags = (): string[] => {
  initMetaCache();
  return [...new Set(postsMetaCache.flatMap((post) => post.tags))];
};

export type { Post, PostMeta };
export { getAllPosts, getCategories, getPostBySlug, getPostsByCategory, getPostsByTag, getTags };
