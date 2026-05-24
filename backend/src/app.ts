import express from 'express'
import cors from 'cors'
import { env } from './config/env'
import onboardingRouter from './routes/onboarding'
import profileRouter from './routes/profile'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'solace-backend' })
})

app.use('/api/onboarding', onboardingRouter)
app.use('/api/profile',    profileRouter)

export default app
