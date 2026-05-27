import type { ActivityLevel, DietaryPattern } from '@prisma/client'

interface ProfileInput {
  symptoms?:       string[]
  dietaryPattern?: DietaryPattern
  stressLevel?:    number
  sleepHours?:     number
  activityLevel?:  ActivityLevel
}

interface InsightDraft {
  type:  'ENCOURAGEMENT' | 'RECOMMENDATION'
  title: string
  body:  string
  flags: string[]
}

// Generates warm welcome insights on onboarding — NOT nutrient detection.
// The Phase 3 rule engine handles evidence-based pattern detection.
// These insights exist to make the user feel seen on day zero.
export function generateFirstInsight(profile: ProfileInput): InsightDraft[] {
  const insights: InsightDraft[] = []

  insights.push({
    type:  'ENCOURAGEMENT',
    title: "We're listening.",
    body:  "You've shared something real. We're not here to diagnose or fix — just to notice patterns alongside you, gently, as they emerge.",
    flags: [],
  })

  const symptoms    = (profile.symptoms ?? []).map(s => s.toLowerCase())
  const hasFatigue  = symptoms.some(s => s.includes('fatigue') || s.includes('tired') || s.includes('energy'))
  const highStress  = (profile.stressLevel ?? 0) >= 4
  const poorSleep   = (profile.sleepHours  ?? 8) < 6

  if (hasFatigue && poorSleep) {
    insights.push({
      type:  'RECOMMENDATION',
      title: "Something we noticed.",
      body:  "Sleep and energy have a way of pulling at each other. When rest is short, everything feels heavier — it's worth keeping an eye on as you settle in here.",
      flags: [],
    })
  } else if (highStress && poorSleep) {
    insights.push({
      type:  'RECOMMENDATION',
      title: "There might be a pattern here.",
      body:  "Stress and sleep often travel together. When both feel strained at once, the body notices — even when the mind tries to push through. We'll watch this with you.",
      flags: [],
    })
  } else if (hasFatigue) {
    insights.push({
      type:  'RECOMMENDATION',
      title: "A quiet thing to notice.",
      body:  "Low energy can have a dozen different causes — some obvious, some easy to miss. The more you check in, the clearer the picture becomes. We're just getting started.",
      flags: [],
    })
  } else {
    insights.push({
      type:  'RECOMMENDATION',
      title: "We're just getting started.",
      body:  "There's nothing jumping out just yet — which is fine. Patterns tend to show themselves over time. The more you check in, the clearer the picture becomes.",
      flags: [],
    })
  }

  return insights
}
