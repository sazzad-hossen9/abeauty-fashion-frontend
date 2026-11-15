'use client';

import React from 'react';
import Link from '@/components/common/Link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export const AnnouncementBar = () => {
  const { isBn } = useLanguage();
  const pathname = usePathname();

  // Hide AnnouncementBar on Checkout, Search, and 404 matching Desktop-Checkout.dc.html, Desktop-Search.dc.html, Desktop-404.dc.html
  const knownPagesWithAnn = ['/', '/shop', '/about', '/contact', '/cart', '/account', '/privacy', '/terms'];
  const showAnnouncement =
    pathname === '/' ||
    knownPagesWithAnn.some((p) => pathname === p || pathname?.startsWith(p + '/')) ||
    pathname?.startsWith('/product/');

  if (!showAnnouncement) return null;

  return (
    <div className="bg-brand-maroon text-white h-10 px-4 flex items-center justify-center gap-4 sm:gap-7 text-[12px] sm:text-[13px] font-medium tracking-wide z-40 relative">
      {isBn ? (
        <>
          <span>৳২,০০০+ অর্ডারে ফ্রি ডেলিভারি</span>
          <span aria-hidden="true" className="opacity-50">•</span>
          <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
          <span aria-hidden="true" className="opacity-50 hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            হেল্পলাইন: ০১৭১২-৩৪৫৬৭৮
          </span>
        </>
      ) : (
        <>
          <span>Free shipping on orders over $50</span>
          <span aria-hidden="true" className="opacity-50">•</span>
          <span>
            New: The Glow Edit is live — <Link to="/shop" className="text-white underline font-semibold hover:text-brand-accentPink">Shop now</Link>
          </span>
          <span aria-hidden="true" className="opacity-50 hidden sm:inline">•</span>
          <span className="hidden sm:inline">Easy returns</span>
        </>
      )}
    </div>
  );
};
