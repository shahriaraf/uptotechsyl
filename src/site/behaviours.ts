/** The page's own small behaviours, in plain DOM code so they work before React hydrates. */
import { site } from '../content/site';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** the header: solid once the hero is behind it; the phone menu opens full screen */
function header() {
  const hdr = document.querySelector<HTMLElement>('[data-hdr]');
  if (!hdr) return;
  const onScroll = () => hdr.classList.toggle('is-solid', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = hdr.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = hdr.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;
  const set = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    hdr.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      set(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', () => set(false));
}

/** Sylhet's time in the header */
function clock() {
  const el = document.querySelector('[data-clock]');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: site.timeZone });
  const tick = () => (el.textContent = fmt.format(new Date()));
  tick();
  setInterval(tick, 1000);
}

/** nav links scramble through glyphs and settle on hover */
function scramble() {
  if (reduce()) return;
  const glyphs = '01<>/_#';
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((a) => {
    const node = [...a.childNodes].find((n) => n.nodeType === 3 && n.textContent!.trim()) as Text | undefined;
    if (!node) return;
    const word = node.textContent!;
    let raf = 0;
    a.addEventListener('pointerenter', () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const run = (now: number) => {
        const t = Math.min(1, (now - start) / 380);
        const done = Math.floor(t * word.length);
        node.textContent = word
          .split('')
          .map((ch, i) => (i < done || ch === ' ' ? ch : glyphs[(Math.random() * glyphs.length) | 0]))
          .join('');
        if (t < 1) raf = requestAnimationFrame(run);
        else node.textContent = word;
      };
      raf = requestAnimationFrame(run);
    });
  });
}

/** #services: pointing at a row shows that service's work beside the cursor */
function preview() {
  const list = document.querySelector<HTMLElement>('[data-preview-list]');
  const box = document.querySelector<HTMLElement>('[data-preview]');
  if (!list || !box || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const img = box.querySelector('img')!;
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const follow = () => {
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    box.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    raf = requestAnimationFrame(follow);
  };
  list.addEventListener('pointermove', (e) => {
    const r = list.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top + list.offsetTop;
    const row = (e.target as HTMLElement).closest<HTMLElement>('.svc__row');
    const src = row?.dataset.preview;
    if (src) {
      if (img.getAttribute('src') !== src) img.src = src;
      box.classList.add('is-on');
    } else box.classList.remove('is-on');
    if (!raf) {
      x = tx;
      y = ty;
      raf = requestAnimationFrame(follow);
    }
  });
  list.addEventListener('pointerleave', () => {
    box.classList.remove('is-on');
    cancelAnimationFrame(raf);
    raf = 0;
  });
}

/** a price card's button fills in "What you need" */
function prefill() {
  document.querySelectorAll<HTMLAnchorElement>('[data-prefill]').forEach((a) =>
    a.addEventListener('click', () => {
      const field = document.querySelector<HTMLInputElement>('#f-service');
      if (field && !field.value) field.value = a.dataset.prefill!;
    }),
  );
}

/** "Open now" or "Closed now", from the real hours in Sylhet's time zone */
function hours() {
  const out = document.querySelector<HTMLElement>('[data-open-now]');
  if (!out) return;
  const parts = new Intl.DateTimeFormat('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: site.timeZone })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((o, p) => ((o[p.type] = p.value), o), {});
  const day = parts.weekday.toLowerCase().slice(0, 3);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  const open = day !== 'fri' && minutes >= 600 && minutes < 1080;
  out.textContent = open ? 'Open now in Sylhet' : 'Closed now, we reply next working day';
  out.classList.toggle('is-open', open);
}

/** the brief form: checks each field, then posts to the endpoint or opens a prepared email */
function form() {
  const f = document.querySelector<HTMLFormElement>('[data-form]');
  if (!f) return;
  const status = f.querySelector<HTMLElement>('[data-form-status]')!;
  const fields = [...f.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
  const check = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const ok = el.type === 'email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()) : el.value.trim().length > 0;
    const err = document.getElementById(el.getAttribute('aria-describedby') || '');
    if (err) err.hidden = ok;
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  };
  fields.forEach((el) => el.addEventListener('blur', () => el.value && check(el)));
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const bad = fields.filter((el) => !check(el));
    if (bad.length) {
      bad[0].focus();
      status.textContent = '';
      return;
    }
    const data = Object.fromEntries(new FormData(f)) as Record<string, string>;
    const endpoint = f.dataset.endpoint;
    if (endpoint) {
      status.textContent = 'Sending ...';
      try {
        const r = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) });
        if (!r.ok) throw new Error(String(r.status));
        f.reset();
        status.textContent = 'Your project brief is in. We will reply by email.';
      } catch {
        status.textContent = `It did not send. Email us at ${site.email} instead.`;
      }
      return;
    }
    const body = `Name: ${data.name}\nEmail: ${data.email}\nWhat I need: ${data.service}\n\n${data.brief}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project brief: ${data.service}`)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Your email app has the brief ready to send.';
  });
}

/** dark and light: the head script picks the first theme (saved, else the system's); this button flips it */
function theme() {
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!btn) return;
  const root = document.documentElement;
  const label = () => btn.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  label();
  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    if (!reduce()) {
      root.classList.add('theme-swap');
      setTimeout(() => root.classList.remove('theme-swap'), 400);
    }
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode: the choice lasts this visit */
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f3f4ee' : '#0b0c0b');
    label();
    window.dispatchEvent(new CustomEvent('themechange'));
  });
}

export function behaviours() {
  theme();
  header();
  clock();
  scramble();
  preview();
  prefill();
  hours();
  form();
}
