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

export interface JournalEntryFormData {
  date:       string
  ciphertext: string
  iv:         string
}
