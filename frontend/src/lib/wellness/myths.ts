// Myths vs facts (roadmap 6.22–6.24). The first three pairs are from screens-wellness.jsx; the
// rest were added for Phase 6. Every fact names its source. Sources were checked 2026-10-22;
// links are given only where the exact page was confirmed. Facts never say "should".

export interface Source {
  label: string
  url?:  string
}

export interface MythFact {
  id:      string
  myth:    string
  fact:    string
  sources: Source[]
}

const BULL_2019: Source = {
  label: 'Bull et al., "Real-world menstrual cycle characteristics of more than 600,000 menstrual cycles", npj Digital Medicine (2019)',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6710244/',
}
const WILCOX_2000: Source = {
  label: 'Wilcox, Dunson & Baird, "The timing of the fertile window in the menstrual cycle", BMJ (2000)',
  url: 'https://pubmed.ncbi.nlm.nih.gov/11082086/',
}
const OWH_PMS: Source = { label: 'Office on Women\'s Health (US HHS) — Premenstrual syndrome (PMS)' }

export const MYTHS: MythFact[] = [
  {
    id: 'same-energy',
    myth: 'You should be productive all month — same energy, same output.',
    fact: 'Energy and focus shift across the month. Planning around that is wisdom, not weakness.',
    sources: [{ label: 'Office on Women\'s Health (US HHS) — Your menstrual cycle' }],
  },
  {
    id: 'push-through',
    myth: 'Cramps are just something to push through quietly.',
    fact: 'Period pain is real pain. Heat helps many people about as well as pain relief does — and pain that stops your everyday life is worth taking to a doctor.',
    sources: [
      { label: 'Jo & Lee, "Heat therapy for primary dysmenorrhea", Scientific Reports (2018)', url: 'https://www.nature.com/articles/s41598-018-34303-z' },
      { label: 'NICE guideline NG73 — Endometriosis: diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng73' },
    ],
  },
  {
    id: 'pms-flaw',
    myth: 'PMS is a personality flaw.',
    fact: 'Your hormones change, and most people who have periods notice something before one. You\'re not "too much" — you\'re a person on a Tuesday in your luteal phase.',
    sources: [OWH_PMS],
  },
  {
    id: 'clockwork',
    myth: 'A normal cycle is 28 days, like clockwork.',
    fact: 'Only a small share of cycles are exactly 28 days. Longer or shorter is common, and a few days\' wobble from month to month is ordinary.',
    sources: [BULL_2019],
  },
  {
    id: 'day-14',
    myth: 'Ovulation always happens on day 14.',
    fact: 'It moves. The fertile window lands on quite different days, even in regular cycles — which is why the phases here are gentle estimates, not a schedule.',
    sources: [WILCOX_2000, BULL_2019],
  },
  {
    id: 'no-exercise',
    myth: 'You shouldn\'t exercise on your period.',
    fact: 'Moving is generally fine, and regular exercise may ease period pain for some people. Resting is fine too — go by how you feel.',
    sources: [{ label: 'Armour et al., "Exercise for dysmenorrhoea", Cochrane Database of Systematic Reviews (2019)', url: 'https://www.cochrane.org/evidence/CD004142' }],
  },
  {
    id: 'phase-training',
    myth: 'You have to train differently in every phase to see results.',
    fact: 'Studies find at most small, inconsistent differences in performance across the cycle. How you feel on the day is a better guide than the calendar.',
    sources: [{ label: 'McNulty et al., "The effects of menstrual cycle phase on exercise performance in eumenorrheic women", Sports Medicine (2020)', url: 'https://doi.org/10.1007/s40279-020-01319-3' }],
  },
  {
    id: 'period-pregnancy',
    myth: 'You can\'t get pregnant during your period.',
    fact: 'It\'s less likely, but possible. Ovulation can come early, and sperm can survive for several days.',
    sources: [WILCOX_2000],
  },
  {
    id: 'syncing',
    myth: 'Living together makes periods sync up.',
    fact: 'Careful studies haven\'t found real syncing. Cycles vary, so overlaps happen by chance — and then they drift apart again.',
    sources: [{ label: 'Yang & Schank, "Women do not synchronize their menstrual cycles", Human Nature (2006)' }],
  },
  {
    id: 'pmdd',
    myth: 'Very low moods before a period are just bad PMS you have to live with.',
    fact: 'When premenstrual changes are intense enough to upend your life, it may be PMDD — a recognised condition that doctors can help with.',
    sources: [{ label: 'Office on Women\'s Health (US HHS) — Premenstrual dysphoric disorder (PMDD)' }],
  },
  {
    id: 'heavy-normal',
    myth: 'Heavy periods are fine if they\'ve always been that way.',
    fact: 'Bleeding through protection, or changing it every hour or two, can wear down iron and leave you tired. It\'s worth mentioning to a doctor, even if it feels familiar.',
    sources: [{ label: 'NHS — Heavy periods' }],
  },
  {
    id: 'cravings',
    myth: 'Cravings before a period mean you lack willpower.',
    fact: 'Appetite and cravings often change in the days before a period. Noticing it is useful information, not a test you\'re failing.',
    sources: [OWH_PMS],
  },
  {
    id: 'irregular',
    myth: 'An irregular cycle always means something is wrong.',
    fact: 'Stress, sleep, illness, travel and age all nudge cycles around. Big or lasting changes are worth checking; the odd unusual month usually isn\'t a worry.',
    sources: [{ label: 'NHS — Irregular periods' }, BULL_2019],
  },
]
