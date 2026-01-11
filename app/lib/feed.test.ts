import { describe, it, expect } from 'vitest'
import { getAllPosts } from './posts'

const SITE_URL = 'https://raizawa-blog.pages.dev'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateRssFeed(posts: ReturnType<typeof getAllPosts>): string {
  const items = posts
    .slice(0, 20)
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString()
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid>${SITE_URL}/posts/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>R-Aizawa Blog</title>
    <link>${SITE_URL}</link>
    <description>R-Aizawaの技術ブログ</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

describe('RSS feed', () => {
  it('should generate valid XML structure', () => {
    const posts = getAllPosts()
    const xml = generateRssFeed(posts)

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<channel>')
    expect(xml).toContain('</channel>')
    expect(xml).toContain('</rss>')
  })

  it('should contain required channel elements', () => {
    const posts = getAllPosts()
    const xml = generateRssFeed(posts)

    expect(xml).toContain('<title>R-Aizawa Blog</title>')
    expect(xml).toContain(`<link>${SITE_URL}</link>`)
    expect(xml).toContain('<description>')
    expect(xml).toContain('<language>ja</language>')
  })

  it('should include posts as items', () => {
    const posts = getAllPosts()
    const xml = generateRssFeed(posts)

    expect(xml).toContain('<item>')
    expect(xml).toContain('</item>')

    // Check first post is included
    const firstPost = posts[0]
    if (firstPost) {
      expect(xml).toContain(escapeXml(firstPost.title))
      expect(xml).toContain(`${SITE_URL}/posts/${firstPost.slug}`)
    }
  })

  it('should limit to 20 items', () => {
    const posts = getAllPosts()
    const xml = generateRssFeed(posts)

    const itemCount = (xml.match(/<item>/g) || []).length
    expect(itemCount).toBeLessThanOrEqual(20)
  })

  it('should escape special XML characters in titles', () => {
    expect(escapeXml('Test & Test')).toBe('Test &amp; Test')
    expect(escapeXml('<script>')).toBe('&lt;script&gt;')
    expect(escapeXml('"quoted"')).toBe('&quot;quoted&quot;')
  })
})
