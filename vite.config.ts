import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from 'path';
import { defineConfig } from "vite";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  // This tells Vite the site will live at:
  // https://alex-s-2030.github.io/
  base: '/',

  plugins: [react(), tailwindcss()],
  build: {
    // Build into "docs" instead of "dist"
    outDir: 'docs',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

