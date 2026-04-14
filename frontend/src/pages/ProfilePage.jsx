import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CROPS = ['rice','wheat','maize','sugarcane','cotton','soybean'];
const DISTRICTS = [
  'Ahmednagar','Akola','Amravati','Aurangabad','Beed','Bhandara','Buldhana',
  'Chandrapur','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna',
  'Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded',
  'Nandurbar','Nashik','Osmanabad','Palghar','Parbhani','Pune','Raigad',
  'Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha',
  'Washim','Yavatmal'
];
export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '',
    village: user?.village || '',
    district: user?.district || '',
    cropType: user?.cropType || 'rice',
    landArea: user?.landArea || ''
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSave() {
    if (!form.name.trim()) { setError('Name cannot be empty.'); return; }
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const calcs   = user?.calculations || [];
  const credits = user?.carbonCredits || 0;

  const totalResidueSum = calcs.reduce((sum, c) => sum + (c.result?.waste?.residueGenerated || 0), 0);
  const totalCO2Sum     = calcs.reduce((sum, c) => sum + (c.result?.waste?.co2Avoided || 0), 0);

  return (
    <div>
      {/* Profile Header */}
      <div style={{ background:'linear-gradient(135deg,#1a3d1f,#3a7a3b)', borderRadius:16, padding:'28px 32px', color:'white', marginBottom:24, display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
        <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', flexShrink:0 }}>
          {user?.role === 'farmer' ? '🧑‍🌾' : '🏭'}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <h2 style={{ fontFamily:'Syne', fontSize:'1.4rem', margin:0 }}>{user?.name}</h2>
            <span style={{ background:'rgba(255,255,255,0.2)', padding:'3px 12px', borderRadius:20, fontSize:'0.72rem', fontWeight:600, textTransform:'uppercase' }}>
              {user?.role === 'farmer' ? '🌾 Farmer' : '🏭 Buyer'}
            </span>
          </div>
          <div style={{ fontSize:'0.83rem', opacity:0.75, marginTop:4 }}>
            {user?.village && `📍 ${user.village}`}{user?.district && `, ${user.district}`}
          </div>
          <div style={{ fontSize:'0.78rem', opacity:0.6, marginTop:2 }}>
            📧 {user?.email} &nbsp;|&nbsp; 📱 +91 {user?.mobile}
          </div>
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button
            className="btn btn-outline"
            style={{ color:'white', borderColor:'rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.1)' }}
            onClick={() => setEditing(true)}
          >
            ✏️ Edit Profile
          </button>
          <button
            className="btn"
            style={{ background:'rgba(255,255,255,0.15)', color:'white' }}
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Stats Row — Farmer only */}
      {user?.role === 'farmer' && (
        <div className="stats-grid" style={{ marginBottom:24 }}>
          <div className="stat-card green"><div className="stat-emoji">🌾</div><div className="stat-label">Total Residue Calculated</div><div className="stat-value">{totalResidueSum.toFixed(1)}</div><div className="stat-unit">tons</div></div>
          <div className="stat-card amber"><div className="stat-emoji">🌍</div><div className="stat-label">Total CO₂ Avoided</div><div className="stat-value">{totalCO2Sum.toFixed(1)}</div><div className="stat-unit">tons</div></div>
          <div className="stat-card green"><div className="stat-emoji">💰</div><div className="stat-label">Carbon Credits Earned</div><div className="stat-value">{credits.toFixed(1)}</div><div className="stat-unit">credits</div></div>
          <div className="stat-card earth"><div className="stat-emoji">📊</div><div className="stat-label">Calculations Done</div><div className="stat-value">{calcs.length}</div><div className="stat-unit">total</div></div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${tab==='profile'?'active':''}`} onClick={() => setTab('profile')}>👤 Profile Details</button>
        {user?.role === 'farmer' && (
          <button className={`tab-btn ${tab==='history'?'active':''}`} onClick={() => setTab('history')}>
            📊 Calculation History ({calcs.length})
          </button>
        )}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="card">
          <div className="card-header">
            <div className="card-icon green">👤</div>
            <div>
              <div className="card-title">Personal Information</div>
              <div className="card-subtitle">Your profile details</div>
            </div>
            {!editing && (
              <button className="btn btn-outline btn-sm" style={{ marginLeft:'auto' }} onClick={() => setEditing(true)}>
                ✏️ Edit
              </button>
            )}
          </div>
          <div className="card-body">
            {saved  && <div className="alert alert-success">✅ Profile updated successfully!</div>}
            {error  && <div className="alert alert-warning">⚠️ {error}</div>}

            {!editing ? (
              <div className="results-grid">
                <div className="result-block">
                  <h4>Basic Info</h4>
                  <div className="result-row"><span className="key">Full Name</span><span className="val">{user?.name}</span></div>
                  <div className="result-row"><span className="key">Email</span><span className="val">{user?.email}</span></div>
                  <div className="result-row"><span className="key">Mobile</span><span className="val">+91 {user?.mobile}</span></div>
                  <div className="result-row"><span className="key">Role</span><span className="val">{user?.role === 'farmer' ? '🧑‍🌾 Farmer' : '🏭 Buyer'}</span></div>
                  <div className="result-row"><span className="key">Member Since</span><span className="val">{new Date(user?.createdAt).toLocaleDateString('en-IN')}</span></div>
                </div>
                {user?.role === 'farmer' && (
                  <div className="result-block">
                    <h4>Farm Details</h4>
                    <div className="result-row"><span className="key">Village</span><span className="val">{user?.village || '—'}</span></div>
                    <div className="result-row"><span className="key">District</span><span className="val">{user?.district || '—'}</span></div>
                    <div className="result-row"><span className="key">Main Crop</span><span className="val">{user?.cropType ? user.cropType.charAt(0).toUpperCase()+user.cropType.slice(1) : '—'}</span></div>
                    <div className="result-row"><span className="key">Land Area</span><span className="val">{user?.landArea ? `${user.landArea} acres` : '—'}</span></div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="form-grid">
                  <div className="form-group"><label>Full Name</label><input name="name" value={form.name} onChange={handleChange} /></div>
                  {user?.role === 'farmer' && <>
                    <div className="form-group"><label>Village</label><input name="village" value={form.village} onChange={handleChange} placeholder="Village / Town" /></div>
                    <div className="form-group">
                      <label>District</label>
                      <select name="district" value={form.district} onChange={handleChange}>
                        <option value="">Select district</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Main Crop</label>
                      <select name="cropType" value={form.cropType} onChange={handleChange}>
                        {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="form-group"><label>Land Area (acres)</label><input type="number" name="landArea" value={form.landArea} onChange={handleChange} /></div>
                  </>}
                </div>
                <div style={{ display:'flex', gap:10, marginTop:16 }}>
                  <button className="btn btn-primary" onClick={handleSave}>💾 Save Changes</button>
                  <button className="btn btn-outline" onClick={() => { setEditing(false); setError(''); }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div>
          {calcs.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">📊</div>
              <h3>No calculations yet</h3>
              <p>Use the Waste Calculator to get started</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {calcs.map((c, i) => (
                <div className="card" key={c.id}>
                  <div className="card-body" style={{ padding:'16px 20px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                          <span style={{ fontFamily:'Syne', fontWeight:700, fontSize:'0.95rem' }}>
                            {c.inputs?.cropType?.charAt(0).toUpperCase()+c.inputs?.cropType?.slice(1)} — {c.inputs?.area} {c.inputs?.unit}
                          </span>
                          <span style={{ fontSize:'0.7rem', background:'#e8f5e9', color:'#2C5F2D', padding:'2px 8px', borderRadius:20, fontWeight:600 }}>
                            #{calcs.length - i}
                          </span>
                        </div>
                        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                          <span style={{ fontSize:'0.8rem', color:'#6b7280' }}>🌾 Residue: <strong>{c.result?.waste?.residueGenerated}t</strong></span>
                          <span style={{ fontSize:'0.8rem', color:'#6b7280' }}>🌍 CO₂: <strong>{c.result?.waste?.co2Avoided}t</strong></span>
                          <span style={{ fontSize:'0.8rem', color:'#6b7280' }}>🔥 Biogas: <strong>{c.result?.biogas?.totalBiogasM3}m³</strong></span>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:'Syne', fontWeight:800, fontSize:'1.2rem', color:'#2C5F2D' }}>
                          ₹{Number(c.result?.credits?.totalIncome || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize:'0.7rem', color:'#6b7280' }}>
                          {new Date(c.date).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}