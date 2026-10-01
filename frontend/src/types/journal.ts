// Local types for the journal domain — not imported from shared/ (Phase 1 decision,
// reaffirmed state.md: "Frontend types defined locally").

// Wire shape — exactly what the server stores/returns. Never contains plaintext.
export interface JournalEntryRecord {
  id:         string
  userId:     string
  date:       string
  ciphertext: string
  iv:         string
  createdAt:  string
  updatedAt:  string
}

// Sealed content of one page — all an edit ever sends.
export interface JournalEntrySealed {
  ciphertext: string
  iv:         string
}

// A new page also carries the writer's local calendar day (YYYY-MM-DD).
export interface JournalEntryCreate extends JournalEntrySealed {
  date: string
}

// Which secret the journal key is derived from — stored once per account (not secret).
export type JournalKeyKind = 'PASSWORD' | 'PASSPHRASE'
