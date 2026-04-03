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
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MindfulFlow',
        short_name: 'MindfulFlow',
        description: 'Sledování mentálního zdraví a nálad',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
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
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false
      },
      output: {
        // Force some big, stable vendor deps into separate chunks.
        // Helps initial payload parsing/execution (LCP) and improves caching.
        manualChunks: {
          react: ['react', 'react-dom'],
          framer: ['framer-motion'],
          dexie: ['dexie', 'dexie-react-hooks'],
          lucide: ['lucide-react']
        }
      }
    },
    
    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
    
    // Minify with esbuild (faster and already included)
    minify: 'esbuild',
    
    // Target modern browsers — esnext gives smaller bundles and faster parsing
    target: 'esnext',
    
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
      'lucide-react'
    ],
    exclude: []
  },
  
  // Enable esbuild for faster builds
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    drop: ['console', 'debugger']
  }
});
