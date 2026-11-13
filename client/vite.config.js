import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Path aliases — import from '@/components/...' instead of '../../components/...'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Proxy API calls to Express backend in development
  // This avoids CORS issues and simulates production routing
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
