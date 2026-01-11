import { defineConfig } from 'vitest/config'
import honox from 'honox/vite'
import build from '@hono/vite-build/cloudflare-pages'
import { postsHMR } from './vite-plugin-posts'

export default defineConfig({
  plugins: [honox(), build(), postsHMR()],
  test: {
    exclude: ['**/node_modules/**', '**/.direnv/**'],
  },
})
