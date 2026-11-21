// Every fact on the site lives here, taken from the client's previous site (git history on main).
// Change a price, an hour or a person here and the page follows.

export const site = {
  name: 'Uptotechsyl',
  title: 'Uptotechsyl: web design and development studio in Sylhet',
  description:
    'Websites, UI/UX design, SEO, graphic design and video editing from a team in Sylhet, Bangladesh. Websites from $199, paid once you approve the work.',
  // the canonical domain from the old footer; used for share tags and the sitemap
  url: 'https://uptotechsyl.com',
  email: 'contact@uptotechsyl.com',
  phone: { label: '+880 1852 471826', href: 'tel:+8801852471826' },
  whatsapp: 'https://wa.me/8801759945057',
  address: { street: 'Sagordighirpar Road', district: 'Sylhet', country: 'Bangladesh' },
  hours: [
    { days: 'Saturday to Thursday', data: 'sat,sun,mon,tue,wed,thu', time: '10:00 to 18:00' },
    { days: 'Friday', data: 'fri', time: 'Closed' },
  ],
  timeZone: 'Asia/Dhaka',
  // the form posts here when set (Formspree, Web3Forms, Basin ...); without it the form opens a mail to `email`
  formEndpoint: (import.meta.env?.VITE_FORM_ENDPOINT as string | undefined) ?? '',
  mainAction: 'Send a project brief',
} as const;

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Prices', href: '#prices' },
  { label: 'Team', href: '#team' },
];

/** the words the hero's second line cycles through */
export const makes = ['online shops', 'business websites', 'web apps', 'brand identities', 'SEO audits'];

export const services: { name: string; line: string; tags: string[]; image?: string }[] = [
  { name: 'Websites', line: 'Business sites, online shops and web apps, built to load fast on any phone.', tags: ['MERN stack', 'Laravel', 'Online shops'], image: 'work-rentifytech' },
  { name: 'UI/UX design', line: 'Research, wireframes and clickable prototypes before a line of code.', tags: ['Wireframes', 'Prototypes', 'Design systems'], image: 'work-portfolio-app' },
  { name: 'Website care', line: 'Security updates, speed fixes and content edits after launch.', tags: ['Updates', 'Speed', 'Backups'], image: 'work-business' },
  { name: 'SEO and marketing', line: 'Search audits, rankings, social media and content.', tags: ['Audits', 'Rankings', 'Social'], image: 'work-seo' },
  { name: 'Graphic design', line: 'Logos, brand kits, book covers, calendars and print.', tags: ['Logos', 'Print', 'Apparel'], image: 'wall-book-knife' },
  { name: 'Video editing', line: 'YouTube and social edits, colour and motion graphics.', tags: ['YouTube', 'Reels', 'Colour'] },
];

export type WorkKind = 'Websites' | 'UI/UX' | 'SEO';

/** the featured projects, each an art-directed frame from scripts/optimize-images.mjs */
export const work: { title: string; kind: WorkKind; meta: string; image: string; alt: string }[] = [
  { title: 'RentifyTech', kind: 'Websites', meta: 'Online shop for smart home tech', image: 'work-rentifytech', alt: 'The RentifyTech online shop on a desktop, a laptop, a tablet and a phone' },
  { title: 'Aaryan Sourcing', kind: 'Websites', meta: 'Apparel exporter, responsive build', image: 'work-aaryan', alt: 'The Aaryan Sourcing website on a desktop, laptop, tablet and phone' },
  { title: 'SEO audit dashboard', kind: 'SEO', meta: 'Site health and organic traffic', image: 'work-seo', alt: 'An SEO audit dashboard with site health scores and organic traffic charts' },
  { title: 'Travel booking', kind: 'Websites', meta: 'Landing page with tour prices', image: 'work-travel', alt: 'A travel landing page with tour prices on a green background' },
  { title: 'Coffee Time', kind: 'Websites', meta: 'Cafe website, desktop and mobile', image: 'work-coffee', alt: 'A coffee shop website shown on a desktop and two phone screens' },
  { title: 'Fintech landing page', kind: 'UI/UX', meta: 'Payments product, hero and sign-up', image: 'work-fintech', alt: 'A dark blue finance landing page with an isometric illustration' },
  { title: 'Business services', kind: 'Websites', meta: 'Company site with product pages', image: 'work-business', alt: 'A green business website shown on a laptop and a phone' },
  { title: 'Designer portfolio app', kind: 'UI/UX', meta: 'Profile and project screens', image: 'work-portfolio-app', alt: 'A designer portfolio app on a tablet with a profile and project cards' },
];

