import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { TYPE_COLORS, TYPE_BG, TYPE_TEXT } from '../data/plantData';

// Fix default leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── Create custom colored marker ─────────────────────────
function createMarkerIcon(type, capacity, isSelected, isNearest) {
  const color = TYPE_COLORS[type] || '#6b7280';
  const size  = Math.max(28, Math.min(48, 24 + capacity / 5));
  const border = isSelected ? '3px solid #fff' : isNearest ? '3px solid #10b981' : '2px solid rgba(255,255,255,0.8)';
  const shadow = isSelected ? `0 0 0 4px ${color}55, 0 4px 12px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.2)';
  const scale  = isSelected ? 1.2 : 1;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg) scale(${scale});
        border: ${border};
        box-shadow: ${shadow};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
      ">
        <span style="transform: rotate(45deg); font-size: ${size * 0.4}px; line-height: 1;">
          ${type === 'Biogas' ? '🔥' : type === 'Biochar' ? '⚗️' : type === 'Biomass' ? '⚡' : '🌱'}
        </span>
      </div>
      ${isNearest ? `<div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:#10b981;color:white;font-size:9px;font-weight:700;padding:2px 6px;border-radius:10px;white-space:nowrap;">NEAREST</div>` : ''}
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// ── Map controller — flies to selected plant ──────────────
function MapController({ selectedPlant }) {
  const map = useMap();
  useEffect(() => {
    if (selectedPlant) {
      map.flyTo([selectedPlant.lat, selectedPlant.lng], 13, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedPlant, map]);
  return null;
}

// ── Main MapView ──────────────────────────────────────────
export default function MapView({
  plants,
  selectedPlant,
  nearestPlant,
  onMarkerClick,
  userLocation,
}) {
  const center = [19.0, 76.0]; // Maharashtra center

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={7}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedPlant={selectedPlant} />

        {/* Route line from user to selected plant */}
        {userLocation && selectedPlant && (
          <Polyline
            positions={[
              [userLocation.lat, userLocation.lng],
              [selectedPlant.lat, selectedPlant.lng],
            ]}
            color="#2C5F2D"
            weight={3}
            dashArray="8, 6"
            opacity={0.8}
          />
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: '',
              html: `<div style="width:16px;height:16px;background:#2563eb;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px #2563eb55;"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup><strong>📍 Your Location</strong></Popup>
          </Marker>
        )}

        {/* Plant markers */}
        {plants.map(plant => (
          <Marker
            key={plant.id}
            position={[plant.lat, plant.lng]}
            icon={createMarkerIcon(
              plant.type,
              plant.capacity,
              selectedPlant?.id === plant.id,
              nearestPlant?.id === plant.id
            )}
            eventHandlers={{
              click: () => onMarkerClick(plant),
            }}
          >
            <Popup maxWidth={260}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", minWidth: 220 }}>
                {/* Header */}
                <div style={{
                  background: TYPE_COLORS[plant.type],
                  margin: '-12px -12px 12px -12px',
                  padding: '12px 14px',
                  borderRadius: '8px 8px 0 0',
                }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{plant.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', marginTop: 2 }}>{plant.city}, {plant.state}</div>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#6b7280' }}>Type</span>
                    <span style={{
                      background: TYPE_BG[plant.type],
                      color: TYPE_TEXT[plant.type],
                      padding: '1px 8px',
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}>{plant.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#6b7280' }}>Capacity</span>
                    <strong>{plant.capacity}T/day</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#6b7280' }}>Distance</span>
                    <strong>{plant.distance} km</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#6b7280' }}>Hours</span>
                    <strong>{plant.operatingHours}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#6b7280' }}>Rating</span>
                    <strong style={{ color: '#f59e0b' }}>{'★'.repeat(Math.floor(plant.rating))} {plant.rating}</strong>
                  </div>
                  {plant.certified && (
                    <div style={{ marginTop: 4, background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>
                      ✅ Certified Facility
                    </div>
                  )}
                  <a href={`tel:${plant.phone}`} style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#2C5F2D',
                    color: 'white',
                    padding: '6px',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginTop: 4,
                  }}>
                    📞 {plant.phone}
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        right: 12,
        background: 'white',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        fontSize: '0.75rem',
      }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: '#374151' }}>Legend</div>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ color: '#6b7280' }}>{type}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, borderTop: '1px solid #e5e7eb', paddingTop: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
          <span style={{ color: '#6b7280' }}>You</span>
        </div>
      </div>
    </div>
  );
}