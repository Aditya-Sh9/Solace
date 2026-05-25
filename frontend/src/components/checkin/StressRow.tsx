'use client'

import IllustratedSlider from '@/src/components/ui/IllustratedSlider'
import { STRESS_LABELS } from '@/src/constants/checkin'

interface StressRowProps {
  value:    number   // 1–5
  onChange: (v: number) => void
}

export default function StressRow({ value, onChange }: StressRowProps) {
  return (
    <div>
      <IllustratedSlider
        label="Stress"
        value={value}
        onChange={onChange}
        min={1}
        max={5}
        icon={
          <svg width={18} height={18} viewBox="0 0 24 24"
            stroke="var(--ink-muted)" strokeWidth={1.6} strokeLinecap="round"
            strokeLinejoin="round" fill="none">
            <path d="M12 4v2M12 18v2M4 12H2M22 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        }
      />
      {value > 0 && (
        <p className="hand" style={{
          textAlign: 'right', marginTop: 4, fontSize: 15,
          color: 'var(--ink-muted)',
        }}>
          {STRESS_LABELS[value - 1]}
        </p>
      )}
    </div>
  )
}
