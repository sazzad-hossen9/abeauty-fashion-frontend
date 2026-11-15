'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '@/utils/storage';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Success Modals
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [contactSuccessModal, setContactSuccessModal] = useState(null); // { ref: '#T-2081', email: '...' }
  const [orderSuccessModal, setOrderSuccessModal] = useState(null); // { order: ... }

  // Cookie Consent banner - safe client-only initialization to prevent hydration mismatch
  const [cookieConsentDismissed, setCookieConsentDismissed] = useState(true);

  useEffect(() => {
    setCookieConsentDismissed(safeStorage.getItem('abf_cookie_consent') === 'true');
  }, []);

  const dismissCookieConsent = () => {
    safeStorage.setItem('abf_cookie_consent', 'true');
    setCookieConsentDismissed(true);
  };

  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <ModalContext.Provider value={{
      quickViewProduct,
      openQuickView,
      closeQuickView,
      newsletterModalOpen,
      setNewsletterModalOpen,
      contactSuccessModal,
      setContactSuccessModal,
      orderSuccessModal,
      setOrderSuccessModal,
      cookieConsentDismissed,
      dismissCookieConsent
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

