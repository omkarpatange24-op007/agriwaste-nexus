import React, { useState } from 'react';
import { useLang } from '../context/LangContext';

const LANGS = [
  { code:'en', label:'EN', full:'English', flag:'🇬🇧' },
  { code:'hi', label:'हि', full:'हिंदी',   flag:'🇮🇳' },
  { code:'mr', label:'म',  full:'मराठी',   flag:'🟠'  },
];

export default function LangToggle() {
  const { lang, changeLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGS.find(l => l.code === lang) || LANGS[0];

  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', background:'var(--green-100)', color:'var(--green-800)', border:'1.5px solid var(--green-400)', borderRadius:20, cursor:'pointer', fontSize:'0.82rem', fontWeight:700, fontFamily:"'DM Sans', sans-serif" }}>
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span style={{ fontSize:'0.65rem', opacity:0.6 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div style={{ position:'fixed', inset:0, zIndex:98 }} onClick={() => setOpen(false)} />
          <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'var(--white)', border:'1px solid var(--gray-300)', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:99, overflow:'hidden', minWidth:140 }}>
            <div style={{ padding:'8px 12px', fontSize:'0.68rem', color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:'0.8px', borderBottom:'1px solid var(--gray-100)' }}>
              Language / भाषा / भाषा
            </div>
            {LANGS.map(l => (
              <button key={l.code} onClick={() => { changeLang(l.code); setOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 14px', background: lang===l.code ? 'var(--green-50)' : 'transparent', border:'none', cursor:'pointer', fontSize:'0.88rem', fontFamily:"'DM Sans', sans-serif", color: lang===l.code ? 'var(--green-800)' : 'var(--gray-700)', fontWeight: lang===l.code ? 700 : 400, textAlign:'left' }}>
                <span style={{ fontSize:'1.1rem' }}>{l.flag}</span>
                <span>{l.full}</span>
                {lang === l.code && <span style={{ marginLeft:'auto', color:'var(--green-600)' }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}