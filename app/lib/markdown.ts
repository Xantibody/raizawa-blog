import { fetchOGP, generateOGPCard } from "./ogp";
import { getHighlighter, shikiTransformers } from "./shiki";
import MarkdownIt from "markdown-it";

const REGEX_CAPTURE_GROUP_INDEX = 1;

// Initialize markdown-it
const md = MarkdownIt({ breaks: true, html: true });

// Shiki plugin (initialized lazily)
let shikiInitialized = false;

const getLangFromTokenInfo = (info: string): string => {
  const [langPart] = info.split(/\s+/);
  if (langPart !== undefined && langPart !== "") {
    return langPart;
  }
  return "text";
};

const resolveLang = (lang: string, loadedLangs: string[]): string => {
  if (loadedLangs.includes(lang)) {
    return lang;
  }
  return "text";
};

const initShiki = async () => {
  if (shikiInitialized) {
    return;
  }

  const highlighter = await getHighlighter();

  // Custom fence renderer using Shiki
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    if (token === undefined) {
      return "";
    }
    const code = token.content;
    const lang = getLangFromTokenInfo(token.info);
    const meta = token.info.slice(lang.length).trim();
    const langToUse = resolveLang(lang, highlighter.getLoadedLanguages());

    return highlighter.codeToHtml(code, {
      lang: langToUse,
      meta: { __raw: meta },
      theme: "gruvbox-dark-soft",
      transformers: shikiTransformers,
    });
  };

  shikiInitialized = true;
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
