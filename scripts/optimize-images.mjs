// Turns the client's originals (design/originals) into the web images the site ships (public/images).
// Each entry: the original, the output name, the widths to write, and an optional crop ratio (w/h).
// Output: <name>-<width>.webp, plus the logo mark and favicons. Run: npm run images
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'design/originals';
const OUT = 'public/images';

const IMAGES = [
  // hero: the RentifyTech shop on desktop, laptop, tablet and phone, cropped to the hero frame (628 x 716)
  { src: 'WEB1.jpeg', name: 'hero-rentifytech', widths: [640], ratio: 628 / 716 },
  // services: portfolio dashboard on a tablet
  { src: 'ui.2jpeg.webp', name: 'services-ui', widths: [640, 1024], ratio: 4 / 3 },
  // work (Motion Brew ProjectIndex)
  { src: 'web3.jpeg', name: 'work-fashion-shop', widths: [800, 1280] },
  { src: 'web2.jpeg', name: 'work-travel-site', widths: [800, 1280] },
  { src: 'webimg6.jpg', name: 'work-business-site', widths: [800, 1280] },
  { src: '100.jpg', name: 'work-book-cover', widths: [800, 1280] },
  { src: '103.jpg', name: 'work-desk-calendar', widths: [800, 1280] },
  { src: 'SEO-audit-dashboard.png', name: 'work-seo-audit', widths: [800, 1400] },
  // steps
  { src: 'brandingui.jpg', name: 'step-plan', widths: [640, 960], ratio: 4 / 3 },
  { src: 'webimg4.avif', name: 'step-design', widths: [640], ratio: 4 / 3 },
  { src: 'webimg11.jpg', name: 'step-launch', widths: [640, 960], ratio: 4 / 3 },
  // team portraits, 4:5
  { src: 'sirimg.jpeg', name: 'team-ataur', widths: [320, 560], ratio: 4 / 5 },
  { src: 'my img.jpeg', name: 'team-farhana', widths: [320, 560], ratio: 4 / 5 },
  { src: 'araf.jpeg', name: 'team-shoumo', widths: [320, 560], ratio: 4 / 5 },
  { src: 'ripa.jpeg', name: 'team-ripa', widths: [320], ratio: 4 / 5 },
  { src: 'hasan.jpeg', name: 'team-hasan', widths: [320, 560], ratio: 4 / 5 },
  { src: 'sritypic.jpeg', name: 'team-srity', widths: [320, 560], ratio: 4 / 5 },
];

const INK = { r: 0x1c, g: 0x1c, b: 0x1c };

async function fresh(out, src) {
  try {
    const [o, s] = await Promise.all([stat(out), stat(src)]);
    return o.mtimeMs >= s.mtimeMs;
  } catch {
    return false;
  }
}

async function image({ src, name, widths, ratio }) {
  const file = path.join(SRC, src);
  const meta = await sharp(file, { limitInputPixels: false }).rotate().metadata();
  const upright = meta.orientation && meta.orientation >= 5;
  const w0 = upright ? meta.height : meta.width;
  const h0 = upright ? meta.width : meta.height;
  for (const w of widths) {
    const out = path.join(OUT, `${name}-${w}.webp`);
    if (await fresh(out, file)) continue;
    const width = Math.min(w, ratio ? Math.min(w0, Math.round(h0 * ratio)) : w0);
    let pipe = sharp(file, { limitInputPixels: false }).rotate();
    pipe = ratio
      ? pipe.resize(width, Math.round(width / ratio), { fit: 'cover', position: sharp.strategy.attention })
      : pipe.resize({ width, withoutEnlargement: true });
    await pipe.webp({ quality: 78, effort: 5 }).toFile(out);
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

await mkdir(OUT, { recursive: true });
await Promise.all(IMAGES.map(image));
await tinted(96, INK, path.join(OUT, 'mark.png'));
await tinted(96, { r: 0xf4, g: 0xf4, b: 0xf2 }, path.join(OUT, 'mark-light.png'));
await tinted(48, { r: 255, g: 255, b: 255 }, 'public/favicon-48.png', '#1c1c1c');
await tinted(132, { r: 255, g: 255, b: 255 }, 'public/apple-touch-icon.png', '#1c1c1c');
console.log(`images: ${IMAGES.length} sources -> ${OUT}`);
