'use client'

// Journal orchestrator — built to screens-journal.jsx. Any number of pages per day: "new"
// always starts a fresh unsaved page, created on first save. Edits scribble out the old
// words (720ms) and keep them as the page's previous version; deletes crumple the page into
// a ball and toss it (~1.2s, user request 2026-10-22 — the mock tears). Both play only after
// the server confirms. Deviations from the reference (inline delete confirm, unlock/passphrase
// card, mobile layout) are noted in the child components and MISSING_REFERENCES.md.

import { useRef, useState, useMemo } from 'react'
import type { JSONContent } from '@tiptap/core'
import { InkCard, PageCrumple } from '@/src/components/ui'
import DashboardError from '@/src/components/dashboard/DashboardError'
import { useJournal, type JournalPage as JournalPageData } from '@/src/hooks/use-journal'
import { useInkEntrance } from '@/src/hooks/use-ink-entrance'
import { MOTION_OK } from '@/src/lib/motion'
import { EMPTY_DOC, docToText, type MoodIndex } from '@/src/lib/journal-payload'
import { todayISODate } from '@/src/lib/format/journal-date'
import JournalSpine, { type SpineItem } from './JournalSpine'
import JournalSheet, { type SheetPage } from './JournalSheet'
import JournalEmpty from './JournalEmpty'
import JournalUnlock from './JournalUnlock'
import JournalSkeleton from './JournalSkeleton'

const NEW_KEY     = 'new'
const SCRIBBLE_MS = 720
const REMOVED_MS  = 2200

function toSheet(p: JournalPageData): SheetPage {
  return { id: p.id, date: p.date, mood: p.mood, doc: p.doc, previous: p.previous, edited: p.edited, createdAt: p.createdAt, updatedAt: p.updatedAt, unreadable: p.unreadable }
}

// Read in event handlers only — branching render on this would mismatch hydration.
const isMotionOk = () => window.matchMedia(MOTION_OK).matches

