import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationErrorLevel,
} from '@shikijs/transformers'
import type { ShikiTransformer } from 'shiki'
import { fetchOGP, generateOGPCard } from './ogp'

// Custom transformer to add file name from meta string
// Usage: ```ts title="filename.ts"
function transformerMetaTitle(): ShikiTransformer {
  return {
    name: 'meta-title',
    pre(node) {
      const meta = this.options.meta?.__raw
      if (!meta) return

      const match = meta.match(/title=["']([^"']+)["']/)
      if (match) {
        const title = match[1]
        // Add title element before the code
        node.children.unshift({
          type: 'element',
          tagName: 'div',
          properties: { class: 'code-title' },
          children: [{ type: 'text', value: title }],
        })
      }
    },
  }
}

// Initialize markdown-it with Shiki
const md = MarkdownIt({ html: true, breaks: true })

// Shiki plugin (initialized lazily)
let shikiInitialized = false

async function initShiki() {
  if (!shikiInitialized) {
    md.use(
      await Shiki({
        theme: 'gruvbox-dark-soft',
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
          transformerNotationErrorLevel(),
          transformerMetaTitle(),
        ],
      })
    )
    shikiInitialized = true
  }
}

// Detect standalone URLs (on their own line only)
function detectStandaloneURLs(markdown: string): string[] {
  const urls: string[] = []
  let match

  // Match <URL> on its own line
  const autolinkRegex = /^<(https?:\/\/[^\s>]+)>$/gm
  while ((match = autolinkRegex.exec(markdown)) !== null) {
    urls.push(match[1])
  }

  // Match standalone URLs on their own line
  const standaloneRegex = /^(https?:\/\/[^\s]+)$/gm
  while ((match = standaloneRegex.exec(markdown)) !== null) {
    urls.push(match[1])
  }

  return [...new Set(urls)] // Remove duplicates
}

export async function renderMarkdown(markdown: string): Promise<string> {
  await initShiki()

  // Detect all standalone URLs
  const urls = detectStandaloneURLs(markdown)

  // Fetch OGP data for all URLs in parallel
  const ogpResults = await Promise.all(
    urls.map(async (url) => ({
      url,
      ogp: await fetchOGP(url),
    }))
  )

  // Replace standalone URLs with OGP cards
  let processedMarkdown = markdown
  for (const { url, ogp } of ogpResults) {
    const ogpCard = generateOGPCard(ogp)
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Replace only standalone URLs (on their own line)
    processedMarkdown = processedMarkdown
      .replace(new RegExp(`^<${escapedUrl}>$`, 'gm'), ogpCard)
      .replace(new RegExp(`^${escapedUrl}$`, 'gm'), ogpCard)
  }

  return md.render(processedMarkdown)
}
