// Turns the client's originals (design/originals) into the art-directed images the site ships (public/images).
//
//  - FRAMED: a project's screenshot or mockup cropped to fill its 16:10 card edge to edge.
//  - COVER: a photograph cropped to fill (print, brand and apparel work on the gallery wall; team portraits).
//
// Output: <name>-<width>.webp, plus the logo mark and favicons. Run: npm run images
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'design/originals';
const OUT = 'public/images';
const STYLE_VERSION = 3; // bump to force every framed image to redraw after a change here

/** web and UI work: full-bleed 16:10 */
const FRAMED = [
  { src: 'WEB1.jpeg', name: 'work-rentifytech' },
  { src: 'web3.jpeg', name: 'work-aaryan' },
  { src: 'web2.jpeg', name: 'work-travel' },
  { src: 'webimg6.jpg', name: 'work-business' },
  { src: 'webimg8.avif', name: 'work-coffee' },
  { src: 'wev1.jpeg', name: 'work-fintech' },
  { src: 'SEO-audit-dashboard.png', name: 'work-seo', position: 'top' },
  { src: 'ui.2jpeg.webp', name: 'work-portfolio-app' },
];

/** photographs cropped to fill: [src, name, widths, ratio w/h] */
const COVER = [
  // the gallery wall: print, brand and apparel work, 4:5. `contain` letterboxes a wide piece on its own
  // corner colour; `extract` takes one panel of a two-panel original first.
  ['100.jpg', 'wall-book-knife', [520], 4 / 5],
  ['99.jpg', 'wall-book-silence', [520], 4 / 5],
  ['102.jpg', 'wall-book-adhd', [520], 4 / 5],
  ['101.jpg', 'wall-book-dark', [520], 4 / 5],
  ['103.jpg', 'wall-calendar-green', [520], 4 / 5],
  ['104.jpg', 'wall-calendar-blue', [520], 4 / 5],
  ['10.jpg', 'wall-folder-teal', [520], 4 / 5, { centre: true }],
  ['11.jpg', 'wall-folder-green', [520], 4 / 5, { centre: true }],
  ['7.jpg', 'wall-tee-impossible', [520], 4 / 5, { extract: 'right' }],
  ['8.jpg', 'wall-tee-dreams', [520], 4 / 5, { extract: 'right' }],
  ['9.jpg', 'wall-tee-discipline', [520], 4 / 5, { extract: 'right' }],
  ['7.jpg', 'wall-print-impossible', [520], 4 / 5, { extract: 'left' }],
  ['booklogo.jpeg', 'wall-logo-boisell', [520], 4 / 5, { contain: 0.86 }],
  // team portraits, 4:5
  ['sirimg.jpeg', 'team-ataur', [360, 640], 4 / 5],
  ['my img.jpeg', 'team-farhana', [360, 640], 4 / 5],
  ['araf.jpeg', 'team-shoumo', [360, 640], 4 / 5],
  ['ripa.jpeg', 'team-ripa', [360, 640], 4 / 5],
  ['hasan.jpeg', 'team-hasan', [360, 640], 4 / 5],
  ['sritypic.jpeg', 'team-srity', [360, 640], 4 / 5],
];

const INK = { r: 0x0b, g: 0x0c, b: 0x0b };

/** team portraits with the background removed in Canva (design/originals/cutouts), set on a transparent
    4:5 canvas: trimmed to the person, scaled to one height and stood on the bottom edge, centred */
const CUTOUTS = ['team-ataur', 'team-farhana', 'team-shoumo', 'team-ripa', 'team-hasan', 'team-srity'];

/** the studio portrait: the cutout standing on one shared backdrop (near black, a tea-green light behind
    the shoulders and one solid tea-green ring), so six different photos read as one set */
