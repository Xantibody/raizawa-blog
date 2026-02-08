import { defineConfig } from "vitest/config";
import { defaultExtensionMap } from "hono/ssg";
import honox from "honox/vite";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";

const entry = "./app/server.ts";

export default defineConfig(({ mode }) => {
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
