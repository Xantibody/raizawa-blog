import { defineConfig } from "vitest/config";
import { defaultExtensionMap } from "hono/ssg";
import honox from "honox/vite";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";

const entry = "./app/server.ts";

// HonoX SSG requires a 2-stage build when using external CSS files:
// 1. `vite build --mode client` - Build CSS assets and generate manifest
// 2. `vite build` - SSG build that resolves CSS paths from manifest
// See: https://github.com/honojs/honox#using-tailwind-css
export default defineConfig(({ mode }) => {
  // Stage 1: Client build for CSS assets
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: ["./app/style.css"],
          output: {
            assetFileNames: "static/[name]-[hash].[ext]",
          },
        },
        emptyOutDir: false,
        manifest: true,
      },
      plugins: [tailwindcss()],
    };
  }
  return {
    build: {
      emptyOutDir: false,
    },
    plugins: [
      tailwindcss(),
      honox(),
      ssg({
        entry,
        extensionMap: {
          "application/rss+xml": "xml",
          ...defaultExtensionMap,
        },
      }),
    ],
    test: {
      exclude: ["**/node_modules/**", "**/.direnv/**"],
    },
  };
});
