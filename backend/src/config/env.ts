import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  PORT:                z.coerce.number().default(4000),
  NODE_ENV:            z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL:        z.string().default('http://localhost:3000'),
  DATABASE_URL:             z.string(),
  SUPABASE_URL:             z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GEMINI_API_KEY:      z.string().optional(),
  ML_SERVICE_URL:      z.string().default('http://localhost:8000'),
})

export const env = envSchema.parse(process.env)
