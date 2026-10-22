// Which button started a Google sign-in. Set as a short-lived cookie by useAuth().signInWithGoogle
// (client) and read once by app/auth/callback/route.ts (server) — a plain module so both can import it.
export type OAuthIntent = 'login' | 'signup'
export const OAUTH_INTENT_COOKIE = 'solace-oauth-intent'
