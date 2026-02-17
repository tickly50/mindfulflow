import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MindfulFlow',
        short_name: 'MindfulFlow',
        description: 'Sledování mentálního zdraví a nálad',
        theme_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for debugging
    sourcemap: false,
    
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Animation libraries
          'animation-vendor': ['framer-motion'],
          
          // Chart libraries
          'chart-vendor': ['recharts'],
        }
      }
    },
    
    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
    
    // Minify with esbuild (faster and already included)
    minify: 'esbuild',
    
    // Target modern browsers for better optimization
    target: 'es2015',
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Optimize assets
    assetsInlineLimit: 4096, // 4kb - inline small assets
  },
  
  // Development server configuration
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    cors: true
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    open: false
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'recharts',
      'lucide-react'
    ],
    exclude: []
  },
  
  // Enable esbuild for faster builds
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
