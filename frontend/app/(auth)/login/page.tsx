import { connection } from 'next/server'
import AuthCard from '@/src/components/auth/AuthCard'

export default async function LoginPage() {
  // Render per request: LoginForm reads ?error=oauth via useSearchParams, which would
  // otherwise need a Suspense boundary that drops the card out of the server HTML.
  await connection()
  return <AuthCard initialMode="login" />
}
