'use client';

import { useRef } from 'react';
import { gsap, ensureScrollTrigger, useGSAP, MOTION_OK, REVEAL, hidePath, drawPath } from '@/src/lib/motion';

// Scroll-linked reveals for Server Component sections. Sections stay server-
// rendered and only carry plain data attributes:
//   data-reveal         → fades up as it enters the viewport
//   data-reveal="wipe"  → clip-path wipe left→right (for dashed SVGs, whose
//                         dash pattern a stroke-draw would destroy)
//   data-draw           → solid-stroke <path> inside a [data-reveal], ink-drawn
//                         when its parent reveals
// Put data-reveal on a plain wrapper, never on an InkCard root or anything
// with its own inline transform/transition (the CSS transition would fight GSAP).
// `display: contents` so this wrapper adds no layout box.
export default function ScrollReveal({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = scope.current;
    if (!root) return;

    gsap.matchMedia().add(MOTION_OK, () => {
      const ScrollTrigger = ensureScrollTrigger();
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
      if (items.length === 0) return;
      const fades = items.filter(el => el.dataset.reveal !== 'wipe');
      const wipes = items.filter(el => el.dataset.reveal === 'wipe');

      if (fades.length) gsap.set(fades, { autoAlpha: 0, y: REVEAL.y });
      if (wipes.length) gsap.set(wipes, { clipPath: 'inset(0 100% 0 0)' });
      gsap.utils.toArray<SVGPathElement>('[data-draw]', root).forEach(hidePath);

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          const els = batch as HTMLElement[];
          const batchFades = els.filter(el => el.dataset.reveal !== 'wipe');
          const batchWipes = els.filter(el => el.dataset.reveal === 'wipe');

          if (batchFades.length) {
            gsap.to(batchFades, {
              autoAlpha: 1,
              y: 0,
              duration: REVEAL.duration,
              stagger: REVEAL.stagger,
              ease: REVEAL.ease,
              clearProps: 'opacity,visibility,transform',
            });
          }
          if (batchWipes.length) {
            gsap.to(batchWipes, {
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.7,
              delay: 0.25,
              stagger: REVEAL.stagger,
              ease: 'power2.out',
              clearProps: 'clipPath',
            });
          }
          els.forEach((el, i) => {
            el.querySelectorAll<SVGPathElement>('[data-draw]').forEach((path, j) => {
              drawPath(path, { delay: 0.15 + i * REVEAL.stagger + j * 0.1 });
            });
          });
        },
      });
    });
  }, { scope });

  return <div ref={scope} style={{ display: 'contents' }}>{children}</div>;
}
