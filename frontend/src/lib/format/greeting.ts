// Time-of-day greetings in SOLACE voice — warm, specific, not generic.

export function getTimeOfDayGreeting(name: string): string {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 11)  return `Good morning, ${name}`
  if (hour >= 11 && hour < 17) return `Good afternoon, ${name}`
  if (hour >= 17 && hour < 22) return `Good evening, ${name}`
  return `Late night, ${name}`
}

export function getGreetingSub(hasCheckedInToday: boolean): string {
  return hasCheckedInToday
    ? 'Here\'s how things are looking.'
    : 'Whenever you\'re ready, we\'re here.'
}
