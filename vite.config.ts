import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
// import { analyzer } from 'vite-bundle-analyzer';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  // plugins: [react(),  analyzer()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, './ext.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: { host: '0.0.0.0', open: '/ext' },
  esbuild: { legalComments: 'none' },
});
