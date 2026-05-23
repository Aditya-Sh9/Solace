# SOLACE — Security Rules

## Journal Encryption

**Non-negotiable rules:**

1. Journal text is encrypted in the browser using Web Crypto API
2. Encryption key is derived from user password (PBKDF2)
3. Encryption key NEVER leaves the client
4. Server stores only ciphertext
5. Server cannot decrypt entries even with full DB access

## Auth

- Supabase manages sessions with httpOnly cookies
- All API routes verify session before responding
- Rate limiting on auth endpoints
- Password requirements: 12+ chars, enforced client + server

## Data Privacy

- Journal data isolated from analytics data
- No third-party trackers (no GA, no FB Pixel)
- User data export endpoint (GDPR-style)
- User data deletion endpoint

## API Security

- All inputs validated with Zod
- SQL injection: prevented by Prisma parameterized queries
- XSS: React's default escaping + sanitize markdown
- CSRF: Supabase handles via cookie SameSite
- Rate limiting on all endpoints

## Environment Variables

- Never commit .env files
- All secrets in Vercel environment
- Public env vars prefixed with NEXT_PUBLIC_
- Separate keys for dev / prod