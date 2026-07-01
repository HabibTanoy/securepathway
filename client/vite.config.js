import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router-dom')) {
            return 'vendor-react';
          }
          // Heavy quiz data
          if (id.includes('/data/extendedQuizzes') || id.includes('/data/quizzes') || id.includes('/data/hookScenarios')) {
            return 'data-quiz';
          }
          // Curriculum + reference content
          if (id.includes('/data/curriculum') || id.includes('/data/assessmentRubrics') || id.includes('/data/simulations') || id.includes('/data/sops')) {
            return 'data-content';
          }
          // Onboarding-specific data
          if (id.includes('/data/onboarding_')) {
            return 'data-onboarding';
          }
        },
      },
    },
  },
})
