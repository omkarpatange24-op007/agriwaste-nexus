import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage({ onSwitch }) {
  const { resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function sendOtp() {
    if (!mobile || mobile.length !== 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setLoading(false);
      setStep(2);
      alert(`📱 OTP sent! (Demo OTP: ${mockOtp})`);
    }, 1000);
  }

  function verifyOtp() {
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return;
    }
    setError('');
    setStep(3);
  }

  function handleReset() {
    if (!newPass || newPass.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPass !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = resetPassword({ mobile, newPassword: newPass });
      if (result.success) { setSuccess(true); }
      else { setError(result.error); }
      setLoading(false);
    }, 800);
  }

  if (success) {
    return (
      <div className="auth-page" style={{ justifyContent: 'center' }}>
        <div className="auth-box" style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
          <h2 className="auth-title">Password Reset!</h2>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Your password has been updated successfully.</p>
          <button className="auth-btn" onClick={() => onSwitch('login')}>Go to Login →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ justifyContent: 'center' }}>
      <div className="auth-box" style={{ maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: '3rem' }}>🔑</span>
          <h2 className="auth-title" style={{ marginTop: 8 }}>Forgot Password</h2>
          <p className="auth-subtitle">
            {step===1 ? 'Enter your registered mobile number' :
             step===2 ? 'Enter the OTP sent to your mobile' :
             'Set your new password'}
          </p>
        </div>

        <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:24 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              width:10, height:10, borderRadius:'50%',
              background: step >= s ? '#2C5F2D' : '#d1d5db',
              transition: 'all 0.3s'
            }}></div>
          ))}
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        {step === 1 && (
          <div>
            <div className="auth-field">
              <label>Registered Mobile Number</label>
              <div className="mobile-wrap">
                <span className="mobile-prefix">+91</span>
                <input
                  value={mobile}
                  onChange={e => { setMobile(e.target.value); setError(''); }}
                  placeholder="10-digit number"
                  maxLength={10}
                />
              </div>
            </div>
            <button className="auth-btn" onClick={sendOtp} disabled={loading}>
              {loading ? <span className="auth-spinner"></span> : '📱 Send OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="auth-field">
              <label>Enter 6-digit OTP</label>
              <input
                value={otp}
                onChange={e => { setOtp(e.target.value); setError(''); }}
                placeholder="Enter OTP"
                maxLength={6}
                style={{ letterSpacing:8, fontSize:'1.3rem', textAlign:'center' }}
              />
            </div>
            <p style={{ fontSize:'0.78rem', color:'#6b7280', marginBottom:16 }}>
              OTP sent to +91 {mobile}.{' '}
              <button className="auth-link" onClick={() => setStep(1)}>Change number?</button>
            </p>
            <button className="auth-btn" onClick={verifyOtp}>✅ Verify OTP</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="auth-field">
              <label>New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={e => { setNewPass(e.target.value); setError(''); }}
                placeholder="Minimum 6 characters"
              />
            </div>
            <div className="auth-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setError(''); }}
                placeholder="Re-enter password"
                />
            </div>
            <button className="auth-btn" onClick={handleReset} disabled={loading}>
              {loading ? <span className="auth-spinner"></span> : '🔐 Reset Password'}
            </button>
          </div>
        )}

        <p className="auth-switch" style={{ marginTop: 16 }}>
          Remember password?{' '}
          <button className="auth-link" onClick={() => onSwitch('login')}>Back to Login</button>
        </p>
      </div>
    </div>
  );
}