/** the gallery wall: print, brand and apparel work */
export const wall = [
  { image: 'wall-book-knife', title: 'Novel cover: Knife' },
  { image: 'wall-calendar-green', title: '2025 desk calendar' },
  { image: 'wall-tee-discipline', title: 'T-shirt: Discipline' },
  { image: 'wall-logo-boisell', title: 'Boi Sell logo' },
  { image: 'wall-book-silence', title: 'Novel cover: Silence' },
  { image: 'wall-folder-green', title: 'Presentation folder' },
  { image: 'wall-tee-dreams', title: 'T-shirt: Dreams' },
  { image: 'wall-calendar-blue', title: 'Desk calendar, blue' },
  { image: 'wall-book-adhd', title: 'Book cover: Men with ADHD' },
  { image: 'wall-print-impossible', title: 'Print: Impossible' },
  { image: 'wall-folder-teal', title: 'Marketing folder' },
  { image: 'wall-book-dark', title: 'Book cover: Darkness' },
  { image: 'wall-tee-impossible', title: 'T-shirt: Impossible' },
];

export const steps = [
  { title: 'Agree the plan', line: 'A call about your goals and customers, then a written scope and a fixed price.', out: 'Scope and fixed price' },
  { title: 'Approve the design', line: 'Wireframes first, then every page in full design, changed until you sign it off.', out: 'Signed-off pages' },
  { title: 'Launch and keep it running', line: 'We build, test and publish the site, then handle updates and security after launch.', out: 'A live, cared-for site' },
];

export const prices = [
  { name: 'Starter', line: 'A small business site.', includes: ['Basic design', 'Responsive layout', 'SEO setup'], value: '$199' },
  { name: 'Professional', line: 'An online shop or a growing business site.', includes: ['Custom UI/UX design', 'Online shop', 'Advanced SEO and marketing'], value: '$499' },
  { name: 'Enterprise', line: 'A fully custom build.', includes: ['Custom build', 'Dedicated support', 'Unlimited revisions'], value: 'On request' },
];

export const questions = [
  { q: 'Do I pay anything up front?', a: 'No. You pay once the work is finished and you have approved it.' },
  { q: 'Do you help after the site goes live?', a: 'Yes. Support continues after delivery, and website care covers updates, security and content changes.' },
  { q: 'Can you work on a site I already have?', a: 'Yes. We take on redesigns, speed fixes and SEO work for existing websites.' },
  { q: 'Do you work with clients outside Bangladesh?', a: 'Yes. We work over video calls and email with clients in any country.' },
];

/** the founder's note on the team section (a draft from the site's own facts: the client should check it) */
export const founder = {
  bio: 'Ataur founded Uptotechsyl and leads its team of six in Sylhet, across websites, UI/UX, SEO, graphic design and video editing. Questions before you start a project go straight to him.',
  facts: [
    ['Studio', 'Sylhet, Bangladesh'],
    ['Team', 'Six people, one office'],
    ['Reply', 'By email, next working day'],
  ] as const,
};

export const team = [
  { name: 'MD. Ataur Rahman Khan', role: 'Founder and CEO', image: 'team-ataur' },
  { name: 'Farhana Khatun', role: 'COO and MERN developer', image: 'team-farhana' },
  { name: 'Shoumo S. Araf', role: 'Project manager', image: 'team-shoumo' },
  { name: 'Ripa', role: 'Laravel developer', image: 'team-ripa' },
  { name: 'Hasan Md. Eyahiya', role: 'UI/UX designer', image: 'team-hasan' },
  { name: 'Srity', role: 'SEO specialist', image: 'team-srity' },
];

/** `srcset` for an image written by scripts/optimize-images.mjs */
export const srcset = (name: string, widths: readonly number[]) =>
  widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ');
