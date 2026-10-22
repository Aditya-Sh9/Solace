// Phase guidance (roadmap 6.11–6.17). Wording from screens-wellness.jsx, extended with movement
// and rest cues. Everything is an invitation, never an instruction: research on phase-matched
// training finds only small, inconsistent differences (McNulty et al., 2020), so movement is
// framed as "if it feels right". Ids match the backend's CyclePhase enum.

export type PhaseId = 'MENSTRUAL' | 'FOLLICULAR' | 'OVULATORY' | 'LUTEAL'

export interface PhaseContent {
  id:       PhaseId
  name:     string
  short:    string     // Caveat word under the name
  body:     string     // what the body is doing
  expect:   string     // what's likely to show up
  suggest:  string[]   // kind things to try
  foods:    string
  movement: string
  rest:     string
}

export const PHASES: PhaseContent[] = [
  {
    id: 'MENSTRUAL',
    name: 'Menstrual',
    short: 'Resting',
    body: 'The body is letting go. Energy is low for good reason.',
    expect: 'Lower energy. Tender mood. Wanting quiet.',
    suggest: ['warm baths', 'slow walks', 'iron-rich meals', 'rest without earning it'],
    foods: 'Leafy greens, slow oats, lentils, dark chocolate, broth.',
    movement: 'Gentle stretching or an easy walk, if it feels right. Some people find it eases cramps.',
    rest: 'Earlier nights are allowed. A heat pad counts as self-care.',
  },
  {
    id: 'FOLLICULAR',
    name: 'Follicular',
    short: 'Rising',
    body: 'Estrogen is rising. Curiosity and stamina often come back.',
    expect: 'Returning energy. Ideas. Wanting to begin things.',
    suggest: ['new projects', 'cardio you enjoy', 'social plans', 'creative work'],
    foods: 'Bright vegetables, fermented foods, lean protein.',
    movement: 'A good window to try something new — a class, a longer run — if you feel up to it.',
    rest: 'Energy can outrun sleep here. Keep a steady bedtime even on good days.',
  },
  {
    id: 'OVULATORY',
    name: 'Ovulatory',
    short: 'Open',
    body: 'A peak. Confidence and connection often feel easier.',
    expect: 'High energy. Talkative. Strong attraction or focus.',
    suggest: ['hard workouts', 'big conversations', 'presentations', 'dates'],
    foods: 'Cruciferous veg, berries, plenty of water.',
    movement: 'If you like a harder session, this is often when it feels easiest.',
    rest: 'Busy days stack up quickly. One quiet hour can keep the week balanced.',
  },
  {
    id: 'LUTEAL',
    name: 'Luteal',
    short: 'Tending',
    body: 'Progesterone shifts. Inward, careful, sometimes prickly.',
    expect: 'Detail-oriented. Easily overstimulated. Cravings.',
    suggest: ['shorter to-do lists', 'magnesium-rich foods', 'gentle yoga', 'extra sleep'],
    foods: 'Bananas, pumpkin seeds, complex carbs, herbal tea.',
    movement: 'Steadier movement — yoga, swimming, walks — often sits well. Strength work is fine too if you want it.',
    rest: 'Sleep can get lighter late in this phase. A slower evening might help.',
  },
]

export const PHASE_BY_ID: Record<PhaseId, PhaseContent> =
  Object.fromEntries(PHASES.map(p => [p.id, p])) as Record<PhaseId, PhaseContent>

export function dayRangeLabel(startDay: number, endDay: number): string {
  return startDay === endDay ? `day ${startDay}` : `days ${startDay} – ${endDay}`
}
