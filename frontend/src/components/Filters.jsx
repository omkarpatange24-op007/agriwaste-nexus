import React from 'react';
import { PLANT_TYPES, STATES } from '../data/plantData';

export default function Filters({ filters, setFilters, totalCount, filteredCount }) {

  function handleChange(key, value) {
    setFilters(f => ({ ...f, [key]: value }));
  }

  function clearAll() {
    setFilters({ type: 'All', certified: false, state: 'All', search: '' });
  }

  const hasActiveFilter = filters.type !== 'All' || filters.certified || filters.state !== 'All' || filters.search;

  return (
    <div style={{
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '14px 16px',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>
            🏭 Plant Locator
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 1 }}>
            Showing {filteredCount} of {totalCount} plants
          </div>
        </div>
        {hasActiveFilter && (
          <button
            onClick={clearAll}
            style={{
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fca5a5',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <span style={{
          position: 'absolute', left: 10, top: '50%',
          transform: 'translateY(-50%)', fontSize: '0.9rem', color: '#9ca3af'
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search by name or city..."
          value={filters.search}
          onChange={e => handleChange('search', e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px 8px 32px',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: '0.83rem',
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none',
            color: '#111827',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.target.style.borderColor = '#2C5F2D'}
          onBlur={e => e.target.style.borderColor = '#d1d5db'}
        />
      </div>

      {/* Type Filter */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
          Plant Type
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PLANT_TYPES.map(type => (
            <button
              key={type}
              onClick={() => handleChange('type', type)}
              style={{
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: filters.type === type ? '1.5px solid #2C5F2D' : '1.5px solid #d1d5db',
                background: filters.type === type ? '#2C5F2D' : 'white',
                color: filters.type === type ? 'white' : '#374151',
                transition: 'all 0.15s',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {type === 'Biogas' ? '🔥 ' : type === 'Biochar' ? '⚗️ ' : type === 'Biomass' ? '⚡ ' : type === 'Compost' ? '🌱 ' : ''}
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* State Filter */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
          State
        </div>
        <select
          value={filters.state}
          onChange={e => handleChange('state', e.target.value)}
          style={{
            width: '100%',
            padding: '7px 10px',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: '0.83rem',
            fontFamily: 'DM Sans, sans-serif',
            color: '#111827',
            outline: 'none',
            background: 'white',
          }}
        >
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Certified Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>✅ Certified Only</div>
          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Show verified facilities</div>
        </div>
        <div
          onClick={() => handleChange('certified', !filters.certified)}
          style={{
            width: 40, height: 22, borderRadius: 11,
            background: filters.certified ? '#2C5F2D' : '#d1d5db',
            position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 2, left: filters.certified ? 20 : 2,
            width: 18, height: 18, borderRadius: '50%',
            background: 'white', transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
      </div>
    </div>
  );
}