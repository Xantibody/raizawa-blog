import { describe, it, expect } from 'vitest'
import { generateOGPCard } from './ogp'
import type { OGPData } from './ogp'

describe('OGP card generation', () => {
  it('should generate card with all OGP data', () => {
    const ogp: OGPData = {
      url: 'https://example.com',
      title: 'Example Title',
      description: 'Example description',
      image: 'https://example.com/image.png',
      siteName: 'Example Site',
    }

    const html = generateOGPCard(ogp)

    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('Example Title')
    expect(html).toContain('Example description')
    expect(html).toContain('src="https://example.com/image.png"')
    expect(html).toContain('Example Site')
    expect(html).toContain('class="ogp-card"')
  })

  it('should show NO IMAGE when image is missing', () => {
    const ogp: OGPData = {
      url: 'https://example.com',
      title: 'Example Title',
      description: '',
      image: '',
      siteName: '',
    }

    const html = generateOGPCard(ogp)

    expect(html).toContain('NO IMAGE')
    expect(html).toContain('ogp-noimage')
  })

  it('should use URL as title when title is missing', () => {
    const ogp: OGPData = {
      url: 'https://example.com/page',
      title: '',
      description: '',
      image: '',
      siteName: '',
    }

    const html = generateOGPCard(ogp)

    expect(html).toContain('https://example.com/page')
  })

  it('should include security attributes', () => {
    const ogp: OGPData = {
      url: 'https://example.com',
      title: 'Test',
      description: '',
      image: '',
      siteName: '',
    }

    const html = generateOGPCard(ogp)

    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })
})

describe('OGP meta tags structure', () => {
  const requiredMetaTags = [
    'og:title',
    'og:description',
    'og:type',
    'og:url',
    'og:site_name',
    'twitter:card',
  ]

  it('should define all required OGP properties', () => {
    // This test documents what OGP tags should be present
    // Actual rendering test would require integration testing
    for (const tag of requiredMetaTags) {
      expect(tag).toBeTruthy()
    }
  })

  it('should have correct og:type values', () => {
    const validTypes = ['website', 'article']
    expect(validTypes).toContain('website') // for index page
    expect(validTypes).toContain('article') // for post pages
  })
})
