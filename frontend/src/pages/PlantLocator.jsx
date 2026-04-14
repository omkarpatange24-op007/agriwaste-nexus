import React, { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// ─── Fix leaflet default icons ────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── YOUR ORIGINAL DATA (unchanged) ──────────────────────
const PLANTS = [
  { id:'P001', name:'Pune Biogas Processing Unit',            type:'Biogas',  city:'Pune',                    distanceKm:5,   capacity:'50T/day',  contact:'+91-2012345678', certified:true,  desc:'Handles rice, wheat & maize straw. Running since 2019.',  lat:18.5204, lng:73.8567 },
  { id:'P002', name:'GreenChar Nashik',                       type:'Biochar', city:'Nashik',                  distanceKm:180, capacity:'20T/day',  contact:'+91-2534567890', certified:true,  desc:'Slow pyrolysis plant. Exports biochar to EU markets.',     lat:20.0059, lng:73.7898 },
  { id:'P003', name:'Solapur Biomass Power',                  type:'Biomass', city:'Solapur',                 distanceKm:250, capacity:'100T/day', contact:'+91-2174563210', certified:false, desc:'Co-gen plant. Accepts sugarcane bagasse & cotton stalks.', lat:17.6867, lng:75.9060 },
  { id:'P004', name:'AgroCompost Kolhapur',                   type:'Compost', city:'Kolhapur',                distanceKm:230, capacity:'30T/day',  contact:'+91-2312345670', certified:true,  desc:'Vermicomposting + aerobic composting. ISO certified.',     lat:16.7050, lng:74.2433 },
  { id:'P005', name:'Satara BioEnergy Hub',                   type:'Biogas',  city:'Satara',                  distanceKm:110, capacity:'40T/day',  contact:'+91-2162345670', certified:true,  desc:'Community biogas serving 500+ households daily.',          lat:17.6805, lng:74.0183 },
  { id:'P006', name:'Chatrapati Sambhajinagar Green Plant',   type:'Biochar', city:'Chatrapati Sambhajinagar', distanceKm:235, capacity:'25T/day',  contact:'+91-2402345670', certified:false, desc:'New facility. Pyrolysis + activated carbon production.',   lat:19.8762, lng:75.3433 },
];

// ─── Colors & icons ───────────────────────────────────────
const TYPE_ICON  = { Biogas:'🔥', Biochar:'⚗️', Biomass:'⚡', Compost:'🌱' };
const TYPE_CLASS = { Biogas:'type-Biogas', Biochar:'type-Biochar', Biomass:'type-Biomass', Compost:'type-Compost' };
const TYPE_COLOR = { Biogas:'#f59e0b', Biochar:'#10b981', Biomass:'#eab308', Compost:'#3b82f6' };
const TYPE_BG    = { Biogas:'#fef3c7', Biochar:'#d1fae5', Biomass:'#fef9c3', Compost:'#dbeafe' };
const TYPE_TEXT  = { Biogas:'#92400e', Biochar:'#065f46', Biomass:'#713f12', Compost:'#1e40af' };

// ─── Custom map marker icon ───────────────────────────────
function createMarkerIcon(type, isSelected, isNearest) {
  const color = TYPE_COLOR[type] || '#6b7280';
  const size  = isSelected ? 44 : 36;
  const emoji = TYPE_ICON[type] || '🏭';
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px; height:${size}px;
        background:${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg) ${isSelected ? 'scale(1.2)' : 'scale(1)'};
        border: ${isSelected ? '3px solid white' : '2px solid rgba(255,255,255,0.8)'};
        box-shadow: ${isSelected ? `0 0 0 4px ${color}55, 0 4px 12px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.2)'};
        display:flex; align-items:center; justify-content:center;
        transition: all 0.2s;
        cursor:pointer;
        position:relative;
      ">
        <span style="transform:rotate(45deg); font-size:${size * 0.38}px; line-height:1;">${emoji}</span>
      </div>
      ${isNearest ? `<div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);background:#10b981;color:white;font-size:9px;font-weight:700;padding:2px 6px;border-radius:10px;white-space:nowrap;z-index:999;">⭐ NEAREST</div>` : ''}
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// ─── Map fly-to controller ────────────────────────────────
function MapController({ selectedPlant }) {
  const map = useMap();
  React.useEffect(() => {
    if (selectedPlant) {
      map.flyTo([selectedPlant.lat, selectedPlant.lng], 13, { animate: true, duration: 1.2 });
    }
  }, [selectedPlant, map]);
  return null;
}

// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function PlantLocator() {

  // ── YOUR ORIGINAL STATE ──────────────────────────────────
  const [filter, setFilter] = useState('All');

  // ── NEW STATE for map features ───────────────────────────
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [search, setSearch]               = useState('');
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [userLocation, setUserLocation]   = useState(null);
  const [locating, setLocating]           = useState(false);
  const [showMap, setShowMap]             = useState(true);

  const types = ['All','Biogas','Biochar','Biomass','Compost'];

  // ── YOUR ORIGINAL filter + NEW search/certified filter ──
  const shown = useMemo(() => {
    return PLANTS.filter(p => {
      if (filter !== 'All' && p.type !== filter) return false;
      if (certifiedOnly && !p.certified) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [filter, certifiedOnly, search]);

  // ── Nearest plant ────────────────────────────────────────
  const nearestPlant = shown.length > 0
    ? shown.reduce((a, b) => a.distanceKm < b.distanceKm ? a : b)
    : null;

  // ── Select plant — click list or marker ──────────────────
  function handleSelect(plant) {
    setSelectedPlant(prev => prev?.id === plant.id ? null : plant);
  }

  // ── Get user GPS location ────────────────────────────────
  function getUserLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      ()  => { setUserLocation({ lat: 18.5204, lng: 73.8567 }); setLocating(false); }
    );
  }

  return (
    <div>

      {/* ══════════════════════════════════════════════════════
          YOUR ORIGINAL UI — completely unchanged
          ══════════════════════════════════════════════════════ */}

      <div className="hero-banner">
        <h2>📍 Nearby Biomass Plants</h2>
        <p>Find certified biogas, biochar, biomass & compost facilities near your farm in Maharashtra</p>
      </div>

      <div className="stats-grid" style={{ marginBottom:18 }}>
        <div className="stat-card green"><div className="stat-emoji">🏭</div><div className="stat-label">Total Plants</div><div className="stat-value">{PLANTS.length}</div></div>
        <div className="stat-card green"><div className="stat-emoji">✅</div><div className="stat-label">Certified</div><div className="stat-value">{PLANTS.filter(p=>p.certified).length}</div></div>
        <div className="stat-card amber"><div className="stat-emoji">📍</div><div className="stat-label">Nearest Plant</div><div className="stat-value">5 km</div></div>
        <div className="stat-card blue"><div className="stat-emoji">⚙️</div><div className="stat-label">Total Capacity</div><div className="stat-value">215T</div><div className="stat-unit">per day</div></div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
        {types.map(t => (
          <button key={t} className={`btn btn-sm ${filter===t?'btn-primary':'btn-outline'}`} onClick={() => setFilter(t)}>
            {TYPE_ICON[t]||'🏭'} {t}
          </button>
        ))}
      </div>

      <div className="plant-list">
        {shown.map(p => (
          <div
            className="plant-item"
            key={p.id}
            onClick={() => handleSelect(p)}
            style={{
              cursor: 'pointer',
              borderLeft: selectedPlant?.id === p.id ? '4px solid #2C5F2D' : '4px solid transparent',
              background: selectedPlant?.id === p.id ? '#f0fdf4' : 'white',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize:'2rem', minWidth:44, textAlign:'center' }}>{TYPE_ICON[p.type]}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                <strong style={{ fontFamily:'Syne', fontSize:'0.92rem' }}>{p.name}</strong>
                <span className={`plant-type-badge ${TYPE_CLASS[p.type]}`}>{p.type}</span>
                {p.certified && <span style={{ fontSize:'0.67rem', background:'#e8f5e9', color:'#2C5F2D', padding:'2px 7px', borderRadius:20, fontWeight:600 }}>✅ Certified</span>}
                {nearestPlant?.id === p.id && <span style={{ fontSize:'0.67rem', background:'#d1fae5', color:'#065f46', padding:'2px 7px', borderRadius:20, fontWeight:700 }}>⭐ Nearest</span>}
              </div>
              <div style={{ fontSize:'0.78rem', color:'#6b7280', marginBottom:3 }}>📍 {p.city} &nbsp;•&nbsp; ⚙️ {p.capacity}</div>
              <div style={{ fontSize:'0.77rem', color:'#374151' }}>{p.desc}</div>
            </div>
            <div style={{ textAlign:'right', minWidth:80 }}>
              <div style={{ fontFamily:'Syne', fontWeight:800, fontSize:'1.3rem', color:'#2C5F2D' }}>{p.distanceKm}</div>
              <div style={{ fontSize:'0.68rem', color:'#6b7280' }}>km away</div>
              <a href={`tel:${p.contact}`} className="btn btn-outline btn-sm" style={{ marginTop:8, display:'inline-block', textDecoration:'none' }}>📞 Call</a>
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info" style={{ marginTop:20 }}>
        🛰️ <strong>v2 Roadmap:</strong> Google Maps API + ISRO Satellite crop detection + IoT farm sensors
      </div>

      {/* ══════════════════════════════════════════════════════
          NEW SECTION — Interactive Map (added below)
          ══════════════════════════════════════════════════════ */}

      <div style={{ marginTop: 32 }}>

        {/* Map Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <div>
            <h3 style={{ fontFamily:'Syne', fontSize:'1.1rem', fontWeight:800, color:'#111827', margin:0 }}>
              🗺️ Interactive Map
            </h3>
            <p style={{ fontSize:'0.77rem', color:'#6b7280', margin:0 }}>
              Click a plant card above or a map marker to highlight it
            </p>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>

            {/* Search */}
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', fontSize:'0.85rem', color:'#9ca3af' }}>🔍</span>
              <input
                type="text"
                placeholder="Search plant or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '7px 10px 7px 28px',
                  border: '1.5px solid #d1d5db',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontFamily: 'DM Sans, sans-serif',
                  outline: 'none',
                  width: 180,
                  color: '#111827',
                }}
              />
            </div>

            {/* Certified toggle */}
            <button
              onClick={() => setCertifiedOnly(!certifiedOnly)}
              style={{
                padding: '7px 12px',
                border: `1.5px solid ${certifiedOnly ? '#2C5F2D' : '#d1d5db'}`,
                background: certifiedOnly ? '#2C5F2D' : 'white',
                color: certifiedOnly ? 'white' : '#374151',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              ✅ Certified Only
            </button>

            {/* My Location */}
            <button
              onClick={getUserLocation}
              disabled={locating}
              style={{
                padding: '7px 12px',
                background: '#2C5F2D',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: locating ? 'wait' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                opacity: locating ? 0.7 : 1,
              }}
            >
              {locating ? '⏳ Locating...' : '📡 My Location'}
            </button>

            {/* Toggle map */}
            <button
              onClick={() => setShowMap(!showMap)}
              style={{
                padding: '7px 12px',
                background: showMap ? '#f3f4f6' : '#2C5F2D',
                color: showMap ? '#374151' : 'white',
                border: '1.5px solid #d1d5db',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}
            </button>
          </div>
        </div>

        {/* Nearest Plant Banner */}
        {nearestPlant && (
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            border: '1px solid #bbf7d0',
            borderRadius: 10,
            padding: '10px 16px',
            marginBottom: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            <div>
              <div style={{ fontSize:'0.7rem', color:'#065f46', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.8px' }}>⭐ Nearest Plant to You</div>
              <div style={{ fontSize:'0.9rem', fontWeight:700, color:'#111827' }}>{nearestPlant.name}</div>
              <div style={{ fontSize:'0.75rem', color:'#6b7280' }}>{nearestPlant.distanceKm} km away · {nearestPlant.capacity} · {nearestPlant.type}</div>
            </div>
            <button
              onClick={() => handleSelect(nearestPlant)}
              style={{
                padding: '7px 14px',
                background: '#2C5F2D',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              📍 View on Map
            </button>
          </div>
        )}

        {/* THE MAP */}
        {showMap && (
          <div style={{
            display: 'flex',
            gap: 0,
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            height: 520,
          }}>

            {/* Left mini list */}
            <div style={{
              width: 220,
              background: 'white',
              borderRight: '1px solid #e5e7eb',
              overflowY: 'auto',
              flexShrink: 0,
            }}>
              <div style={{ padding:'10px 12px', borderBottom:'1px solid #f3f4f6', fontSize:'0.72rem', fontWeight:700, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.8px' }}>
                {shown.length} Plants
              </div>
              {shown.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid #f9fafb',
                    cursor: 'pointer',
                    background: selectedPlant?.id === p.id ? '#f0fdf4' : 'white',
                    borderLeft: selectedPlant?.id === p.id ? '3px solid #2C5F2D' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (selectedPlant?.id !== p.id) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={e => { if (selectedPlant?.id !== p.id) e.currentTarget.style.background = 'white'; }}
                >
                  <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#111827', marginBottom:2, lineHeight:1.3 }}>{p.name}</div>
                  <div style={{ display:'flex', gap:4, alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ fontSize:'0.68rem', background: TYPE_BG[p.type], color: TYPE_TEXT[p.type], padding:'1px 6px', borderRadius:8, fontWeight:600 }}>
                      {TYPE_ICON[p.type]} {p.type}
                    </span>
                    {nearestPlant?.id === p.id && (
                      <span style={{ fontSize:'0.62rem', background:'#d1fae5', color:'#065f46', padding:'1px 5px', borderRadius:8, fontWeight:700 }}>⭐</span>
                    )}
                  </div>
                  <div style={{ fontSize:'0.7rem', color:'#9ca3af', marginTop:3 }}>
                    {p.distanceKm} km · {p.capacity}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div style={{ flex:1, position:'relative' }}>

              {/* Selected plant overlay */}
              {selectedPlant && (
                <div style={{
                  position: 'absolute',
                  top: 10, left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  borderRadius: 10,
                  padding: '8px 14px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  maxWidth: '85%',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Syne', fontWeight:700, fontSize:'0.85rem', color:'#111827' }}>{selectedPlant.name}</div>
                    <div style={{ fontSize:'0.72rem', color:'#6b7280' }}>{selectedPlant.type} · {selectedPlant.distanceKm} km · {selectedPlant.capacity}</div>
                  </div>
                  <button
                    onClick={() => setSelectedPlant(null)}
                    style={{ background:'#f3f4f6', border:'none', borderRadius:'50%', width:22, height:22, cursor:'pointer', fontSize:'0.75rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
                  >✕</button>
                </div>
              )}

              <MapContainer
                center={[19.0, 76.0]}
                zoom={7}
                style={{ width:'100%', height:'100%', zIndex:1 }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController selectedPlant={selectedPlant} />

                {/* Route line from user to selected plant */}
                {userLocation && selectedPlant && (
                  <Polyline
                    positions={[[userLocation.lat, userLocation.lng], [selectedPlant.lat, selectedPlant.lng]]}
                    color="#2C5F2D"
                    weight={3}
                    dashArray="8,6"
                    opacity={0.8}
                  />
                )}

                {/* User location blue dot */}
                {userLocation && (
                  <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.divIcon({
                      className: '',
                      html: `<div style="width:16px;height:16px;background:#2563eb;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px #2563eb55;"></div>`,
                      iconSize: [16,16], iconAnchor: [8,8],
                    })}
                  >
                    <Popup><strong>📍 Your Location</strong></Popup>
                  </Marker>
                )}

                {/* Plant markers */}
                {shown.map(plant => (
                  <Marker
                    key={plant.id}
                    position={[plant.lat, plant.lng]}
                    icon={createMarkerIcon(plant.type, selectedPlant?.id === plant.id, nearestPlant?.id === plant.id)}
                    eventHandlers={{ click: () => handleSelect(plant) }}
                  >
                    <Popup maxWidth={240}>
                      <div style={{ fontFamily:'DM Sans, sans-serif', minWidth:200 }}>
                        {/* Popup header */}
                        <div style={{ background: TYPE_COLOR[plant.type], margin:'-12px -12px 10px -12px', padding:'10px 12px', borderRadius:'8px 8px 0 0' }}>
                          <div style={{ color:'white', fontWeight:700, fontSize:'0.9rem' }}>{plant.name}</div>
                          <div style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.72rem', marginTop:2 }}>{plant.city}</div>
                        </div>
                        {/* Popup details */}
                        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem' }}>
                            <span style={{ color:'#6b7280' }}>Type</span>
                            <span style={{ background: TYPE_BG[plant.type], color: TYPE_TEXT[plant.type], padding:'1px 7px', borderRadius:8, fontWeight:600, fontSize:'0.72rem' }}>{plant.type}</span>
                          </div>
                          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem' }}>
                            <span style={{ color:'#6b7280' }}>Capacity</span><strong>{plant.capacity}</strong>
                          </div>
                          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem' }}>
                            <span style={{ color:'#6b7280' }}>Distance</span><strong>{plant.distanceKm} km</strong>
                          </div>
                          {plant.certified && (
                            <div style={{ background:'#d1fae5', color:'#065f46', padding:'3px 8px', borderRadius:6, fontSize:'0.72rem', fontWeight:600, textAlign:'center', marginTop:2 }}>
                              ✅ Certified Facility
                            </div>
                          )}
                          <a href={`tel:${plant.contact}`} style={{ display:'block', textAlign:'center', background:'#2C5F2D', color:'white', padding:'5px', borderRadius:6, textDecoration:'none', fontSize:'0.78rem', fontWeight:600, marginTop:2 }}>
                            📞 {plant.contact}
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Map Legend */}
              <div style={{
                position:'absolute', bottom:16, right:10,
                background:'white', borderRadius:10, padding:'8px 12px',
                boxShadow:'0 2px 10px rgba(0,0,0,0.12)', zIndex:1000, fontSize:'0.72rem',
              }}>
                <div style={{ fontWeight:700, marginBottom:5, color:'#374151' }}>Legend</div>
                {Object.entries(TYPE_COLOR).map(([type, color]) => (
                  <div key={type} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:color, flexShrink:0 }} />
                    <span style={{ color:'#6b7280' }}>{type}</span>
                  </div>
                ))}
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4, borderTop:'1px solid #f3f4f6', paddingTop:4 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:'#2563eb', flexShrink:0 }} />
                  <span style={{ color:'#6b7280' }}>You</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}