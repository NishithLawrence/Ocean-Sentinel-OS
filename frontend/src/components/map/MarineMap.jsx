import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import EmptyState from '../common/EmptyState.jsx'

function FitBounds({ reefs }) {
  const map = useMap()
  const points = useMemo(
    () => reefs.filter((r) => r.latitude != null && r.longitude != null).map((r) => [r.latitude, r.longitude]),
    [reefs],
  )
  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView(points[0], 6)
      return
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 8 })
  }, [map, points])
  return null
}

function reefIcon(health) {
  const color = health >= 70 ? '#34d399' : health >= 40 ? '#fbbf24' : '#fb7185'
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,.85);box-shadow:0 0 14px ${color}88"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export default function MarineMap({ reefs = [], height = 'h-80', onSelectReef, selectedReefId }) {
  const validReefs = reefs.filter((r) => r.latitude != null && r.longitude != null)

  if (validReefs.length === 0) {
    return (
      <EmptyState
        title="No reef coordinates"
        description="Reef markers appear once latitude and longitude are recorded."
      />
    )
  }

  const center = [validReefs[0].latitude, validReefs[0].longitude]

  return (
    <div className={`${height} overflow-hidden rounded-2xl border border-cyan-100/10 [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:rounded-2xl [&_.leaflet-container]:bg-[#041426]`}>
      <MapContainer center={center} zoom={3} scrollWheelZoom={false} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds reefs={validReefs} />
        {validReefs.map((reef) => (
          <Marker
            key={reef.id}
            position={[reef.latitude, reef.longitude]}
            icon={reefIcon(reef.coral_health ?? 50)}
            eventHandlers={{
              click: () => {
                if (onSelectReef) onSelectReef(reef)
              },
            }}
          >
            <Popup>
              <div className="min-w-40 text-sm">
                <p className="font-semibold text-slate-900">{reef.reef_name}</p>
                <p className="text-slate-600">{reef.country}</p>
                <p className="mt-1 text-slate-700">Health: {reef.coral_health}%</p>
                <div className="mt-2 flex flex-col gap-1">
                  {onSelectReef && (
                    <button
                      type="button"
                      onClick={() => onSelectReef(reef)}
                      className="text-left font-medium text-cyan-700 hover:underline"
                    >
                      Select Reef AI Assessment
                    </button>
                  )}
                  <Link to={`/reef/${reef.id}`} className="text-slate-600 underline">
                    View full details
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

