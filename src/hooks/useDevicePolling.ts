'use client'

import { useState, useEffect } from 'react'
import { Device } from '../types/device'

export function useDevicePolling(initialDevices: Device[]) {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Polling toutes les 60s
  useEffect(() => {
    let isMounted = true
    
    async function fetchDevices() {
      setIsLoading(true)
      setHasError(false)
      try {
        const res = await fetch('/api/devices', {
          cache: 'no-store'
        })
        if (!res.ok) throw new Error('Failed to fetch devices')
        const data = await res.json()
        if (isMounted && data.devices) setDevices(data.devices)
      } catch {
        if (isMounted) setHasError(true)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    const interval = setInterval(fetchDevices, 60000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return { devices, isLoading, hasError }
} 