import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite config. Env vars (VITE_FIREBASE_*, VITE_GEMINI_API_KEY) are read at build time
// from .env — never commit real secrets. See README for setup.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
