'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/src/hooks/use-auth'
import InkButton from '@/src/components/ui/InkButton'
import MoodPickerRow  from './MoodPickerRow'
import EnergyRow      from './EnergyRow'
import SleepRow       from './SleepRow'
import WaterRow       from './WaterRow'
import SunlightRow    from './SunlightRow'
import StressRow      from './StressRow'
import ChipMultiSelect from './ChipMultiSelect'
import NotesField      from './NotesField'
import SaveSuccess     from './SaveSuccess'
import { SYMPTOM_OPTIONS, FOOD_GROUP_OPTIONS } from '@/src/constants/checkin'
import { saveCheckIn, getTodayCheckIn } from '@/src/lib/api/checkin'
import type { CheckInFormData } from '@/src/types/checkin'

const DEFAULT_FORM: CheckInFormData = {
  moodScore:       3,
  energyScore:     3,
  sleepHours:      7,
  waterGlasses:    4,
  sunlightMinutes: 30,
  stressLevel:     2,
  symptoms:        [],
  foodGroups:      [],
  notes:           '',
}

export default function CheckInPage() {
  const { loading: authLoading } = useAuth()
  const hasFetched = useRef(false)
  const [form,    setForm]    = useState<CheckInFormData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isEdit,  setIsEdit]  = useState(false)

  // Pre-fill if already checked in today — wait for auth session to load first
  useEffect(() => {
    if (authLoading) return
    if (hasFetched.current) return
    hasFetched.current = true

    getTodayCheckIn().then(({ data }) => {
      if (!data) return
      setIsEdit(true)
      setForm({
        moodScore:       data.moodScore,
        energyScore:     data.energyScore,
        sleepHours:      data.sleepHours ?? DEFAULT_FORM.sleepHours,
        waterGlasses:    data.waterGlasses ?? DEFAULT_FORM.waterGlasses,
        sunlightMinutes: data.sunlightMinutes ?? DEFAULT_FORM.sunlightMinutes,
        stressLevel:     data.stressLevel ?? DEFAULT_FORM.stressLevel,
        symptoms:        data.symptoms ?? [],
        foodGroups:      data.foodGroups ?? [],
        notes:           data.notes ?? '',
      })
    })
  }, [authLoading])

  const patch = (updates: Partial<CheckInFormData>) =>
    setForm(prev => ({ ...prev, ...updates }))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    const { error } = await saveCheckIn(form)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    setSuccess(true)
  }

  if (success) return <SaveSuccess />

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className="checkin-page">
      {/* Header */}
      <div>
        <p style={{
          fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px',
        }}>
          {today}
        </p>
        <h1 className="serif" style={{
          fontSize: 28, fontWeight: 500, margin: 0,
          color: 'var(--ink)', letterSpacing: '-0.01em',
        }}>
          {isEdit ? 'Update your entry' : 'How was today?'}
        </h1>
      </div>

      {/* Mood picker */}
      <div className="checkin-row">
        <MoodPickerRow
          value={form.moodScore}
          onChange={v => patch({ moodScore: v })}
        />
      </div>

      {/* Energy */}
      <div className="checkin-row">
        <EnergyRow
          value={form.energyScore}
          onChange={v => patch({ energyScore: v })}
        />
      </div>

      {/* Sleep */}
      <div className="checkin-row">
        <SleepRow
          value={form.sleepHours ?? 0}
          onChange={v => patch({ sleepHours: v })}
        />
      </div>

      {/* Water */}
      <div className="checkin-row">
        <WaterRow
          value={form.waterGlasses ?? 0}
          onChange={v => patch({ waterGlasses: v })}
        />
      </div>

      {/* Sunlight */}
      <div className="checkin-row">
        <SunlightRow
          value={form.sunlightMinutes ?? 0}
          onChange={v => patch({ sunlightMinutes: v })}
        />
      </div>

      {/* Stress */}
      <div className="checkin-row">
        <StressRow
          value={form.stressLevel ?? 1}
          onChange={v => patch({ stressLevel: v })}
        />
      </div>

      {/* Symptoms */}
      <div className="checkin-row">
        <ChipMultiSelect
          label="Anything you've been feeling?"
          options={SYMPTOM_OPTIONS}
          selected={form.symptoms}
          onChange={v => patch({ symptoms: v })}
        />
      </div>

      {/* Food groups */}
      <div className="checkin-row">
        <ChipMultiSelect
          label="What did you eat today?"
          options={FOOD_GROUP_OPTIONS}
          selected={form.foodGroups}
          onChange={v => patch({ foodGroups: v })}
        />
      </div>

      {/* Notes */}
      <div className="checkin-row">
        <NotesField
          value={form.notes}
          onChange={v => patch({ notes: v })}
        />
      </div>

      {/* Error */}
      {error && (
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, margin: 0 }}>{error}</p>
      )}

      {/* Submit */}
      <div style={{ paddingBottom: 32 }}>
        <InkButton
          variant="primary"
          onClick={handleSubmit}
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Saving…' : isEdit ? 'Update entry' : 'Save today\'s entry'}
        </InkButton>
      </div>
    </div>
  )
}
