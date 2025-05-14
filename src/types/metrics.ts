export interface Metrics {
  device_id: string
  timestamps: string[]
  response_times: Array<number | null>
  statuses: Array<'up' | 'down' | 'flapping'>
} 