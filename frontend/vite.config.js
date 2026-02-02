import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 48732,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:6789',
        changeOrigin: true,
      },
      '/grafana': {
        target: 'http://localhost:6789',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})