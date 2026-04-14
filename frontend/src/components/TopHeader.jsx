import React from 'react';

export default function TopHeader() {
  return (
    <div className="top-header">
      <div className="header-logo-row">
        <div className="header-logo-middle">
          <img 
  src="/images/logo2.png" 
  alt="AgriWaste Nexus Logo"
  className="header-logo"
/>
          <div className="header-brand-text">
            <div className="header-hindi">कृषि अपशिष्ट नेक्सस</div>
            <div className="header-title">AgriWaste Nexus</div>
            <div className="header-satyamev">सत्यमेव जयते</div>
          </div>
        </div>
        <div className="header-logo-right">
          <div className="header-badges">
            <div className="header-badge-item">
              <span style={{ fontSize:'1.4rem' }}>🌾</span>
              <span className="hb-label">Agri<br/>Innovation</span>
            </div>
            <div className="header-divider"></div>
            <div className="header-badge-item">
              <span style={{ fontSize:'1.1rem' }}>♻️</span>
              <span className="hb-label">Digital<br/>India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}