export interface OGPData {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
}

const createOGPData = (url: string, partial: Partial<OGPData> = {}): OGPData => {
  return {
    description: partial.description ?? "",
    image: partial.image ?? "",
    siteName: partial.siteName ?? "",
    title: partial.title ?? "",
    url,
  };
};

// In-memory cache for OGP data (expires after 1 hour)
const ogpCache = new Map<string, { data: OGPData; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Extract content from meta tags using regex
const extractMetaContent = (html: string, patterns: string[]): string | undefined => {
  for (const pattern of patterns) {
    const regex = new RegExp(`<meta[^>]*${pattern}[^>]*content=["']([^"']+)["']`, "i");
    const match = html.match(regex);
    if (match) {
      return match[1];
    }
  }
  return undefined;
};

export const fetchOGP = async (url: string): Promise<OGPData> => {
  // Check cache
  const cached = ogpCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Fetch HTML with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OGPBot/1.0; +https://raizawa-blog.pages.dev)",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract OGP and fallback meta tags using regex
    const title =
      extractMetaContent(html, ['property="og:title"', 'name="twitter:title"']) ??
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];

    const description = extractMetaContent(html, [
      'property="og:description"',
      'name="twitter:description"',
      'name="description"',
    ]);

    let image = extractMetaContent(html, ['property="og:image"', 'name="twitter:image"']);

    // Resolve relative image URLs
    if (image && !image.startsWith("http")) {
      const baseUrl = new URL(url);
      image = new URL(image, baseUrl.origin).toString();
    }

    const siteName = extractMetaContent(html, ['property="og:site_name"', 'name="twitter:site"']);

    const ogpData = createOGPData(url, { description, image, siteName, title });

    // Cache the result
    ogpCache.set(url, { data: ogpData, timestamp: Date.now() });

    return ogpData;
  } catch (error) {
    console.error(`Failed to fetch OGP for ${url}:`, error);

    // Return minimal OGP data on failure
    const ogpData = createOGPData(url);
    ogpCache.set(url, { data: ogpData, timestamp: Date.now() });

    return ogpData;
  }
};

export const generateOGPCard = (ogp: OGPData): string => {
  const { description, image, siteName, title, url } = ogp;

  const imageHtml = image
    ? `<span class="ogp-image"><img src="${image}" alt="${title || url}" /></span>`
    : `<span class="ogp-image ogp-noimage">NO IMAGE</span>`;

  return `<a href="${url}" class="ogp-card" target="_blank" rel="noopener noreferrer">${imageHtml}<span class="ogp-content"><span class="ogp-title">${title || url}</span><span class="ogp-description">${description}</span><span class="ogp-site">${siteName}</span></span></a>`;
};
