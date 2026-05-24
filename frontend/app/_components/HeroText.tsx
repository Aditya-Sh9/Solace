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
