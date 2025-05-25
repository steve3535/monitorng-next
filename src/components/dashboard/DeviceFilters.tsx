interface DeviceFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  view: 'table' | 'map'
  onViewChange: (view: 'table' | 'map') => void
}

export function DeviceFilters({ search, onSearchChange, view, onViewChange }: DeviceFiltersProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <button
        className={`px-3 py-1 rounded-l border cursor-pointer ${view === 'table' ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
        onClick={() => onViewChange('table')}
      >
        Table
      </button>
      <button
        className={`px-3 py-1 rounded-r border-l-0 border cursor-pointer ${view === 'map' ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}
        onClick={() => onViewChange('map')}
      >
        Carte
      </button>
      <input
        className="ml-auto px-2 py-1 rounded border bg-background text-foreground w-48"
        placeholder="Recherche nom ou IP..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
    </div>
  )
} 