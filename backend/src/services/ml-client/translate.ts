import { validateTone } from '../gemini/validate'
import type { MlPattern } from './schema'

// Voice-compliant copy for each (feature, direction, target) combination.
// All strings validated manually against the banned-phrase list and again at runtime.
// Hedging language only — no causation, no prescription.
const PATTERN_COPY: Record<
  string,
  Partial<Record<'positive' | 'negative', Partial<Record<'mood' | 'energy', string>>>>
> = {
  sleep_hours: {
    positive: {
      mood:   'On days with more sleep, your mood tends to feel a little steadier.',
      energy: 'More sleep seems to come with higher energy the next day.',
    },
    negative: {
      mood:   'Your mood might dip slightly on days with less sleep.',
      energy: 'Less sleep seems connected to your energy feeling lower.',
    },
  },
  water_glasses: {
    positive: {
      mood:   'Staying hydrated might come with a gentle lift in mood.',
      energy: 'More water seems to come with steadier energy.',
    },
    negative: {
      mood:   'Your mood might feel a little lower on days with less water.',
      energy: 'Less water seems connected to your energy dipping slightly.',
    },
  },
  sunlight_minutes: {
    positive: {
      mood:   'More time outdoors might come with your mood feeling steadier.',
      energy: 'Getting outside seems connected to your energy being higher.',
    },
    negative: {
      mood:   'Less time outdoors might be linked to your mood feeling lower.',
      energy: 'Less sunlight seems to come with your energy dipping.',
    },
  },
  stress_level: {
    positive: {
      // unusual direction — stress up, mood/energy up — present with curiosity, not alarm
      mood:   'There might be something worth noticing in how stress and mood move together for you.',
      energy: 'There might be a pattern here in how stress and energy relate for you.',
    },
    negative: {
      mood:   'Higher stress seems to come with your mood feeling lower.',
      energy: 'Higher stress seems connected to your energy dipping.',
    },
  },
  food_group_count: {
    positive: {
      mood:   'Eating a wider variety of foods might come with a gentle lift in mood.',
      energy: 'More food variety seems connected to your energy feeling steadier.',
    },
    negative: {
      mood:   'There might be something worth noticing about food variety and how your mood feels.',
      energy: 'Less food variety might be linked to your energy feeling lower.',
    },
  },
  symptom_count: {
    positive: {
      // unusual — more symptoms correlating with higher scores; keep neutral and curious
      mood:   'There might be a pattern worth noticing in how symptoms and mood relate for you.',
      energy: 'There might be something worth noticing about how symptoms and energy relate for you.',
    },
    negative: {
      mood:   'More symptoms seem to come with your mood feeling lower.',
      energy: 'More symptoms seem connected to your energy dipping.',
    },
  },
}

/**
 * Converts an MlPattern into a voice-compliant copy string.
 * Returns null if no template exists for the feature or if the tone check fails.
 */
export function patternToCopy(pattern: MlPattern): string | null {
  const copy = PATTERN_COPY[pattern.feature]?.[pattern.direction]?.[pattern.target]
  if (!copy) return null

  const { ok } = validateTone(copy)
  if (!ok) return null

  return copy
}

/**
 * Normalises a 1–6 ML score to a UI band word.
 * ML returns floats; the frontend only ever sees "lower" | "steady" | "brighter".
 */
export function bandPrediction(score: number): 'lower' | 'steady' | 'brighter' {
  const normalised = ((score - 1) / 5) * 10
  if (normalised < 3) return 'lower'
  if (normalised < 7) return 'steady'
  return 'brighter'
}

/**
 * Converts a 0–1 confidence float to UI wording.
 * Confidence < 0.3 → caller should hide the card entirely ("still learning" shown if needed).
 */
export function confidenceToWording(confidence: number): string {
  if (confidence < 0.3) return 'still learning'
  if (confidence < 0.6) return 'there might be a pattern here'
  return 'worth noticing'
}
