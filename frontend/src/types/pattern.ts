export interface PatternEntry {
  feature:   string
  target:    'mood' | 'energy'
  direction: 'positive' | 'negative'
  copy:      string
}

export interface PatternPrediction {
  mood:   'lower' | 'steady' | 'brighter'
  energy: 'lower' | 'steady' | 'brighter'
}

// Shape returned by GET /api/patterns when trained:true and confidence ≥ 0.3
export interface PatternsDataTrained {
  trained:    true
  confidence: string   // "there might be a pattern here" | "worth noticing"
  n_samples:  number
  prediction: PatternPrediction | null
  patterns:   PatternEntry[]
}

// Shape returned when trained:false (fewer than 14 check-ins)
export interface PatternsDataLearning {
  trained:    false
  confidence: 'still learning'
  n_samples:  number
  prediction: null
  patterns:   []
}

export type PatternsData = PatternsDataTrained | PatternsDataLearning
