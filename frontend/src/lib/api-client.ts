import { createClient } from './supabase/client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const supabase = createClient()
    let { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      const { data } = await supabase.auth.refreshSession()
      session = data.session
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const errMsg = typeof body.error === 'string' ? body.error : `Request failed (${res.status})`
      return { data: null, error: errMsg }
    }

    const body = await res.json()
    return { data: body.data ?? body, error: null }
  } catch {
    return { data: null, error: "Something got in the way — not your fault. Try again in a moment?" }
  }
}
