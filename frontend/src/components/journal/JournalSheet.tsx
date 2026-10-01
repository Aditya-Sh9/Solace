'use client'

// The open page from screens-journal.jsx. Deviations: delete asks first (inline, warm copy)
// and has no tear animation yet — PageTearOverlay/ScribbleOut are wired in sub-phase 5c, as
// is the "speak instead" mic (decorative until then). Padding narrows below 720px (no mobile
// reference exists — logged in MISSING_REFERENCES.md).

import { useState } from 'react'
import type { JSONContent } from '@tiptap/core'
import { InkCard, InkButton, Icon, MarginDoodle } from '@/src/components/ui'
import JournalEditor from './JournalEditor'
import JournalMoodPicker from './JournalMoodPicker'
import { docToText, type MoodIndex } from '@/src/lib/journal-payload'
import { formatLongDate, formatStampDate, formatTime } from '@/src/lib/format/journal-date'

export interface SheetPage {
  id:         string | null   // null = today's page, not saved yet
  date:       string          // YYYY-MM-DD
  mood:       MoodIndex | null
  doc:        JSONContent
  edited:     boolean
  createdAt:  string | null   // null until first save
  updatedAt:  string | null
  unreadable: boolean
}

interface JournalSheetProps {
  page:        SheetPage
  pageNumber:  number
  pageCount:   number
  isEditing:   boolean
  onEdit:      () => void
  onCancel:    () => void
  onSave:      (doc: JSONContent) => Promise<string | null>
  onMood:      (mood: MoodIndex) => Promise<string | null>
  onRemove:    () => Promise<string | null>
}

const DOODLES = ['star', 'leaf', 'dot', 'heart', 'sparkle', 'dot'] as const

export default function JournalSheet({
  page, pageNumber, pageCount, isEditing, onEdit, onCancel, onSave, onMood, onRemove,
}: JournalSheetProps) {
  const [draft,      setDraft]      = useState<JSONContent>(page.doc)
  const [isBusy,     setIsBusy]     = useState(false)
  const [isConfirm,  setIsConfirm]  = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const run = async (action: () => Promise<string | null>) => {
    setIsBusy(true)
    setError(null)
    const err = await action()
    setIsBusy(false)
    if (err) setError(err)
    return err
  }

  const handleSave = () => {
    // A new page with nothing on it isn't worth filing — just close it.
    if (!page.id && !docToText(draft)) { onCancel(); return }
    run(() => onSave(draft))
  }

  const bodyLines = docToText(page.doc).split('\n')
  const hasBody   = bodyLines.some(l => l.trim())

  return (
    <InkCard
      hand
      handIntensity={2.4}
      handSeed={7340}
      className="paper-bg journal-sheet"
      style={{
        minHeight: 560, position: 'relative',
        borderRadius: '4px 22px 18px 6px / 22px 4px 22px 18px',
        boxShadow: '0 24px 50px -22px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.4) inset',
      }}
    >
      <div aria-hidden className="journal-margin-rule" />
      <div aria-hidden className="journal-margin-doodles">
        {DOODLES.map((kind, i) => <MarginDoodle key={i} kind={kind} />)}
      </div>

      <div className="journal-sheet-header">
        <div>
          <div className="hand" style={{ fontSize: 30, color: 'var(--ink)', lineHeight: 1, transform: 'rotate(-1.2deg)', display: 'inline-block' }}>
            {formatLongDate(page.date)}
          </div>
          <div className="eyebrow" style={{ marginTop: 8 }}>
            Page {pageNumber} of {pageCount}{page.createdAt ? ` · ${formatTime(page.createdAt)}` : ''}
          </div>
        </div>
        {!page.unreadable && (
          <JournalMoodPicker
            value={page.mood}
            disabled={isBusy}
            onChange={mood => { if (mood !== page.mood) run(() => onMood(mood)) }}
          />
        )}
      </div>

      {page.unreadable ? (
        <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
          This page was closed with a different key, so it stays shut. It&apos;s still here — nothing was lost.
        </p>
      ) : isEditing ? (
        <JournalEditor initialDoc={page.doc} onChange={setDraft} />
      ) : (
        <div className="journal-body" style={{ position: 'relative' }}>
          {hasBody
            ? bodyLines.map((line, i) => <p key={i} style={{ margin: 0, minHeight: 32 }}>{line}</p>)
            : <span style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>An empty page. That&apos;s fine — just begin.</span>}
          {page.edited && page.updatedAt && (
            <div className="hand journal-edited-note">edited {formatStampDate(page.updatedAt)}</div>
          )}
        </div>
      )}

      <div className="journal-sheet-footer">
        <button type="button" className="ink-btn ink-btn--ghost ink-btn--sm" style={{ padding: '8px 14px' }}
          disabled aria-disabled title="Coming soon">
          <Icon.Mic size={16} />
          <span className="hand" style={{ fontSize: 17, marginLeft: 2 }}>speak instead</span>
        </button>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {isEditing ? (
            <>
              <InkButton size="sm" variant="ghost" onClick={onCancel} disabled={isBusy}>Cancel</InkButton>
              <InkButton size="sm" variant="primary" onClick={handleSave} disabled={isBusy} icon={<Icon.Check size={14} />}>
                {isBusy ? 'Saving…' : 'Save'}
              </InkButton>
            </>
          ) : isConfirm ? (
            <>
              <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
                Remove this page? It won&apos;t come back.
              </span>
              <InkButton size="sm" variant="ghost" onClick={() => setIsConfirm(false)} disabled={isBusy}>Keep it</InkButton>
              <InkButton size="sm" variant="primary" disabled={isBusy} icon={<Icon.Trash size={14} />}
                onClick={async () => { if (!(await run(onRemove))) setIsConfirm(false) }}>
                Remove
              </InkButton>
            </>
          ) : (
            <>
              {page.id && (
                <InkButton size="sm" variant="ghost" icon={<Icon.Trash size={14} />} onClick={() => setIsConfirm(true)} disabled={isBusy}>
                  Remove page
                </InkButton>
              )}
              {!page.unreadable && (
                <InkButton size="sm" variant="primary" icon={<Icon.Edit size={14} />} onClick={() => { setDraft(page.doc); onEdit() }} disabled={isBusy}>Edit</InkButton>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--ink-soft)', textAlign: 'right' }}>{error}</p>
      )}
    </InkCard>
  )
}
