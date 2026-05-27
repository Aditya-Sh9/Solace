import { z } from 'zod'

export const insightTypeSchema = z.enum([
  'ENCOURAGEMENT',
  'RECOMMENDATION',
  'DEFICIENCY_FLAG',
  'PATTERN',
])

export const geminiInsightSchema = z.object({
  type:  insightTypeSchema,
  title: z.string().min(1).max(120),
  body:  z.string().min(10).max(500),
  flags: z.array(z.string()).default([]),
})

export const geminiResponseSchema = z.object({
  insights: z.array(geminiInsightSchema).min(1).max(4),
})

export type GeminiInsight = z.infer<typeof geminiInsightSchema>
export type GeminiResponse = z.infer<typeof geminiResponseSchema>
