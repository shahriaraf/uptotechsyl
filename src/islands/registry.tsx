import type { ComponentType } from 'react';
import { ProjectIndex, type ProjectItem } from '../components/motion-brew/project-index';
import { ContactCard } from '../components/motion-brew/contact-card';
import { site } from '../content/site';

/** #work: the client's projects in Motion Brew's ProjectIndex, flat on the page grid (the picture panel takes the page's one card look). */
function WorkIndex({ projects }: { projects: ProjectItem[] }) {
  return (
    <ProjectIndex
      projects={projects}
      eyebrow="Recent projects"
      effect="grain"
      intensity={0.35}
      duration={0.7}
      parallax={0}
      numbers={false}
      className="work-index w-full max-w-none rounded-none bg-transparent p-0 shadow-none"
    />
  );
}

/** The close: the founder's name in the sentence opens Motion Brew's ContactCard. */
function FounderContact() {
  return (
    <ContactCard
      label="MD. Ataur Rahman Khan"
      name="MD. Ataur Rahman Khan"
      role="Founder and CEO, Uptotechsyl"
      avatar="/images/team-ataur-320.webp"
      email={site.email}
      bookHref="#enquiry"
      bookLabel={site.mainAction}
      available={false}
    />
  );
}

export const islands = {
  work: WorkIndex,
  founder: FounderContact,
} satisfies Record<string, ComponentType<any>>;

export type IslandName = keyof typeof islands;
