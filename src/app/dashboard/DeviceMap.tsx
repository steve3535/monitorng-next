import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import type { Device } from '../../types/device'

const statusColor: Record<string, string> = {
  up: 'green',
  down: 'red',
  flapping: 'orange',
  UP: 'green',
  DOWN: 'red',
  FLAPPING: 'orange'
}

function getMarkerIcon(status: Device['status'] | string) {
  const glow: Record<string, string> = {
    up: '0 0 12px 4px #22c55e',
    down: '0 0 12px 4px #ef4444',
    flapping: '0 0 12px 4px #eab308',
    UP: '0 0 12px 4px #22c55e',
    DOWN: '0 0 12px 4px #ef4444',
    FLAPPING: '0 0 12px 4px #eab308'
  }
  const key = (status || '').toString()
  return L.divIcon({
    className: '',
    html: `<span style="display:inline-block;width:10px;height:10px;background:${statusColor[key] || 'gray'};border-radius:50%;border:1.5px solid #fff;box-shadow:${glow[key] || 'none'};"></span>`
  })
}

// Dispersion légère autour de Lomé
function getCoords(device: Device): [number, number] {
  if (device.coordinates && device.coordinates.length === 2) return device.coordinates
  // Génère un point aléatoire dans Lomé (zone urbaine)
  const lat = 6.10 + Math.random() * 0.08 // 6.10 à 6.18
  const lng = 1.18 + Math.random() * 0.08 // 1.18 à 1.26
  return [lat, lng]
}

export default function DeviceMap({ devices }: { devices: Device[] }) {
  // Centre sur Lomé
  const center: [number, number] = [6.1319, 1.2228]
  return (
    <div className="w-full h-[500px] md:h-[650px] rounded-lg overflow-hidden shadow border border-zinc-200 dark:border-zinc-700">
      <MapContainer
        center={center}
        zoom={12}
        minZoom={10}
        maxZoom={16}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {devices.map((device) => (
          <Marker
            key={device.id}
            position={getCoords(device)}
            icon={getMarkerIcon(device.status)}
          >
            <Popup>
              <div className="font-semibold mb-1">{device.name}</div>
              <div className="text-xs text-zinc-700 dark:text-zinc-200">IP: {device.ip_address}</div>
              <div className="text-xs">Statut: <span className={`font-bold ${device.status === 'up' ? 'text-green-600' : device.status === 'down' ? 'text-red-600' : 'text-yellow-600'}`}>{device.status}</span></div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 