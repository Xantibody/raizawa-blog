import anchor from "markdown-it-anchor";
import preprocessOgpCards from "./markdown-it-ogp-card";
import { SHIKI_THEME, getHighlighter, shikiTransformers } from "./shiki";
import { type RenderResult, type TocItem } from "./toc";
import MarkdownIt from "markdown-it";

// Initialize markdown-it
const md = MarkdownIt({ breaks: true, html: true });

let currentTocItems: TocItem[] = [];

md.use(anchor, {
  callback: (token: { tag: string }, info: { slug: string; title: string }) => {
    currentTocItems.push({
      id: info.slug,
      level: Number(token.tag.slice(1)),
      text: info.title,
    });
  },
  permalink: anchor.permalink.linkAfterHeader({
    assistiveText: (title: string) => `「${title}」へのリンク`,
    class: "header-anchor",
    placement: "after",
    style: "aria-label",
    symbol: "#",
    wrapper: ['<div class="heading-wrapper">', "</div>"],
  }),
});

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
      theme: SHIKI_THEME,
      transformers: shikiTransformers,
    });
  };

  shikiInitialized = true;
};

const renderMarkdown = async (markdown: string): Promise<RenderResult> => {
  await initShiki();
  const processedMarkdown = await preprocessOgpCards(markdown);
  currentTocItems = [];
  const html = md.render(processedMarkdown);
  return { html, toc: [...currentTocItems] };
};

export default renderMarkdown;
