import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        id: '/',
        lang: 'fr',
        name: 'Kaisse',
        short_name: 'Kaisse',
        description: 'Systeme de caisse premium pour fastfoods',
        theme_color: '#0D1533',
        background_color: '#0D1533',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/kaisse.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/kaisse.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
