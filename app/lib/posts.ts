import * as yaml from 'js-yaml'

export interface PostMeta {
  slug: string
  title: string
  date: string
  categories?: string[]
  tags?: string[]
  draft: boolean
}

export interface Post {
  meta: PostMeta
  content: string
}

// Import all markdown files at build time using Vite's import.meta.glob
const postFiles = import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' })

function parseFrontmatter(fileContents: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = fileContents.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content: fileContents }
  }

  const [, frontmatter, content] = match
  const data = yaml.load(frontmatter) as Record<string, any>

  return { data, content }
}

function parsePost(filePath: string, fileContents: string): Post {
  const slug = filePath.replace('../posts/', '').replace('.md', '')
  const { data, content } = parseFrontmatter(fileContents)

  const meta: PostMeta = {
    slug,
    title: data.title || slug,
    date: data.date || '',
    categories: data.categories || [],
    tags: data.tags || [],
    draft: data.draft || false,
  }

  return { meta, content }
}

// Parse all posts at module load time (build time for Workers)
const allPosts: Post[] = Object.entries(postFiles)
  .map(([path, content]) => parsePost(path, content as string))
  .filter((post) => !post.meta.draft)
  .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1))

export function getAllPosts(): PostMeta[] {
  return allPosts.map((post) => post.meta)
}

export function getPostBySlug(slug: string): Post | null {
  return allPosts.find((post) => post.meta.slug === slug) || null
}
