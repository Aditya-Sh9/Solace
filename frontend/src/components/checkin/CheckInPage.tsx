'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/hooks/use-auth'
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import { Icon } from '@/src/components/ui/Icons'
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
  const router = useRouter()
  const { loading: authLoading } = useAuth()
  const hasFetched = useRef(false)
  const [form,    setForm]    = useState<CheckInFormData>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isEdit,  setIsEdit]  = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (hasFetched.current) return
    hasFetched.current = true

    getTodayCheckIn().then(({ data }) => {
      if (!data) return
      setIsEdit(true)
      setForm({
        moodScore:       data.moodScore   ?? DEFAULT_FORM.moodScore,
        energyScore:     data.energyScore ?? DEFAULT_FORM.energyScore,
        sleepHours:      data.sleepHours      ?? DEFAULT_FORM.sleepHours,
        waterGlasses:    data.waterGlasses    ?? DEFAULT_FORM.waterGlasses,
        sunlightMinutes: data.sunlightMinutes ?? DEFAULT_FORM.sunlightMinutes,
        stressLevel:     data.stressLevel     ?? DEFAULT_FORM.stressLevel,
        symptoms:        data.symptoms        ?? [],
        foodGroups:      data.foodGroups      ?? [],
        notes:           data.notes           ?? '',
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
    if (error) { setError(error); return }
    setSuccess(true)
  }

  if (success) return <SaveSuccess />

  const _now = new Date()
  const _months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const shortDate = `${_months[_now.getMonth()]} ${_now.getDate()}`

  return (
    <div className="checkin-page" style={{ maxWidth: 760 }}>

      {/* Header — date eyebrow left, handwritten date right */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Today, just for a second</div>
          <h2 className="serif" style={{
            fontSize: 32, fontWeight: 400, fontStyle: 'italic',
            margin: 0, color: 'var(--ink)',
          }}>
            {isEdit ? 'Still with you.' : 'How are you, really?'}
          </h2>
        </div>
        <div className="hand" style={{ fontSize: 20, color: 'var(--ink-muted)', transform: 'rotate(-3deg)' }}>
          {shortDate}
        </div>
      </div>

      {/* Mood picker — InkCard applied inside MoodPickerRow */}
      <MoodPickerRow
        value={form.moodScore}
        onChange={v => patch({ moodScore: v })}
      />

      {/* Symptoms — InkCard applied inside ChipMultiSelect */}
      <ChipMultiSelect
        label="Body & mind notes"
        subtitle="Tap anything that's true today. None of this is a diagnosis — just notes for you."
        options={SYMPTOM_OPTIONS}
        selected={form.symptoms}
        onChange={v => patch({ symptoms: v })}
      />

      {/* Sliders — grouped in one InkCard */}
      <InkCard hand handIntensity={2.4} style={{ padding: 28 }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>The little things</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <EnergyRow      value={form.energyScore}          onChange={v => patch({ energyScore: v })} />
          <SleepRow       value={form.sleepHours    ?? 0}   onChange={v => patch({ sleepHours: v })} />
          <WaterRow       value={form.waterGlasses  ?? 0}   onChange={v => patch({ waterGlasses: v })} />
          <SunlightRow    value={form.sunlightMinutes ?? 0} onChange={v => patch({ sunlightMinutes: v })} />
          <StressRow      value={form.stressLevel   ?? 1}   onChange={v => patch({ stressLevel: v })} />
        </div>
      </InkCard>

      {/* Food groups — InkCard applied inside ChipMultiSelect */}
      <ChipMultiSelect
        label="What did you eat today?"
        options={FOOD_GROUP_OPTIONS}
        selected={form.foodGroups}
        onChange={v => patch({ foodGroups: v })}
      />

      {/* Notes — InkCard applied inside NotesField */}
      <NotesField
        value={form.notes}
        onChange={v => patch({ notes: v })}
      />

      {/* Error */}
      {error && (
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, margin: 0 }}>{error}</p>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingBottom: 32 }}>
        <InkButton variant="ghost" onClick={() => router.push('/dashboard')}>Save & close</InkButton>
        <InkButton
          variant="primary"
          icon={<Icon.Check size={16} />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving…' : isEdit ? 'Update entry' : 'Save today\'s entry'}
        </InkButton>
      </div>
    </div>
  )
}
