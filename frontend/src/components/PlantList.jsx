import React from 'react';
import { TYPE_COLORS, TYPE_BG, TYPE_TEXT } from '../data/plantData';

function StarRating({ rating }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#6b7280', marginLeft: 3 }}>{rating}</span>
    </span>
  );
}

export default function PlantList({ plants, selectedPlant, nearestPlant, onSelect }) {

  if (plants.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🔍</div>
        <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>No plants found</div>
        <div style={{ fontSize: '0.8rem' }}>Try adjusting your filters</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {plants.map((plant, idx) => {
        const isSelected = selectedPlant?.id === plant.id;
        const isNearest  = nearestPlant?.id === plant.id;

        return (
          <div
            key={plant.id}
            onClick={() => onSelect(plant)}
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              background: isSelected ? '#f0fdf4' : 'white',
              borderLeft: isSelected ? '3px solid #2C5F2D' : '3px solid transparent',
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              if (!isSelected) e.currentTarget.style.background = '#f9fafb';
            }}
            onMouseLeave={e => {
              if (!isSelected) e.currentTarget.style.background = 'white';
            }}
          >
            {/* Nearest Badge */}
            {isNearest && (
              <div style={{
                position: 'absolute',
                top: 10, right: 12,
                background: '#10b981',
                color: 'white',
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 10,
                letterSpacing: '0.5px',
              }}>
                ⭐ NEAREST
              </div>
            )}

            {/* Plant Name & Type */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: 8,
                background: TYPE_BG[plant.type],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0,
              }}>
                {plant.type === 'Biogas' ? '🔥' : plant.type === 'Biochar' ? '⚗️' : plant.type === 'Biomass' ? '⚡' : '🌱'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#111827',
                  lineHeight: 1.3,
                  marginBottom: 3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {plant.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{
                    background: TYPE_BG[plant.type],
                    color: TYPE_TEXT[plant.type],
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 10,
                  }}>
                    {plant.type}
                  </span>
                  {plant.certified && (
                    <span style={{
                      background: '#d1fae5',
                      color: '#065f46',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 10,
                    }}>
                      ✅ Certified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                📍 <strong style={{ color: '#374151' }}>{plant.city}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                📦 <strong style={{ color: '#374151' }}>{plant.capacity}T/day</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                🛣️ <strong style={{ color: '#374151' }}>{plant.distance} km</strong>
              </div>
            </div>

            {/* Rating & Hours */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StarRating rating={plant.rating} />
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                🕐 {plant.operatingHours}
              </div>
            </div>

            {/* Accepted Waste */}
            <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {plant.acceptedWaste.map(w => (
                <span key={w} style={{
                  background: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: 6,
                }}>
                  {w}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}