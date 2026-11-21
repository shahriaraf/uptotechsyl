import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Page } from './Page';
import { islands, type IslandName } from './islands/registry';

/** The whole page as static HTML, each island rendered on its own root so it hydrates cleanly. */
export function render(): string {
  const html = renderToString(<Page />);
  return html.replace(
    /<(div|span) class="([^"]*)" data-island="([a-z-]+)"( data-edge-free="")? data-props="([^"]*)"><!--island:[a-z-]+--><\/(div|span)>/g,
    (_m, tag, cls, name: IslandName, free: string | undefined, rawProps) => {
      const props = JSON.parse(
        rawProps
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&'),
      );
      const inner = renderToString(createElement(islands[name], props));
      return `<${tag} class="${cls}" data-island="${name}"${free ?? ''} data-props="${rawProps}">${inner}</${tag}>`;
    },
  );
}
