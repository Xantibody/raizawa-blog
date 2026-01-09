import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'

export interface PostMeta {
  slug: string
  title: string
  date: string
  categories?: string[]
  tags?: string[]
  draft: boolean
}

const postsDirectory = join(process.cwd(), 'app/posts')

function parseFrontmatter(fileContents: string): { data: any; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = fileContents.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content: fileContents }
  }

  const [, frontmatter, content] = match
  const data = yaml.load(frontmatter) as Record<string, any>

  return { data, content }
}

export function getAllPosts(): PostMeta[] {
  const fileNames = readdirSync(postsDirectory)
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = join(postsDirectory, fileName)
      const fileContents = readFileSync(fullPath, 'utf8')
      const { data } = parseFrontmatter(fileContents)

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        categories: data.categories || [],
        tags: data.tags || [],
        draft: data.draft || false,
      } as PostMeta
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  return posts
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
  try {
    const fullPath = join(postsDirectory, `${slug}.md`)
    const fileContents = readFileSync(fullPath, 'utf8')
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
  } catch {
    return null
  }
}
