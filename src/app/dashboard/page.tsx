import { Device } from '../../types/device'
import { DashboardClient } from './DashboardClient'

async function fetchDevices(): Promise<Device[]> {
  const res = await fetch('https://monitor.linkafric.com/api/devices', {
    headers: { 'x-api-key': 'P@ssNtc202!' },
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to fetch devices')
  const data = await res.json()
  return data.devices
}

export default async function Page() {
  const devices = await fetchDevices()
  return <DashboardClient devices={devices} />
} 