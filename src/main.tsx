import './styles/index.css';
import { behaviours } from './site/behaviours';

/**
 * The page arrives as finished HTML. The Motion Brew islands (and React and motion with them) hydrate
 * once the browser is idle, so the first screen ships no framework code. In `npm run dev` there is no
 * server render, so the page is drawn here first.
 */
async function hydrateIslands() {
  const [{ createElement }, { createRoot, hydrateRoot }, { islands }] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./islands/registry'),
  ]);
  const mount = (el: HTMLElement) => {
    const Component = islands[el.dataset.island as keyof typeof islands];
    if (!Component) return;
    const node = createElement(Component, JSON.parse(el.dataset.props || '{}'));
    if (el.firstElementChild) hydrateRoot(el, node);
    else createRoot(el).render(node);
  };
  // each island wakes as it nears the screen, so no single long task hydrates the whole page
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        mount(e.target as HTMLElement);
      }),
    { rootMargin: '600px 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-island]').forEach((el) => io.observe(el));
}

function whenIdle(run: () => void) {
  if ('requestIdleCallback' in window) requestIdleCallback(() => run(), { timeout: 1500 });
  else setTimeout(run, 300);
}

/** dev only: render the page to static HTML, exactly as scripts/prerender.mjs does for the build */
async function devPage() {
  const [{ render }] = await Promise.all([import('./entry-server')]);
  document.getElementById('app')!.outerHTML = render();
}

// three.js loads after first paint, so it never holds up the headline
function terrain() {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-terrain]');
  if (!canvas) return;
  whenIdle(() => import('./scene/terrain').then((m) => m.mountTerrain(canvas)));
}

function start() {
  document.documentElement.classList.add('is-ready');
  behaviours();
  terrain();
}

if (document.body.dataset.prerendered === 'true') {
  start();
  whenIdle(hydrateIslands);
} else
  devPage().then(() => {
    start();
    hydrateIslands();
  });
