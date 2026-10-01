import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'

// Google → Supabase → here with a one-time PKCE `code`. Exchanging it sets the session
// cookies server-side. Everyone then goes to /onboarding, whose gate sends people who've
// already onboarded straight on to /dashboard — so new and returning users share one path.
// Redirect targets are fixed paths on our own origin; there is deliberately no `next` param.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const failed = NextResponse.redirect(new URL('/login?error=oauth', origin))

  // `error` is set when the user cancels on Google's consent screen.
  if (!code || searchParams.get('error')) return failed

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[auth/callback] code exchange failed:', error.message)
    return failed
  }

  return NextResponse.redirect(new URL('/onboarding', origin))
}
