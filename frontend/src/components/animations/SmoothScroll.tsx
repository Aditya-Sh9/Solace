'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ensureScrollTrigger, prefersReducedMotion } from '@/src/lib/motion';

// App-wide Lenis smooth scrolling. Renders no DOM of its own so the body's
// flex-column layout is untouched. Lenis drives the native window scroll
// (not a transformed wrapper), so sticky navs and Next's scroll-to-top /
// back-button restoration keep working. Touch devices keep native scrolling
// (syncTouch is off by default). Nested scrollers opt out with
// `data-lenis-prevent`.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ScrollTrigger = ensureScrollTrigger();
    // anchors: in-page hash links (landing "See how it works") glide instead of
    // jumping. Lenis honours the target's scroll-margin-top (clears the sticky nav).
    const lenis = new Lenis({ autoRaf: false, anchors: true });
    lenisRef.current = lenis;

    // Drive Lenis from GSAP's ticker so ScrollTrigger and Lenis read the
    // same frame — avoids reveals lagging a frame behind the scroll.
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New route = new page height. Let Next handle the scroll position itself;
  // just make sure Lenis and ScrollTrigger re-measure.
  useEffect(() => {
    lenisRef.current?.resize();
    ensureScrollTrigger().refresh();
  }, [pathname]);

  return <>{children}</>;
}
