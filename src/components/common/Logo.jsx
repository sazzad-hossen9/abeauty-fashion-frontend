'use client';

import React from 'react';
import Image from 'next/image';
import Link from './Link';

export const Logo = ({ dark = false, className = '' }) => {
  // Footer Logo: Typographic brand logo matching design HTML (Main.dc.html line 264)
  if (dark) {
    return (
      <Link 
        href="/" 
        aria-label="ABeauty and Fashion home"
        className={`inline-flex items-center no-underline transition-opacity hover:opacity-90 ${className}`}
      >
        <span className="d text-[28px] sm:text-[32px] tracking-tight leading-none text-white">
          ABeauty <span className="s font-normal text-[#F4A9C0]">&amp;</span> Fashion
        </span>
      </Link>
    );
  }

  // Header / Navbar Logo: Official graphical brand logo badge (with stylized eye & calligraphy)
  return (
    <Link 
      href="/" 
      aria-label="ABeauty and Fashion home"
      className={`inline-flex items-center no-underline transition-opacity hover:opacity-95 ${className}`}
    >
      <Image 
        src="/logo.png" 
        alt="ABeauty & Fashion" 
        width={80}
        height={44}
        priority
        className="h-[44px] sm:h-[46px] w-auto object-contain block"
      />
    </Link>
  );
};

export default Logo;
