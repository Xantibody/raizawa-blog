import { spawn } from 'child_process'
import type { Plugin } from 'vite'

export function postsHMR(): Plugin {
  return {
    name: 'posts-hmr',
    configureServer(server) {
      const postsDir = 'app/posts'

      server.watcher.add(postsDir)

      server.watcher.on('change', async (path) => {
        if (path.endsWith('.md') && path.includes(postsDir)) {
          console.log(`\n[posts-hmr] ${path} changed, rebuilding...`)

          const proc = spawn('bun', ['run', 'scripts/build-posts.ts'], {
            stdio: 'inherit',
          })

          proc.on('close', (code) => {
            if (code === 0) {
              console.log('[posts-hmr] Rebuild complete, reloading...')
              server.ws.send({ type: 'full-reload' })
            }
          })
        }
      })
    },
  }
}
