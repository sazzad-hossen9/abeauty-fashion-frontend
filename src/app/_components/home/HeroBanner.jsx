"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "@/components/common/Link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/api/api";

export const HeroBanner = () => {
  const { addToCart, formatPrice: _unused } = useCart();
  const { isBn, formatPrice } = useLanguage();
  const [heroProduct, setHeroProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getProducts({ badge: "bestseller", limit: 4 })
      .then(({ items }) => {
        if (!isMounted) return;
        if (items.length > 0) {
          setHeroProduct(items[0]);
          return;
        }
        return api.getProducts({ limit: 1 }).then((fallback) => {
          if (isMounted) setHeroProduct(fallback.items?.[0] || null);
        });
      })
      .catch(() => {
        if (isMounted) setHeroProduct(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddHeroProduct = (e) => {
    e.preventDefault();
    if (!heroProduct) return;
    const defaultVariant =
      heroProduct.sizes?.[0]?.name || heroProduct.shades?.[0] || "Standard";
    addToCart(heroProduct, defaultVariant, 1, true);
  };

  return (
    <section
      className={`w-full bg-[#FCEEF1] ${
        isBn
          ? "py-[28px] sm:py-[48px] lg:pt-[64px] lg:pb-[72px]"
          : "py-[28px] sm:py-[48px] lg:pt-[72px] lg:pb-[80px]"
      }`}
    >
      <div
        className={`max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] grid grid-cols-1 items-center ${
          isBn
            ? "lg:grid-cols-[1fr_1fr] gap-8 lg:gap-[56px]"
            : "lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-[56px]"
        }`}
      >
        {/* Left Column: Copy, Headings & Action Buttons */}
        <div
          className={`flex flex-col ${isBn ? "gap-4 sm:gap-5 lg:gap-[24px]" : "gap-4 sm:gap-5 lg:gap-[28px]"}`}
        >
          {/* Eyebrow */}
          {isBn ? (
            <span
              className="text-[#C8325F] text-[14px] font-bold leading-none tracking-normal"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              ঈদ গ্লো কালেকশন ২০২৬
            </span>
          ) : (
            <span
              className="eyebrow text-[#C8325F] text-[12px] font-bold tracking-[0.16em] uppercase leading-none"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              New season · The Glow Edit
            </span>
          )}

          {/* H1 Heading */}
          {isBn ? (
            <h1
              className="m-0 font-bold text-[#1F1219] leading-[1.15]"
              style={{
                fontFamily: "'Anek Bangla', 'Hind Siliguri', sans-serif",
                letterSpacing: 0,
                fontSize: "clamp(32px, 5.25vw, 76px)",
              }}
            >
              <span className="block whitespace-nowrap">
                সৌন্দর্যে হোন <span style={{ color: "#C8325F" }}>স্মার্ট,</span>
              </span>
              <span className="block whitespace-nowrap">
                ফ্যাশনে হোন অনন্য।
              </span>
            </h1>
          ) : (
            <h1
              className="d m-0 font-bold text-[#1F1219] leading-[0.95]"
              style={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                letterSpacing: "-0.03em",
                fontSize: "clamp(38px, 6.4vw, 92px)",
              }}
            >
              <span className="block whitespace-nowrap">Be smart with</span>
              <span className="block whitespace-nowrap">
                <span
                  className="s font-normal inline-block text-[1.13em] leading-none mr-[0.14em]"
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    color: "#C8325F",
                    letterSpacing: "-0.01em",
                    marginLeft: 0,
                  }}
                >
                  beauty
                </span>
                &amp;
              </span>
              <span className="block whitespace-nowrap">fashion.</span>
            </h1>
          )}

          {/* Paragraph Subtitle */}
          {isBn ? (
            <p
              className="mut m-0 text-[#6E5A63] text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.75] max-w-[540px]"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              বাছাই করা স্কিনকেয়ার, মেকআপ, হেয়ার কেয়ার আর বিউটি টুলস — আমাদের
              বায়িং গাইডের মতোই যত্ন করে বেছে নেওয়া, যাতে আপনি কেবল কাজের
              জিনিসটাই কেনেন।
            </p>
          ) : (
            <p
              className="mut m-0 text-[#6E5A63] text-[16px] sm:text-[18px] lg:text-[19px] leading-[1.6] max-w-[540px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Curated skincare, makeup, hair care and beauty tools — picked with
              the same care as our buying guides, so you only buy what actually
              works.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-[12px]">
            {isBn ? (
              <>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-[10px] h-[54px] px-[28px] rounded-full bg-[#1F1219] text-white hover:bg-[#C8325F] transition-colors cursor-pointer no-underline text-[16px] font-semibold leading-none box-border"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  এখনই কিনুন
                </Link>
                <Link
                  to="/#quiz"
                  className="inline-flex items-center justify-center gap-[10px] h-[54px] px-[28px] rounded-full bg-transparent text-[#1F1219] shadow-[inset_0_0_0_1.5px_#1F1219] hover:bg-[#1F1219] hover:text-white transition-all cursor-pointer no-underline text-[16px] font-semibold leading-none box-border"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  আমার রুটিন খুঁজুন
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/shop"
                  className="btn inline-flex items-center justify-center gap-[10px] h-[52px] px-[28px] text-[15px] font-semibold leading-none rounded-full bg-[#1F1219] text-white hover:bg-[#C8325F] transition-colors no-underline box-border cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>Shop the Glow Edit</span>
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
                <Link
                  to="/#quiz"
                  className="btn ghost inline-flex items-center justify-center h-[52px] px-[28px] text-[15px] font-semibold leading-none rounded-full bg-transparent text-[#1F1219] shadow-[inset_0_0_0_1.5px_#1F1219] hover:bg-[#1F1219] hover:text-white transition-all no-underline box-border cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Find my routine
                </Link>
              </>
            )}
          </div>

          {/* Value Props Row */}
          {isBn ? (
            <div
              className="flex flex-wrap items-center gap-5 sm:gap-[24px] text-[15px] font-semibold text-[#1F1219]"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              <span className="flex items-center gap-[8px]">
                <svg
                  width="20"
                  height="20"
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
                ১০০% অরিজিনাল
              </span>
              <span className="flex items-center gap-[8px]">
                <svg
                  width="20"
                  height="20"
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
                ক্যাশ অন ডেলিভারি
              </span>
              <span className="flex items-center gap-[8px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8325F"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 9h11a5 5 0 0 1 0 10H8"></path>
                  <path d="M8 5 4 9l4 4"></path>
                </svg>
                সহজ রিটার্ন
              </span>
            </div>
          ) : (
            <div
              className="flex flex-wrap items-center gap-5 sm:gap-[28px] mt-[8px] text-[14px] font-semibold text-[#1F1219]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="flex items-center gap-[8px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8325F"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                100% authentic
              </span>
              <span className="flex items-center gap-[8px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8325F"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"></path>
                  <circle cx="7" cy="18" r="1.6"></circle>
                  <circle cx="17" cy="18" r="1.6"></circle>
                </svg>
                Free shipping $50+
              </span>
              <span className="flex items-center gap-[8px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8325F"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 9h11a5 5 0 0 1 0 10H8"></path>
                  <path d="M8 5 4 9l4 4"></path>
                </svg>
                Easy returns
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Visual Photo Card Composition */}
        <div
          className={`relative w-full ${
            isBn
              ? "h-[420px] sm:h-[480px] lg:h-[560px]"
              : "h-[440px] sm:h-[500px] lg:h-[580px]"
          }`}
        >
          {/* Card 1: Main Campaign Photo Frame (76% width, 100% height, right: 0, top: 0, border-radius: 32px) */}
          <div className="ph absolute right-0 top-0 w-[76%] h-full bg-[#F6D7E0] rounded-[32px] overflow-hidden">
            <img
              src="/images/hero/hero-campaign-model.jpg"
              alt={
                isBn
                  ? "উজ্জ্বল ত্বকের মডেল ক্যাম্পেইন পোর্ট্রেট"
                  : "Editorial beauty model portrait with luminous dewy skin against a blush pink backdrop"
              }
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Card 2: Texture Shot Floating Frame (36% width, 220px/230px height, left: 0, top: 50px/56px, border: 6px solid #FCEEF1, radius 28px) */}
          <div
            className={`ph absolute left-0 w-[46%] sm:w-[36%] bg-[#FCE6D9] border-[6px] border-[#FCEEF1] rounded-[28px] overflow-hidden z-10 ${
              isBn
                ? "top-4 sm:top-[50px] h-[180px] sm:h-[220px]"
                : "top-5 sm:top-[56px] h-[190px] sm:h-[230px]"
            }`}
          >
            <img
              src="/images/hero/hero-texture-swatch.jpg"
              alt={
                isBn
                  ? "হাইড্রেটিং স্কিনকেয়ার ক্রিম ও সিরাম টেক্সচার সোয়াচ"
                  : "Macro peach skincare cream swirl and translucent serum gel swatch"
              }
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 3: Floating Product Card (width: 310px/300px, padding: 14px, radius: 22px, left: 24px, bottom: 36px/40px) */}
          {heroProduct && (
          <div
            className={`absolute left-3 sm:left-[24px] bg-white rounded-[22px] p-[14px] flex gap-[14px] items-center shadow-[0_24px_48px_-20px_rgba(58,24,48,0.35)] z-20 ${
              isBn
                ? "bottom-4 sm:bottom-[36px] w-[295px] sm:w-[310px]"
                : "bottom-5 sm:bottom-[40px] w-[290px] sm:w-[300px]"
            }`}
          >
            {/* Thumbnail */}
            <div
              className={`rounded-[14px] bg-[#FBE4EA] shrink-0 flex items-center justify-center relative overflow-hidden ${
                isBn ? "w-[70px] h-[82px]" : "w-[72px] h-[84px]"
              }`}
              style={{ backgroundColor: heroProduct.tint || "#FBE4EA" }}
            >
              {heroProduct.image ? (
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.imageAlt || heroProduct.name}
                  fill
                  sizes="84px"
                  className="object-cover"
                />
              ) : !isBn ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8C6676"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="10" y="2" width="4" height="3" rx="0.5"></rect>
                  <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                </svg>
              ) : null}
            </div>

            {/* Product info and Add button */}
            <div
              className={`flex flex-col ${isBn ? "gap-[2px]" : "gap-[4px]"} flex-1 min-w-0`}
            >
              <span
                className="mut text-[#6E5A63] leading-none"
                style={{
                  fontSize: isBn ? "13px" : "12px",
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
              >
                {isBn
                  ? heroProduct.badge || "বেস্টসেলার"
                  : `${heroProduct.badge || "Featured"} · ${heroProduct.category}`}
              </span>
              <Link
                to={`/product/${heroProduct.id || heroProduct._id}`}
                className="font-bold text-[15px] leading-[1.25] text-[#1F1219] hover:text-[#C8325F] truncate no-underline block"
                style={{
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
                title={
                  isBn && heroProduct.nameBn
                    ? heroProduct.nameBn
                    : heroProduct.name
                }
              >
                {isBn && heroProduct.nameBn
                  ? heroProduct.nameBn
                  : heroProduct.name}
              </Link>
              <div className="flex justify-between items-center mt-1">
                <span
                  className="font-bold text-[#1F1219]"
                  style={{
                    fontSize: isBn ? "17px" : "16px",
                    fontFamily: isBn
                      ? "'Hind Siliguri', sans-serif"
                      : "'DM Sans', sans-serif",
                  }}
                >
                  {formatPrice(heroProduct.price)}
                </span>
                <button
                  onClick={handleAddHeroProduct}
                  className="inline-flex items-center justify-center h-[34px] px-[14px] rounded-full bg-[#C8325F] text-white hover:bg-[#A3244B] transition-colors font-bold cursor-pointer border-0"
                  style={{
                    fontSize: isBn ? "14px" : "13px",
                    fontFamily: isBn
                      ? "'Hind Siliguri', sans-serif"
                      : "'DM Sans', sans-serif",
                  }}
                >
                  {isBn ? "যোগ করুন" : "Add"}
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Card 4: Rotated Circular "New GLOW EDIT" Badge - English only matching Main.dc.html line 99 */}
          {!isBn && (
            <div className="absolute right-[-8px] sm:right-[-16px] top-[-8px] sm:top-[-16px] w-[96px] sm:w-[112px] h-[96px] sm:h-[112px] rounded-full bg-[#1F1219] text-white flex flex-col items-center justify-center -rotate-[10deg] shadow-lg z-20 pointer-events-none">
              <span
                className="s text-[28px] sm:text-[30px] leading-none font-normal text-white"
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                }}
              >
                New
              </span>
              <span
                className="text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-white mt-1 uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                GLOW EDIT
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
