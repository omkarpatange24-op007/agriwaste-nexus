import React from 'react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'calculator', icon: '🌾', label: 'Waste Calculator' },
  { id: 'biogas', icon: '🔥', label: 'Biogas Estimator' },
  { id: 'biochar', icon: '⚗️', label: 'Biochar Advisor' },
  { id: 'carbon', icon: '🌍', label: 'Carbon Credits' },
  { id: 'marketplace', icon: '🛒', label: 'Marketplace' },
  { id: 'locator', icon: '📍', label: 'Plant Locator' },
  { id: 'farmerId', icon: '🪪', label: 'Farmer ID' },
];

const BUYER_NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'marketplace', icon: '🛒', label: 'Marketplace' },
  { id: 'locator', icon: '📍', label: 'Plant Locator' },
];

export default function Sidebar({ activePage, setPage, sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navItems = user?.role === 'buyer' ? BUYER_NAV : NAV_ITEMS;

  return (
    <>
      {/* ✅ Dark overlay — only on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="leaf">🌿</span>
              <h1>{t('appName')}</h1>
              <p>{t('appTagline')}</p>
            </div>
            {/* ✅ Close button — only on mobile */}
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>

        {user && (
          <div className="sidebar-user" onClick={() => setPage('profile')}>
            <div className="su-avatar">{user.role === 'farmer' ? '🧑‍🌾' : '🏭'}</div>
            <div className="su-info">
              <div className="su-name">{user.name}</div>
              <div className="su-role">{user.role === 'farmer' ? 'Farmer' : 'Buyer'} · {user.district || user.village || 'Maharashtra'}</div>
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>›</div>
          </div>
        )}

        <nav className="nav-section">
          <label>Navigation</label>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div style={{ marginTop: 12 }}>
            <label>Account</label>
            <button className={`nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setPage('profile')}>
              <span className="icon">👤</span> My Profile
            </button>
            <button className="nav-item" onClick={logout}>
              <span className="icon">🚪</span> Logout
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div>🏆 Pune Agri Hackathon 2026</div>
          <div style={{ marginTop: 4 }}>Team Thunder</div>
        </div>
      </aside>
    </>
  );

}