export default function JournalPage() {
  const journal = useJournal()
  const { status, pages } = journal
  const scopeRef = useRef<HTMLDivElement>(null)

  const [activeKey,   setActiveKey]   = useState<string | null>(null)
  const [draftNew,    setDraftNew]    = useState<SheetPage | null>(null)
  const [isEditing,   setIsEditing]   = useState(false)
  const [showRemoved, setShowRemoved] = useState(false)
  const [scribble,    setScribble]    = useState<{ id: string; doc: JSONContent } | null>(null)
  const [crumplingId, setCrumplingId] = useState<string | null>(null)
  const [listenOnOpen, setListenOnOpen] = useState(false)

  useInkEntrance(scopeRef, status === 'ready')

  // The open page: the unsaved new one, the chosen one, or the most recent.
  const resolvedKey = draftNew ? NEW_KEY : (activeKey && pages.some(p => p.id === activeKey) ? activeKey : pages[0]?.id ?? null)
  const activePage: SheetPage | null = draftNew ?? (() => {
    const p = pages.find(pg => pg.id === resolvedKey)
    return p ? toSheet(p) : null
  })()

  const spineItems: SpineItem[] = useMemo(() => {
    const saved = pages.map(p => ({ key: p.id, date: p.date, createdAt: p.createdAt, preview: p.preview, mood: p.mood, unreadable: p.unreadable }))
    return draftNew
      ? [{ key: NEW_KEY, date: draftNew.date, createdAt: null, preview: '', mood: draftNew.mood, unreadable: false }, ...saved]
      : saved
  }, [pages, draftNew])

  const openPage = (key: string) => {
    if (key === resolvedKey || crumplingId) return
    if (key !== NEW_KEY) setDraftNew(null)
    setActiveKey(key)
    setIsEditing(false)
    setListenOnOpen(false)
    setScribble(null)
  }

  const startEdit = (listen: boolean) => {
    setScribble(null)
    setListenOnOpen(listen)
    setIsEditing(true)
  }

  // Always a fresh page — never reopens an earlier one. If a blank new page is already open,
  // it simply stays (a second blank page would just be noise in the spine).
  const startNew = () => {
    if (!draftNew) {
      setDraftNew({ id: null, date: todayISODate(), mood: null, doc: EMPTY_DOC, edited: false, createdAt: null, updatedAt: null, unreadable: false })
    }
    startEdit(false)
  }

  const cancelEdit = () => {
    setDraftNew(null)
    setIsEditing(false)
    setListenOnOpen(false)
  }

  const saveDoc = async (doc: JSONContent) => {
    if (!activePage) return null
    const oldText     = docToText(activePage.doc)
    const isRewritten = !!activePage.id && !!oldText && oldText !== docToText(doc)
    // A rewrite keeps the words it replaced as the page's one previous version; a save that
    // changes nothing keeps whatever previous version the page already had.
    const previous = isRewritten
      ? { doc: activePage.doc, savedAt: activePage.updatedAt ?? activePage.createdAt ?? new Date().toISOString() }
      : activePage.previous
    const { page, error } = await journal.save(activePage.id, activePage.date, { mood: activePage.mood, doc, previous })
    if (error || !page) return error
    setDraftNew(null)
    setActiveKey(page.id)
    setIsEditing(false)
    setListenOnOpen(false)
    if (isRewritten && isMotionOk()) {
      setScribble({ id: page.id, doc: activePage.doc })
      window.setTimeout(() => setScribble(s => (s?.id === page.id ? null : s)), SCRIBBLE_MS)
    }
    return null
  }

  const saveMood = async (mood: MoodIndex) => {
    if (!activePage) return null
    // An unsaved page keeps its mood locally until the words are saved with it.
    if (!activePage.id) {
      setDraftNew(prev => (prev ? { ...prev, mood } : prev))
      return null
    }
    const { error } = await journal.save(activePage.id, activePage.date, { mood, doc: activePage.doc, previous: activePage.previous })
    return error
  }

  const finishRemoval = (id: string) => {
    journal.dropPage(id)
    setCrumplingId(null)
    setActiveKey(pages.find(p => p.id !== id)?.id ?? null)
    setIsEditing(false)
    setShowRemoved(true)
    window.setTimeout(() => setShowRemoved(false), REMOVED_MS)
  }

  // Server first, then the crumple — a page that failed to delete never looks thrown away.
  const removePage = async () => {
    if (!activePage?.id) return null
    const id = activePage.id
    const error = await journal.remove(id)
    if (error) return error
    if (isMotionOk()) setCrumplingId(id)
    else finishRemoval(id)
    return null
  }

  if (status === 'checking') return <JournalSkeleton />
  if (status === 'error')    return <DashboardError onRetry={journal.retry} />
  if (status === 'locked' || status === 'needs-passphrase') {
    return (
      <div className="journal-gate">
        <JournalUnlock
          mode={status === 'locked' ? 'unlock' : 'choose'}
          usesPassphrase={journal.usesPassphrase}
          onSubmit={status === 'locked' ? journal.unlock : journal.choosePassphrase}
        />
      </div>
    )
  }

  const isCrumpling = !!crumplingId && crumplingId === activePage?.id
  const pageNumber = activePage ? spineItems.findIndex(i => i.key === resolvedKey) + 1 : 0

  return (
    <div ref={scopeRef} className="journal-layout">
      <div data-enter style={{ minWidth: 0 }}>
        <JournalSpine
          items={spineItems}
          activeKey={resolvedKey}
          hasMore={journal.hasMore}
          onOpen={openPage}
          onNew={startNew}
          onLoadOlder={journal.loadOlder}
        />
      </div>

      <div data-enter style={{ position: 'relative', minWidth: 0 }}>
        {activePage ? (
          <PageCrumple active={isCrumpling} onDone={() => { if (crumplingId) finishRemoval(crumplingId) }}>
            <JournalSheet
              key={`${resolvedKey}-${isEditing ? 'edit' : 'view'}`}
              page={activePage}
              pageNumber={pageNumber}
              pageCount={spineItems.length}
              isEditing={isEditing}
              scribbleDoc={scribble && scribble.id === activePage.id ? scribble.doc : null}
              isCrumpling={isCrumpling}
              listenOnOpen={listenOnOpen}
              onEdit={() => startEdit(false)}
              onListen={() => startEdit(true)}
              onCancel={cancelEdit}
              onSave={saveDoc}
              onMood={saveMood}
              onRemove={removePage}
            />
          </PageCrumple>
        ) : (
          <JournalEmpty onNew={startNew} />
        )}

        {showRemoved && (
          <div role="status" className="journal-removed-note">
            <InkCard variant="note" tilt={-2} style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3 L16 5 L20 8 L21 13 L19 18 L14 21 L9 20 L4 17 L3 11 L6 6 Z M8 9 L12 12 L10 16 M12 12 L17 10 M12 12 L15 17" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <span className="hand" style={{ fontSize: 18 }}>Page removed.</span>
            </InkCard>
          </div>
        )}
      </div>
    </div>
  )
}
