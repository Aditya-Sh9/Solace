'use client'

// The answer to a refresh that produced no cards ("not enough check-ins yet", "try again in a few
// hours"). It sits under the header row at full width, as a quiet note, instead of wrapping into a
// narrow column under the button (2026-10-22, user: "looks ugly and is not neatly placed").

import InkCard from '@/src/components/ui/InkCard'
import { Icon } from '@/src/components/ui/Icons'

export default function RefreshNote({ message }: { message: string }) {
  return (
    <InkCard variant="soft" style={{ padding: '14px 18px' }}>
      <p role="status" className="refresh-note">
        <span aria-hidden className="refresh-note-icon"><Icon.Sparkle size={14} /></span>
        {message}
      </p>
    </InkCard>
  )
}
