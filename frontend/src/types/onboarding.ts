export type ActivityLevel  = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE'
export type DietaryPattern = 'OMNIVORE' | 'VEGETARIAN' | 'VEGAN' | 'PESCATARIAN' | 'OTHER'

export interface OnboardingFormData {
  name?:           string
  age?:            number
  energyLevel?:    number        // UX only — not sent to backend
  activityLevel?:  ActivityLevel
  dietaryPattern?: DietaryPattern
  symptoms?:       string[]
  sleepHours?:     number
  stressLevel?:    number
  wellnessGoal?:   string
  cycleTracking?:  boolean
}

export interface InsightCard {
  id:        string
  type:      'ENCOURAGEMENT' | 'RECOMMENDATION' | 'DEFICIENCY_FLAG' | 'PATTERN'
  title:     string
  body:      string
  flags:     string[]
}
