// Client-only journal encryption. The server never sees plaintext or the key — only
// ciphertext + IV (see security-rules.md). Key is derived via PBKDF2 from the user's
// login password and cached in sessionStorage (tab-scoped; cleared on tab close, never
// sent anywhere). Nothing here has a precedent elsewhere in the codebase — first of its kind.

const PBKDF2_ITERATIONS = 300_000
const SESSION_KEY_STORAGE_KEY = 'solace-journal-key'

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

// TS 5.7+ types plain `new Uint8Array(n)` as `Uint8Array<ArrayBufferLike>` (which also
// covers SharedArrayBuffer) — Web Crypto's BufferSource wants concretely ArrayBuffer-backed
// data, so the return type is pinned explicitly.
function fromBase64(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64)
  const bytes: Uint8Array<ArrayBuffer> = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export async function deriveKey(password: string, saltBase64: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: fromBase64(saltBase64),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true, // extractable — needed to cache raw bytes in sessionStorage
    ['encrypt', 'decrypt']
  )
}

export async function encryptText(key: CryptoKey, plaintext: string): Promise<{ ciphertext: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder()
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext))
  return { ciphertext: toBase64(new Uint8Array(cipherBuf)), iv: toBase64(iv) }
}

// Throws (auth-tag failure) on a wrong key or tampered data — callers use that as the
// "wrong password" signal, no separate validity check needed.
export async function decryptText(key: CryptoKey, ciphertextB64: string, ivB64: string): Promise<string> {
  const plainBuf = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(ivB64) },
    key,
    fromBase64(ciphertextB64)
  )
  return new TextDecoder().decode(plainBuf)
}

export async function cacheKey(key: CryptoKey): Promise<void> {
  try {
    const raw = await crypto.subtle.exportKey('raw', key)
    sessionStorage.setItem(SESSION_KEY_STORAGE_KEY, toBase64(new Uint8Array(raw)))
  } catch { /* private browsing — key simply won't survive this tab; unlock flow covers it */ }
}

export async function getCachedKey(): Promise<CryptoKey | null> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_STORAGE_KEY)
    if (!raw) return null
    return await crypto.subtle.importKey('raw', fromBase64(raw), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt'])
  } catch {
    return null
  }
}

export function clearCachedKey(): void {
  try { sessionStorage.removeItem(SESSION_KEY_STORAGE_KEY) } catch { /* private browsing — nothing to clear */ }
}
