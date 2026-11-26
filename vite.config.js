import { defineConfig } from 'vite';

/* Builds the game as one script (castaways.js) plus one stylesheet (castaways.css), with no other
 * files, so the page can link them with ?v=<file time> (the site's fresh_url) and a browser never
 * runs a stale copy after an upload. base './' keeps every path relative. */
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    target: 'es2020',
    modulePreload: { polyfill: false },
    assetsInlineLimit: 100000,
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'castaways.js',
        chunkFileNames: 'castaways-[name]-[hash].js',
        assetFileNames: (info) => {
          const name = (info.names && info.names[0]) || info.name || '';
          return name.endsWith('.css') ? 'castaways.css' : 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
