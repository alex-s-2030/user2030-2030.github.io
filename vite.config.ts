import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from 'path';
import { defineConfig } from "vite";

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  // This tells Vite the site will live at:
  // https://alex-s-2030.github.io/user2030-2030.github.io/
  base: '/user2030-2030.github.io/',

  plugins: [react(), tailwindcss()],
  build: {
    // Build into "docs" instead of "dist"
    outDir: 'docs',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
    },
  },
});

