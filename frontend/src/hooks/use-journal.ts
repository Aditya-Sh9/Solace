'use client'

// Journal state: fetch ciphertext, decide whether the key is present, decrypt locally, save.
// Everything plaintext stays in this tab's memory — the server only ever sees what
// encryptText() returns (security-rules.md).

import { useState, useEffect, useRef, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { useAuth, hasPasswordIdentity } from '@/src/hooks/use-auth'
import { createClient } from '@/src/lib/supabase/client'
import { getJournalSalt, getJournalEntries, createJournalEntry, updateJournalEntry, deleteJournalEntry, setJournalKeyKind } from '@/src/lib/api/journal'
import { deriveKey, encryptText, decryptText, cacheKey, getCachedKey, clearCachedKey } from '@/src/lib/journal-crypto'
import { encodePayload, decodePayload, payloadPreview, type JournalPayload } from '@/src/lib/journal-payload'
import { entryISODate } from '@/src/lib/format/journal-date'
import type { JournalEntryRecord, JournalKeyKind } from '@/src/types/journal'

const PAGE_SIZE = 30
const EDITED_AFTER_MS = 60_000

export interface JournalPage extends JournalPayload {
  id:         string
  date:       string   // YYYY-MM-DD
  preview:    string
  edited:     boolean
  createdAt:  string
  updatedAt:  string
  unreadable: boolean  // locked under a different key — shown, never dropped
}

// checking → (locked | needs-passphrase | ready | error)
export type JournalStatus = 'checking' | 'locked' | 'needs-passphrase' | 'ready' | 'error'

const WRONG_SECRET = "That doesn't seem to open it — try once more?"
const SOFT_FAIL    = 'Something got in the way — not your fault. Try again in a moment?'

async function decryptRecord(key: CryptoKey, r: JournalEntryRecord): Promise<JournalPage> {
  const base = {
    id:        r.id,
    date:      entryISODate(r.date),
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    edited:    new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime() > EDITED_AFTER_MS,
  }
  try {
    const payload = decodePayload(await decryptText(key, r.ciphertext, r.iv))
    return { ...base, ...payload, preview: payloadPreview(payload.doc), unreadable: false }
  } catch {
    return { ...base, mood: null, doc: { type: 'doc' }, preview: '', unreadable: true }
  }
}

// Newest first by when the page was begun — matches the server's createdAt/id ordering.
function sortNewestFirst(pages: JournalPage[]): JournalPage[] {
  return [...pages].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : a.id < b.id ? 1 : -1)
}

