import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';

export type WorkItem = { title: string; kind: string; meta: string; image: string; alt: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * #work: the featured projects as art-directed frames. Filter pills slide a highlight between kinds,
 * the grid re-flows on a spring, and a frame opens full size in a dialog.
 */
export function WorkGrid({ items }: { items: WorkItem[] }) {
  const kinds = ['All', ...Array.from(new Set(items.map((i) => i.kind)))];
  const [kind, setKind] = useState('All');
  const [open, setOpen] = useState<WorkItem | null>(null);
  const still = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = kind === 'All' ? items : items.filter((i) => i.kind === kind);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <div className="workgrid">
      <div className="workgrid__filters" role="group" aria-label="Filter projects">
        <LayoutGroup id="work-filter">
          {kinds.map((k) => {
            return (
              <button
                key={k}
                type="button"
                className="workgrid__pill"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
              >
                {kind === k && (
                  <motion.span
                    layoutId="work-pill"
                    className="workgrid__pill-bg"
                    transition={still ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="workgrid__pill-label">{k}</span>
              </button>
            );
          })}
        </LayoutGroup>
      </div>

      <motion.ul className="workgrid__list" layout={!still}>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((w, i) => (
            <motion.li
              key={w.image}
              layout={!still}
              className="workgrid__item"
              initial={still ? false : { opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              exit={still ? undefined : { opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <button type="button" className="workcard" onClick={() => setOpen(w)} aria-haspopup="dialog">
                <span className="workcard__frame">
                  <img
                    src={`/images/${w.image}-480.webp`}
                    srcSet={`/images/${w.image}-480.webp 480w, /images/${w.image}-960.webp 960w`}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    alt={w.alt}
                    width={1600}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="workcard__open" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 10L10 4M5 4h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </span>
                </span>
                <span className="workcard__foot">
                  <span className="workcard__title">{w.title}</span>
                  <span className="workcard__meta">{w.meta}</span>
                  <span className="workcard__kind">{w.kind}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={open ? open.title : 'Project'}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
      >
        {open && (
          <figure className="lightbox__body">
            <img src={`/images/${open.image}-1600.webp`} alt={open.alt} width={1600} height={1000} />
            <div className="lightbox__bar">
              <span className="lightbox__title">{open.title}</span>
              <span className="lightbox__meta">
                {open.kind} / {open.meta}
              </span>
              <button type="button" className="lightbox__close" onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </div>
  );
}
