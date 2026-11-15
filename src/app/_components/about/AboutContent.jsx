'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Award } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const AboutContent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectionSteps = [
    {
      n: "01",
      t: "Formula review",
      d: "We evaluate active percentages, pH levels, and allergen flags before testing a single drop."
    },
    {
      n: "02",
      t: "Independent testing",
      d: "Our resident dermatologists and panel test each candidate formula for 4 weeks."
    },
    {
      n: "03",
      t: "Ethical sourcing",
      d: "Cruelty-free certifications, sustainable packaging, and authorized supply chain checks."
    },
    {
      n: "04",
      t: "Routine compatibility",
      d: "Does it layer under SPF and makeup without pilling? Only the best make it onto our shelves."
    }
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-brand-roseLight w-full py-16 sm:py-24 border-b border-brand-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-rose">
              About us
            </span>
            <h1 className="d text-[46px] sm:text-[68px] lg:text-[84px] leading-[0.96] text-brand-dark m-0">
              Beauty, without the <span className="s text-brand-rose font-normal">guesswork.</span>
            </h1>
            <p className="text-brand-muted text-[17px] sm:text-[19px] leading-relaxed max-w-lg m-0">
              ABeauty &amp; Fashion started as a place for honest how-tos and buying guides. Now we stock the products we'd actually recommend — so you can learn, choose and shop in one place.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="primary" to="/shop">Shop the edit</Button>
              <Button variant="ghost" to="/#journal">Read the journal</Button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 grid-rows-2 gap-4 h-[460px] sm:h-[536px]">
            {/* Slot 1: Founder / Team Photo (Curated Beauty Testing) */}
            <div className="row-span-2 relative overflow-hidden rounded-[28px] p-6 flex flex-col justify-between shadow-xs group bg-[#F6D7E0]">
              <Image
                src="/images/about/about-founder-testing.jpg"
                alt="Curated beauty testing - Founder in studio"
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 360px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 pointer-events-none" />
              <div className="relative z-10">
                <Sparkles className="w-10 h-10 text-white/90 drop-shadow-sm" />
              </div>
              <span className="relative z-10 text-[11px] sm:text-[12px] font-bold tracking-wider uppercase text-white drop-shadow-sm">
                Curated beauty testing
              </span>
            </div>

            {/* Slot 2: Studio / Flat-lay (Clean Formulations) */}
            <div className="relative overflow-hidden rounded-[28px] p-6 flex items-end shadow-xs group bg-[#FCE6D9]">
              <Image
                src="/images/about/about-clean-formulations.jpg"
                alt="Clean formulations - studio flat-lay"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 240px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
              <span className="relative z-10 text-[11px] font-bold tracking-wider uppercase text-white drop-shadow-sm">
                Clean formulations
              </span>
            </div>

            {/* Slot 3: Product Testing (Dermatologist Approved) */}
            <div className="relative overflow-hidden rounded-[28px] p-6 flex items-end shadow-xs group bg-[#ECE4F6]">
              <Image
                src="/images/about/about-dermatologist-approved.jpg"
                alt="Dermatologist approved - skincare testing"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 240px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
              <span className="relative z-10 text-[11px] font-bold tracking-wider uppercase text-white drop-shadow-sm">
                Dermatologist approved
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-rose">Our story</span>
          <h2 className="d text-[38px] sm:text-[52px] leading-tight text-brand-dark m-0">
            From guides to a{' '}<span className="s text-[#C8325F] font-normal">store</span>
          </h2>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6 text-[18px] sm:text-[20px] text-brand-dark leading-relaxed">
          <p className="m-0 font-medium">
            Since 2024, we've published in-depth buying guides on skincare, hair care, personal care and everyday style — from <em>how to wash your face properly</em> to <em>how to choose the best facial steamer</em>.
          </p>
          <p className="text-brand-muted m-0">
            Readers kept asking the exact same question: <strong>"Which one should I actually buy?"</strong> So we built an e-commerce platform directly around that answer — a small, strictly curated catalogue of formulas and tools we've researched, tested in our own bathrooms, and wholeheartedly recommend to our loved ones.
          </p>
          <p className="text-brand-muted m-0">
            Every product on our shelves solves a genuine routine requirement without unnecessary filler ingredients, false marketing claims, or inflated markups.
          </p>
        </div>
      </section>

      {/* 4 Selection Steps */}
      <section className="bg-brand-pinkSubtle w-full py-20 sm:py-28 border-t border-b border-brand-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] flex flex-col gap-12">
          <div className="text-center flex flex-col items-center gap-2 max-w-xl mx-auto">
            <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-rose">How we choose</span>
            <h2 className="d text-[36px] sm:text-[48px] text-brand-dark m-0">
              Every product earns its{' '}<span className="s text-[#C8325F] font-normal">place</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectionSteps.map((st) => (
              <div key={st.n} className="bg-white rounded-[24px] p-6 sm:p-7 flex flex-col gap-4 border border-brand-border">
                <span className="w-12 h-12 rounded-full bg-brand-dark text-white font-bold text-[18px] flex items-center justify-center">
                  {st.n}
                </span>
                <h3 className="d text-[22px] text-brand-dark m-0">{st.t}</h3>
                <p className="text-brand-muted text-[15px] leading-relaxed m-0">{st.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContent;
