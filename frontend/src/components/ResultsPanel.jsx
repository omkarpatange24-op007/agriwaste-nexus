import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function ResultsPanel({ results, inputs }) {
  if (!results) return null;
  const { waste:w, biogas:bg, biochar:bc, credits:cr } = results;

  const barData = {
    labels: ['Residue Generated','Dry Biomass','Usable Biomass'],
    datasets: [{ label:'Tons', data:[w.residueGenerated, w.dryBiomass, w.usableBiomass], backgroundColor:['#2C5F2D','#4d9e4e','#97BC62'], borderRadius:8 }]
  };
  const donutData = {
    labels: ['Electricity Rev','Biochar Rev','Carbon Credits','Fertilizer Saving'],
    datasets: [{ data:[Math.round(bg.totalKWh*8), bc.estimatedRevenue, cr.incomeMid, cr.fertilizerSaving], backgroundColor:['#2C5F2D','#a0673a','#f59e0b','#2563eb'], borderWidth:0 }]
  };
  const barOpts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{legend:{display:false}},
    scales:{ y:{grid:{color:'#f3f4f6'}}, x:{grid:{display:false}} }
  };

  return (
    <div className="results-section">
      <div className="alert alert-success">
        ✅ Analysis complete for <strong>{inputs.cropType} ({inputs.area} {inputs.unit})</strong> — ICAR/FAO formula-based results
      </div>

      <div className="stats-grid">
        <div className="stat-card green"><div className="stat-emoji">🌾</div><div className="stat-label">Residue Generated</div><div className="stat-value">{w.residueGenerated}</div><div className="stat-unit">tons</div></div>
        <div className="stat-card green"><div className="stat-emoji">♻️</div><div className="stat-label">Usable Biomass</div><div className="stat-value">{w.usableBiomass}</div><div className="stat-unit">tons</div></div>
        <div className="stat-card amber"><div className="stat-emoji">🌍</div><div className="stat-label">CO₂ Avoided</div><div className="stat-value">{w.co2Avoided}</div><div className="stat-unit">tons CO₂</div></div>
        <div className="stat-card earth"><div className="stat-emoji">💰</div><div className="stat-label">Total Potential Income</div><div className="stat-value">₹{(cr.totalIncome/1000).toFixed(1)}K</div><div className="stat-unit">estimated</div></div>
      </div>

      <div className="results-grid" style={{ marginBottom:20 }}>
        <div className="card">
          <div className="card-header"><div className="card-icon green">📊</div><div><div className="card-title">Biomass Breakdown</div><div className="card-subtitle">tons</div></div></div>
          <div className="card-body"><div className="chart-wrapper"><Bar data={barData} options={barOpts} /></div></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-icon amber">💹</div><div><div className="card-title">Revenue Sources (₹)</div></div></div>
          <div className="card-body"><div className="chart-wrapper"><Doughnut data={donutData} options={{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'right',labels:{font:{size:10},boxWidth:10}}} }} /></div></div>
        </div>
      </div>

      <div className="results-grid">
        {/* Biogas */}
        <div className="card">
          <div className="card-header"><div className="card-icon green">🔥</div><div><div className="card-title">Biogas Potential</div></div></div>
          <div className="card-body">
            <div className="result-block">
              <h4>30-Day Digester</h4>
              <div className="result-row"><span className="key">Total Biogas</span><span className="val green">{bg.totalBiogasM3} m³</span></div>
              <div className="result-row"><span className="key">Daily Output</span><span className="val">{bg.dailyBiogasM3} m³/day</span></div>
              <div className="result-row"><span className="key">Electricity</span><span className="val green">{bg.totalKWh} kWh</span></div>
              <div className="result-row"><span className="key">LPG Equivalent</span><span className="val">{bg.lpgEquivalentKg} kg</span></div>
              <div className="result-row"><span className="key">Households/day</span><span className="val amber">{bg.householdsServed} homes</span></div>
              <div className="result-row"><span className="key">CO₂ Offset (LPG)</span><span className="val">{bg.co2OffsetLPG} t</span></div>
            </div>
          </div>
        </div>

        {/* Biochar */}
        <div className="card">
          <div className="card-header"><div className="card-icon earth">⚗️</div><div><div className="card-title">Biochar Recommendation</div></div></div>
          <div className="card-body">
            <div className="result-block">
              <h4>Slow Pyrolysis — {bc.pyrolysisTemp}°C</h4>
              <div className="result-row"><span className="key">Biochar Yield</span><span className="val green">{bc.biocharYield} tons</span></div>
              <div className="result-row"><span className="key">Temperature</span><span className="val">{bc.pyrolysisTemp}°C</span></div>
              <div className="result-row"><span className="key">Retention Time</span><span className="val">{bc.retentionTime}</span></div>
              <div className="result-row"><span className="key">Carbon Sequestered</span><span className="val green">{bc.carbonSequestered} t</span></div>
              <div className="result-row"><span className="key">Soil Benefit Score</span><span className="val amber">{bc.soilBenefitScore}/100</span></div>
              <div className="result-row"><span className="key">Est. Revenue</span><span className="val green">₹{Number(bc.estimatedRevenue).toLocaleString()}</span></div>
            </div>
            <p style={{ fontSize:'0.75rem', color:'#6b7280', marginTop:10 }}>💡 {bc.recommendation}</p>
          </div>
        </div>

        {/* Carbon Credits */}
        <div className="card">
          <div className="card-header"><div className="card-icon amber">🌍</div><div><div className="card-title">Carbon Credits</div></div></div>
          <div className="card-body">
            <div className="result-block">
              <h4>{cr.creditStandard}</h4>
              <div className="result-row"><span className="key">CO₂ Avoided</span><span className="val green">{cr.co2Avoided} t</span></div>
              <div className="result-row"><span className="key">Carbon Credits</span><span className="val green">{cr.carbonCredits}</span></div>
              <div className="result-row"><span className="key">Credit Income</span><span className="val green">₹{Number(cr.incomeMid).toLocaleString()}</span></div>
              <div className="result-row"><span className="key">Range</span><span className="val">₹{Number(cr.incomeLow).toLocaleString()} – ₹{Number(cr.incomeHigh).toLocaleString()}</span></div>
              <div className="result-row"><span className="key">Fertilizer Saving</span><span className="val">₹{Number(cr.fertilizerSaving).toLocaleString()}</span></div>
              <div className="result-row"><span className="key">Subsidy Potential</span><span className="val">₹{Number(cr.subsidyPotential).toLocaleString()}</span></div>
              <div className="result-row"><span className="key">Equiv. Trees</span><span className="val amber">🌳 {Number(cr.equivalentTrees).toLocaleString()}</span></div>
            </div>
            <div style={{ marginTop:14, padding:'12px 14px', background:'#e8f5e9', borderRadius:8 }}>
              <div style={{ fontSize:'0.7rem', color:'#2C5F2D', fontWeight:600 }}>TOTAL POTENTIAL INCOME</div>
              <div style={{ fontFamily:'Syne', fontSize:'1.7rem', fontWeight:800, color:'#2C5F2D' }}>₹{Number(cr.totalIncome).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}