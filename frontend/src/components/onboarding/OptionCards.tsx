'use client'

// The "single" option list from screens-onboarding.jsx: hand-cut card, ink-blot radio, label +
// sub-line. Added: an optional leading icon and a two-column layout (both 2026-10-21).
import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export interface Option<T> {
  value: T
  label: string
  sub?:  string
  icon?: ReactNode
}

interface Props<T> {
  label:    string
  options:  Option<T>[]
  value:    T | undefined
  onChange: (value: T) => void
  columns?: 1 | 2
}

export default function OptionCards<T extends string | number | boolean>({
  label, options, value, onChange, columns = 1,
}: Props<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const selectedIndex = options.findIndex(o => o.value === value)
  // Roving tabindex: one tab stop for the whole group, arrows move within it (native radio feel).
  const tabStop = selectedIndex === -1 ? 0 : selectedIndex

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const delta = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1
      : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (i + delta + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={columns === 2 ? 'onb-options onb-options--two' : 'onb-options'}
    >
      {options.map((opt, i) => {
        const on = opt.value === value
        return (
          <button
            key={String(opt.value)}
            ref={el => { refs.current[i] = el }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={i === tabStop ? 0 : -1}
            className="onb-option"
            data-on={on}
            onClick={() => onChange(opt.value)}
            onKeyDown={e => onKey(e, i)}
          >
            <span className="onb-option-dot" aria-hidden="true" />
            {opt.icon && <span className="onb-option-icon" aria-hidden="true">{opt.icon}</span>}
            <span style={{ minWidth: 0 }}>
              <span className="onb-option-label">{opt.label}</span>
              {opt.sub && <span className="hand onb-option-sub">{opt.sub}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
