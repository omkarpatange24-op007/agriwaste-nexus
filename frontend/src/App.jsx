import React, { useState } from 'react';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import AuthWrapper from './components/AuthWrapper';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import CalculatorForm from './components/CalculatorForm';
import ResultsPanel from './components/ResultsPanel';
import Marketplace from './pages/Marketplace';
import PlantLocator from './pages/PlantLocator';
import ProfilePage from './pages/ProfilePage';
import LangToggle from './components/LangToggle';
import { useLang } from './context/LangContext';
import { LangProvider } from './context/LangContext';
import TopHeader from './components/TopHeader';
import HeroSlideshow from './components/HeroSlideshow';
import FarmerIDPage from './pages/FarmerIDPage';
import KisanMitraChat from './components/KisanMitraChat';



function Dashboard({ setPage }) {
  const { t } = useLang();
  const { user } = useAuth();
  const isBuyer = user?.role === 'buyer';
  const calcs = user?.calculations || [];
  const credits = user?.carbonCredits || 0;

  const features = isBuyer ? [
    { icon: '🛒', page: 'marketplace', label: t('marketplace'), desc: t('marketplaceDesc'), bg: '#fef3c7' },
    { icon: '📍', page: 'locator', label: t('plantLocator'), desc: t('locatorDesc'), bg: '#f0fdf4' },
  ] : [
    { icon: '🌾', page: 'calculator', label: t('wasteCalculator'), desc: t('wasteCalcDesc'), bg: '#e8f5e9' },
    { icon: '🔥', page: 'biogas', label: t('biogasEstimator'), desc: t('biogasDesc'), bg: '#fff3e0' },
    { icon: '⚗️', page: 'biochar', label: t('biocharAdvisor'), desc: t('biocharDesc'), bg: '#f5ebe0' },
    { icon: '🌍', page: 'carbon', label: t('carbonCredits'), desc: t('carbonDesc'), bg: '#dbeafe' },
    { icon: '🛒', page: 'marketplace', label: t('marketplace'), desc: t('marketplaceDesc'), bg: '#fef3c7' },
    { icon: '📍', page: 'locator', label: t('plantLocator'), desc: t('locatorDesc'), bg: '#f0fdf4' },
  ];

  return (
    <div>
      <div style={{ padding: '4px 0 0' }}>
        <div className="hero-banner">
          <h2>
            {isBuyer
              ? `🏭 ${t('welcomeBuyer')}, ${user?.name}!`
              : `🌿 ${t('welcomeBack')}, ${user?.name}!`}
          </h2>
          <p>
            {isBuyer
              ? t('browseListings')
              : `${t('calculations')} ${calcs.length} • ${t('carbonCreditsEarned')} ${credits.toFixed(1)}`}
          </p>
        </div>

        {!isBuyer && (
          <div className="stats-grid">
            <div className="stat-card green"><div className="stat-emoji">🌾</div><div className="stat-label">Crop Residue (India)</div><div className="stat-value">500MT</div><div className="stat-unit">yearly</div></div>
            <div className="stat-card amber"><div className="stat-emoji">🔥</div><div className="stat-label">Burned Openly</div><div className="stat-value">~60%</div><div className="stat-unit">causing pollution</div></div>
            <div className="stat-card green"><div className="stat-emoji">🌍</div><div className="stat-label">Your Carbon Credits</div><div className="stat-value">{credits.toFixed(1)}</div><div className="stat-unit">credits earned</div></div>
            <div className="stat-card earth"><div className="stat-emoji">📊</div><div className="stat-label">Your Calculations</div><div className="stat-value">{calcs.length}</div><div className="stat-unit">total done</div></div>
          </div>
        )}

        <h3 style={{ fontFamily: 'Syne', fontSize: '1.05rem', marginBottom: 14, color: '#374151' }}>
          {t('platformFeatures')}
        </h3>

        <div className="results-grid">
          {features.map(f => (
            <div key={f.page} className="card"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => setPage(f.page)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body" style={{ textAlign: 'center', padding: '26px 18px', background: f.bg, borderRadius: 16 }}>
                <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.95rem', marginBottom: 7, color: '#1a3d1f' }}>{f.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5 }}>{f.desc}</div>
                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2C5F2D', background: 'rgba(44,95,45,0.12)', padding: '3px 11px', borderRadius: 20 }}>Open →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isBuyer && calcs.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'Syne', fontSize: '1.05rem', color: '#374151' }}>
                {t('recentCalculations')}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setPage('profile')}>
                {t('viewAll')} →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {calcs.slice(0, 3).map(c => (
                <div className="card" key={c.id}>
                  <div className="card-body" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>
                        {c.inputs?.cropType?.charAt(0).toUpperCase() + c.inputs?.cropType?.slice(1)} — {c.inputs?.area} {c.inputs?.unit}
                      </span>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 3 }}>
                        🌾 {c.result?.waste?.residueGenerated}t · 🌍 {c.result?.waste?.co2Avoided}t CO₂
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, color: '#2C5F2D' }}>
                        ₹{Number(c.result?.credits?.totalIncome || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                        {new Date(c.date).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isBuyer && calcs.length === 0 && (
          <div className="alert alert-info" style={{ marginTop: 22 }}>
            🚀 <strong>{t('quickStart')}</strong> {t('quickStartDesc')}
          </div>
        )}

      </div>
    </div>
  );
}


function CalculatorPage() {
  const { saveCalculation } = useAuth();
  const [results, setResults] = useState(null);
  const [inputs, setInputs] = useState(null);

  function handleResults(r, i) {
    setResults(r);
    setInputs(i);
    saveCalculation(r, i);
  }

  return (
    <div>
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        💡 Results are automatically saved to your profile history.
      </div>
      <CalculatorForm onResults={handleResults} />
      <ResultsPanel results={results} inputs={inputs} />
    </div>
  );
}


function MainApp() {
  const { t } = useLang();

  const PAGE_TITLES = {
    dashboard: { title: t('dashboard'), sub: t('appTagline') },
    calculator: { title: t('wasteCalculator'), sub: t('wasteCalcDesc') },
    biogas: { title: t('biogasEstimator'), sub: t('biogasDesc') },
    biochar: { title: t('biocharAdvisor'), sub: t('biocharDesc') },
    carbon: { title: t('carbonCredits'), sub: t('carbonDesc') },
    marketplace: { title: t('marketplace'), sub: t('marketplaceDesc') },
    locator: { title: t('plantLocator'), sub: t('locatorDesc') },
    profile: { title: t('myProfile'), sub: t('profileDetails') },
    farmerId: { title: 'Farmer ID', sub: 'Digital Farmer Identity Card' },
  };

  const [page, setPage] = useState('dashboard');
  const [showChat, setShowChat] = useState(false); // ✅ ADDED
  const info = PAGE_TITLES[page] || PAGE_TITLES.dashboard;

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard setPage={setPage} />;
      case 'calculator':
      case 'biogas':
      case 'biochar':
      case 'carbon': return <CalculatorPage />;
      case 'marketplace': return <Marketplace />;
      case 'locator': return <PlantLocator />;
      case 'profile': return <ProfilePage />;
      case 'farmerId': return <FarmerIDPage />;
      default: return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div className="app-with-header">
      <TopHeader />
      <div className="app-layout">
        <Sidebar activePage={page} setPage={setPage} />
        <div className="main-content">

          <div className={`page-header ${page === 'dashboard' ? 'no-border-bottom' : ''}`}>
            <div>
              <h2>{info.title}</h2>
              <div className="subtitle">{info.sub}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <LangToggle />
              <span className="badge">🏆 Pune Agri Hackathon 2026</span>
            </div>
          </div>

          {page === 'dashboard' && (
            <div style={{ marginTop: '-1px' }}>
              <HeroSlideshow />
            </div>
          )}

          <div className="page-body">
            {renderPage()}
            <Footer />
          </div>

        </div>
      </div>

      {/* ✅ ADDED — Kisan Mitra Chatbot */}
      {showChat ? (
        <KisanMitraChat onClose={() => setShowChat(false)} />
      ) : (
        <div
          onClick={() => setShowChat(true)}
          title="Chat with Kisan Mitra"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 120,
            height:120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2C5F2D, #4d9e4e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(44,95,45,0.5)',
            zIndex: 9999,
           fontSize: '1.6rem',
          overflow: 'hidden',
          }}
        >
          <img
            src="/chatbot.png"
            alt="Kisan Mitra"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
      {/* ✅ END chatbot */}

    </div>
  );
}


export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <AuthWrapper>
          <MainApp />
        </AuthWrapper>
      </AuthProvider>
    </LangProvider>
  );
}