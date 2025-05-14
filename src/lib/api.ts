import { devices, metrics, alerts } from './mock-data'
import { Device } from '../types/device'
import { Metrics } from '../types/metrics'
import { Alert } from '../types/alert'

export async function getDevices(): Promise<Device[]> {
  return devices
}

export async function getDeviceById(id: string): Promise<Device | undefined> {
  return devices.find(device => device.id === id)
}

export async function getMetricsByDeviceId(deviceId: string): Promise<Metrics | undefined> {
  return metrics.find(m => m.device_id === deviceId)
}

export async function getAlerts(): Promise<Alert[]> {
  return alerts
}

export async function getOverview() {
  const total = devices.length
  const online = devices.filter(d => d.status === 'up').length
  const offline = devices.filter(d => d.status === 'down').length
  const flapping = devices.filter(d => d.status === 'flapping').length
  return { total, online, offline, flapping }
} 