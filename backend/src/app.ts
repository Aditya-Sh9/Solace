import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import onboardingRouter from './routes/onboarding'
import profileRouter    from './routes/profile'
import checkInRouter    from './routes/checkin'
import dashboardRouter  from './routes/dashboard'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL }))
app.use(express.json({ limit: '100kb' }))

// Global rate limiter: 100 req / 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { data: null, error: 'Too many requests — please slow down a little.' },
})
app.use(globalLimiter)

// Strict limiter for write endpoints that have real cost or abuse risk
const onboardingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { data: null, error: 'Too many requests — please try again later.' },
})

const checkinLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { data: null, error: 'Too many requests — please try again later.' },
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'solace-backend' })
})

app.use('/api/onboarding', onboardingLimiter, onboardingRouter)
app.use('/api/profile',    profileRouter)
app.use('/api/checkin',    checkinLimiter, checkInRouter)
app.use('/api/dashboard',  dashboardRouter)

// Central error handler — catches all unhandled async errors thrown by routes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const route     = `${req.method} ${req.path}`
  const message   = err instanceof Error ? err.message : String(err)
  console.error(`[${timestamp}] ERROR ${route}: ${message}`)
  if (err instanceof Error && err.stack) {
    console.error(err.stack)
  }
  res.status(500).json({ data: null, error: 'Something went wrong. Please try again.' })
})

export default app
