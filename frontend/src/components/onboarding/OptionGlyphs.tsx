// Small hand-drawn glyphs for onboarding option cards. Plain arithmetic + .toFixed only —
// no Math.sin/random — so server and client render the same path (coding-rules.md, SSR safety).

/** An ink jar filled to `level` of 5 — energy without a number or a battery icon. */
export function EnergyJar({ level }: { level: number }) {
  const top = 23 - (level / 5) * 14
  const fill = `M6.6 ${top.toFixed(2)} Q12 ${(top - 1.2).toFixed(2)} 17.4 ${top.toFixed(2)} L17.2 22.6 Q12 24.2 6.8 22.6 Z`
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={fill} fill="var(--accent-soft)" stroke="none" />
      <path d="M8 4.5h8M8.6 4.6 8 8.2C6.2 9 5.6 10.4 5.7 12.6l.5 10.2c.1 1.3 1 2.1 2.3 2.2 2.4.2 4.6.2 7 0 1.3-.1 2.2-.9 2.3-2.2l.5-10.2c.1-2.2-.5-3.6-2.3-4.4l-.6-3.6" />
    </svg>
  )
}
