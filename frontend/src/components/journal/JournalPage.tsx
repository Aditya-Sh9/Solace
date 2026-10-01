'use client'

// Journal orchestrator — built to screens-journal.jsx. Any number of pages per day: "new"
// always starts a fresh unsaved page, created on first save. Deviations from
// the reference (inline delete confirm, unlock/passphrase card, mobile layout) are noted in
// the child components and MISSING_REFERENCES.md.

import { useRef, useState, useMemo } from 'react'
import type { JSONContent } from '@tiptap/core'
import { InkCard } from '@/src/components/ui'
import DashboardError from '@/src/components/dashboard/DashboardError'
import { useJournal, type JournalPage as JournalPageData } from '@/src/hooks/use-journal'
import { useInkEntrance } from '@/src/hooks/use-ink-entrance'
import { EMPTY_DOC, type MoodIndex } from '@/src/lib/journal-payload'
import { todayISODate } from '@/src/lib/format/journal-date'
import JournalSpine, { type SpineItem } from './JournalSpine'
import JournalSheet, { type SheetPage } from './JournalSheet'
import JournalEmpty from './JournalEmpty'
import JournalUnlock from './JournalUnlock'
import JournalSkeleton from './JournalSkeleton'

const NEW_KEY = 'new'

function toSheet(p: JournalPageData): SheetPage {
  return { id: p.id, date: p.date, mood: p.mood, doc: p.doc, edited: p.edited, createdAt: p.createdAt, updatedAt: p.updatedAt, unreadable: p.unreadable }
}

export default function JournalPage() {
  const journal = useJournal()
  const { status, pages } = journal
  const scopeRef = useRef<HTMLDivElement>(null)

  const [activeKey,   setActiveKey]   = useState<string | null>(null)
  const [draftNew,    setDraftNew]    = useState<SheetPage | null>(null)
  const [isEditing,   setIsEditing]   = useState(false)
  const [showRemoved, setShowRemoved] = useState(false)

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
    if (key === resolvedKey) return
    if (key !== NEW_KEY) setDraftNew(null)
    setActiveKey(key)
    setIsEditing(false)
  }

  // Always a fresh page — never reopens an earlier one. If a blank new page is already open,
  // it simply stays (a second blank page would just be noise in the spine).
  const startNew = () => {
    if (!draftNew) {
      setDraftNew({ id: null, date: todayISODate(), mood: null, doc: EMPTY_DOC, edited: false, createdAt: null, updatedAt: null, unreadable: false })
    }
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setDraftNew(null)
    setIsEditing(false)
  }

  const saveDoc = async (doc: JSONContent) => {
    if (!activePage) return null
    const { page, error } = await journal.save(activePage.id, activePage.date, { mood: activePage.mood, doc })
    if (error || !page) return error
    setDraftNew(null)
    setActiveKey(page.id)
    setIsEditing(false)
    return null
  }

  const saveMood = async (mood: MoodIndex) => {
    if (!activePage) return null
    // An unsaved page keeps its mood locally until the words are saved with it.
    if (!activePage.id) {
      setDraftNew(prev => (prev ? { ...prev, mood } : prev))
      return null
    }
    const { error } = await journal.save(activePage.id, activePage.date, { mood, doc: activePage.doc })
    return error
  }

  const removePage = async () => {
    if (!activePage?.id) return null
    const id = activePage.id
    const error = await journal.remove(id)
    if (error) return error
    setActiveKey(pages.find(p => p.id !== id)?.id ?? null)
    setIsEditing(false)
    setShowRemoved(true)
    window.setTimeout(() => setShowRemoved(false), 2200)
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
          <JournalSheet
            key={`${resolvedKey}-${isEditing ? 'edit' : 'view'}`}
            page={activePage}
            pageNumber={pageNumber}
            pageCount={spineItems.length}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={cancelEdit}
            onSave={saveDoc}
            onMood={saveMood}
            onRemove={removePage}
          />
        ) : (
          <JournalEmpty onNew={startNew} />
        )}

        {showRemoved && (
          <div role="status" className="journal-removed-note">
            <InkCard variant="note" tilt={-2} style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 6 8 4 12 6 16 4 20 6 V 18 L 16 16 L 12 18 L 8 16 L 4 18 Z" strokeLinejoin="round" />
              </svg>
              <span className="hand" style={{ fontSize: 18 }}>Page removed.</span>
            </InkCard>
          </div>
        )}
      </div>
    </div>
  )
}
