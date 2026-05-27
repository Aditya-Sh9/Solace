export type InsightType = 'ENCOURAGEMENT' | 'RECOMMENDATION' | 'DEFICIENCY_FLAG' | 'PATTERN'

export interface Insight {
  id:        string
  userId:    string
  checkInId: string | null
  type:      InsightType
  title:     string
  body:      string
  flags:     string[]
  createdAt: string
}

export interface RefreshResponse {
  insights:  Insight[]
  generated: 'gemini' | 'fallback'
}
