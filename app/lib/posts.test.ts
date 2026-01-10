import { describe, it, expect } from 'vitest'
import { getAllPosts, getPostBySlug } from './posts'
import { renderMarkdown } from './markdown'

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
    // Shiki initialization can be slow in CI
    const posts = getAllPosts()

    for (const postMeta of posts) {
      const post = getPostBySlug(postMeta.slug)
      if (!post) continue

      // This should not throw
      await expect(renderMarkdown(post.content)).resolves.toBeDefined()
    }
  }, 60000) // 60 second timeout for CI
})

describe('code blocks', () => {
  it('should not have uppercase language identifiers', () => {
    const posts = getAllPosts()
    const issues: string[] = []

    for (const postMeta of posts) {
      const post = getPostBySlug(postMeta.slug)
      if (!post) continue

      // Find code blocks with uppercase language
      const matches = post.content.matchAll(/```([A-Z][a-zA-Z]*)/g)
      for (const match of matches) {
        issues.push(`${postMeta.slug}: \`\`\`${match[1]} should be \`\`\`${match[1].toLowerCase()}`)
      }
    }

    expect(issues).toEqual([])
  })
})
