export interface Alert {
  id: string
  device_id: string
  type: string
  severity: 'high' | 'medium' | 'low'
  message: string
  triggered_at: string
  resolved_at: string | null
  acknowledged: boolean
} 