'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '@/utils/storage';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = safeStorage.getItem('abf_lang');
    if (saved && (saved === 'en' || saved === 'bn')) {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    safeStorage.setItem('abf_lang', lang);
    if (typeof document !== 'undefined') {
      if (lang === 'bn') {
        document.documentElement.lang = 'bn';
      } else {
        document.documentElement.lang = 'en';
      }
    }
  }, [lang]);

  const toggleLanguage = (targetLang) => {
    setLang(targetLang);
  };

  const isBn = lang === 'bn';

  // Format currency helper
  const formatPrice = (usdAmount) => {
    if (typeof usdAmount !== 'number') {
      usdAmount = parseFloat(usdAmount) || 0;
    }
    if (isBn) {
      // 1 USD ~ 110 BDT rate standard
      const bdt = Math.round(usdAmount * 110);
      return `৳${bdt.toLocaleString('bn-BD')}`;
    }
    return `$${usdAmount.toFixed(2)}`;
  };

  return (
    <LanguageContext.Provider value={{
      lang,
      isBn,
      setLang: toggleLanguage,
      formatPrice
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

