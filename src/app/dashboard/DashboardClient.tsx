'use client'

import { useState, useMemo, Suspense } from 'react'
import { Device } from '../../types/device'
import dynamic from 'next/dynamic'
import { ModernPieChart } from '../../components/dashboard/ModernPieChart'
import { ThemeToggle } from '../../components/ThemeToggle'
import { LogoutButton } from '../../components/LogoutButton'
import { DeviceFilters } from '../../components/dashboard/DeviceFilters'
import { useDevicePolling } from '../../hooks/useDevicePolling'
import { ArrowUp, ArrowDown, ChevronsUpDown, HeartPulse, AlertTriangle } from 'lucide-react'

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

function StatusIndicator({ status }: { status: string }) {
  if (status?.toUpperCase() === 'UP') {
    return (
      <span className="flex items-center gap-1 text-green-700">
        <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
        <HeartPulse className="w-4 h-4 inline-block" />
        <span>En ligne</span>
      </span>
    )
  }
  if (status?.toUpperCase() === 'DOWN') {
    return (
      <span className="flex items-center gap-1 text-red-700">
        <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
        <AlertTriangle className="w-4 h-4 inline-block" />
        <span>Hors ligne</span>
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-yellow-700">
      <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
      <HeartPulse className="w-4 h-4 inline-block" />
      <span>Instable</span>
    </span>
  )
}

export function DashboardClient({ devices: initialDevices }: DashboardClientProps) {
  const { devices, isLoading, hasError } = useDevicePolling(initialDevices)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table' | 'map'>('table')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // Identify backbone lines by name
  const fibre = devices.find(d => d.name?.toLowerCase().includes('fibre'))
  const blr = devices.find(d => d.name?.toLowerCase().includes('yas togo'))

  // Exclude backbone lines from the main table
  const filtered = useMemo(() =>
    devices.filter(d =>
      !d.name?.toLowerCase().includes('fibre') &&
      !d.name?.toLowerCase().includes('blr') &&
      (d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.ip_address?.includes(search))
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
        <div className="flex items-center gap-4">
          <LogoutButton />
          <ThemeToggle />
        </div>
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
          <DeviceFilters
            search={search}
            onSearchChange={setSearch}
            view={view}
            onViewChange={setView}
          />
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
        <aside className="w-full md:w-1/3 flex-shrink-0 space-y-6">
          {/* Quick Stats */}
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="text-lg font-bold mb-3">Statistiques</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>{stats.up} en ligne</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>{stats.down} hors ligne</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>{stats.flapping} instable(s)</span>
              </span>
            </div>
          </div>

          {/* Backbone Links Section */}
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="font-semibold mb-3 text-sm">Liaisons backbone :</div>
            <ul className="text-xs space-y-2">
              <li className="flex gap-4 items-center">
                <span className="font-bold text-blue-700 min-w-[220px]">LIAISON BACKBONE PRINCIPALE</span>
                <div className="flex items-center gap-1 min-w-[120px]">
                  <StatusIndicator status={fibre?.status || ''} />
                </div>
              </li>
              <li className="flex gap-4 items-center">
                <span className="font-bold text-purple-700 min-w-[220px]">LIAISON BACKBONE SECONDAIRE</span>
                <div className="flex items-center gap-1 min-w-[120px]">
                  <StatusIndicator status={blr?.status || ''} />
                </div>
              </li>
            </ul>
          </div>

          {/* Modern Pie Chart */}
          <ModernPieChart data={stats} />
        </aside>
      </main>
    </div>
  )
} 