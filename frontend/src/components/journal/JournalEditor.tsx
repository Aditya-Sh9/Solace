'use client'

// Tiptap with no toolbar — styled in globals.css (.journal-editor) to look exactly like the
// reference's plain handwritten textarea, but storing structured JSON for later rich text.

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor, JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

interface JournalEditorProps {
  initialDoc: JSONContent
  onChange:   (doc: JSONContent) => void
  onEditor?:  (editor: Editor | null) => void   // lets dictation insert at the cursor
}

export default function JournalEditor({ initialDoc, onChange, onEditor }: JournalEditorProps) {
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

  useEffect(() => {
    onEditor?.(editor)
    return () => onEditor?.(null)
  }, [editor, onEditor])

  return (
    <div className="journal-editor" data-lenis-prevent>
      <EditorContent editor={editor} />
    </div>
  )
}
