import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

import { cloudflare } from "@cloudflare/vite-plugin";

/** 避免浏览器强缓存 HTML / 静态资源，本地调试时总能拉到最新内容 */
function devNoStoreHeaders(): Plugin {
  return {
    name: 'dev-no-store-headers',
    configureServer(server) {
      server.middlewares.use((_req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devNoStoreHeaders(), cloudflare()],
  server: {
    port: 5173,
    strictPort: true,
  },
})