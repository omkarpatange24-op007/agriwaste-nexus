import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatBot from '../components/ChatBot';
import LangToggle from '../components/LangToggle';
import { useLang } from '../context/LangContext';

export default function LoginPage({ onSwitch, onSuccess }) {
  const { t } = useLang();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(form);
      if (result.success) { onSuccess(); }
      else { setError(result.error); }
      setLoading(false);
    }, 800);
  }

  function demoLogin(role) {
    setLoading(true);
    setTimeout(() => {
      const demoFarmer = { id: 'DEMO_F', name: 'Demo Farmer', email: 'farmer@demo.com', password: 'demo123', mobile: '9999999999', role: 'farmer', village: 'Nashik', district: 'Nashik', cropType: 'rice', landArea: '5', createdAt: new Date().toISOString(), listings: [], calculations: [], carbonCredits: 23.5 };
      const demoBuyer = { id: 'DEMO_B', name: 'Demo Buyer', email: 'buyer@demo.com', password: 'demo123', mobile: '8888888888', role: 'buyer', village: 'Pune', district: 'Pune', cropType: '', landArea: '', createdAt: new Date().toISOString(), listings: [], calculations: [], carbonCredits: 0 };
      const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
      if (!users.find(u => u.email === 'farmer@demo.com')) users.push(demoFarmer);
      if (!users.find(u => u.email === 'buyer@demo.com')) users.push(demoBuyer);
      localStorage.setItem('agri_users', JSON.stringify(users));
      const creds = role === 'farmer'
        ? { email: 'farmer@demo.com', password: 'demo123' }
        : { email: 'buyer@demo.com', password: 'demo123' };
      const result = login(creds);
      if (result.success) onSuccess();
      setLoading(false);
    }, 600);
  }

  return (
    <div className="auth-page">

      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        <LangToggle />
      </div>
      <div className="auth-left">
        <div className="auth-brand">
          <span style={{ fontSize: '3rem' }}>🌿</span>
          <h1>AgriWaste Nexus</h1>
          <p>Turn Farm Waste into Clean Energy & Income</p>
        </div>
        <div className="auth-stats">
          <div className="auth-stat">
            <div className="as-value">500MT</div>
            <div className="as-label">Crop Residue Yearly</div>
          </div>
          <div className="auth-stat">
            <div className="as-value">₹15K+</div>
            <div className="as-label">Farmer Income/Acre</div>
          </div>
          <div className="auth-stat">
            <div className="as-value">60%</div>
            <div className="as-label">Waste Being Burned</div>
          </div>
        </div>
        <div className="auth-quote">
          "Turning Farm Waste into Clean Energy & Farmer Income"
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-title">{t('welcomeBackAuth')}</h2>
          <p className="auth-subtitle">{t('loginSubtitle')}</p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>{t('emailAddress')}</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="yourname@email.com"
              />
            </div>
            <div className="auth-field">
              <label>{t('password')}</label>
              <div className="pass-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <button
                type="button"
                className="auth-link"
                onClick={() => onSwitch('forgot')}
              >
                {t('forgotPassword')}
              </button>
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="auth-spinner"></span> : t('loginBtn')}
            </button>
          </form>

          <div className="auth-divider"><span>{t('orTryDemo')}</span></div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="demo-btn farmer" onClick={() => demoLogin('farmer')}>
              {t('demoFarmer')}
            </button>

            <button className="demo-btn buyer" onClick={() => demoLogin('buyer')}>
              {t('demoBuyer')}
            </button>
          </div>

          <p className="auth-switch">
            {t('noAccount')}{' '}
            <button className="auth-link" onClick={() => onSwitch('register')}>
              {t('registerHere')}
            </button>
          </p>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}