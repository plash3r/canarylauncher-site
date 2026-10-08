import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  server: { open: '/app.html' },
  build: {
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'app.html',
      // A single classic bundle also works when index.html is opened from disk.
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'js/app.js',
        assetFileNames: (asset) => asset.names?.some(name => name.endsWith('.css'))
          ? 'css/style.css'
          : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
