// Disclaimer: one-time header on /insights page only (per plan decision)
// Built from inferred design language — no screens-insights.jsx reference exists.
// See frontend/design-reference/MISSING_REFERENCES.md
export default function InsightsHeader() {
  return (
    <div style={{ marginBottom: 32 }}>
      <h1 className="serif" style={{
        fontSize: 36,
        fontWeight: 400,
        margin: '0 0 10px',
        color: 'var(--ink)',
        lineHeight: 1.1,
      }}>
        Your patterns, so far.
      </h1>
      <p className="hand" style={{
        fontFamily: 'var(--font-hand)',
        fontSize: 17,
        color: 'var(--ink-muted)',
        fontStyle: 'italic',
        margin: 0,
        lineHeight: 1.5,
      }}>
        These are gentle observations, not medical advice.{' '}
        Always trust your own body first.
      </p>
    </div>
  )
}
