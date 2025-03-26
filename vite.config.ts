import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    open: true, // Auto-opens browser on dev server start
    port: 3000, // Ensures consistency
    strictPort: true, // Avoids fallback to random ports
  },
});
