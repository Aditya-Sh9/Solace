'use client';

// Delete animation for a journal page (replaces the old page tear, user request 2026-10-22):
// the page creases, squeezes into a paper ball, and the ball is tossed away.
// The squeeze runs on this wrapper (never on the InkCard root — its inline transform
// transition would fight the keyframes). Callers gate it on prefers-reduced-motion.
// CSS: globals.css "Journal: crumple".

import { useEffect, useRef, type ReactNode } from 'react';

const SQUEEZE_MS = 520;
const TOSS_DELAY_MS = 470;
const TOSS_MS = 760;
const TOTAL_MS = TOSS_DELAY_MS + TOSS_MS;

interface PageCrumpleProps {
  active:   boolean;
  onDone?:  () => void;
  children: ReactNode;
}

export default function PageCrumple({ active, onDone, children }: PageCrumpleProps) {
  // Held in a ref so a parent re-render (new callback identity) can't restart the timer.
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => onDoneRef.current?.(), TOTAL_MS);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="page-crumple" data-active={active || undefined}>
      <div className="page-crumple-sheet" style={{ animationDuration: `${SQUEEZE_MS}ms` }}>
        {children}
        {active && <CreaseOverlay />}
      </div>
      {active && (
        <div
          aria-hidden
          className="page-crumple-ball"
          style={{ animationDuration: `${TOSS_MS}ms`, animationDelay: `${TOSS_DELAY_MS}ms` }}
        >
          <PaperBall />
        </div>
      )}
    </div>
  );
}

// Creases fade in over the page as it's squeezed. Straight lines only, so a stretched
// viewBox can't distort anything round.
function CreaseOverlay() {
  return (
    <svg aria-hidden className="page-crumple-creases" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon points="45,48 52,45 70,90 30,85" fill="var(--ink-border)" />
      <polygon points="60,10 52,45 10,20" fill="var(--ink-border)" opacity="0.6" />
      <g fill="none" stroke="var(--ink-faint)" strokeWidth="1.2" vectorEffect="non-scaling-stroke">
        <path d="M10 20 L45 48 L30 85" vectorEffect="non-scaling-stroke" />
        <path d="M60 10 L52 45 L90 70" vectorEffect="non-scaling-stroke" />
        <path d="M45 48 L52 45 L70 90" vectorEffect="non-scaling-stroke" />
        <path d="M2 62 L45 48" vectorEffect="non-scaling-stroke" />
        <path d="M90 70 L98 40" vectorEffect="non-scaling-stroke" />
        <path d="M52 45 L84 22" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

// Hand-placed geometry (no trig) — identical on server and client.
function PaperBall() {
  return (
    <svg width="104" height="104" viewBox="0 0 120 120">
      <path
        d="M60 8 L74 14 L88 12 L98 26 L110 38 L106 54 L114 68 L102 82 L96 98 L78 104 L62 112 L46 104 L28 102 L20 86 L8 72 L14 56 L8 40 L22 28 L34 14 L48 16 Z"
        fill="var(--paper)" stroke="var(--ink-soft)" strokeWidth="1.6" strokeLinejoin="round"
      />
      <polygon points="52,48 66,44 88,60 66,86 46,70" fill="var(--ink-border)" />
      <polygon points="74,14 88,12 98,26 66,44" fill="var(--ink-border)" opacity="0.7" />
      <polygon points="20,86 28,76 46,70 46,104 28,102" fill="var(--ink-border)" opacity="0.5" />
      <g fill="none" stroke="var(--ink-muted)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 34 L52 48 L46 70 L66 86" />
        <path d="M74 22 L66 44 L88 60 L80 82" />
        <path d="M52 48 L66 44" />
        <path d="M46 70 L28 76" />
        <path d="M88 60 L104 58" />
        <path d="M66 86 L62 106" />
        <path d="M38 18 L52 48" />
      </g>
      {/* a few ruled lines survive on the outside of the ball */}
      <g fill="none" stroke="var(--paper-rule)" strokeWidth="1.4">
        <path d="M18 60 L40 56" />
        <path d="M70 96 L92 90" />
      </g>
    </svg>
  );
}
