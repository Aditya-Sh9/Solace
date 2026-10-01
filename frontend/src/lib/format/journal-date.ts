// Journal dates. Hardcoded names, never toLocaleDateString — server and browser locales
// differ and that has caused hydration crashes here before (defects.md 2026-05-26).
// Entry dates arrive as "YYYY-MM-DDT00:00:00.000Z" (Prisma @db.Date), so they are read in
// UTC; reading them in local time would shift the day for anyone west of Greenwich.

const WEEKDAYS       = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS         = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                        'August', 'September', 'October', 'November', 'December']
const MONTHS_SHORT   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "Friday, May 23" */
export function formatLongDate(iso: string): string {
  const d = new Date(iso)
  return `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
}

/** "Fri · May 23" */
export function formatShortDate(iso: string): string {
  const d = new Date(iso)
  return `${WEEKDAYS_SHORT[d.getUTCDay()]} · ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`
}

/** "May 23" — for the edited-at margin note. Uses the local clock: it's a timestamp, not a page date. */
export function formatStampDate(iso: string): string {
  const d = new Date(iso)
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`
}

/** "9:42 pm" — tells apart several pages from one day. Local clock; only ever rendered client-side. */
export function formatTime(iso: string): string {
  const d = new Date(iso)
  const h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h % 12 || 12}:${m} ${h < 12 ? 'am' : 'pm'}`
}

/** The user's local calendar day as "YYYY-MM-DD" — what a page is filed under. */
export function todayISODate(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** "YYYY-MM-DD" from a stored entry date. */
export function entryISODate(iso: string): string {
  return iso.slice(0, 10)
}
