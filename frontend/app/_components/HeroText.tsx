'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function HeroText() {
  const reduce = useReducedMotion();

  const fade = (delay: number, duration: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.01 : duration / 1000,
      delay: reduce ? 0 : delay / 1000,
      ease: 'easeOut',
    },
  });

  return (
    <>
      {/* Margin note instead of a product eyebrow — penciled in, not printed */}
      <motion.div className="hero-margin-note" {...fade(0, 800)}>
        <span className="hand">if something&apos;s felt off lately —</span>
        <svg
          className="hero-margin-arrow"
          width="34" height="30" viewBox="0 0 34 30"
          fill="none" stroke="var(--accent)" strokeWidth={1.6}
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 4.5c7.5-1.2 15.8 1.4 19.6 8.1 2 3.6 2.3 7.8 1.4 12.1" />
          <path d="M19.8 21.4l4.4 4.1 3.3-5.1" />
        </svg>
      </motion.div>

      <motion.h1
        className="serif"
        style={{
          fontSize: 'clamp(40px, 4.6vw, 62px)',
          fontWeight: 400,
          lineHeight: 1.08,
          marginBottom: 22,
          letterSpacing: '-0.02em',
        }}
        {...fade(0, 800)}
      >
        You&apos;re not <em>imagining it.</em>
      </motion.h1>

      <motion.p
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: 'var(--ink-soft)',
          maxWidth: 520,
          lineHeight: 1.55,
          marginBottom: 36,
        }}
        {...fade(400, 1000)}
      >
        There&apos;s more to how you feel — and maybe a pattern in it.
      </motion.p>
    </>
  );
}
