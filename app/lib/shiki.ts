import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import { type HighlighterCore, createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { type ShikiTransformer } from "shiki";

const SHIKI_THEME = "one-dark-pro";

// Global highlighter cache
// eslint-disable-next-line init-declarations -- lazy initialization pattern
let highlighter: HighlighterCore | undefined;

// Custom transformer to add file name from meta string
// Usage: ```ts title="filename.ts"
const REGEX_CAPTURE_GROUP_INDEX = 1;

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
      node.children.unshift({
        children: [{ type: "text", value: title }],
        properties: { class: "code-title" },
        tagName: "div",
        type: "element",
      });
    }
  },
});

// Custom transformer to add copy button to code blocks
const transformerCopyButton = (): ShikiTransformer => ({
  name: "copy-button",
  pre(node) {
    node.children.push({
      children: [{ type: "text", value: "Copy" }],
      properties: { class: "copy-button" },
      tagName: "button",
      type: "element",
    });
  },
});

// All transformers used for syntax highlighting
const shikiTransformers = [
  transformerNotationDiff(),
  transformerNotationHighlight(),
  transformerNotationErrorLevel(),
  transformerMetaTitle(),
  transformerCopyButton(),
];

// Initialize Shiki highlighter (Cloudflare Workers compatible)
const getHighlighter = async (): Promise<HighlighterCore> => {
  if (highlighter !== undefined) {
    return highlighter;
  }

  highlighter = await createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: [
      import("shiki/langs/rust.mjs"),
      import("shiki/langs/nix.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/json.mjs"),
    ],
    themes: [import("shiki/themes/one-dark-pro.mjs")],
  });

  return highlighter;
};

export { getHighlighter, SHIKI_THEME, shikiTransformers };
