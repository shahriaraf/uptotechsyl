import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The page is prerendered to static HTML by scripts/prerender.mjs after the client build;
// only the Motion Brew islands hydrate in the browser (src/main.tsx).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  ssr: {
    // bundle the animation libraries into the prerender build so Node can import it directly
    noExternal: ['motion', 'framer-motion', 'motion-dom', 'motion-utils', 'lucide-react'],
  },
});
