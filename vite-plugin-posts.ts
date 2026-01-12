/**
 * Vite plugin for markdown file HMR during local development.
 *
 * Purpose:
 * - Watch app/posts/*.md files for changes
 * - Automatically rebuild posts-data.ts when markdown files are modified
 * - Trigger browser reload to reflect changes immediately
 *
 * Note:
 * - This plugin only runs in dev mode (configureServer is not called during build)
 * - Production builds use the standard build:content script before vite build
 */
import { spawn } from "child_process";
import type { Plugin } from "vite";

export function postsHMR(): Plugin {
  return {
    name: "posts-hmr",
    configureServer(server) {
      const postsDir = "app/posts";

      server.watcher.add(postsDir);

      server.watcher.on("change", async (path) => {
        if (path.endsWith(".md") && path.includes(postsDir)) {
          console.log(`\n[posts-hmr] ${path} changed, rebuilding...`);

          const proc = spawn("bun", ["run", "scripts/build-posts.ts"], {
            stdio: "inherit",
          });

          proc.on("close", (code: number | null) => {
            if (code === 0) {
              console.log("[posts-hmr] Rebuild complete, reloading...");
              server.ws.send({ type: "full-reload" });
            }
          });
        }
      });
    },
  };
}
