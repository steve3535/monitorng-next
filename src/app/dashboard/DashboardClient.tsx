'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { Device } from '../../types/device'
import dynamic from 'next/dynamic'
import { Pie } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
Chart.register(ArcElement, Tooltip, Legend)

const DeviceMap = dynamic(() => import('./DeviceMap'), { ssr: false })

interface DashboardClientProps {
  devices: Device[]
}

type SortKey = 'name' | 'status' | 'type'
type SortOrder = 'asc' | 'desc'

function getStatusLabel(status: string) {
  if (status?.toUpperCase() === 'UP') return 'En ligne'
  if (status?.toUpperCase() === 'DOWN') return 'Hors ligne'
  if (status?.toUpperCase() === 'FLAPPING') return 'Instable'
  return status || 'Inconnu'
}

function getStatusColor(status: string) {
  if (status?.toUpperCase() === 'UP') return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
  if (status?.toUpperCase() === 'DOWN') return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
  if (status?.toUpperCase() === 'FLAPPING') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
}

function formatDate(date?: string) {
  if (!date) return '—'
  const d = new Date(date)
  return isNaN(d.getTime()) ? '—' : d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

const statusOrder = { 'UP': 1, 'FLAPPING': 2, 'DOWN': 3 }

export function DashboardClient({ devices: initialDevices }: DashboardClientProps) {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table' | 'map'>('table')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

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

  const filtered = useMemo(() =>
    devices.filter(d =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.ip_address?.includes(search)
    ), [devices, search])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      if (sortKey === 'name') {
        const cmp = (a.name || '').localeCompare(b.name || '', 'fr', { sensitivity: 'base' })
        return sortOrder === 'asc' ? cmp : -cmp
      }
      if (sortKey === 'status') {
        const aVal = statusOrder[a.status?.toUpperCase() as keyof typeof statusOrder] || 99
        const bVal = statusOrder[b.status?.toUpperCase() as keyof typeof statusOrder] || 99
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      if (sortKey === 'type') {
        const cmp = (a.type || '').localeCompare(b.type || '', 'fr', { sensitivity: 'base' })
        return sortOrder === 'asc' ? cmp : -cmp
      }
      return 0
    })
    return arr
  }, [filtered, sortKey, sortOrder])

  const stats = useMemo(() => {
    const up = devices.filter(d => d.status?.toUpperCase() === 'UP').length
    const down = devices.filter(d => d.status?.toUpperCase() === 'DOWN').length
    const flapping = devices.filter(d => d.status?.toUpperCase() === 'FLAPPING').length
    return { up, down, flapping }
  }, [devices])

  const pieData = useMemo(() => ({
    labels: ['En ligne', 'Hors ligne', 'Instable'],
    datasets: [
      {
        data: [stats.up, stats.down, stats.flapping],
        backgroundColor: [
          '#22c55e', // green-500
          '#ef4444', // red-500
          '#eab308'  // yellow-500
        ],
        borderColor: [
          '#14532d', // green-900
          '#7f1d1d', // red-900
          '#78350f'  // yellow-900
        ],
        borderWidth: 2
      }
    ]
  }), [stats])

  const pieLegend = [
    { label: 'En ligne', color: 'bg-green-500' },
    { label: 'Hors ligne', color: 'bg-red-500' },
    { label: 'Instable', color: 'bg-yellow-500' }
  ]

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortOrder(order => order === 'asc' ? 'desc' : 'asc')
    else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-background">
        <div className="text-2xl font-bold tracking-tight">Monitoring réseau monétique</div>
        <ThemeToggle />
      </header>
      {/* Navbar */}
      <nav className="px-6 py-2 border-b border-zinc-200 dark:border-zinc-700 bg-background text-sm flex gap-4">
        <span className="font-semibold text-primary">Dashboard</span>
        <span className="text-zinc-400">|</span>
        <span className="text-zinc-500">Rapports</span>
        <span className="text-zinc-400">|</span>
        <span className="text-zinc-500">Alertes</span>
      </nav>
      {/* Main split */}
      <main className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-6">
        {/* Left: Table/Map */}
        <section className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <button
              className={`px-3 py-1 rounded-l border cursor-pointer ${view === 'table' ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
              onClick={() => setView('table')}
            >Table</button>
            <button
              className={`px-3 py-1 rounded-r border-l-0 border cursor-pointer ${view === 'map' ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
              onClick={() => setView('map')}
            >Carte</button>
            <input
              className="ml-auto px-2 py-1 rounded border bg-background text-foreground w-48"
              placeholder="Recherche nom ou IP..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {hasError && (
            <div className="mb-2 text-red-600 text-sm">Erreur lors du chargement des données.</div>
          )}
          {isLoading && (
            <div className="mb-2 text-zinc-500 text-sm">Rafraîchissement des données…</div>
          )}
          {view === 'table' ? (
            <div className="overflow-x-auto rounded shadow border border-zinc-200 dark:border-zinc-700 bg-background">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-100 dark:bg-zinc-800">
                  <tr>
                    <th className="px-3 py-2 text-left whitespace-nowrap cursor-pointer select-none" onClick={() => handleSort('name')}>
                      Nom
                      <span className="inline-block ml-1 align-middle">
                        {sortKey === 'name' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </span>
                    </th>
                    <th className="px-3 py-2 text-left whitespace-nowrap cursor-pointer select-none" onClick={() => handleSort('type')}>
                      Type
                      <span className="inline-block ml-1 align-middle">
                        {sortKey === 'type' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </span>
                    </th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">IP</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap cursor-pointer select-none" onClick={() => handleSort('status')}>
                      Statut
                      <span className="inline-block ml-1 align-middle">
                        {sortKey === 'status' ? (
                          sortOrder === 'asc' ? <ArrowUp className="w-4 h-4 text-primary" /> : <ArrowDown className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </span>
                    </th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Dernier contact OK</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(device => (
                    <tr key={device.id} className="border-t border-zinc-200 dark:border-zinc-700">
                      <td className="px-3 py-2 font-medium whitespace-nowrap">{device.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{device.type}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{device.ip_address}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(device.status)}`}>{getStatusLabel(device.status)}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatDate(device.last_success)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Suspense fallback={<div className="h-[500px] flex items-center justify-center">Chargement de la carte…</div>}>
              <DeviceMap devices={sorted} />
            </Suspense>
          )}
        </section>
        {/* Right: Stats */}
        <aside className="w-full md:w-1/3 flex-shrink-0 bg-zinc-50 dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col gap-6">
          <div>
            <div className="text-lg font-bold mb-1">Statistiques</div>
            <div className="flex gap-4 text-sm items-center">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> {stats.up} en ligne</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> {stats.down} hors ligne</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> {stats.flapping} instables</span>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1 text-sm">Hors ligne :</div>
            <ul className="text-xs text-red-600 space-y-1">
              {devices.filter(d => d.status?.toUpperCase() === 'DOWN').map(d => (
                <li key={d.id}>{d.name} ({d.ip_address})</li>
              ))}
              {devices.filter(d => d.status?.toUpperCase() === 'DOWN').length === 0 && <li className="text-zinc-400">Aucun</li>}
            </ul>
          </div>
          <div className="mt-2">
            <div className="font-semibold text-sm mb-1">Répartition</div>
            <div className="w-full h-48 flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded">
              <Pie data={pieData} options={{
                plugins: {
                  legend: { display: false },
                },
                maintainAspectRatio: false
              }} />
              <div className="flex gap-4 mt-2">
                {pieLegend.map(l => (
                  <span key={l.label} className="flex items-center gap-1 text-xs">
                    <span className={`w-3 h-3 rounded-full inline-block ${l.color}`}></span>
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
} 