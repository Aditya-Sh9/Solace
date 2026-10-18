// Old words with a hand scribble drawn through each line — the reference's edit animation
// (screens-journal.jsx), also used to show a page's previous version. One ScribbleOut per
// line so the scribble follows the text instead of stretching across a whole block.

import type { JSONContent } from '@tiptap/core'
import { ScribbleOut } from '@/src/components/ui'
import { docToText } from '@/src/lib/journal-payload'

interface JournalScribbledTextProps {
  doc:   JSONContent
  label: string   // screen readers hear what this block is, not just struck-out words
}

export default function JournalScribbledText({ doc, label }: JournalScribbledTextProps) {
  const lines = docToText(doc).split('\n').filter(l => l.trim())
  if (lines.length === 0) return null

  return (
    <div className="journal-scribbled" role="group" aria-label={label}>
      {lines.map((line, i) => (
        <div key={i} className="journal-scribbled-line">
          <span>{line}</span>
          <ScribbleOut height={32} />
        </div>
      ))}
    </div>
  )
}
