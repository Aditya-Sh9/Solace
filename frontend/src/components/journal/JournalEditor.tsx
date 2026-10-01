'use client'

// Tiptap with no toolbar — styled in globals.css (.journal-editor) to look exactly like the
// reference's plain handwritten textarea, but storing structured JSON for later rich text.

import { useEditor, EditorContent } from '@tiptap/react'
import type { JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

interface JournalEditorProps {
  initialDoc: JSONContent
  onChange:   (doc: JSONContent) => void
}

export default function JournalEditor({ initialDoc, onChange }: JournalEditorProps) {
  const editor = useEditor({
    // Next 16 SSR: rendering on the server would mismatch on hydration.
    immediatelyRender: false,
    autofocus: 'end',
    extensions: [
      StarterKit.configure({ heading: false, codeBlock: false, code: false, horizontalRule: false, blockquote: false }),
      Placeholder.configure({ placeholder: 'Write whatever wants to come out. No one will see this but you.' }),
    ],
    content: initialDoc,
    editorProps: {
      attributes: { class: 'journal-prose', 'aria-label': 'Journal page', role: 'textbox', 'aria-multiline': 'true' },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
  })

  return (
    <div className="journal-editor" data-lenis-prevent>
      <EditorContent editor={editor} />
    </div>
  )
}
