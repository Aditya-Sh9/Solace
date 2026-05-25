'use client'

interface NotesFieldProps {
  value:    string
  onChange: (v: string) => void
}

export default function NotesField({ value, onChange }: NotesFieldProps) {
  return (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 10px',
      }}>
        Anything else?
      </p>
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
    </div>
  )
}
