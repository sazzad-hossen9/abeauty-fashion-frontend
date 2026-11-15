"use client";

import React from "react";
import Link from "@/components/common/Link";
import { useLanguage } from "@/context/LanguageContext";

export const PromoBanners = () => {
  const { isBn } = useLanguage();

  if (isBn) {
    return (
      <section className="w-full pt-0 pb-[36px] sm:pb-[72px] lg:pb-[96px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
          {/* Exact 2-column grid matching Desktop-Home-BN.dc.html lines 117-129 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-[24px]">
            {/* Banner 1: Mobile Wallet Offer (#F6D7E0, height 360px, padding 44px, radius 32px) */}
            <div className="relative min-h-[220px] sm:h-[360px] rounded-[22px] sm:rounded-[32px] bg-[#F6D7E0] text-[#1F1219] p-6 sm:p-[44px] box-border flex flex-col justify-between overflow-hidden">
              <span
                className="eyebrow !text-[#A3244B] !text-[13px] sm:!text-[14px] font-bold"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                মোবাইল ওয়ালেট অফার
              </span>
              <h3
                className="d text-[24px] sm:text-[34px] lg:text-[40px] leading-[1.2] max-w-[380px] text-[#1F1219] m-0 font-bold"
                style={{
                  fontFamily: "'Anek Bangla', 'Hind Siliguri', sans-serif",
                }}
              >
                বিকাশ / নগদে পেমেন্টে ১০% ক্যাশব্যাক
              </h3>
              <span
                className="text-[13px] sm:text-[15px] text-[#6E5A63]"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                ন্যূনতম অর্ডার ৳১,৫০০ · শর্ত প্রযোজ্য
              </span>
              {/* Decorative circle matching line 122 */}
              <span
                aria-hidden="true"
                className="absolute -right-[40px] -top-[40px] w-[220px] h-[220px] rounded-full bg-[#C8325F]/[0.12] pointer-events-none"
              />
            </div>

            {/* Banner 2: Beauty Tools (#3A1830, height 360px, padding 44px, radius 32px) */}
            <div className="relative min-h-[220px] sm:h-[360px] rounded-[22px] sm:rounded-[32px] bg-[#3A1830] text-white p-6 sm:p-[44px] box-border flex flex-col justify-between">
              <span
                className="eyebrow !text-[#F4A9C0] !text-[13px] sm:!text-[14px] font-bold"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                বিউটি টুলস
              </span>
              <h3
                className="d text-[24px] sm:text-[34px] lg:text-[40px] leading-[1.2] text-white m-0 max-w-[420px] font-bold"
                style={{
                  fontFamily: "'Anek Bangla', 'Hind Siliguri', sans-serif",
                }}
              >
                ফেসিয়াল স্টিমার ও হেয়ার ড্রায়ারে ২৫% পর্যন্ত ছাড়
              </h3>
              <Link
                to="/shop?category=Beauty+Tools"
                className="btn light self-start !h-[44px] sm:!h-[52px] !px-[20px] sm:!px-[28px] !text-[14px] sm:!text-[15px] font-semibold"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                টুলস দেখুন
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // English Version matching Main.dc.html lines 152-171
  return (
    <section className="w-full pt-0 pb-[48px] sm:pb-[72px] lg:pb-[96px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        {/* 2-column grid with gap 24px matching Main.dc.html line 152 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-[24px]">
          {/* Banner 1: The Night Shift (#ECE4F6, height 440px, padding 52px, radius 32px) */}
          <div className="relative h-[340px] sm:h-[400px] lg:h-[440px] rounded-[26px] sm:rounded-[32px] bg-[#ECE4F6] overflow-hidden p-6 sm:p-10 lg:p-[52px] box-border flex flex-col justify-between">
            <div className="flex flex-col gap-2.5 sm:gap-[16px] max-w-[320px] relative z-10">
              <span
                className="eyebrow !text-[#5B3A78] !text-[12px] font-bold tracking-[0.16em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Night rituals
              </span>
              <h3
                className="d text-[28px] sm:text-[38px] lg:text-[46px] leading-[1] text-[#1F1219] m-0 font-bold"
                style={{
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                }}
              >
                The{" "}
                <span
                  className="ml-0 s font-normal"
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                  }}
                >
                  Night
                </span>{" "}
                Shift
              </h3>
              <p
                className="mut text-[14px] sm:text-[16px] leading-[1.55] m-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Wake up to better hair and skin — silk pillowcases, sleeping
                masks and repair oils.
              </p>
            </div>

            <Link
              to="/shop?category=Personal+Care"
              className="btn self-start relative z-10 !h-[44px] sm:!h-[52px] !px-[20px] sm:!px-[28px] !text-[14px] sm:!text-[15px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Shop night care
            </Link>

            {/* Photo card matching Main.dc.html line 160: right 32px, top 32px, bottom 32px, width 240px, bg #DCCFEE */}
            <div className="ph hidden md:flex absolute right-[24px] lg:right-[32px] top-[24px] lg:top-[32px] bottom-[24px] lg:bottom-[32px] w-[180px] lg:w-[240px] bg-[#DCCFEE] rounded-[20px] lg:rounded-[24px] overflow-hidden pointer-events-none">
              <img
                src="/images/banners/night-shift-silk-pillow.jpg"
                alt="Muted lavender mulberry silk pillowcase on an evening bed for overnight hair and skin care"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Banner 2: Tools that do the work (#3A1830, height 440px, padding 52px, radius 32px) */}
          <div className="relative h-[340px] sm:h-[400px] lg:h-[440px] rounded-[26px] sm:rounded-[32px] bg-[#3A1830] text-white overflow-hidden p-6 sm:p-10 lg:p-[52px] box-border flex flex-col justify-between">
            <div className="flex flex-col gap-2.5 sm:gap-[16px] max-w-[330px] relative z-10">
              <span
                className="eyebrow !text-[#F4A9C0] !text-[12px] font-bold tracking-[0.16em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Up to 25% off
              </span>
              <h3
                className="d text-[28px] sm:text-[38px] lg:text-[46px] leading-[1] text-white m-0 font-bold"
                style={{
                  fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                }}
              >
                Tools that{" "}
                <span
                  className="s font-normal"
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    color: "#F4A9C0",
                  }}
                >
                  do the work
                </span>
              </h3>
              <p
                className="text-[#E6D3DA] text-[14px] sm:text-[16px] leading-[1.55] m-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Facial steamers, ionic dryers and rollers — the ones that won
                our buying guides.
              </p>
            </div>

            <Link
              to="/shop?category=Beauty+Tools"
              className="btn light self-start relative z-10 !h-[44px] sm:!h-[52px] !px-[20px] sm:!px-[28px] !text-[14px] sm:!text-[15px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Shop beauty tools
            </Link>

            {/* Photo card matching Main.dc.html line 169: right 32px, top 32px, bottom 32px, width 240px, bg #542244 */}
            <div className="ph hidden md:flex absolute right-[24px] lg:right-[32px] top-[24px] lg:top-[32px] bottom-[24px] lg:bottom-[32px] w-[180px] lg:w-[240px] bg-[#542244] rounded-[20px] lg:rounded-[24px] overflow-hidden pointer-events-none">
              <img
                src="/images/banners/beauty-tools-showcase.jpg"
                alt="Facial steamer, ionic hair dryer, hair straightener, and facial roller beauty tools collection"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
