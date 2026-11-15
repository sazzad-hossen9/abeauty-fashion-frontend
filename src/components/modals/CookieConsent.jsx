'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useModal } from '@/context/ModalContext';
import { useLanguage } from '@/context/LanguageContext';
import { safeStorage } from '@/utils/storage';
import { Settings, Check, ShieldCheck } from 'lucide-react';

export const CookieConsent = () => {
  const { cookieConsentDismissed, dismissCookieConsent } = useModal();
  const { isBn } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [closed, setClosed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Preference states
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    const savedConsent = safeStorage.getItem('abf_cookie_consent');
    if (savedConsent === 'true') {
      setClosed(true);
    }
  }, []);

  if (!mounted || closed || cookieConsentDismissed) return null;

  const handleAcceptAll = (e) => {
    e?.preventDefault();
    safeStorage.setItem('abf_cookie_consent', 'true');
    safeStorage.setItem('abf_cookie_analytics', 'true');
    safeStorage.setItem('abf_cookie_marketing', 'true');
    setClosed(true);
    dismissCookieConsent();
  };

  const handleRejectOptional = (e) => {
    e?.preventDefault();
    safeStorage.setItem('abf_cookie_consent', 'true');
    safeStorage.setItem('abf_cookie_analytics', 'false');
    safeStorage.setItem('abf_cookie_marketing', 'false');
    setClosed(true);
    dismissCookieConsent();
  };

  const handleSavePreferences = (e) => {
    e?.preventDefault();
    safeStorage.setItem('abf_cookie_consent', 'true');
    safeStorage.setItem('abf_cookie_analytics', String(analyticsEnabled));
    safeStorage.setItem('abf_cookie_marketing', String(marketingEnabled));
    setClosed(true);
    dismissCookieConsent();
  };

  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-8 lg:inset-x-[56px] z-[9999] max-w-[1440px] mx-auto pointer-events-auto animate-in slide-in-from-bottom duration-300">
      <div 
        role="dialog"
        aria-labelledby="cookie-title"
        className="bg-white border border-[#F1E4E8] rounded-[22px] p-[20px_22px] sm:p-[24px_28px] shadow-[0_30px_60px_-20px_rgba(31,18,25,0.32)] flex flex-col gap-5"
      >
        {/* Main Banner Row matching Desktop-Modals.dc.html lines 129-132 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-[32px]">
          <div className="flex-1 flex flex-col gap-[6px]">
            <h2 id="cookie-title" className="text-[17px] font-bold text-[#1F1219] m-0">
              {isBn ? 'আমরা কুকি ব্যবহার করি' : 'We use cookies'}
            </h2>
            <p className="mut text-[13px] sm:text-[14px] leading-[1.5] m-0">
              {isBn 
                ? 'আপনার শপিং ব্যাগ ও চেকআউট সচল রাখতে প্রয়োজনীয় কুকি ব্যবহার করা হয়। আপনার সম্মতিতে আমরা অ্যানালিটিক্স ও পার্সোনালাইজড রুটিন কুকিও ব্যবহার করি।' 
                : 'Essential cookies keep your bag and checkout working. With your OK we also use analytics and personalized routine cookies.'}{' '}
              <Link to="/privacy" className="text-[#1F1219] underline font-medium hover:text-[#C8325F] transition-colors">
                {isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-[10px] shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              className="btn ghost !h-[46px] !px-4 sm:!px-5 !text-[14px] flex-1 md:flex-none !shadow-[inset_0_0_0_1px_#D9C6CE] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#6E5A63]" />
              <span>{isBn ? (showSettings ? 'সেটিংস লুকান' : 'সেটিংস') : (showSettings ? 'Hide settings' : 'Settings')}</span>
            </button>
            <button
              type="button"
              onClick={handleRejectOptional}
              className="btn ghost !h-[46px] !px-4 sm:!px-5 !text-[14px] flex-1 md:flex-none cursor-pointer"
            >
              {isBn ? 'ঐচ্ছিক বাতিল' : 'Reject optional'}
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="btn !h-[46px] !px-5 sm:!px-6 !text-[14px] flex-1 md:flex-none font-bold !bg-[#1F1219] !text-white hover:!bg-[#C8325F] shadow-sm cursor-pointer"
            >
              {isBn ? 'সব গ্রহণ করুন' : 'Accept all'}
            </button>
          </div>
        </div>

        {/* Expandable Settings Panel */}
        {showSettings && (
          <div className="pt-4 border-t border-[#F1E4E8] flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Essential Cookies */}
              <div className="p-3.5 rounded-[16px] bg-[#FCEEF1]/60 border border-[#F1E4E8] flex flex-col justify-between gap-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[14px] text-brand-dark">
                      {isBn ? 'প্রয়োজনীয় কুকি' : 'Essential cookies'}
                    </span>
                    <span className="text-[11px] font-bold text-[#C8325F] bg-[#FCEEF1] px-2 py-0.5 rounded-full">
                      {isBn ? 'বাধ্যতামূলক' : 'Always Active'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6E5A63] mt-1 m-0">
                    {isBn ? 'শপিং ব্যাগ, পেমেন্ট ও লগইন সচল রাখার জন্য আবশ্যক।' : 'Required for shopping bag, secure checkout and auth sessions.'}
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div 
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`p-3.5 rounded-[16px] border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  analyticsEnabled ? 'bg-white border-[#C8325F]/40 shadow-xs' : 'bg-gray-50 border-gray-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[14px] text-brand-dark">
                      {isBn ? 'অ্যানালিটিক্স কুকি' : 'Analytics cookies'}
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${analyticsEnabled ? 'bg-[#C8325F] text-white' : 'border border-gray-300'}`}>
                      {analyticsEnabled && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <p className="text-[12px] text-[#6E5A63] mt-1 m-0">
                    {isBn ? 'সাইটের পারফরম্যান্স ও পেজ লোডিং স্পিড উন্নত করতে সাহায্য করে।' : 'Helps improve site speed, browsing performance and error tracking.'}
                  </p>
                </div>
              </div>

              {/* Marketing & Personalization */}
              <div 
                onClick={() => setMarketingEnabled(!marketingEnabled)}
                className={`p-3.5 rounded-[16px] border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  marketingEnabled ? 'bg-white border-[#C8325F]/40 shadow-xs' : 'bg-gray-50 border-gray-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[14px] text-brand-dark">
                      {isBn ? 'ব্যক্তিগত রুটিন কুকি' : 'Personalization cookies'}
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${marketingEnabled ? 'bg-[#C8325F] text-white' : 'border border-gray-300'}`}>
                      {marketingEnabled && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <p className="text-[12px] text-[#6E5A63] mt-1 m-0">
                    {isBn ? 'আপনার ত্বকের জন্য উপযোগী পণ্য ও রুটিন সুপারিশ প্রদর্শন করে।' : 'Used to recommend tailored skincare routines and relevant offers.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="btn rose !h-10 !px-5 !text-[13px] font-bold self-end"
              >
                {isBn ? 'পছন্দ সংরক্ষণ করুন' : 'Save preferences'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
