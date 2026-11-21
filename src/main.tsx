import './styles/index.css';

/**
 * The page arrives as finished HTML. The Motion Brew islands (and React, motion and gsap with them)
 * load only once the browser is idle, so the first screen ships no framework code. In `npm run dev` there is no server render, so the page is drawn here first.
 */
async function hydrateIslands() {
  const [{ createElement }, { createRoot, hydrateRoot }, { islands }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./islands/registry'),
  ]);
  document.querySelectorAll<HTMLElement>('[data-island]').forEach((el) => {
    const Component = islands[el.dataset.island as keyof typeof islands];
    if (!Component) return;
    const node = createElement(Component, JSON.parse(el.dataset.props || '{}'));
    if (el.firstElementChild) hydrateRoot(el, node);
    else createRoot(el).render(node);
  });
}

// The islands hydrate once the browser is idle after load (not on scroll, so nothing in them changes as it
// comes into view); three.js loads the same way.
function whenIdle(run: () => void) {
  if ('requestIdleCallback' in window) requestIdleCallback(() => run(), { timeout: 2000 });
  else setTimeout(run, 300);
}

async function devPage() {
  const [{ createElement }, { createRoot }, { flushSync }, { Page }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('react-dom'),
    import('./Page'),
  ]);
  const root = createRoot(document.getElementById('app')!);
  flushSync(() => root.render(createElement(Page)));
  for (const src of ['/assets/system.js', '/assets/motion/motion.js', '/assets/layout/layout.js']) {
    const s = document.createElement('script');
    s.type = 'module';
    s.src = src;
    document.body.appendChild(s);
  }
}

// three.js (about 150 KB gzipped) loads only once the page is idle, so it never holds up the first screen
function glassScene() {
  const canvases = [...document.querySelectorAll<HTMLCanvasElement>('canvas.scene')];
  if (!canvases.length) return;
  whenIdle(() => import('./scene/glass-scene').then((m) => m.mountGlassScenes(canvases)));
}

if (document.body.dataset.prerendered === 'true') {
  whenIdle(hydrateIslands);
  glassScene();
} else devPage().then(() => {
  hydrateIslands();
  glassScene();
});
