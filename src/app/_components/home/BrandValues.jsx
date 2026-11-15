"use client";

import React from "react";
import { SITE_BRAND_VALUES } from "@/constants/siteContent";
import { useLanguage } from "@/context/LanguageContext";

export const BrandValues = () => {
  const { isBn } = useLanguage();

  const getSvgIcon = (idx) => {
    switch (idx) {
      case 0:
        return (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C8325F"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        );
      case 1:
        return (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C8325F"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="6" width="18" height="12" rx="2"></rect>
            <circle cx="12" cy="12" r="2.5"></circle>
          </svg>
        );
      case 2:
        return (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C8325F"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"></path>
            <circle cx="7" cy="18" r="1.6"></circle>
            <circle cx="17" cy="18" r="1.6"></circle>
          </svg>
        );
      default:
        return (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C8325F"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="11" width="14" height="10" rx="2"></rect>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
          </svg>
        );
    }
  };

  return (
    <section
      className={`w-full border-b border-[#F1E4E8] ${
        isBn
          ? "py-[28px] sm:py-[40px] lg:py-[48px]"
          : "py-[32px] sm:py-[40px] lg:pt-[58px] lg:pb-[30px]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        {/* 2-column grid on mobile matching Mobile-Home.dc.html line 175 & Mobile-Home-BN.dc.html line 105, 4-column on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[12px] gap-y-[20px] sm:gap-[24px] lg:gap-[24px]">
          {SITE_BRAND_VALUES.map((v, i) => (
            <div
              key={v.n}
              className="flex flex-col sm:flex-row gap-2.5 sm:gap-[16px] items-start"
            >
              {/* 50px/52px circular icon container in #FCEEF1 */}
              <div className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] lg:w-[52px] lg:h-[52px] rounded-full bg-[#FCEEF1] flex items-center justify-center shrink-0">
                {getSvgIcon(i)}
              </div>
              <div className="flex flex-col">
                <div
                  className=" md:mt-[-4px] font-bold text-[14px] sm:text-[16px] lg:text-[17px] text-[#1F1219]  sm:mb-[4px] leading-snug"
                  style={{
                    fontFamily: isBn
                      ? "'Hind Siliguri', sans-serif"
                      : "'DM Sans', sans-serif",
                  }}
                >
                  {isBn && v.tBn ? v.tBn : v.t}
                </div>
                <div
                  className="text-[#6E5A63] text-[12px] sm:text-[14px] lg:text-[15px] leading-[1.5]"
                  style={{
                    fontFamily: isBn
                      ? "'Hind Siliguri', sans-serif"
                      : "'DM Sans', sans-serif",
                  }}
                >
                  {isBn && v.dBn ? v.dBn : v.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
