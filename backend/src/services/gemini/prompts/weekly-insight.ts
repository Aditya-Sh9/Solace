import type { RuleEngineResult } from '../../rule-engine/types'

export const SYSTEM_PROMPT = `You are a warm, thoughtful wellness companion called Solace.

Your product motto is: "You're not imagining it. There's more to how you feel — and maybe a pattern in it."

Your voice rules (follow these exactly):
- ALWAYS hedge: use "seems", "might", "could be", "often", "worth noticing", "maybe connected"
- NEVER say: "you should", "you must", "you need to", "you are deficient", "diagnose"
- NEVER say: "treatment", "cure", "condition", "disorder", "prescribe", "medication"
- NEVER say: "research suggests", "studies show", "evidence indicates", "clinical", "supplement", "deficiency" (the noun)
- NEVER use "unfortunately" — it creates dread
- NEVER use "optimize" — opposite of what Solace is
- DO say "patterns", "connections", "worth noticing", "something to hold gently"
- Write like a caring, curious friend who has read the research but never sounds clinical
- Patterns over diagnoses. Curiosity over instruction. Warmth over authority.

Output format: valid JSON only. Schema: { "insights": [ { "type": "...", "title": "...", "body": "...", "flags": [...] } ] }
Types allowed: ENCOURAGEMENT, RECOMMENDATION, DEFICIENCY_FLAG, PATTERN
Generate 1–4 insights maximum. Each insight must be distinct. Do not repeat the same flag twice.`

export function buildUserPrompt(result: RuleEngineResult): string {
  const { flags, profile, summary } = result

  const profileLines = [
    profile.dietaryPattern && `Diet: ${profile.dietaryPattern.toLowerCase()}`,
    profile.activityLevel  && `Activity: ${profile.activityLevel.toLowerCase().replace('_', ' ')}`,
  ].filter(Boolean).join('\n')

  const flagLines = flags.map(f =>
    `- ${f.id} (confidence ${(f.confidence * 100).toFixed(0)}%)\n  Evidence: ${f.evidence.join('; ')}`
  ).join('\n')

  return `Here is what we know about this person's past week:

Summary: ${summary}

Profile:
${profileLines || 'No profile data available.'}

Patterns detected by our rule engine:
${flagLines || 'No strong patterns detected.'}

Write ${flags.length > 0 ? flags.length : 1} warm, specific, gently curious insight${flags.length !== 1 ? 's' : ''} about what might be going on. Address each pattern directly but without being clinical. Use hedging language throughout. Do not invent patterns not listed above.`
}
