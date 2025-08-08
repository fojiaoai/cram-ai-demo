/*
 * @Descripttion: ****
 * @version: 1.0.0
 * @Author: Tom Zhou
 * @Date: 2025-07-31 02:11:57
 * @LastEditors: Tom Zhou
 * @LastEditTime: 2025-07-31 02:12:02
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar', '@radix-ui/react-button', '@radix-ui/react-card'],
          icons: ['lucide-react'],
          i18n: ['react-i18next', 'i18next'],
          router: ['react-router-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    host: true
  }
})