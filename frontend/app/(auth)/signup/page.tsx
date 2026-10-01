import { connection } from 'next/server'
import AuthCard from '@/src/components/auth/AuthCard'

export default async function SignupPage() {
  // Both forms are mounted on both pages (the card slides between them), so this page
  // renders per request too — see login/page.tsx.
  await connection()
  return <AuthCard initialMode="signup" />
}
