import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CROPS = ['rice', 'wheat', 'maize', 'sugarcane', 'cotton', 'soybean'];
const STATES = ['Maharashtra', 'Karnataka', 'Gujarat'];

const DISTRICTS_BY_STATE = {
    Maharashtra: [
        'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana',
        'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
        'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
        'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad',
        'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha',
        'Washim', 'Yavatmal'
    ],
    Karnataka: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot']
};
export default function RegisterPage({ onSwitch, onSuccess }) {
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '', email: '', mobile: '', password: '', confirmPassword: '',
        role: 'farmer', village: '', state: '', district: '', cropType: 'rice', landArea: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    }

    function validateStep1() {
        if (!form.name.trim()) { setError('Please enter your full name.'); return false; }
        if (!form.email.trim()) { setError('Please enter your email.'); return false; }
        if (!/\S+@\S+\.\S+/.test(form.email)) { setError('Please enter a valid email.'); return false; }
        if (!form.mobile || form.mobile.length !== 10) { setError('Please enter a valid 10-digit mobile number.'); return false; }
        if (!form.password || form.password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return false; }
        return true;
    }

    function validateStep2() {
        if (form.role === 'farmer' && !form.state) {
            setError('Please select your state.');
            return false;
        }
        if (form.role === 'farmer' && !form.district) {
            setError('Please select your district.');
            return false;
        }
        return true;
    }

    function nextStep() {
        setError('');
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setStep(s => s + 1);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const result = register(form);
            if (result.success) { onSuccess(); }
            else { setError(result.error); setStep(1); }
            setLoading(false);
        }, 900);
    }

    const progressWidth = `${(step / 3) * 100}%`;

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-brand">
                    <span style={{ fontSize: '3rem' }}>🌿</span>
                    <h1>AgriWaste Nexus</h1>
                    <p>Join thousands of farmers earning from waste</p>
                </div>
                <div className="register-benefits">
                    <div className="rb-item">✅ Free waste-to-energy calculator</div>
                    <div className="rb-item">✅ Earn carbon credits</div>
                    <div className="rb-item">✅ Connect with 50+ buyers</div>
                    <div className="rb-item">✅ Find nearest biogas plants</div>
                    <div className="rb-item">✅ Track your income</div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-box">
                    <h2 className="auth-title">Create Account 🌱</h2>
                    <p className="auth-subtitle">
                        Step {step} of 3 — {step === 1 ? 'Basic Info' : step === 2 ? 'Farm Details' : 'Confirm'}
                    </p>

                    <div className="reg-progress-track">
                        <div className="reg-progress-fill" style={{ width: progressWidth }}></div>
                    </div>

                    <div className="reg-steps">
                        {['Basic Info', 'Farm Details', 'Confirm'].map((s, i) => (
                            <div key={i} className={`reg-step ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
                                <div className="rs-circle">{step > i + 1 ? '✓' : i + 1}</div>
                                <div className="rs-label">{s}</div>
                            </div>
                        ))}
                    </div>

                    {error && <div className="auth-error">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>

                        {step === 1 && (
                            <div>
                                <div className="auth-field">
                                    <label>Full Name</label>
                                    <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ramesh Patil" />
                                </div>
                                <div className="auth-field">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="yourname@email.com" />
                                </div>
                                <div className="auth-field">
                                    <label>Mobile Number</label>
                                    <div className="mobile-wrap">
                                        <span className="mobile-prefix">+91</span>
                                        <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
                                    </div>
                                </div>
                                <div className="auth-field">
                                    <label>Password</label>
                                    <div className="pass-wrap">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Minimum 6 characters"
                                        />
                                        <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                                            {showPass ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>
                                <div className="auth-field">
                                    <label>Confirm Password</label>
                                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password" />
                                </div>
                                <button type="button" className="auth-btn" onClick={nextStep}>Next →</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <div className="auth-field">
                                    <label>I am a</label>
                                    <div className="role-picker">
                                        <div
                                            className={`role-card ${form.role === 'farmer' ? 'selected' : ''}`}
                                            onClick={() => setForm(f => ({ ...f, role: 'farmer' }))}
                                        >
                                            <span style={{ fontSize: '2rem' }}>🧑‍🌾</span>
                                            <div className="rc-title">Farmer</div>
                                            <div className="rc-desc">Calculate waste, list residue, earn credits</div>
                                        </div>
                                        <div
                                            className={`role-card ${form.role === 'buyer' ? 'selected' : ''}`}
                                            onClick={() => setForm(f => ({ ...f, role: 'buyer' }))}
                                        >
                                            <span style={{ fontSize: '2rem' }}>🏭</span>
                                            <div className="rc-title">Buyer / Company</div>
                                            <div className="rc-desc">Browse listings, contact farmers, procure waste</div>
                                        </div>
                                    </div>
                                </div>

                                {form.role === 'farmer' && (
                                    <>
                                        <div className="auth-field">
                                            <label>Village / Town</label>
                                            <input name="village" value={form.village} onChange={handleChange} placeholder="e.g. Shrirampur" />
                                        </div>
                                        <div className="auth-field">
                                            <label>State</label>
                                            <select
                                                name="state"
                                                value={form.state}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setForm(f => ({ ...f, district: '' }));
                                                }}
                                            >
                                                <option value="">Select state</option>
                                                {STATES.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="auth-field">
                                            <label>District</label>
                                            <select
                                                name="district"
                                                value={form.district}
                                                onChange={handleChange}
                                                disabled={!form.state}
                                            >
                                                <option value="">Select district</option>
                                                {form.state &&
                                                    DISTRICTS_BY_STATE[form.state]?.map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            <div className="auth-field">
                                                <label>Main Crop</label>
                                                <select name="cropType" value={form.cropType} onChange={handleChange}>
                                                    {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                                </select>
                                            </div>
                                            <div className="auth-field">
                                                <label>Land Area (acres)</label>
                                                <input type="number" name="landArea" value={form.landArea} onChange={handleChange} placeholder="e.g. 5" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {form.role === 'buyer' && (
                                    <div className="auth-field">
                                        <label>Company / Organization Name</label>
                                        <input name="village" value={form.village} onChange={handleChange} placeholder="e.g. GreenChar Industries" />
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button type="button" className="auth-btn-outline" onClick={() => setStep(1)}>← Back</button>
                                    <button type="button" className="auth-btn" onClick={nextStep} style={{ flex: 1 }}>Next →</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div>
                                <div className="confirm-card">
                                    <h4>📋 Review Your Details</h4>
                                    <div className="cc-row"><span>Name</span><strong>{form.name}</strong></div>
                                    <div className="cc-row"><span>Email</span><strong>{form.email}</strong></div>
                                    <div className="cc-row"><span>Mobile</span><strong>+91 {form.mobile}</strong></div>
                                    <div className="cc-row"><span>Role</span><strong>{form.role === 'farmer' ? '🧑‍🌾 Farmer' : '🏭 Buyer'}</strong></div>
                                    {form.role === 'farmer' && <>
                                        <div className="cc-row"><span>District</span><strong>{form.district}</strong></div>
                                        <div className="cc-row"><span>Main Crop</span><strong>{form.cropType}</strong></div>
                                        <div className="cc-row"><span>Land Area</span><strong>{form.landArea} acres</strong></div>
                                    </>}
                                </div>
                                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                    <button type="button" className="auth-btn-outline" onClick={() => setStep(2)}>← Back</button>
                                    <button type="submit" className="auth-btn" style={{ flex: 1 }} disabled={loading}>
                                        {loading ? <span className="auth-spinner"></span> : '✅ Create Account'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>

                    <p className="auth-switch">
                        Already have an account?{' '}
                        <button className="auth-link" onClick={() => onSwitch('login')}>Login here</button>
                    </p>
                </div>
            </div>
        </div>
    );
}