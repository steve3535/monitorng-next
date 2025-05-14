export interface Device {
  id: string
  name: string
  type: 'TPE' | 'GAB'
  ip_address: string
  location: string
  region: string
  coordinates: [number, number]
  status: 'up' | 'down' | 'flapping'
  last_ping: string
  response_time: number | null
  uptime_24h: number
  last_success?: string
} 