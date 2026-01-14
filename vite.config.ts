import { defineConfig } from "vitest/config";
import honox from "honox/vite";
import build from "@hono/vite-build/cloudflare-workers";

export default defineConfig({
  plugins: [honox(), build()],
  test: {
    exclude: ["**/node_modules/**", "**/.direnv/**"],
  },
});
