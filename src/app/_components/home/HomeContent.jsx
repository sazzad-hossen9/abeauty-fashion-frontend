'use client';

import React, { useEffect } from 'react';
import { HeroBanner } from '@/app/_components/home/HeroBanner';
import { FlashSaleBanner } from '@/app/_components/home/FlashSaleBanner';
import { CategorySelector } from '@/app/_components/home/CategorySelector';
import { BestsellersGrid } from '@/app/_components/home/BestsellersGrid';
import { PromoBanners } from '@/app/_components/home/PromoBanners';
import { SkinQuizWidget } from '@/app/_components/home/SkinQuizWidget';
import { JustLandedGrid } from '@/app/_components/home/JustLandedGrid';
import { BeautyJournal } from '@/app/_components/home/BeautyJournal';
import { BrandValues } from '@/app/_components/home/BrandValues';
import { NewsletterSection } from '@/app/_components/home/NewsletterSection';

export const HomeContent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex-1 bg-white">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 1.5. Flash Sale Banner matching Desktop-Home-BN.dc.html lines 86-92 */}
      <FlashSaleBanner />

      {/* 2. Circular Category Selectors */}
      <CategorySelector />

      {/* 3. Bestsellers this week */}
      <BestsellersGrid />

      {/* 4. Split Promo Banners (The Night Shift & Tools that do the work) */}
      <PromoBanners />

      {/* 5. Routine Finder / Skin Quiz Widget */}
      <SkinQuizWidget />

      {/* 6. Just Landed Products Grid */}
      <JustLandedGrid />

      {/* 7. Editorial Beauty Journal */}
      <BeautyJournal />

      {/* 8. Trust Brand Values Row */}
      <BrandValues />

      {/* 9. Join the Glow List Newsletter */}
      <NewsletterSection />
    </main>
  );
};


export default HomeContent;
