import type { IslandName } from './registry';

/**
 * A Motion Brew component inside the static page. The server writes a marker here and
 * entry-server.tsx swaps it for the component rendered on its own root, so the browser can
 * hydrate exactly that root (src/main.tsx) while the rest of the page stays plain HTML.
 */
export function Island({
  name,
  props,
  inline = false,
  className = '',
}: {
  name: IslandName;
  props: Record<string, unknown>;
  inline?: boolean;
  className?: string;
}) {
  const Tag = inline ? 'span' : 'div';
  return (
    <Tag
      className={`${inline ? 'island island--inline' : 'island'} ${className}`.trim()}
      data-island={name}
      // an inline island sits inside a sentence, not on the page grid
      data-edge-free={inline ? '' : undefined}
      data-props={JSON.stringify(props)}
      dangerouslySetInnerHTML={{ __html: `<!--island:${name}-->` }}
    />
  );
}
