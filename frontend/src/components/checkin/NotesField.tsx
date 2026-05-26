'use client'

import InkCard from '@/src/components/ui/InkCard'

interface NotesFieldProps {
  value:    string
  onChange: (v: string) => void
}

export default function NotesField({ value, onChange }: NotesFieldProps) {
  return (
    <InkCard hand handIntensity={2.4} style={{ padding: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>One line, if you want</div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        maxLength={2000}
        placeholder="You don't have to write anything good. You just have to write."
        style={{
          width: '100%', resize: 'none', boxSizing: 'border-box',
          background: 'var(--paper)', color: 'var(--ink)',
          border: '1px solid var(--ink-border)',
          borderRadius: '14px 12px 16px 13px / 13px 14px 12px 15px',
          padding: '14px 16px', fontSize: 15, fontFamily: 'var(--font-hand)',
          lineHeight: 1.6, outline: 'none',
          transition: 'border-color 200ms ease, background 200ms ease',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-soft)' }}
        onBlur={e =>  { e.currentTarget.style.borderColor = 'var(--ink-border)' }}
      />
    </InkCard>
  )
}
