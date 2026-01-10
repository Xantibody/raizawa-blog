/// <reference types="vitest" />
import { defineConfig } from 'vite'
import honox from 'honox/vite'
import build from '@hono/vite-build/cloudflare-pages'

export default defineConfig({
  plugins: [honox(), build()],
  test: {
    exclude: ['**/node_modules/**', '**/.direnv/**'],
  },
})
