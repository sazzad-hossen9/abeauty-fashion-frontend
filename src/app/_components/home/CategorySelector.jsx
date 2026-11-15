"use client";

import React from "react";
import Link from "@/components/common/Link";
import {
  Droplets,
  Sparkles,
  Scissors,
  Heart,
  Flower2,
  Wand2,
} from "lucide-react";
import { SITE_CATEGORIES } from "@/constants/siteContent";
import { useLanguage } from "@/context/LanguageContext";

export const CategorySelector = () => {
  const { isBn } = useLanguage();

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case "droplets":
        return (
          <Droplets
            className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] lg:w-[52px] lg:h-[52px] text-[#8C6676]"
            strokeWidth={1.2}
          />
        );
      case "sparkles":
        return (
          <Sparkles
            className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] lg:w-[52px] lg:h-[52px] text-[#8C6676]"
            strokeWidth={1.2}
          />
        );
      case "scissors":
        return (
          <Scissors
            className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] lg:w-[52px] lg:h-[52px] text-[#8C6676]"
            strokeWidth={1.2}
          />
        );
      case "heart":
        return (
          <Heart
            className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] lg:w-[52px] lg:h-[52px] text-[#8C6676]"
            strokeWidth={1.2}
          />
        );
      case "flower":
        return (
          <Flower2
            className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] lg:w-[52px] lg:h-[52px] text-[#8C6676]"
            strokeWidth={1.2}
          />
        );
      default:
        return (
          <Wand2
            className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px] lg:w-[52px] lg:h-[52px] text-[#8C6676]"
            strokeWidth={1.2}
          />
        );
    }
  };

  return (
    <section
      className={`w-full ${
        isBn
          ? "pt-[32px] sm:pt-[64px] lg:pt-[80px] pb-[8px] sm:pb-[24px] xl:mb-5"
          : "pt-[40px] sm:pt-[62px] lg:pt-[88px] pb-[8px] sm:pb-[24px]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        {/* Header row with heading and right action matching Main.dc.html line 106 & Desktop-Home-BN.dc.html line 95 */}
        <div className="flex justify-between items-end mb-4 sm:mb-7 lg:mb-[36px]">
          <h2
            className="d m-0 text-[26px] sm:text-[38px] lg:text-[48px] text-[#1F1219] leading-tight"
            style={{
              fontFamily: isBn
                ? "'Anek Bangla', 'Hind Siliguri', sans-serif"
                : "'Bricolage Grotesque', system-ui, sans-serif",
            }}
          >
            {isBn ? (
              <>
                ক্যাটাগরি অনুযায়ী{" "}
                <span style={{ color: "#C8325F" }}>কেনাকাটা</span>
              </>
            ) : (
              <>
                <div className="">
                  Shop by
                  <span
                    className="s md:ml-2 font-normal"
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontStyle: "italic",
                      color: "#C8325F",
                    }}
                  >
                    category
                  </span>
                </div>
              </>
            )}
          </h2>

          <Link
            to="/shop"
            className="font-semibold text-[14px] sm:text-[15px] lg:text-[16px] text-[#1F1219] hover:text-[#C8325F] flex items-center gap-[8px] no-underline transition-colors shrink-0"
            style={{
              fontFamily: isBn
                ? "'Hind Siliguri', sans-serif"
                : "'DM Sans', sans-serif",
            }}
          >
            <span>{isBn ? "সব ক্যাটাগরি" : "All categories"}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6"></path>
            </svg>
          </Link>
        </div>

        {/* 6 circular items grid: 3-col on mobile matching Mobile-Home.dc.html line 82 & Mobile-Home-BN.dc.html line 69, 6-col on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-x-[10px] gap-y-[16px] sm:gap-[20px] lg:gap-[20px]">
          {SITE_CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${encodeURIComponent(c.name)}`}
              className="group flex flex-col items-center gap-2 sm:gap-[14px] lg:gap-[16px] no-underline text-center"
            >
              <div
                className="w-full aspect-square rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{ backgroundColor: c.tint }}
              >
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.imageAlt || (isBn && c.nameBn ? c.nameBn : c.name)}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getCategoryIcon(c.icon)
                )}
              </div>

              <span
                className="text-[13px] sm:text-[15px] lg:text-[18px] font-bold text-[#1F1219] group-hover:text-[#C8325F] transition-colors leading-tight"
                style={{
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
              >
                {isBn && c.nameBn ? c.nameBn : c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
