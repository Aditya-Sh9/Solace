// Single entry point for GSAP. Every component that uses GSAP imports it from
// here so plugins are registered exactly once and the motion tokens stay in
// sync with design-ideology.md. Framer Motion still owns component-state
// animation (mount/unmount, AnimatePresence) — see design-system.md "Motion".
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, useGSAP);
  // Same curve as the CSS spring token cubic-bezier(.34, 1.4, .64, 1)
  CustomEase.create('ink-spring', 'M0,0 C0.34,1.4 0.64,1 1,1');
}

let isScrollTriggerRegistered = false;

/**
 * Registers ScrollTrigger on first use. Must be called from inside an effect,
 * never at module scope: registering measures the page by writing to
 * `body.style`, which re-serializes the body's style attribute before React
 * hydrates and triggers a hydration mismatch on <body>.
 */
export function ensureScrollTrigger(): typeof ScrollTrigger {
  if (!isScrollTriggerRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isScrollTriggerRegistered = true;
  }
  return ScrollTrigger;
}

// Every GSAP effect runs inside gsap.matchMedia(MOTION_OK) so users who ask
// for reduced motion simply see content, with no tween at all.
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export const REVEAL = {
  y: 12,
  duration: 0.6,
  stagger: 0.08,
  ease: 'ink-spring',
} as const;

export const ENTER = {
  y: 12,
  duration: 0.6,
  stagger: 0.07,
  ease: 'ink-spring',
} as const;

// Mirrors the `ink-draw` keyframe (1.4s ease-out)
export const DRAW = {
  duration: 1.4,
  ease: 'power2.out',
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Hides a solid-stroke path so it can be drawn in with `drawPath`. */
export function hidePath(path: SVGPathElement): number {
  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  return length;
}

/** Ink-draws a path previously prepared with `hidePath`, then removes the dash props. */
export function drawPath(path: SVGPathElement, vars: gsap.TweenVars = {}): gsap.core.Tween {
  return gsap.to(path, {
    strokeDashoffset: 0,
    ...DRAW,
    ...vars,
    clearProps: 'strokeDasharray,strokeDashoffset',
  });
}

export { gsap, useGSAP };
