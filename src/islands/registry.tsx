import type { ComponentType } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BinaryText } from '../components/motion-brew/binary-text';
import { FlipWords } from '../components/motion-brew/flip-words';
import { InfiniteGallery } from '../components/motion-brew/infinite-gallery';
import { BlurAccordion } from '../components/motion-brew/blur-accordion';
import { MagneticButton } from '../components/motion-brew/magnetic-button';
import { RotatingText } from '../components/motion-brew/rotating-text';
import { ContactCard } from '../components/motion-brew/contact-card';
import { BlurText } from '../components/motion-brew/blur-text';
import { HighlightText } from '../components/motion-brew/highlight-text';
import { AnnotationText } from '../components/motion-brew/annotation-text';
import { WaveText } from '../components/motion-brew/wave-text';
import { WorkGrid, type WorkItem } from '../components/WorkGrid';
import { questions, site, wall } from '../content/site';

/** a section's mono label, decoding out of 0s and 1s when it comes into view and on hover */
function Label({ text }: { text: string }) {
  return <BinaryText as="span" text={text} duration={0.9} className="label-code" />;
}

/** the hero's second line: one word flips to the next */
function Makes({ words }: { words: string[] }) {
  return <FlipWords before="We make" words={words} after="" interval={2200} className="makes" wordClassName="makes__word" />;
}

/** the main action, leaning toward the cursor */
function Cta({ label, href }: { label: string; href: string }) {
  return (
    <MagneticButton href={href} size="md" strength={0.3} className="cta-magnetic">
      {label} <ArrowUpRight className="size-4" aria-hidden />
    </MagneticButton>
  );
}

/** print, brand and apparel work on an endless wall you can drag */
function Wall() {
  return (
    <InfiniteGallery
      items={wall.map((w) => ({ src: `/images/${w.image}-520.webp`, title: w.title, alt: w.title }))}
      cardWidth={240}
      cardHeight={300}
      gap={18}
      drift={18}
      wheel={false}
      pixelate={false}
      intro={false}
      blur={0}
      label="Print, brand and apparel work"
      className="wall-gallery h-[620px] max-md:h-[460px]"
    />
  );
}

function Faq() {
  return (
    <BlurAccordion
      items={questions.map((q, i) => ({ id: `q${i}`, title: q.q, content: q.a }))}
      className="faq-accordion w-full gap-0 rounded-none bg-transparent p-0 shadow-none dark:bg-transparent"
    />
  );
}

/** the pay-after promise on a slowly turning ring */
function Badge() {
  return <RotatingText text="Pay after you approve • No money up front • " size={168} duration={18} className="badge-ring" label="Pay after you approve, no money up front" />;
}

/** the founder's name in the closing sentence opens Motion Brew's ContactCard */
function FounderContact() {
  return (
    <ContactCard
      label="MD. Ataur Rahman Khan"
      name="MD. Ataur Rahman Khan"
      role="Founder and CEO, Uptotechsyl"
      avatar="/images/team-ataur-360.webp"
      email={site.email}
      bookHref="#enquiry"
      bookLabel={site.mainAction}
      available={false}
    />
  );
}

function Work({ items }: { items: WorkItem[] }) {
  return <WorkGrid items={items} />;
}

/** a section heading: its words rise out of a blur, once, as it comes into view */
function Heading({ text }: { text: string }) {
  return <BlurText as="span" text={text} by="word" stagger={0.06} duration={0.7} blur={10} className="heading-blur" />;
}

/** the promise: a tea-green marker sweeps behind the one phrase that matters */
function PromiseLine({ text, mark }: { text: string; mark: string }) {
  return <HighlightText text={text} highlights={[mark]} color="rgba(197, 242, 90, 0.32)" className="promise-hl" />;
}

/** a hand-drawn circle round one figure */
function Circled({ text }: { text: string }) {
  return (
    <AnnotationText type="circle" color="#c5f25a" strokeWidth={2} delay={0.9}>
      {text}
    </AnnotationText>
  );
}

/** the footer wordmark, warping like liquid under the pointer */
function Wordmark() {
  return <WaveText as="div" text="uptotechsyl" strength={22} className="wordmark" />;
}

const table = {
  heading: Heading,
  promise: PromiseLine,
  circled: Circled,
  wordmark: Wordmark,
  label: Label,
  makes: Makes,
  cta: Cta,
  wall: Wall,
  faq: Faq,
  badge: Badge,
  founder: FounderContact,
  work: Work,
};

export type IslandName = keyof typeof table;
export const islands: Record<IslandName, ComponentType<any>> = table;
