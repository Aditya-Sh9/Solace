'use client'

import { forwardRef } from 'react'

export interface InkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const InkInput = forwardRef<HTMLInputElement, InkInputProps>(
  ({ label, error, id, className, ...props }, ref) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
          }}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`ink-input${className ? ` ${className}` : ''}`}
        style={error ? { borderColor: 'var(--accent)' } : undefined}
        {...props}
      />
      {error && (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>
          {error}
        </p>
      )}
    </div>
  )
)

InkInput.displayName = 'InkInput'
export default InkInput
