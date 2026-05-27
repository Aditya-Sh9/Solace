import type { CheckInSnapshot, ProfileSnapshot, RuleEngineResult } from './types'
import { ironRule, vitaminDRule, magnesiumRule, b12Rule, vitaminCRule } from './rules/deficiency'
import { sleepDebtRule, dehydrationRule, sedentaryRule } from './rules/lifestyle'
import { sustainedStressRule } from './rules/stress'

export function runRuleEngine(
  profile: ProfileSnapshot,
  checkIns: CheckInSnapshot[],
): RuleEngineResult {
  if (checkIns.length === 0) {
    return { flags: [], profile, summary: 'No check-in data available.' }
  }

  const rules = [
    ironRule,
    vitaminDRule,
    magnesiumRule,
    b12Rule,
    vitaminCRule,
    sleepDebtRule,
    dehydrationRule,
    sedentaryRule,
    sustainedStressRule,
  ]

  const flags = rules
    .map(rule => rule(profile, checkIns))
    .filter((f): f is NonNullable<typeof f> => f !== null)
    // Confidence gate: require at least 2 pieces of evidence
    .filter(f => f.evidence.length >= 2)

  const summary = flags.length === 0
    ? `No strong patterns detected across ${checkIns.length} check-ins.`
    : `Detected ${flags.length} pattern(s): ${flags.map(f => f.id).join(', ')} across ${checkIns.length} check-ins.`

  return { flags, profile, summary }
}

export type { CheckInSnapshot, ProfileSnapshot, RuleEngineResult, Flag, FlagId } from './types'
