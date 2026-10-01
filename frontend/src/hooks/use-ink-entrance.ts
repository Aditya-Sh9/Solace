import type { RefObject } from 'react';
import { gsap, useGSAP, MOTION_OK, ENTER } from '@/src/lib/motion';

/**
 * Staggered page-entrance for `[data-enter]` children of `scope`, played when
 * `ready` becomes true (i.e. when the real content — not the skeleton — has
 * mounted). Re-renders don't replay it: useGSAP only re-runs when `ready`
 * changes. Elements already animated by Framer Motion (InsightCard,
 * PatternPredictionCard) must not carry `data-enter`.
 */
export function useInkEntrance(scope: RefObject<HTMLElement | null>, ready: boolean) {
  useGSAP(() => {
    if (!ready || !scope.current) return;
    const targets = gsap.utils.toArray<HTMLElement>('[data-enter]', scope.current);
    if (targets.length === 0) return;
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.from(targets, {
        autoAlpha: 0,
        y: ENTER.y,
        duration: ENTER.duration,
        stagger: ENTER.stagger,
        ease: ENTER.ease,
        clearProps: 'opacity,visibility,transform',
      });
    });
  }, { scope, dependencies: [ready] });
}
