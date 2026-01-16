import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
      // eslint-disable-next-line no-undef
      '@features': path.resolve(__dirname, './src/features'),
      // eslint-disable-next-line no-undef
      '@shared': path.resolve(__dirname, './src/shared'),
      // eslint-disable-next-line no-undef
      '@types': path.resolve(__dirname, './src/types'),
      // eslint-disable-next-line no-undef
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
});
