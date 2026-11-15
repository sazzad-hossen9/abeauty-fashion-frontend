'use client';

import React, { useState } from 'react';
import Link from '@/components/common/Link';
import { X, ChevronDown, ChevronRight, User, ShoppingBag, Sparkles } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, openLoginModal } = useAuth();
  const { isBn } = useLanguage();
  const [skincareExpanded, setSkincareExpanded] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dimmed backdrop */}
      <div 
        className="absolute inset-0 bg-[#1F1219]/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over menu panel */}
      <nav 
        aria-label="Main menu"
        className="absolute left-0 top-0 bottom-0 w-[346px] max-w-[88vw] bg-white flex flex-col shadow-[20px_0_50px_-20px_rgba(31,18,25,0.5)] z-10 animate-in slide-in-from-left duration-300"
      >
        {/* Header with logo & close */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-brand-border">
          <Logo />
          <button 
            onClick={onClose}
            aria-label="Close menu"
            className="icb w-10 h-10"
          >
            <X className="w-5 h-5 text-brand-dark" />
          </button>
        </div>

        {/* Scrollable menu content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col">
          {/* User Sign in / Account Banner */}
          {user ? (
            <Link
              to="/account"
              onClick={onClose}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8F1F3] mb-3 no-underline text-brand-dark hover:bg-brand-roseLight transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-brand-rose font-bold">
                {user.firstName?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col">
                <strong className="text-[15px] font-semibold">
                  Hi, {user.firstName}
                </strong>
                <span className="text-[13px] text-brand-muted">
                  View account &amp; orders
                </span>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => { onClose(); openLoginModal(); }}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8F1F3] mb-3 text-left w-full hover:bg-brand-roseLight transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <User className="w-5 h-5 text-brand-dark" strokeWidth={1.7} />
              </div>
              <div className="flex flex-col">
                <strong className="text-[15px] font-semibold text-brand-dark">
                  {isBn ? 'লগইন বা রেজিস্টার' : 'Sign in or register'}
                </strong>
                <span className="text-[13px] text-brand-muted">
                  {isBn ? 'অর্ডার ট্র্যাক করুন, প্রিয় পণ্য সেভ করুন' : 'Track orders, save favourites'}
                </span>
              </div>
            </button>
          )}

          {/* Nav links */}
          <Link
            to="/shop"
            onClick={onClose}
            className="flex items-center justify-between h-[52px] font-semibold text-[17px] text-brand-dark border-b border-[#F4E9EC] no-underline hover:text-brand-rose"
          >
            <span>{isBn ? 'সব পণ্য' : 'Shop All'}</span>
            <ChevronRight className="w-4 h-4 text-brand-muted" />
          </Link>

          {/* Skincare Accordion */}
          <div className="border-b border-[#F4E9EC] py-1">
            <button
              type="button"
              onClick={() => setSkincareExpanded(!skincareExpanded)}
              className="flex items-center justify-between h-[52px] w-full font-semibold text-[17px] text-brand-rose hover:opacity-90"
              aria-expanded={skincareExpanded}
            >
              <span>{isBn ? 'স্কিনকেয়ার' : 'Skincare'}</span>
              {skincareExpanded ? (
                <ChevronDown className="w-4 h-4 text-brand-rose" />
              ) : (
                <ChevronRight className="w-4 h-4 text-brand-rose" />
              )}
            </button>
            {skincareExpanded && (
              <div className="flex flex-col pl-3.5 pb-2">
                <Link to="/shop?category=Skincare&type=Cleansers" onClick={onClose} className="flex items-center h-10 text-[15px] text-brand-muted hover:text-brand-dark no-underline">
                  {isBn ? 'ক্লিনজার' : 'Cleansers'}
                </Link>
                <Link to="/shop?category=Skincare&type=Serums" onClick={onClose} className="flex items-center h-10 text-[15px] text-brand-muted hover:text-brand-dark no-underline">
                  {isBn ? 'সিরাম' : 'Serums'}
                </Link>
                <Link to="/shop?category=Skincare&type=Moisturisers" onClick={onClose} className="flex items-center h-10 text-[15px] text-brand-muted hover:text-brand-dark no-underline">
                  {isBn ? 'ময়েশ্চারাইজার' : 'Moisturisers'}
                </Link>
                <Link to="/shop?category=Skincare&type=Masks" onClick={onClose} className="flex items-center h-10 text-[15px] text-brand-muted hover:text-brand-dark no-underline">
                  {isBn ? 'মাস্ক ও সানস্ক্রিন' : 'Masks & sunscreen'}
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/shop?category=Makeup"
            onClick={onClose}
            className="flex items-center justify-between h-[52px] font-semibold text-[17px] text-brand-dark border-b border-[#F4E9EC] no-underline hover:text-brand-rose"
          >
            <span>{isBn ? 'মেকআপ' : 'Makeup'}</span>
            <ChevronRight className="w-4 h-4 text-brand-muted" />
          </Link>

          <Link
            to="/shop?category=Hair+Care"
            onClick={onClose}
            className="flex items-center justify-between h-[52px] font-semibold text-[17px] text-brand-dark border-b border-[#F4E9EC] no-underline hover:text-brand-rose"
          >
            <span>{isBn ? 'হেয়ার কেয়ার' : 'Hair Care'}</span>
            <ChevronRight className="w-4 h-4 text-brand-muted" />
          </Link>

          <Link
            to="/shop?category=Personal+Care"
            onClick={onClose}
            className="flex items-center justify-between h-[52px] font-semibold text-[17px] text-brand-dark border-b border-[#F4E9EC] no-underline hover:text-brand-rose"
          >
            <span>{isBn ? 'ব্যক্তিগত যত্ন' : 'Personal Care'}</span>
            <ChevronRight className="w-4 h-4 text-brand-muted" />
          </Link>

          <Link
            to="/shop?category=Beauty+Tools"
            onClick={onClose}
            className="flex items-center justify-between h-[52px] font-semibold text-[17px] text-brand-dark border-b border-[#F4E9EC] no-underline hover:text-brand-rose"
          >
            <span>{isBn ? 'বিউটি টুলস' : 'Beauty Tools'}</span>
            <ChevronRight className="w-4 h-4 text-brand-muted" />
          </Link>

          <Link
            to="/shop?filter=sale"
            onClick={onClose}
            className="flex items-center justify-between h-[52px] font-semibold text-[17px] text-brand-rose border-b border-[#F4E9EC] no-underline"
          >
            <span>{isBn ? 'অফার ও সেল' : 'Sale'}</span>
            <ChevronRight className="w-4 h-4 text-brand-rose" />
          </Link>

          {/* The Glow Edit Promo Banner Card */}
          <Link
            to="/shop"
            onClick={onClose}
            className="mt-4 flex items-center gap-3.5 p-3.5 rounded-[20px] bg-brand-maroon text-white no-underline hover:opacity-95"
          >
            <div className="w-16 h-[72px] rounded-2xl bg-brand-darkCard flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-brand-accentPink" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold tracking-widest text-brand-accentPink uppercase">
                {isBn ? 'নতুন' : 'NEW'}
              </span>
              <span className="d text-[19px] leading-tight">
                The <span className="s text-brand-accentPink">Glow</span> Edit
              </span>
              <span className="text-[12px] text-brand-lightMuted">
                {isBn ? 'কালেকশন দেখুন →' : 'Shop the collection →'}
              </span>
            </div>
          </Link>

          {/* Quick secondary links */}
          <div className="flex flex-col gap-1 mt-4 text-[15px] text-brand-dark">
            <Link to="/#journal" onClick={onClose} className="h-10 flex items-center text-brand-dark hover:text-brand-rose no-underline">
              {isBn ? 'বিউটি জার্নাল' : 'Beauty Journal'}
            </Link>
            <Link to="/account" onClick={onClose} className="h-10 flex items-center text-brand-dark hover:text-brand-rose no-underline">
              {isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track my order'}
            </Link>
            <Link to="/contact" onClick={onClose} className="h-10 flex items-center text-brand-dark hover:text-brand-rose no-underline">
              {isBn ? 'যোগাযোগ ও সাহায্য' : 'Help & contact'}
            </Link>
            <Link to="/about" onClick={onClose} className="h-10 flex items-center text-brand-dark hover:text-brand-rose no-underline">
              {isBn ? 'আমাদের সম্পর্কে' : 'About us'}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

