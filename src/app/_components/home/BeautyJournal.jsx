"use client";

import React, { useState, useEffect } from "react";
import Link from "@/components/common/Link";
import { api } from "@/api/api";
import { useLanguage } from "@/context/LanguageContext";

export const BeautyJournal = () => {
  const { isBn } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getArticles()
      .then((data) => {
        if (isMounted) {
          setArticles(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load articles.");
          setArticles([]);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="journal"
      className={`w-full bg-[#FFF7F8] ${
        isBn
          ? "py-[32px] sm:py-[64px] lg:py-[88px]"
          : "py-[44px] sm:py-[64px] lg:py-[93px]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        {/* Header row matching Main.dc.html line 216 & Desktop-Home-BN.dc.html line 132 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-[24px] sm:mb-[32px] lg:mb-[40px] gap-3">
          <div className="flex flex-col gap-2 sm:gap-[12px]">
            <h2
              className="d text-[26px] sm:text-[38px] lg:text-[48px] text-[#1F1219] m-0 leading-tight"
              style={{
                fontFamily: isBn
                  ? "'Anek Bangla', 'Hind Siliguri', sans-serif"
                  : "'Bricolage Grotesque', system-ui, sans-serif",
              }}
            >
              {isBn ? (
                <>
                  বিউটি <span style={{ color: "#C8325F" }}>ব্লগ</span>
                </>
              ) : (
                <>
                  From the{" "}
                  <span
                    className="s font-normal"
                    style={{
                      fontFamily: "'Instrument Serif', Georgia, serif",
                      fontStyle: "italic",
                      color: "#C8325F",
                    }}
                  >
                    Beauty Journal
                  </span>
                </>
              )}
            </h2>
            {!isBn && (
              <p
                className="mut text-[15px] sm:text-[17px] m-0"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Honest how-tos and buying guides — with the products to match.
              </p>
            )}
          </div>

          {isBn ? (
            <Link
              to="/about"
              className="font-semibold underline text-[#1F1219] hover:text-[#C8325F] text-[14px] sm:text-[16px] transition-colors shrink-0"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              সব লেখা পড়ুন
            </Link>
          ) : (
            <Link
              to="/about"
              className="btn ghost sm shrink-0 !h-[44px] !px-[20px] !text-[14px]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Read the journal
            </Link>
          )}
        </div>

        {/* 3 Articles Grid matching Main.dc.html line 223 with gap 28px */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[28px]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-full aspect-[16/10] rounded-[20px] sm:rounded-[24px] bg-[#F1E4E8]/60 animate-pulse" />
            ))}
          </div>
        ) : error || articles.length === 0 ? (
          <div className="rounded-[20px] border border-[#F1E4E8] bg-white p-10 text-center">
            <p className="mut text-[15px] m-0">
              {error
                ? error
                : isBn
                ? "এখনো কোনো ব্লগ আর্টিকেল প্রকাশিত হয়নি।"
                : "No journal articles yet."}
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[28px]">
          {articles.map((article) => (
            <article
              key={article.id || article._id}
              className="flex flex-col gap-3 sm:gap-[16px]"
            >
              {/* Image card matching Main.dc.html line 226: aspect-ratio 16/10, radius 24px */}
              <div
                className="ph w-full aspect-[16/10] rounded-[20px] sm:rounded-[24px] overflow-hidden relative flex items-center justify-center"
                style={{ backgroundColor: article.tint || "#FBE4EA" }}
              >
                {article.image ? (
                  <img
                    src={article.image}
                    alt={
                      article.imageAlt ||
                      (isBn && article.titleBn ? article.titleBn : article.title)
                    }
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="phl">Article image</span>
                )}
              </div>

              {/* Tag with tracking-[0.1em] matching Main.dc.html line 227 */}
              <span
                className="self-start text-[12px] sm:text-[14px] font-bold tracking-[0.1em] uppercase text-[#C8325F]"
                style={{
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
              >
                {isBn && article.tagBn ? article.tagBn : article.tag}
              </span>

              {/* Title with font-size 24px and line-height 1.3 matching Main.dc.html line 228 */}
              <Link
                to="/about"
                className="d md:mt-[-2px] text-[18px] sm:text-[22px] lg:text-[24px] leading-[1.2] font-bold text-[#1F1219] hover:text-[#C8325F] transition-colors no-underline line-clamp-2"
                style={{
                  fontFamily: isBn
                    ? "'Anek Bangla', 'Hind Siliguri', sans-serif"
                    : "'Bricolage Grotesque', system-ui, sans-serif",
                }}
              >
                {isBn && article.titleBn ? article.titleBn : article.title}
              </Link>

              {/* Links row matching Desktop-Home-BN.dc.html line 135 */}
              <div
                className="flex gap-[18px] text-[14px] sm:text-[15px] font-semibold"
                style={{
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
              >
                {isBn ? (
                  <Link
                    to="/shop"
                    className="text-[#C8325F] hover:underline no-underline"
                  >
                    সংশ্লিষ্ট পণ্য দেখুন →
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/about"
                      className="text-[#1F1219] underline hover:text-[#C8325F]"
                    >
                      Read guide
                    </Link>
                    <Link
                      to="/shop"
                      className="text-[#C8325F] hover:underline no-underline"
                    >
                      Shop the products →
                    </Link>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
};
