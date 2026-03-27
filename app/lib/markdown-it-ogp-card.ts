import { fetchOGP, generateOGPCard } from "./ogp";

const REGEX_CAPTURE_GROUP_INDEX = 1;

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

const detectStandaloneURLs = (markdown: string): string[] => {
  const autolinkRegex = /^<(https?:\/\/[^\s>]+)>$/gm;
  const autolinkUrls = extractUrlsWithPattern(markdown, autolinkRegex);

  const standaloneRegex = /^(https?:\/\/[^\s]+)$/gm;
  const standaloneUrls = extractUrlsWithPattern(markdown, standaloneRegex);

  return [...new Set([...autolinkUrls, ...standaloneUrls])];
};

const replaceUrlsWithOGPCards = (
  markdown: string,
  ogpResults: { ogp: Awaited<ReturnType<typeof fetchOGP>>; url: string }[],
): string => {
  let processedMarkdown = markdown;
  for (const { url, ogp } of ogpResults) {
    const ogpCard = generateOGPCard(ogp);
    const escapedUrl = url.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
    processedMarkdown = processedMarkdown
      .replaceAll(new RegExp(`^<${escapedUrl}>$`, "gm"), ogpCard)
      .replaceAll(new RegExp(`^${escapedUrl}$`, "gm"), ogpCard);
  }
  return processedMarkdown;
};

const preprocessOgpCards = async (markdown: string): Promise<string> => {
  const urls = detectStandaloneURLs(markdown);

  const ogpResults = await Promise.all(
    urls.map(async (url) => ({
      ogp: await fetchOGP(url),
      url,
    })),
  );

  return replaceUrlsWithOGPCards(markdown, ogpResults);
};

export { preprocessOgpCards };
