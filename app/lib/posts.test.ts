import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { getAllPosts, getPostBySlug } from './posts'
import { renderMarkdown } from './markdown'

const postsDirectory = join(process.cwd(), 'app/posts')

describe('posts', () => {
  it('should load all posts without error', () => {
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThan(0)
  })

  it('all posts should have required frontmatter fields', () => {
    const posts = getAllPosts()
    for (const post of posts) {
      expect(post.title).toBeTruthy()
      expect(post.date).toBeTruthy()
      expect(post.slug).toBeTruthy()
    }
  })

  it('each post should be loadable by slug', () => {
    const posts = getAllPosts()
    for (const post of posts) {
      const loaded = getPostBySlug(post.slug)
      expect(loaded).not.toBeNull()
      expect(loaded?.meta.title).toBe(post.title)
    }
  })
})

describe('markdown rendering', () => {
  it('should render all posts without error', async () => {
    const files = readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))

    for (const file of files) {
      const filePath = join(postsDirectory, file)
      const content = readFileSync(filePath, 'utf-8')

      // Extract content after frontmatter
      const match = content.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/)
      if (!match) continue

      const markdownContent = match[1]

      // This should not throw
      await expect(renderMarkdown(markdownContent)).resolves.toBeDefined()
    }
  })
})

describe('code blocks', () => {
  it('should not have uppercase language identifiers', () => {
    const files = readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))
    const issues: string[] = []

    for (const file of files) {
      const filePath = join(postsDirectory, file)
      const content = readFileSync(filePath, 'utf-8')

      // Find code blocks with uppercase language
      const matches = content.matchAll(/```([A-Z][a-zA-Z]*)/g)
      for (const match of matches) {
        issues.push(`${file}: \`\`\`${match[1]} should be \`\`\`${match[1].toLowerCase()}`)
      }
    }

    expect(issues).toEqual([])
  })
})
