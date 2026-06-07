import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['test/setup.ts'],
    include: ['test/**/*.test.ts'],
  },
  resolve: {
    alias: { src: fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
