'use client';

import { useState } from 'react';
import { InkCard, MoodFace, InkCircleSelection, MOOD_LABELS } from '@/src/components/ui';

export default function FeatureMoodPicker() {
  const [selected, setSelected] = useState(3);
  return (
    <InkCard hand handIntensity={2.2} style={{ padding: 28, background: 'var(--surface)' }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>A feeling, roughly</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            style={{
              position: 'relative', background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 6,
              transform: selected === i ? 'translateY(-2px) scale(1.05)' : 'none',
              transition: 'transform 280ms cubic-bezier(.34,1.4,.64,1)',
            }}
          >
            <MoodFace index={i as 0 | 1 | 2 | 3 | 4 | 5} size={36} active={selected === i} />
            <InkCircleSelection size={54} active={selected === i} />
          </button>
        ))}
      </div>
      <div className="hand" style={{ marginTop: 18, fontSize: 20, color: 'var(--accent)', textAlign: 'center' }}>
        feeling {MOOD_LABELS[selected]}
      </div>
    </InkCard>
  );
}
