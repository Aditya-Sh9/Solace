'use client'

// "Pages" spine from screens-journal.jsx. Below 720px it becomes a horizontal strip of date
// tabs (no mobile reference — logged in MISSING_REFERENCES.md); the privacy note stays.

import { useState } from 'react'
import { Icon, MoodFace } from '@/src/components/ui'
import { formatShortDate, formatTime } from '@/src/lib/format/journal-date'
import type { MoodIndex } from '@/src/lib/journal-payload'

export interface SpineItem {
  key:        string
  date:       string
  createdAt:  string | null   // null = new page, not saved yet
  preview:    string
  mood:       MoodIndex | null
  unreadable: boolean
}

interface JournalSpineProps {
  items:       SpineItem[]
  activeKey:   string | null
  hasMore:     boolean
  onOpen:      (key: string) => void
  onNew:       () => void
  onLoadOlder: () => Promise<string | null>
}

export default function JournalSpine({ items, activeKey, hasMore, onOpen, onNew, onLoadOlder }: JournalSpineProps) {
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [olderError,     setOlderError]     = useState<string | null>(null)

  const loadOlder = async () => {
    setIsLoadingOlder(true)
    setOlderError(await onLoadOlder())
    setIsLoadingOlder(false)
  }

  return (
    <nav aria-label="Journal pages" className="journal-spine">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, fontStyle: 'italic', margin: 0 }}>Pages</h3>
        <button type="button" onClick={onNew} className="ink-btn ink-btn--ghost ink-btn--sm" style={{ padding: '6px 10px' }}>
          <Icon.Plus size={14} /> new
        </button>
      </div>

      {items.length > 0 && (
        <div className="journal-spine-list">
          <div aria-hidden className="journal-spine-line" />
          {items.map(item => {
            const isActive = item.key === activeKey
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onOpen(item.key)}
                aria-current={isActive ? 'page' : undefined}
                className="journal-spine-item"
              >
                <span aria-hidden className="journal-spine-tab" data-active={isActive || undefined} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="hand" style={{ display: 'block', fontSize: 19, lineHeight: 1.2, color: isActive ? 'var(--ink)' : 'var(--ink-soft)' }}>
                    {formatShortDate(item.date)}
                    {item.createdAt && <span className="journal-spine-time"> · {formatTime(item.createdAt)}</span>}
                  </span>
                  <span className="journal-spine-preview">
                    {item.unreadable ? 'A page that stays shut.' : item.preview || 'A fresh page.'}
                  </span>
                </span>
                {item.mood !== null && <MoodFace index={item.mood} size={22} active={isActive} />}
              </button>
            )
          })}
          {hasMore && (
            <button type="button" onClick={loadOlder} disabled={isLoadingOlder} className="journal-spine-older hand">
              {isLoadingOlder ? 'turning back…' : 'older pages →'}
            </button>
          )}
          {olderError && <p style={{ margin: '4px 0 0 18px', fontSize: 12, color: 'var(--ink-muted)' }}>{olderError}</p>}
        </div>
      )}

      <div className="journal-privacy-note">
        <Icon.Lock size={14} />
        <span>This journal is yours alone. We can&apos;t read it, and we don&apos;t want to.</span>
      </div>
    </nav>
  )
}
