import { fetchOGP, generateOGPCard } from "./ogp";
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";
import { type ShikiTransformer } from "shiki";

const REGEX_CAPTURE_GROUP_INDEX = 1;

// Custom transformer to add file name from meta string
// Usage: ```ts title="filename.ts"
const transformerMetaTitle = (): ShikiTransformer => ({
  name: "meta-title",
  pre(node) {
    const meta = this.options.meta?.__raw;
    if (meta === undefined || meta === "") {
      return;
    }

    const match = meta.match(/title=["']([^"']+)["']/);
    const title = match?.[REGEX_CAPTURE_GROUP_INDEX];
    if (title !== undefined && title !== "") {
      // Add title element before the code
      node.children.unshift({
        children: [{ type: "text", value: title }],
        properties: { class: "code-title" },
        tagName: "div",
        type: "element",
      });
    }
  },
});

// Initialize markdown-it with Shiki
const md = MarkdownIt({ breaks: true, html: true });

// Shiki plugin (initialized lazily)
let shikiInitialized = false;

const initShiki = async () => {
  if (!shikiInitialized) {
    md.use(
      await Shiki({
        theme: "gruvbox-dark-soft",
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
          transformerNotationErrorLevel(),
          transformerMetaTitle(),
        ],
      }),
    );
    shikiInitialized = true;
  }
};

// Extract URLs from markdown using a regex pattern
const extractUrlsWithPattern = (markdown: string, regex: RegExp): string[] => {
  const urls: string[] = [];
  for (const match of markdown.matchAll(regex)) {
    const url = match[REGEX_CAPTURE_GROUP_INDEX];
    if (url !== undefined && url !== "") {
      urls.push(url);
    }
  }
  return urls;
};

// Detect standalone URLs (on their own line only)
const detectStandaloneURLs = (markdown: string): string[] => {
  // Match <URL> on its own line
  const autolinkRegex = /^<(https?:\/\/[^\s>]+)>$/gm;
  const autolinkUrls = extractUrlsWithPattern(markdown, autolinkRegex);

  // Match standalone URLs on their own line
  const standaloneRegex = /^(https?:\/\/[^\s]+)$/gm;
  const standaloneUrls = extractUrlsWithPattern(markdown, standaloneRegex);

  // Remove duplicates
  return [...new Set([...autolinkUrls, ...standaloneUrls])];
};

const renderMarkdown = async (markdown: string): Promise<string> => {
  await initShiki();

  // Detect all standalone URLs
  const urls = detectStandaloneURLs(markdown);

  // Fetch OGP data for all URLs in parallel
  const ogpResults = await Promise.all(
    urls.map(async (url) => ({
      ogp: await fetchOGP(url),
      url,
    })),
  );

  // Replace standalone URLs with OGP cards
  let processedMarkdown = markdown;
  for (const { url, ogp } of ogpResults) {
    const ogpCard = generateOGPCard(ogp);
    const escapedUrl = url.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
    // Replace only standalone URLs (on their own line)
    processedMarkdown = processedMarkdown
      .replaceAll(new RegExp(`^<${escapedUrl}>$`, "gm"), ogpCard)
      .replaceAll(new RegExp(`^${escapedUrl}$`, "gm"), ogpCard);
  }

  return md.render(processedMarkdown);
};

export default renderMarkdown;
