import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project is served from https://<user>.github.io/ai-driven-gta7/ on Pages,
// and from / during local dev.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/ai-driven-gta7/' : '/',
  plugins: [react()],
  build: { outDir: 'dist', assetsInlineLimit: 0 },
}))
