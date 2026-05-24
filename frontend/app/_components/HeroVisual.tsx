'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  InkCard,
  MoodGraph,
  MoodFace,
  Icon,
} from '@/src/components/ui';

export default function HeroVisual() {
  const reduce = useReducedMotion();

  const card = (delay: number) => ({
    initial: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.6,
      delay: reduce ? 0 : delay,
      ease: 'easeOut',
    },
  });

  return (
    <div style={{ position: 'relative', minHeight: 460 }}>
      <motion.div
        {...card(0)}
        style={{ position: 'absolute', top: 20, left: 0, right: 40, zIndex: 1 }}
      >
        <InkCard hand handIntensity={2.0} tilt={-2.4} style={{
          padding: '22px 22px 14px', background: 'var(--surface)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Recent days</div>
          <div className="hand" style={{ fontSize: 18, color: 'var(--accent)', marginBottom: 6 }}>mostly gentle</div>
          <MoodGraph data={[2.4, 3.8, 1.2, 3.0, 5.4, 3.6, 0.6]} width={420} height={120} wobble={0.2} />
        </InkCard>
      </motion.div>

      <motion.div
        {...card(0.15)}
        style={{ position: 'absolute', top: 200, left: 40, right: 0, zIndex: 2 }}
      >
        <InkCard hand handIntensity={2.2} tilt={1.4} style={{
          padding: 22, background: 'var(--paper)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Friday evening</div>
          <div className="serif italic" style={{ fontSize: 24, fontWeight: 400, color: 'var(--ink)', lineHeight: 1.1 }}>
            Good evening, friend.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <MoodFace key={i} index={i as 0 | 1 | 2 | 3 | 4 | 5} size={28} active={i === 3} />
            ))}
          </div>
        </InkCard>
      </motion.div>

      <motion.div
        {...card(0.3)}
        style={{ position: 'absolute', top: 360, right: 10, width: 220, zIndex: 3 }}
      >
        <InkCard hand handIntensity={2.4} variant="note" tilt={-3.5} style={{
          padding: 16,
          background: 'color-mix(in oklab, var(--accent-wash) 50%, var(--paper))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Icon.Sparkle size={14} />
            <div className="eyebrow">Pattern</div>
          </div>
          <div className="hand" style={{ fontSize: 19, color: 'var(--ink)', lineHeight: 1.25 }}>
            you&apos;ve been kinder to yourself this week.
          </div>
        </InkCard>
      </motion.div>
    </div>
  );
}