async function studio(name) {
  const w = 800, h = 1000;
  const src = path.join(OUT, `${name}-cut-800.webp`);
  const out = path.join(OUT, `${name}-studio-800.webp`);
  if (await fresh(out, src)) return;
  const ground = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="g" cx="50%" cy="62%" r="58%"><stop offset="0" stop-color="#c5f25a" stop-opacity="0.42"/><stop offset="0.5" stop-color="#c5f25a" stop-opacity="0.1"/><stop offset="1" stop-color="#c5f25a" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#121512"/>
    
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.34}" fill="none" stroke="#c5f25a" stroke-opacity="0.6" stroke-width="4"/>
  </svg>`);
  // a soft shadow under the figure so it stands rather than floats
  const shade = await sharp(src).ensureAlpha().extractChannel(3).toColourspace('b-w').blur(18).toBuffer();
  const shadow = await sharp({ create: { width: w, height: h, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .joinChannel(await sharp(shade).linear(0.55, 0).toBuffer())
    .png()
    .toBuffer();
  await sharp(ground)
    .composite([{ input: shadow, left: 14, top: 10 }, { input: src }])
    .webp({ quality: 82, effort: 5 })
    .toFile(out);
}

async function cutout(name) {
  const file = path.join(SRC, 'cutouts', `${name}.png`);
  for (const w of [480, 800]) {
    const out = path.join(OUT, `${name}-cut-${w}.webp`);
    if (await fresh(out, file)) continue;
    const h = Math.round(w * 1.25);
    const person = await sharp(file).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
    const { width: W0, height: H0 } = person.info;
    // fill the card: as wide as the card or 86% of its height, whichever is larger
    const scale = Math.max((h * 0.86) / H0, (w * 0.92) / W0);
    const pw = Math.round(W0 * scale), ph = Math.round(H0 * scale);
    let fig = sharp(person.data).resize(pw, ph);
    // keep the head 6% below the top; whatever is left over runs off the bottom and the sides
    const top = Math.max(Math.round(h * 0.06), h - ph);
    const cropW = Math.min(pw, w), cropH = Math.min(ph, h - top);
    fig = fig.extract({ left: Math.round((pw - cropW) / 2), top: 0, width: cropW, height: cropH });
    await sharp({ create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: await fig.toBuffer(), left: Math.round((w - cropW) / 2), top }])
      .webp({ quality: 84, alphaQuality: 90, effort: 5 })
      .toFile(out);
  }
}

async function fresh(out, src) {
  try {
    const [o, s, me] = await Promise.all([stat(out), stat(src), stat(new URL(import.meta.url))]);
    return o.mtimeMs >= s.mtimeMs && o.mtimeMs >= me.mtimeMs;
  } catch {
    return false;
  }
}

async function cover([src, name, widths, ratio, opt = {}]) {
  const file = path.join(SRC, src);
  for (const w of widths) {
    const out = path.join(OUT, `${name}-${w}.webp`);
    if (await fresh(out, file)) continue;
    const h = Math.round(w / ratio);
    let input = sharp(file, { limitInputPixels: false }).rotate();
    if (opt.extract) {
      const m = await input.clone().metadata();
      const half = Math.floor(m.width / 2);
      input = sharp(await input.extract({ left: opt.extract === 'right' ? half : 0, top: 0, width: half, height: m.height }).toBuffer());
    }
    if (opt.contain) {
      // letterbox on the picture's own corner colour, so the card reads as one ground
      const { data } = await input.clone().extract({ left: 2, top: 2, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
      const bg = { r: data[0], g: data[1], b: data[2] };
      const inner = await input.clone().resize(Math.round(w * opt.contain), Math.round(h * opt.contain), { fit: 'inside' }).toBuffer();
      await sharp({ create: { width: w, height: h, channels: 3, background: bg } })
        .composite([{ input: inner, gravity: 'centre' }])
        .webp({ quality: 80, effort: 5 })
        .toFile(out);
      continue;
    }
    await input
      .resize(w, h, { fit: 'cover', position: opt.centre ? 'centre' : sharp.strategy.attention })
      .webp({ quality: 80, effort: 5 })
      .toFile(out);
  }
}

/** a project filling its card edge to edge: cropped to 16:10 around its centre, a 1600 and a 960 copy */
async function framed({ src, name, position = 'centre' }) {
  const file = path.join(SRC, src);
  for (const w of [1600, 960, 480]) {
    const out = path.join(OUT, `${name}-${w}.webp`);
    if (await fresh(out, file)) continue;
    await sharp(file, { limitInputPixels: false })
      .rotate()
      .resize(w, Math.round(w / 1.6), { fit: 'cover', position })
      .webp({ quality: 82, effort: 5 })
      .toFile(out);
  }
}

// The round arrow mark from the client's logo (white on black), as a mask we can colour.
async function markMask(size) {
  return sharp(path.join(SRC, 'logo.jpg'))
    .extract({ left: 411, top: 62, width: 202, height: 202 })
    .resize(size, size)
    .grayscale()
    .linear(1.4, -40) // clean the JPEG fringe: dark goes to 0, the white disc to 255
    .toColourspace('b-w')
    .raw()
    .toBuffer();
}

async function tinted(size, rgb, out, bg) {
  const alpha = await markMask(size);
  const pixels = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4] = rgb.r;
    pixels[i * 4 + 1] = rgb.g;
    pixels[i * 4 + 2] = rgb.b;
    pixels[i * 4 + 3] = alpha[i];
  }
  let img = sharp(pixels, { raw: { width: size, height: size, channels: 4 } });
  if (bg) {
    const pad = Math.round(size * 0.18);
    const full = size + pad * 2;
    const r = Math.round(full * 0.22);
    const square = Buffer.from(
      `<svg width="${full}" height="${full}"><rect width="${full}" height="${full}" rx="${r}" fill="${bg}"/></svg>`,
    );
    img = sharp(square).composite([{ input: await img.png().toBuffer(), left: pad, top: pad }]);
  }
  await img.png({ compressionLevel: 9 }).toFile(out);
}

void STYLE_VERSION;
await mkdir(OUT, { recursive: true });
await Promise.all([...FRAMED.map(framed), ...COVER.map(cover)]);
// the studio portraits (cutout + studio, from the Canva cut-outs) are not on the page now; to bring them back:
// await Promise.all(CUTOUTS.map(cutout)); await Promise.all(CUTOUTS.map(studio));
await tinted(96, INK, path.join(OUT, 'mark.png'));
await tinted(96, { r: 0xed, g: 0xf0, b: 0xe8 }, path.join(OUT, 'mark-light.png'));
await tinted(48, { r: 0xc5, g: 0xf2, b: 0x5a }, 'public/favicon-48.png', '#0b0c0b');
await tinted(132, { r: 0xc5, g: 0xf2, b: 0x5a }, 'public/apple-touch-icon.png', '#0b0c0b');
console.log(`images: ${FRAMED.length} framed + ${COVER.length} covers -> ${OUT}`);
