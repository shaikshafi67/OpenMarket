import React, { createContext, useContext, useState } from 'react';
import { t, tCat } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('om_language') || 'English'
  );

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('om_language', lang);
  };

  const translate    = (key)     => t(language, key);
  const translateCat = (catName) => tCat(language, catName);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t: translate, tCat: translateCat }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
