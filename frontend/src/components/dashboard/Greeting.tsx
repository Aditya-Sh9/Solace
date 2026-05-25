import { getTimeOfDayGreeting, getGreetingSub } from '@/src/lib/format/greeting'

interface GreetingProps {
  name:            string
  hasCheckedIn:    boolean
}

export default function Greeting({ name, hasCheckedIn }: GreetingProps) {
  const headline = getTimeOfDayGreeting(name)
  const sub      = getGreetingSub(hasCheckedIn)

  return (
    <div>
      <h1 className="serif" style={{
        fontSize: 30, fontWeight: 500, letterSpacing: '-0.01em',
        lineHeight: 1.15, margin: '0 0 6px', color: 'var(--ink)',
      }}>
        {headline}
      </h1>
      <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
        {sub}
      </p>
    </div>
  )
}
