// After `vite build` (client) and `vite build --ssr` (server), write the page's HTML into dist/index.html.
// The page then works without JavaScript; src/main.tsx only hydrates the Motion Brew islands.
import { readFile, writeFile, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const dist = path.resolve('dist');
const { render } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);

const KIT_SCRIPTS = [
  '<script type="module" src="/assets/system.js"></script>',
  '<script type="module" src="/assets/motion/motion.js"></script>',
  '<script type="module" src="/assets/layout/layout.js"></script>',
].join('\n');

const file = path.join(dist, 'index.html');
let html = await readFile(file, 'utf8');
const body = render();
if (!html.includes('<div id="app"></div>')) throw new Error('dist/index.html has no <div id="app"></div> to fill');
html = html
  .replace('<div id="app"></div>', body)
  .replace('<body>', '<body data-prerendered="true">')
  .replace('<!--kit-scripts-->', KIT_SCRIPTS);
await writeFile(file, html);
await rm(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`prerendered dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);
