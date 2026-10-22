import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'
import { OAUTH_INTENT_COOKIE } from '@/src/lib/auth/oauth-intent'

// Google → Supabase → here with a one-time PKCE `code`. Exchanging it sets the session
// cookies server-side. Everyone then goes to /onboarding, whose gate sends people who've
// already onboarded straight on to /dashboard — so new and returning users share one path.
// Redirect targets are fixed paths on our own origin; there is deliberately no `next` param.
//
// Someone who pressed Google on the *sign up* page but picked a Google account that already
// has Solace is signed in to that account (one Google account = one Solace account), and
// `?returning=1` lets the dashboard say so instead of looking like nothing happened.

// An account made by this very sign-in is seconds old; anything older already existed.
const NEW_ACCOUNT_MS = 2 * 60 * 1000

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const intent = request.cookies.get(OAUTH_INTENT_COOKIE)?.value
  const finish = (path: string) => {
    const res = NextResponse.redirect(new URL(path, origin))
    res.cookies.delete(OAUTH_INTENT_COOKIE)
    return res
  }

  // `error` is set when the user cancels on Google's consent screen.
  if (!code || searchParams.get('error')) return finish('/login?error=oauth')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[auth/callback] code exchange failed:', error.message)
    return finish('/login?error=oauth')
  }

  const createdAt = Date.parse(data.user?.created_at ?? '')
  const isExisting = Number.isFinite(createdAt) && Date.now() - createdAt > NEW_ACCOUNT_MS
  return finish(intent === 'signup' && isExisting ? '/onboarding?returning=1' : '/onboarding')
}
