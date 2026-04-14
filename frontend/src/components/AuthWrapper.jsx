import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';

export default function AuthWrapper({ children }) {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState('login');

  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#f1faf1' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:12 }}>🌿</div>
          <div className="spinner" style={{ margin:'0 auto' }}></div>
          <p style={{ color:'#6b7280', marginTop:12, fontSize:'0.88rem' }}>Loading AgriWaste Nexus...</p>
        </div>
      </div>
    );
  }

  if (user) return children;

  const onSuccess = () => {};

  if (authScreen === 'register') return <RegisterPage onSwitch={setAuthScreen} onSuccess={onSuccess} />;
  if (authScreen === 'forgot')   return <ForgotPasswordPage onSwitch={setAuthScreen} />;
  return <LoginPage onSwitch={setAuthScreen} onSuccess={onSuccess} />;
}