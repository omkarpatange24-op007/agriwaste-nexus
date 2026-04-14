import React, { useState } from 'react';
import { runLocalCalculation } from '../utils/api';

const CROPS = ['rice','wheat','maize','sugarcane','cotton','soybean'];

export default function CalculatorForm({ onResults }) {
  const [form, setForm] = useState({ cropType:'rice', area:2, yieldPerAcre:3, unit:'acres' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      let result;
      try {
        const res = await fetch('/api/calculator/full', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ ...form, area:+form.area, yieldPerAcre:+form.yieldPerAcre })
        });
        if (!res.ok) throw new Error('Backend unavailable');
        const data = await res.json();
        result = data.result;
      } catch {
        // Fallback: run calculation locally in the browser
        result = runLocalCalculation({ ...form, area:+form.area, yieldPerAcre:+form.yieldPerAcre });
      }
      onResults(result, form);
    } catch (err) {
      setError('Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setForm({ cropType:'rice', area:2, yieldPerAcre:3, unit:'acres' });
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon green">🌾</div>
        <div>
          <div className="card-title">Farm Details</div>
          <div className="card-subtitle">Enter your crop and field information</div>
        </div>
        <button className="btn btn-outline btn-sm" style={{ marginLeft:'auto' }} onClick={loadSample}>
          Load Sample Data
        </button>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-warning">⚠️ {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Crop Type</label>
              <select name="cropType" value={form.cropType} onChange={handleChange}>
                {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Land Area</label>
              <input type="number" name="area" value={form.area} min="0.1" step="0.1" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Area Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange}>
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </div>
            <div className="form-group">
              <label>Yield (tons per {form.unit==='hectares'?'hectare':'acre'})</label>
              <input type="number" name="yieldPerAcre" value={form.yieldPerAcre} min="0.1" step="0.1" onChange={handleChange} />
            </div>
          </div>
          <div style={{ marginTop:18, display:'flex', gap:10 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Calculating...' : '🔬 Calculate Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}