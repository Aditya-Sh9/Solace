import type { CheckInSnapshot, ProfileSnapshot, Flag } from '../types'

type RuleFn = (profile: ProfileSnapshot, checkIns: CheckInSnapshot[]) => Flag | null

const IRON_FOOD_GROUPS = ['meat', 'leafy_greens', 'legumes']
const PLANT_BASED_DIETS = ['VEGAN', 'VEGETARIAN']

function hasSym(checkIn: CheckInSnapshot, ...terms: string[]): boolean {
  return checkIn.symptoms.some(s =>
    terms.some(t => s.toLowerCase().includes(t))
  )
}

export const ironRule: RuleFn = (_profile, checkIns) => {
  const fatigueDays = checkIns.filter(c =>
    hasSym(c, 'fatigue', 'tired', 'exhausted', 'low energy', 'no energy')
  )
  if (fatigueDays.length < 3) return null

  const lowIronFoodDays = checkIns.filter(c =>
    !IRON_FOOD_GROUPS.some(g => c.foodGroups.map(f => f.toLowerCase()).includes(g))
  )
  if (lowIronFoodDays.length < 4) return null

  const hasCognitiveSym = checkIns.some(c =>
    hasSym(c, 'irritab', 'brain fog', 'foggy', 'concentration', 'focus')
  )
  if (!hasCognitiveSym) return null

  return {
    id: 'IRON',
    evidence: [
      `Fatigue or low-energy symptoms logged on ${fatigueDays.length} of ${checkIns.length} days`,
      `Low iron-rich food intake on ${lowIronFoodDays.length} of ${checkIns.length} days`,
      'Cognitive or mood symptoms also present (irritability, brain fog)',
    ],
    confidence: Math.min(0.9, 0.5 + fatigueDays.length * 0.1),
  }
}

export const vitaminDRule: RuleFn = (_profile, checkIns) => {
  const lowMoodDays = checkIns.filter(c => c.moodScore <= 3)
  if (lowMoodDays.length < 4) return null

  const lowSunlightDays = checkIns.filter(c =>
    c.sunlightMinutes !== null && c.sunlightMinutes <= 15
  )
  if (lowSunlightDays.length < 5) return null

  return {
    id: 'VITAMIN_D',
    evidence: [
      `Low mood (score ≤3) on ${lowMoodDays.length} of ${checkIns.length} days`,
      `Very limited sunlight (≤15 min) on ${lowSunlightDays.length} of ${checkIns.length} days`,
    ],
    confidence: 0.7,
  }
}

export const magnesiumRule: RuleFn = (_profile, checkIns) => {
  const poorSleepDays = checkIns.filter(c =>
    c.sleepHours !== null && c.sleepHours < 6
  )
  if (poorSleepDays.length < 3) return null

  const highStressDays = checkIns.filter(c =>
    c.stressLevel !== null && c.stressLevel >= 4
  )
  if (highStressDays.length < 3) return null

  const hasAnxietySym = checkIns.some(c =>
    hasSym(c, 'anxiety', 'anxious', 'tension', 'tense', 'restless', 'worry')
  )
  if (!hasAnxietySym) return null

  return {
    id: 'MAGNESIUM',
    evidence: [
      `Poor sleep (<6h) on ${poorSleepDays.length} of ${checkIns.length} days`,
      `High stress (level ≥4) on ${highStressDays.length} of ${checkIns.length} days`,
      'Anxiety or tension symptoms logged at least once',
    ],
    confidence: 0.65,
  }
}

export const b12Rule: RuleFn = (profile, checkIns) => {
  if (!profile.dietaryPattern || !PLANT_BASED_DIETS.includes(profile.dietaryPattern)) return null

  const brainFogDays = checkIns.filter(c =>
    hasSym(c, 'brain fog', 'foggy', 'concentration', 'focus', 'mental clarity')
  )
  if (brainFogDays.length < 3) return null

  const fatigueDays = checkIns.filter(c =>
    hasSym(c, 'fatigue', 'tired', 'exhausted', 'low energy')
  )
  if (fatigueDays.length < 2) return null

  return {
    id: 'B12',
    evidence: [
      `Plant-based diet (${profile.dietaryPattern.toLowerCase()})`,
      `Brain fog or concentration issues on ${brainFogDays.length} of ${checkIns.length} days`,
      `Fatigue symptoms on ${fatigueDays.length} of ${checkIns.length} days`,
    ],
    confidence: 0.75,
  }
}

export const vitaminCRule: RuleFn = (_profile, checkIns) => {
  const lowEnergyDays = checkIns.filter(c => c.energyScore <= 3)
  if (lowEnergyDays.length < 4) return null

  const lowFruitVegDays = checkIns.filter(c => {
    const groups = c.foodGroups.map(f => f.toLowerCase())
    return !groups.includes('fruits') && !groups.includes('vegetables')
  })
  if (lowFruitVegDays.length < 4) return null

  return {
    id: 'VITAMIN_C',
    evidence: [
      `Low energy (score ≤3) on ${lowEnergyDays.length} of ${checkIns.length} days`,
      `Low fruit and vegetable intake on ${lowFruitVegDays.length} of ${checkIns.length} days`,
    ],
    confidence: 0.6,
  }
}
