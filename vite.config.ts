import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        customize: path.resolve(__dirname, 'index.html'),
        prebuilt: path.resolve(__dirname, 'index.html'),
        'gaming-pcs': path.resolve(__dirname, 'index.html'),
        workstations: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'index.html'),
        support: path.resolve(__dirname, 'index.html'),
      },
      output: {
        dir: 'dist',
      },
    },
  },
}));
