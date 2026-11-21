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
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Prices', href: '#prices' },
  { label: 'Team', href: '#team' },
];

export const services: { name: string; line: string }[] = [
  { name: 'Websites', line: 'Business sites, online shops and web apps.' },
  { name: 'UI/UX design', line: 'Research, wireframes and clickable prototypes.' },
  { name: 'Website care', line: 'Security updates, speed fixes and content edits.' },
  { name: 'SEO and marketing', line: 'Search audits, rankings, social media and content.' },
  { name: 'Graphic design', line: 'Logos, brand kits, book covers and print.' },
  { name: 'Video editing', line: 'YouTube and social edits, colour and motion.' },
];

export const work = [
  { title: 'Aaryan Sourcing website', meta: 'Apparel exporter, responsive build', image: '/images/work-fashion-shop-1280.webp', alt: 'The Aaryan Sourcing website on a desktop, laptop, tablet and phone' },
  { title: 'Travel booking landing page', meta: 'Web design', image: '/images/work-travel-site-1280.webp', alt: 'A travel landing page with tour prices on a green background' },
  { title: 'Business services website', meta: 'Web design and development', image: '/images/work-business-site-1280.webp', alt: 'A green business website shown on a laptop and a phone' },
  { title: 'Novel cover: Knife', meta: 'Book cover design', image: '/images/work-book-cover-1280.webp', alt: 'A brown hardback book cover titled Knife' },
  { title: '2025 desk calendar', meta: 'Print design', image: '/images/work-desk-calendar-1280.webp', alt: 'A green and white desk calendar for 2025' },
  { title: 'SEO audit dashboard', meta: 'Search engine optimisation', image: '/images/work-seo-audit-1400.webp', alt: 'An SEO audit dashboard with site health and organic traffic charts' },
];

export const steps = [
  {
    title: 'Agree the plan',
    line: 'A call about your goals and customers, then a written scope and a fixed price.',
    image: 'step-plan',
    widths: [640, 960],
    alt: 'Wireframe sketches, a phone and sticky notes on a desk',
  },
  {
    title: 'Approve the design',
    line: 'Wireframes first, then every page in full design, changed until you sign it off.',
    image: 'step-design',
    widths: [640],
    alt: 'Page layouts for a blog and a photo gallery side by side',
  },
  {
    title: 'Launch and keep it running',
    line: 'We build, test and publish the site, then handle updates and security after launch.',
    image: 'step-launch',
    widths: [640, 960],
    alt: 'An education website with a row of course cards',
  },
];

export const prices = [
  {
    name: 'Starter',
    line: 'A small business site.',
    includes: ['Basic design', 'Responsive layout', 'SEO setup'],
    value: '$199',
  },
  {
    name: 'Professional',
    line: 'An online shop or a growing business site.',
    includes: ['Custom UI/UX design', 'Online shop', 'Advanced SEO and marketing'],
    value: '$499',
  },
  {
    name: 'Enterprise',
    line: 'A fully custom build.',
    includes: ['Custom build', 'Dedicated support', 'Unlimited revisions'],
    value: 'Price on request',
  },
];

export const questions = [
  {
    q: 'Do I pay anything up front?',
    a: 'No. You pay once the work is finished and you have approved it.',
  },
  {
    q: 'Do you help after the site goes live?',
    a: 'Yes. Support continues after delivery, and website care covers updates, security and content changes.',
  },
  {
    q: 'Can you work on a site I already have?',
    a: 'Yes. We take on redesigns, speed fixes and SEO work for existing websites.',
  },
  {
    q: 'Do you work with clients outside Bangladesh?',
    a: 'Yes. We work over video calls and email with clients in any country.',
  },
];

export const team = [
  { name: 'MD. Ataur Rahman Khan', role: 'Founder and CEO', image: 'team-ataur', widths: [320, 560] },
  { name: 'Farhana Khatun', role: 'COO and MERN developer', image: 'team-farhana', widths: [320, 560] },
  { name: 'Shoumo S. Araf', role: 'Project manager', image: 'team-shoumo', widths: [320, 560] },
  { name: 'Ripa', role: 'Laravel developer', image: 'team-ripa', widths: [320] },
  { name: 'Hasan Md. Eyahiya', role: 'UI/UX designer', image: 'team-hasan', widths: [320, 560] },
  { name: 'Srity', role: 'SEO specialist', image: 'team-srity', widths: [320, 560] },
];

/** `srcset` for an image written by scripts/optimize-images.mjs */
export const srcset = (name: string, widths: readonly number[]) =>
  widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ');
