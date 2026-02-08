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

// Helper to extract title from meta string
// Usage: ```ts title="filename.ts"
const REGEX_CAPTURE_GROUP_INDEX = 1;

const extractTitle = (meta: string | undefined): string | undefined => {
  if (meta === undefined || meta === "") {
    return undefined;
  }
  const match = meta.match(/title=["']([^"']+)["']/);
  return match?.[REGEX_CAPTURE_GROUP_INDEX];
};

// Custom transformer to add title to code block
const transformerMetaTitle = (): ShikiTransformer => ({
  name: "meta-title",
  pre(node) {
    const title = extractTitle(this.options.meta?.__raw);
    if (title === undefined || title === "") {
      return;
    }

    node.children.unshift({
      children: [{ type: "text", value: title }],
      properties: { class: "code-title" },
      tagName: "div",
      type: "element",
    });
  },
});

// Custom transformer to wrap code block with copy button
const transformerCodeWrapper = (): ShikiTransformer => ({
  name: "code-wrapper",
  root(node) {
    const [pre] = node.children;
    if (pre === undefined || pre.type !== "element") {
      return;
    }

    node.children = [
      {
        children: [
          {
            children: [{ type: "text", value: "Copy" }],
            properties: { class: "copy-button btn btn-xs" },
            tagName: "button",
            type: "element",
          },
          pre,
        ],
        properties: { class: "code-block-wrapper" },
        tagName: "div",
        type: "element",
      },
    ];
  },
});

// All transformers used for syntax highlighting
const shikiTransformers = [
  transformerNotationDiff(),
  transformerNotationHighlight(),
  transformerNotationErrorLevel(),
  transformerMetaTitle(),
  transformerCodeWrapper(),
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