export function useJournal() {
  const { user, loading: authLoading } = useAuth()
  const hasFetched = useRef(false)
  const keyRef     = useRef<CryptoKey | null>(null)
  const recordsRef = useRef<JournalEntryRecord[]>([])

  const [status,  setStatus]  = useState<JournalStatus>('checking')
  const [pages,   setPages]   = useState<JournalPage[]>([])
  const [hasMore, setHasMore] = useState(false)

  // Which secret the key comes from. The stored value (set once, server-side) always wins;
  // before it exists, the account's sign-in methods decide (email identity → password).
  const storedKindRef = useRef<JournalKeyKind | null>(null)
  const [keyKind, setKeyKind] = useState<JournalKeyKind>('PASSWORD')

  const resolveKind = (u: User, stored: JournalKeyKind | null): JournalKeyKind =>
    stored ?? (hasPasswordIdentity(u) ? 'PASSWORD' : 'PASSPHRASE')

  const openWith = useCallback(async (key: CryptoKey, records: JournalEntryRecord[], kind: JournalKeyKind) => {
    keyRef.current = key
    if (!storedKindRef.current) {
      // First time a key is proven for this account — pin its kind. Best-effort: if it
      // fails, it's simply recorded on the next open.
      const { data } = await setJournalKeyKind(kind)
      if (data?.keyKind) storedKindRef.current = data.keyKind
    }
    setPages(await Promise.all(records.map(r => decryptRecord(key, r))))
    setStatus('ready')
  }, [])

  const load = useCallback(async (currentUser: User) => {
    setStatus('checking')
    const [list, salt] = await Promise.all([getJournalEntries({ limit: PAGE_SIZE }), getJournalSalt()])
    const data = list.data
    if (list.error || !data || salt.error || !salt.data) { setStatus('error'); return }
    recordsRef.current = data
    setHasMore(data.length === PAGE_SIZE)
    storedKindRef.current = salt.data.keyKind
    const kind = resolveKind(currentUser, salt.data.keyKind)
    setKeyKind(kind)

    const cached = await getCachedKey()
    if (cached) {
      // A cached key that can't open the newest page is stale (e.g. left over from another
      // account in this tab) — drop it and ask, rather than writing under the wrong key.
      const newest = data[0]
      const isValid = !newest || await decryptText(cached, newest.ciphertext, newest.iv).then(() => true, () => false)
      if (isValid) { await openWith(cached, data, kind); return }
      clearCachedKey()
    }

    setStatus(kind === 'PASSPHRASE' && data.length === 0 ? 'needs-passphrase' : 'locked')
  }, [openWith])

  useEffect(() => {
    if (authLoading || !user || hasFetched.current) return
    hasFetched.current = true
    load(user)
  }, [authLoading, user, load])

  const retry = useCallback(() => {
    if (user) load(user)
  }, [user, load])

  const deriveFromSecret = async (secret: string): Promise<CryptoKey | null> => {
    const { data } = await getJournalSalt()
    if (!data) return null
    return deriveKey(secret, data.salt)
  }

  /** Re-open the journal in a tab with no cached key. Returns warm error copy, or null. */
  const unlock = useCallback(async (secret: string): Promise<string | null> => {
    if (!user) return SOFT_FAIL
    const records = recordsRef.current
    try {
      if (records.length === 0 && keyKind === 'PASSWORD') {
        // Nothing to test the key against yet — confirm the password with Supabase instead,
        // so a typo can't quietly lock future pages under the wrong key.
        const { error } = await createClient().auth.signInWithPassword({ email: user.email ?? '', password: secret })
        if (error) return WRONG_SECRET
      }
      const key = await deriveFromSecret(secret)
      if (!key) return SOFT_FAIL
      const newest = records[0]
      if (newest) {
        const isValid = await decryptText(key, newest.ciphertext, newest.iv).then(() => true, () => false)
        if (!isValid) return WRONG_SECRET
      }
      await cacheKey(key)
      await openWith(key, records, keyKind)
      return null
    } catch {
      return SOFT_FAIL
    }
  }, [user, keyKind, openWith])

  /** First journal visit for a passphrase account: the passphrase becomes the key. */
  const choosePassphrase = useCallback(async (passphrase: string): Promise<string | null> => {
    try {
      const key = await deriveFromSecret(passphrase)
      if (!key) return SOFT_FAIL
      await cacheKey(key)
      await openWith(key, recordsRef.current, 'PASSPHRASE')
      return null
    } catch {
      return SOFT_FAIL
    }
  }, [openWith])

  const usesPassphrase = keyKind === 'PASSPHRASE'

  const loadOlder = useCallback(async (): Promise<string | null> => {
    const key = keyRef.current
    const oldest = pages[pages.length - 1]
    if (!key || !oldest) return null
    const { data, error } = await getJournalEntries({ limit: PAGE_SIZE, cursor: oldest.id })
    if (error || !data) return SOFT_FAIL
    recordsRef.current = [...recordsRef.current, ...data]
    setHasMore(data.length === PAGE_SIZE)
    const older = await Promise.all(data.map(r => decryptRecord(key, r)))
    setPages(prev => sortNewestFirst([...prev, ...older]))
    return null
  }, [pages])

  /** Encrypt and save. No id → a new page filed under `date`; an id → that page is rewritten. */
  const save = useCallback(async (id: string | null, date: string, payload: JournalPayload): Promise<{ page: JournalPage | null; error: string | null }> => {
    const key = keyRef.current
    if (!key) return { page: null, error: SOFT_FAIL }
    try {
      const sealed = await encryptText(key, encodePayload(payload))
      const { data, error } = id
        ? await updateJournalEntry(id, sealed)
        : await createJournalEntry({ date, ...sealed })
      if (error || !data) return { page: null, error: error ?? SOFT_FAIL }

      recordsRef.current = [data, ...recordsRef.current.filter(r => r.id !== data.id)]
      const page = await decryptRecord(key, data)
      setPages(prev => sortNewestFirst([page, ...prev.filter(p => p.id !== page.id)]))
      return { page, error: null }
    } catch {
      return { page: null, error: SOFT_FAIL }
    }
  }, [])

  const remove = useCallback(async (id: string): Promise<string | null> => {
    const { error } = await deleteJournalEntry(id)
    if (error) return error
    recordsRef.current = recordsRef.current.filter(r => r.id !== id)
    setPages(prev => prev.filter(p => p.id !== id))
    return null
  }, [])

  return { status, pages, hasMore, usesPassphrase, retry, unlock, choosePassphrase, loadOlder, save, remove }
}
