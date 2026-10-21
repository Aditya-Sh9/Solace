import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const APP_ROUTES = ['/dashboard', '/checkin', '/journal', '/insights', '/wellness', '/settings', '/onboarding']
  const isProtected = APP_ROUTES.some(r => pathname.startsWith(r))
  const isAuthRoute  = pathname.startsWith('/login')    || pathname.startsWith('/signup')

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  // Signed-in → the onboarding gate, not /dashboard: LoginForm's router.refresh() re-requests
  // /login and races its push('/onboarding'); sending both to the gate (which forwards onboarded
  // people to /dashboard) means a new user can't skip onboarding whichever lands last.
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
