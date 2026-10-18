'use client'

// The open page from screens-journal.jsx. Deviations: delete asks first (inline, warm copy),
// and both animations play *after* the server confirms — the mock scribbles/tears first, but
// a failed save must never look like it worked. "See what it said before" (last version) and
// the dictation states have no mock (MISSING_REFERENCES.md). Padding narrows below 720px.

import { useState, useCallback } from 'react'
import type { Editor, JSONContent } from '@tiptap/core'
import { InkCard, InkButton, Icon, MarginDoodle, PageTearOverlay } from '@/src/components/ui'
import JournalEditor from './JournalEditor'
import JournalMoodPicker from './JournalMoodPicker'
import JournalDictation from './JournalDictation'
import JournalScribbledText from './JournalScribbledText'
import { docToText, type MoodIndex, type PreviousVersion } from '@/src/lib/journal-payload'
import { formatLongDate, formatStampDate, formatTime } from '@/src/lib/format/journal-date'

export interface SheetPage {
  id:         string | null   // null = a new page, not saved yet
  date:       string          // YYYY-MM-DD
  mood:       MoodIndex | null
  doc:        JSONContent
  previous?:  PreviousVersion
  edited:     boolean
  createdAt:  string | null   // null until first save
  updatedAt:  string | null
  unreadable: boolean
}

interface JournalSheetProps {
  page:          SheetPage
  pageNumber:    number
  pageCount:     number
  isEditing:     boolean
  scribbleDoc:   JSONContent | null   // the words just replaced — scribbled out briefly
  isTearing:     boolean
  listenOnOpen:  boolean
  onEdit:        () => void
  onListen:      () => void           // view mode mic tap → edit + listen
  onCancel:      () => void
  onSave:        (doc: JSONContent) => Promise<string | null>
  onMood:        (mood: MoodIndex) => Promise<string | null>
  onRemove:      () => Promise<string | null>
  onTearDone:    () => void
}

const DOODLES = ['star', 'leaf', 'dot', 'heart', 'sparkle', 'dot'] as const

export default function JournalSheet({
  page, pageNumber, pageCount, isEditing, scribbleDoc, isTearing, listenOnOpen,
  onEdit, onListen, onCancel, onSave, onMood, onRemove, onTearDone,
}: JournalSheetProps) {
  const [draft,        setDraft]        = useState<JSONContent>(page.doc)
  const [isBusy,       setIsBusy]       = useState(false)
  const [isConfirm,    setIsConfirm]    = useState(false)
  const [isShowingOld, setIsShowingOld] = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [editor,       setEditor]       = useState<Editor | null>(null)

  const isLocked = isBusy || isTearing

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

  const insertTranscript = useCallback((text: string) => {
    editor?.chain().focus().insertContent(`${text} `).run()
  }, [editor])

  const bodyLines = docToText(page.doc).split('\n')
  const hasBody   = bodyLines.some(l => l.trim())
  const previous  = page.previous

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
            disabled={isLocked}
            onChange={mood => { if (mood !== page.mood) run(() => onMood(mood)) }}
          />
        )}
      </div>

      {page.unreadable ? (
        <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
          This page was closed with a different key, so it stays shut. It&apos;s still here — nothing was lost.
        </p>
      ) : isEditing ? (
        <JournalEditor initialDoc={page.doc} onChange={setDraft} onEditor={setEditor} />
      ) : (
        <div className="journal-body" style={{ position: 'relative' }}>
          {scribbleDoc && <JournalScribbledText doc={scribbleDoc} label="The words you just replaced" />}
          {hasBody
            ? bodyLines.map((line, i) => <p key={i} style={{ margin: 0, minHeight: 32 }}>{line}</p>)
            : <span style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>An empty page. That&apos;s fine — just begin.</span>}
          {page.edited && page.updatedAt && (
            <div className="hand journal-edited-note">edited {formatStampDate(page.updatedAt)}</div>
          )}
          {previous && !scribbleDoc && (
            <div className="journal-previous">
              <button type="button" className="hand journal-previous-toggle" aria-expanded={isShowingOld}
                onClick={() => setIsShowingOld(v => !v)}>
                {isShowingOld ? 'fold it away' : 'see what it said before'}
              </button>
              {isShowingOld && (
                <div className="journal-previous-body">
                  <div className="eyebrow">as it was · {formatStampDate(previous.savedAt)}</div>
                  <JournalScribbledText doc={previous.doc} label="What this page said before" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="journal-sheet-footer">
        {page.unreadable ? <span /> : (
          <JournalDictation
            isEditing={isEditing}
            canListen={editor !== null}
            autoStart={listenOnOpen}
            disabled={isLocked}
            onTranscript={insertTranscript}
            onRequestEdit={() => { setDraft(page.doc); onListen() }}
          />
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {isEditing ? (
            <>
              <InkButton size="sm" variant="ghost" onClick={onCancel} disabled={isLocked}>Cancel</InkButton>
              <InkButton size="sm" variant="primary" onClick={handleSave} disabled={isLocked} icon={<Icon.Check size={14} />}>
                {isBusy ? 'Saving…' : 'Save'}
              </InkButton>
            </>
          ) : isConfirm ? (
            <>
              <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--ink-soft)' }}>
                Remove this page? It won&apos;t come back.
              </span>
              <InkButton size="sm" variant="ghost" onClick={() => setIsConfirm(false)} disabled={isLocked}>Keep it</InkButton>
              <InkButton size="sm" variant="primary" disabled={isLocked} icon={<Icon.Trash size={14} />}
                onClick={() => { run(onRemove) }}>
                Remove
              </InkButton>
            </>
          ) : (
            <>
              {page.id && (
                <InkButton size="sm" variant="ghost" icon={<Icon.Trash size={14} />} onClick={() => setIsConfirm(true)} disabled={isLocked}>
                  Remove page
                </InkButton>
              )}
              {!page.unreadable && (
                <InkButton size="sm" variant="primary" icon={<Icon.Edit size={14} />} onClick={() => { setDraft(page.doc); onEdit() }} disabled={isLocked}>Edit</InkButton>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--ink-soft)', textAlign: 'right' }}>{error}</p>
      )}

      {isTearing && <PageTearOverlay onDone={onTearDone} />}
    </InkCard>
  )
}
