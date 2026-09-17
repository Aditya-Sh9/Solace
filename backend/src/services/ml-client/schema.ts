import { z } from 'zod'

// --- Request ---

export interface CheckInPayload {
  date: string              // ISO date YYYY-MM-DD
  sleep_hours: number | null
  water_glasses: number | null
  sunlight_minutes: number | null
  stress_level: number | null
  symptom_count: number | null
  food_group_count: number | null
  mood_score: number | null   // 1–6
  energy_level: number | null // 1–6
}

// --- Response (mirrors ml-service Pydantic schemas, snake_case) ---

export const PatternSchema = z.object({
  feature: z.string(),
  target: z.enum(['mood', 'energy']),
  direction: z.enum(['positive', 'negative']),
  strength: z.number(),
})

export const PredictionSchema = z.object({
  mood: z.number(),
  energy: z.number(),
  horizon: z.literal('next_day'),
  confidence: z.number().min(0).max(1),
})

export const QualitySchema = z.object({
  mood_r2: z.number().nullable(),
  energy_r2: z.number().nullable(),
})

export const PredictResponseSchema = z.object({
  trained: z.boolean(),
  n_samples: z.number(),
  prediction: PredictionSchema.nullable(),
  patterns: z.array(PatternSchema),
  quality: QualitySchema.nullable(),
})

export type MlPredictResponse = z.infer<typeof PredictResponseSchema>
export type MlPattern = z.infer<typeof PatternSchema>
export type MlPrediction = z.infer<typeof PredictionSchema>
