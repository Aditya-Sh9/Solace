'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import { IllustrationSunMoon } from '@/src/components/ui/Illustrations'
import { Icon } from '@/src/components/ui/Icons'

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

const GREETING: Record<TimeOfDay, string> = {
  morning:   'Good morning',
  afternoon: 'Good afternoon',
  evening:   'Good evening',
  night:     'Still up?',
}

const SUB: Record<TimeOfDay, string> = {
  morning:   'A soft start. No pressure to do anything heavy yet.',
  afternoon: 'A small pause is a good idea. Want to log a moment?',
  evening:   'Take stock, gently. Today does not need to be a whole thing.',
  night:     'It is late. Be kind to yourself before sleep.',
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function getTimeOfDay(h: number): TimeOfDay {
  if (h < 5)  return 'night'
  if (h < 12) return 'morning'
  if (h < 18) return 'afternoon'
  return 'evening'
}

interface GreetingProps {
  name:          string
  hasCheckedIn?: boolean
}

export default function Greeting({ name }: GreetingProps) {
  const router = useRouter()

  // Server renders neutral defaults; client fills in time-aware values after mount.
  const [time,    setTime]    = useState<TimeOfDay>('morning')
  const [eyebrow, setEyebrow] = useState('')

  useEffect(() => {
    const d = new Date()
    const h = d.getHours()
    // Reading browser Date is a side effect — setState inside effect is intentional here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(getTimeOfDay(h))
    setEyebrow(`${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`)
  }, [])

  return (
    <InkCard hand handIntensity={2.4} style={{
      padding: '32px 36px', display: 'flex', alignItems: 'center', gap: 28,
    }}>
      <div style={{ flex: 1 }}>
        {eyebrow && (
          <div className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>
        )}
        <h2 className="serif" style={{
          fontSize: 38, lineHeight: 1.05, fontWeight: 400, fontStyle: 'italic',
          margin: '0 0 12px', color: 'var(--ink)',
        }}>
          {GREETING[time]}{name ? `, ${name}` : ''}.
        </h2>
        <p style={{ margin: '0 0 22px', color: 'var(--ink-soft)', fontSize: 16, maxWidth: 520 }}>
          {SUB[time]}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <InkButton variant="primary" icon={<Icon.Check size={16} />}
                     onClick={() => router.push('/checkin')}>
            Today&apos;s check-in
          </InkButton>
          <InkButton variant="ghost" icon={<Icon.Journal size={16} />}
                     onClick={() => router.push('/journal')}>
            Open journal
          </InkButton>
        </div>
      </div>
      <div style={{
        flex: '0 0 auto', display: 'grid', placeItems: 'center',
        width: 120, height: 120,
      }}>
        <IllustrationSunMoon time={time} size={120} />
      </div>
    </InkCard>
  )
}
