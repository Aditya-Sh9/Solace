import { describe, it, expect } from 'vitest'
import { phaseRanges, phaseOn, cycleToday, cycleDayFor, learnCycleLength, toDayNumber } from '../cycle-phase'
import { summarisePhases, type PhasedCheckIn } from '../cycle-patterns'
import { validateTone } from '../gemini/validate'

const base = { lastPeriodStart: '2026-10-01', cycleLength: 28, periodLength: 5 }

describe('phaseRanges', () => {
  it('matches the design reference for a 28-day cycle with a 5-day period', () => {
    expect(phaseRanges(28, 5)).toEqual([
      { phase: 'MENSTRUAL',  startDay: 1,  endDay: 5 },
      { phase: 'FOLLICULAR', startDay: 6,  endDay: 13 },
      { phase: 'OVULATORY',  startDay: 14, endDay: 16 },
      { phase: 'LUTEAL',     startDay: 17, endDay: 28 },
    ])
  })

  it('places ovulation ~14 days before the end of longer cycles', () => {
    const r = phaseRanges(35, 5)
    expect(r[2]).toEqual({ phase: 'OVULATORY', startDay: 21, endDay: 23 })
    expect(r[3].endDay).toBe(35)
  })

  it.each([[21, 10], [21, 2], [45, 10], [28, 2], [24, 8]])('covers every day with no gaps or empty phases (%i/%i)', (len, period) => {
    const r = phaseRanges(len, period)
    expect(r[0].startDay).toBe(1)
    expect(r[3].endDay).toBe(len)
    for (let i = 0; i < r.length; i++) {
      expect(r[i].endDay).toBeGreaterThanOrEqual(r[i].startDay)
      if (i > 0) expect(r[i].startDay).toBe(r[i - 1].endDay + 1)
    }
  })

  it('clamps out-of-range inputs', () => {
    expect(phaseRanges(99, 30)[3].endDay).toBe(45)
    expect(phaseRanges(10, 1)[0].endDay).toBe(2)
  })
})

describe('cycleDayFor / phaseOn', () => {
  it('counts the start day as day 1', () => {
    expect(cycleDayFor(base, '2026-10-01')).toEqual({ day: 1, projected: false })
    expect(phaseOn(base, '2026-10-01')).toBe('MENSTRUAL')
  })
  it('finds each phase', () => {
    expect(phaseOn(base, '2026-10-06')).toBe('FOLLICULAR')
    expect(phaseOn(base, '2026-10-14')).toBe('OVULATORY')
    expect(phaseOn(base, '2026-10-18')).toBe('LUTEAL')
    expect(phaseOn(base, '2026-10-28')).toBe('LUTEAL')
  })
  it('wraps after one cycle and flags it as projected', () => {
    expect(cycleDayFor(base, '2026-10-29')).toEqual({ day: 1, projected: true })
  })
  it('knows nothing about dates before the anchor', () => {
    expect(cycleDayFor(base, '2026-09-30')).toBeNull()
    expect(phaseOn(base, '2026-09-30')).toBeNull()
  })
  it('accepts Prisma @db.Date values (UTC midnight)', () => {
    expect(phaseOn({ ...base, lastPeriodStart: '2026-10-01' }, new Date('2026-10-14T00:00:00.000Z'))).toBe('OVULATORY')
    expect(toDayNumber(new Date('2026-10-01T00:00:00.000Z'))).toBe(toDayNumber('2026-10-01'))
  })
})

describe('cycleToday', () => {
  it('reports days until the next phase', () => {
    expect(cycleToday(base, '2026-10-18')).toEqual({ day: 18, phase: 'LUTEAL', daysUntilNext: 11, nextPhase: 'MENSTRUAL', projected: false })
    expect(cycleToday(base, '2026-10-05')).toMatchObject({ phase: 'MENSTRUAL', daysUntilNext: 1, nextPhase: 'FOLLICULAR' })
  })
})

describe('learnCycleLength', () => {
  it('moves a third of the way toward the observed gap', () => {
    expect(learnCycleLength('2026-09-01', '2026-10-02', 28)).toBe(29) // gap 31 → (56+31)/3 = 29
  })
  it('ignores implausible gaps and a missing previous start', () => {
    expect(learnCycleLength('2026-09-20', '2026-10-01', 28)).toBe(28) // 11 days
    expect(learnCycleLength('2026-06-01', '2026-10-01', 28)).toBe(28) // 122 days
    expect(learnCycleLength(null, '2026-10-01', 30)).toBe(30)
  })
})

describe('summarisePhases', () => {
  const rows = (phase: PhasedCheckIn['cyclePhase'], n: number, mood: number, energy: number): PhasedCheckIn[] =>
    Array.from({ length: n }, () => ({ cyclePhase: phase, moodScore: mood, energyScore: energy }))

  it('says nothing until two phases have three check-ins each', () => {
    const r = summarisePhases([...rows('LUTEAL', 3, 2, 2), ...rows('FOLLICULAR', 1, 5, 5), ...rows(null, 10, 3, 3)])
    expect(r.annotation).toBeNull()
    expect(r.needed).toBe(2)
  })

  it('names the clearest difference in hedged words', () => {
    const r = summarisePhases([...rows('LUTEAL', 4, 3, 1), ...rows('FOLLICULAR', 4, 3, 5)])
    expect(r.needed).toBe(0)
    expect(r.annotation).toMatch(/energy has tended to (sit a little lower in your luteal|run a little higher in your follicular) days/)
    expect(validateTone(r.annotation!).ok).toBe(true)
    expect(r.phases.find(p => p.phase === 'LUTEAL')!.energy).toBe('lower')
  })

  it('falls back to a steady line when nothing stands out', () => {
    const r = summarisePhases([...rows('LUTEAL', 4, 3, 3), ...rows('MENSTRUAL', 4, 3, 3)])
    expect(r.annotation).toContain('fairly even')
  })

  it('never exposes numbers, only bands', () => {
    const r = summarisePhases([...rows('LUTEAL', 4, 1, 1), ...rows('OVULATORY', 4, 6, 6)])
    for (const p of r.phases) {
      expect([null, 'lower', 'steady', 'brighter']).toContain(p.mood)
    }
  })
})
