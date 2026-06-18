import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** @see https://vite.dev/config/ */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4101,
    strictPort: true,
  },
});
