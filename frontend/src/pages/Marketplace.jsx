import React, { useState } from 'react';

const MOCK_LISTINGS = [
  { id:'L001', farmerName:'Ramesh Patil',  location:'Nashik, MH',  cropType:'rice',      wasteType:'Rice Straw',  quantity:15, pricePerTon:1200, contact:'+91-9876543210', status:'available', postedDate:'2026-03-15', description:'Dry rice straw, low ash. Suitable for biogas/biochar.' },
  { id:'L002', farmerName:'Suresh Jadhav', location:'Pune, MH',    cropType:'wheat',     wasteType:'Wheat Stubble',quantity:8, pricePerTon:900,  contact:'+91-9123456789', status:'available', postedDate:'2026-03-18', description:'Post-harvest wheat straw. Delivery within 50km.' },
  { id:'L003', farmerName:'Anita Shinde',  location:'Solapur, MH', cropType:'sugarcane', wasteType:'Bagasse',     quantity:30, pricePerTon:600,  contact:'+91-9988776655', status:'available', postedDate:'2026-03-20', description:'High calorific bagasse. Bulk available.' },
  { id:'L004', farmerName:'Vijay Kulkarni',location:'Kolhapur, MH',cropType:'maize',     wasteType:'Maize Stalks',quantity:12, pricePerTon:1100, contact:'+91-9765432100', status:'available', postedDate:'2026-03-22', description:'Dried corn stalks for biomass energy.' },
];

const MOCK_BUYERS = [
  { id:'B001', name:'Maharashtra Biogas Authority', type:'Biogas Plant',    location:'Pune',     acceptedWaste:['rice','wheat','maize'],       capacity:'50T/day',  phone:'+91-2012345678', rating:4.5 },
  { id:'B002', name:'GreenChar Industries',         type:'Biochar Mfr',    location:'Nashik',   acceptedWaste:['rice','wheat','cotton'],       capacity:'20T/day',  phone:'+91-2534567890', rating:4.8 },
  { id:'B003', name:'SugarEnergy Co-op',            type:'Biomass Power',  location:'Solapur',  acceptedWaste:['sugarcane','cotton'],          capacity:'100T/day', phone:'+91-2174563210', rating:4.2 },
  { id:'B004', name:'AgroCompost Ltd.',             type:'Compost',        location:'Kolhapur', acceptedWaste:['rice','wheat','maize','soybean'],capacity:'30T/day', phone:'+91-2312345670', rating:4.0 },
];

const CROP_EMOJI = { rice:'🌾', wheat:'🌿', maize:'🌽', sugarcane:'🎋', cotton:'🌼', soybean:'🫘' };
const TYPE_COLOR = { 'Biogas Plant':'#2C5F2D', 'Biochar Mfr':'#a0673a', 'Biomass Power':'#f59e0b', 'Compost':'#2563eb' };

function Stars({ rating }) {
  return <span style={{ color:'#f59e0b' }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5-Math.floor(rating))} {rating}</span>;
}

