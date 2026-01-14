import { defineConfig } from "vitest/config";
import { defaultExtensionMap } from "hono/ssg";
import honox from "honox/vite";
import ssg from "@hono/vite-ssg";

const entry = "./app/server.ts";

export default defineConfig({
  plugins: [
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
});
