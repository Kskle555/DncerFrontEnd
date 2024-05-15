import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7068', // API adresi
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // İsteğin yeniden yazılması
      },
    },
  },
});