export default function Marketplace() {
  const [tab, setTab]           = useState('listings');
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [contacted, setContacted] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast]       = useState('');
  const [form, setForm]         = useState({ farmerName:'', location:'', cropType:'rice', wasteType:'', quantity:'', pricePerTon:'', contact:'', description:'' });

  function showMsg(msg) { setToast(msg); setTimeout(() => setToast(''), 3500); }
  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  function handlePost(e) {
    e.preventDefault();
    if (!form.farmerName || !form.quantity) return;
    const newL = { ...form, id:`L${Date.now()}`, status:'available', postedDate:new Date().toISOString().split('T')[0] };
    setListings(l => [newL, ...l]);
    setForm({ farmerName:'', location:'', cropType:'rice', wasteType:'', quantity:'', pricePerTon:'', contact:'', description:'' });
    setShowForm(false);
    showMsg('✅ Your listing has been posted!');
  }

  function handleContact(buyer) {
    setContacted(c => ({ ...c, [buyer.id]: true }));
    showMsg(`📞 Request sent to ${buyer.name}. They'll respond within 24 hours.`);
  }

  return (
    <div>
      {toast && (
        <div className="alert alert-success" style={{ position:'fixed', top:20, right:20, zIndex:999, maxWidth:400 }}>{toast}</div>
      )}

      <div className="tabs">
        <button className={`tab-btn ${tab==='listings'?'active':''}`} onClick={() => setTab('listings')}>🌾 Farmer Listings ({listings.length})</button>
        <button className={`tab-btn ${tab==='buyers'?'active':''}`}   onClick={() => setTab('buyers')}>🏭 Buyers & Plants ({MOCK_BUYERS.length})</button>
      </div>

      {tab === 'listings' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
            <div>
              <h3 style={{ fontFamily:'Syne', fontSize:'1rem' }}>Available Farm Waste</h3>
              <p style={{ fontSize:'0.77rem', color:'#6b7280' }}>Connect with farmers selling agricultural residue</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ List Your Waste'}
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom:18 }}>
              <div className="card-header"><div className="card-icon green">📝</div><div><div className="card-title">Post New Listing</div></div></div>
              <div className="card-body">
                <form onSubmit={handlePost}>
                  <div className="form-grid">
                    <div className="form-group"><label>Your Name *</label><input name="farmerName" value={form.farmerName} onChange={handleChange} placeholder="Farmer name" required /></div>
                    <div className="form-group"><label>Location</label><input name="location" value={form.location} onChange={handleChange} placeholder="Village, District" /></div>
                    <div className="form-group"><label>Crop Type</label><select name="cropType" value={form.cropType} onChange={handleChange}>{['rice','wheat','maize','sugarcane','cotton','soybean'].map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                    <div className="form-group"><label>Waste Type</label><input name="wasteType" value={form.wasteType} onChange={handleChange} placeholder="e.g. Rice Straw" /></div>
                    <div className="form-group"><label>Quantity (tons)*</label><input type="number" name="quantity" value={form.quantity} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Price/Ton (₹)</label><input type="number" name="pricePerTon" value={form.pricePerTon} onChange={handleChange} /></div>
                    <div className="form-group"><label>Contact</label><input name="contact" value={form.contact} onChange={handleChange} /></div>
                    <div className="form-group"><label>Description</label><input name="description" value={form.description} onChange={handleChange} /></div>
                  </div>
                  <div style={{ marginTop:14, display:'flex', gap:10 }}>
                    <button type="submit" className="btn btn-primary">Post Listing</button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="marketplace-grid">
            {listings.map(l => (
              <div className="listing-card" key={l.id}>
                <div className="listing-header">
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div><span style={{ fontSize:'1.3rem' }}>{CROP_EMOJI[l.cropType]||'🌿'}</span><div style={{ fontFamily:'Syne', fontWeight:700, marginTop:3 }}>{l.wasteType}</div></div>
                    <span className="listing-tag">{l.cropType}</span>
                  </div>
                </div>
                <div className="listing-body">
                  <div className="listing-price">₹{l.pricePerTon?.toLocaleString()}<span style={{ fontSize:'0.72rem', fontWeight:400, color:'#6b7280' }}>/ton</span></div>
                  <div className="listing-stat"><span>👨‍🌾</span><strong>{l.farmerName}</strong></div>
                  <div className="listing-stat"><span>📍</span><strong>{l.location}</strong></div>
                  <div className="listing-stat"><span>📦</span><strong>{l.quantity} tons</strong></div>
                  <div className="listing-stat"><span>📅</span><strong>{l.postedDate}</strong></div>
                  {l.description && <p style={{ fontSize:'0.75rem', color:'#6b7280', marginTop:7, lineHeight:1.4 }}>{l.description}</p>}
                </div>
                <div className="listing-footer">
                  <span style={{ fontSize:'0.7rem', padding:'3px 8px', background:'#e8f5e9', color:'#2C5F2D', borderRadius:20, fontWeight:600 }}>Available</span>
                  {l.contact && <a href={`tel:${l.contact}`} className="btn btn-outline btn-sm" style={{ textDecoration:'none' }}>📞 Call</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'buyers' && (
        <div>
          <h3 style={{ fontFamily:'Syne', fontSize:'1rem', marginBottom:6 }}>Verified Buyers & Plants</h3>
          <p style={{ fontSize:'0.77rem', color:'#6b7280', marginBottom:18 }}>Connect with industrial buyers for your waste</p>
          <div className="marketplace-grid">
            {MOCK_BUYERS.map(b => (
              <div className="listing-card" key={b.id}>
                <div className="listing-header" style={{ background: TYPE_COLOR[b.type]||'#2C5F2D' }}>
                  <div style={{ fontFamily:'Syne', fontWeight:700 }}>{b.name}</div>
                  <div style={{ fontSize:'0.73rem', opacity:0.8, marginTop:2 }}>{b.type}</div>
                </div>
                <div className="listing-body">
                  <div style={{ marginBottom:8 }}><Stars rating={b.rating} /></div>
                  <div className="listing-stat"><span>📍</span><strong>{b.location}</strong></div>
                  <div className="listing-stat"><span>⚙️</span><strong>{b.capacity}</strong></div>
                  <div className="listing-stat"><span>♻️</span><strong>{b.acceptedWaste.join(', ')}</strong></div>
                </div>
                <div className="listing-footer">
                  {contacted[b.id]
                    ? <span style={{ fontSize:'0.8rem', color:'#2C5F2D', fontWeight:600 }}>✅ Request Sent</span>
                    : <button className="btn btn-primary btn-sm" onClick={() => handleContact(b)}>📬 Contact</button>}
                  <a href={`tel:${b.phone}`} className="btn btn-outline btn-sm" style={{ textDecoration:'none' }}>📞</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}