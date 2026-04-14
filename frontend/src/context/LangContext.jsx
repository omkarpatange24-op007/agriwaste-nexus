import React, { createContext, useContext, useState } from 'react';
import translations from '../utils/translations';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    localStorage.getItem('agri_lang') || 'en'
  );

  function changeLang(newLang) {
    setLang(newLang);
    localStorage.setItem('agri_lang', newLang);
  }

  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || key;

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}