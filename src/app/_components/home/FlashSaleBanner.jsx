'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useLanguage } from '@/context/LanguageContext';

export const FlashSaleBanner = () => {
  const { isBn } = useLanguage();

  // Simple live countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 2, minutes: 45, seconds: 18 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigits = (num) => {
    const str = String(num).padStart(2, '0');
    if (!isBn) return str;
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return str.split('').map((d) => bnDigits[parseInt(d, 10)] || d).join('');
  };

  return (
    <section className="w-full pt-[20px] sm:pt-[28px] lg:pt-[40px] pb-0">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        {/* Banner container matching Desktop-Home-BN.dc.html lines 86-92 & Mobile-Home-BN.dc.html lines 60-65 */}
        <div className="bg-[#C8325F] text-white rounded-[22px] sm:rounded-[28px] p-[18px] sm:p-7 lg:py-[28px] lg:px-[36px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 lg:gap-[32px]">
          {/* Left Title and Subtitle */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            <span
              className="d font-bold text-[22px] sm:text-[30px] lg:text-[34px] leading-[1.2] text-white"
              style={{
                fontFamily: isBn
                  ? "'Anek Bangla', 'Hind Siliguri', sans-serif"
                  : "'Bricolage Grotesque', system-ui, sans-serif",
              }}
            >
              {isBn ? 'ফ্ল্যাশ সেল — ৪০% পর্যন্ত ছাড়' : 'Flash Sale — Up to 40% Off'}
            </span>
            <span
              className="text-[#FBE4EA] text-[13px] sm:text-[15px] lg:text-[16px]"
              style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
            >
              {isBn ? 'সীমিত স্টক · শেষ হওয়ার আগেই নিয়ে নিন' : 'Limited stock · Grab before it’s gone'}
            </span>
          </div>

          {/* Right Actions: Timer Chips & CTA Button */}
          <div className="flex items-center gap-3 sm:gap-[10px] w-full md:w-auto justify-between md:justify-end">
            {/* 3 Timer Chips */}
            <div className="flex gap-2 sm:gap-[10px] items-center" aria-label={isBn ? "অফার শেষ হতে বাকি" : "Offer ends in"}>
              <div className="cd w-[50px] h-[50px] sm:w-[64px] sm:h-[64px] rounded-[14px] sm:rounded-[16px] bg-white text-[#1F1219] flex flex-col items-center justify-center shadow-xs">
                <b
                  className="font-extrabold text-[18px] sm:text-[24px] leading-none text-[#1F1219]"
                  style={{ fontFamily: isBn ? "'Anek Bangla', sans-serif" : "'DM Sans', sans-serif" }}
                >
                  {formatDigits(timeLeft.hours)}
                </b>
                <span
                  className="text-[10px] sm:text-[12px] text-[#6E5A63] mt-0.5"
                  style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
                >
                  {isBn ? 'ঘণ্টা' : 'Hours'}
                </span>
              </div>
              <div className="cd w-[50px] h-[50px] sm:w-[64px] sm:h-[64px] rounded-[14px] sm:rounded-[16px] bg-white text-[#1F1219] flex flex-col items-center justify-center shadow-xs">
                <b
                  className="font-extrabold text-[18px] sm:text-[24px] leading-none text-[#1F1219]"
                  style={{ fontFamily: isBn ? "'Anek Bangla', sans-serif" : "'DM Sans', sans-serif" }}
                >
                  {formatDigits(timeLeft.minutes)}
                </b>
                <span
                  className="text-[10px] sm:text-[12px] text-[#6E5A63] mt-0.5"
                  style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
                >
                  {isBn ? 'মিনিট' : 'Mins'}
                </span>
              </div>
              <div className="cd w-[50px] h-[50px] sm:w-[64px] sm:h-[64px] rounded-[14px] sm:rounded-[16px] bg-white text-[#1F1219] flex flex-col items-center justify-center shadow-xs">
                <b
                  className="font-extrabold text-[18px] sm:text-[24px] leading-none text-[#1F1219]"
                  style={{ fontFamily: isBn ? "'Anek Bangla', sans-serif" : "'DM Sans', sans-serif" }}
                >
                  {formatDigits(timeLeft.seconds)}
                </b>
                <span
                  className="text-[10px] sm:text-[12px] text-[#6E5A63] mt-0.5"
                  style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
                >
                  {isBn ? 'সেকেন্ড' : 'Secs'}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/shop?filter=sale"
              className="btn light !h-[44px] sm:!h-[52px] !px-[16px] sm:!px-[28px] !text-[14px] sm:!text-[15px] shrink-0 font-semibold"
              style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
            >
              {isBn ? 'অফার দেখুন' : 'Shop Offers'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
