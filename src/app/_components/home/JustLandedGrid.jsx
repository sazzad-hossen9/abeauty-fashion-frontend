"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "@/components/common/Link";
import { ProductCard } from "@/components/common/ProductCard";
import { api } from "@/api/api";
import { useLanguage } from "@/context/LanguageContext";

export const JustLandedGrid = () => {
  const { isBn } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts({ badge: "new", limit: 4 });
      if (data.items.length > 0) {
        setProducts(data.items.slice(0, 4));
      } else {
        const latest = await api.getProducts({ sort: "newest", limit: 4 });
        setProducts((latest.items || []).slice(0, 4));
      }
    } catch (err) {
      setError(err.message || "Failed to load new arrivals.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <section className="w-full pt-[49px] sm:pt-[64px] lg:pt-[96px] pb-[44px] sm:pb-[64px] lg:pb-[88px]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        <div className="flex justify-between items-end mb-[20px] sm:mb-[28px] lg:mb-[36px]">
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
                সদ্য যুক্ত <span style={{ color: "#C8325F" }}>পণ্য</span>
              </>
            ) : (
              <div>
                Just{" "}
                <span
                  className="s font-normal"
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    color: "#C8325F",
                  }}
                >
                  landed
                </span>
              </div>
            )}
          </h2>

          <Link
            to="/shop?filter=new"
            className="font-semibold text-[14px] sm:text-[15px] lg:text-[16px] text-[#1F1219] hover:text-[#C8325F] flex items-center gap-[8px] no-underline transition-colors shrink-0"
            style={{
              fontFamily: isBn
                ? "'Hind Siliguri', sans-serif"
                : "'DM Sans', sans-serif",
            }}
          >
            <span>{isBn ? "নতুন পণ্য দেখুন" : "Shop new in"}</span>
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

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-[24px]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-[16px] sm:rounded-[20px] bg-[#F8F1F3] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[20px] border border-[#F1E4E8] bg-[#FFF7F8] p-8 text-center flex flex-col items-center gap-3">
            <p className="text-[#6E5A63] text-[15px] m-0">{error}</p>
            <button onClick={loadProducts} className="btn ghost sm">
              {isBn ? "আবার চেষ্টা করুন" : "Try again"}
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[20px] border border-[#F1E4E8] bg-[#FFF7F8] p-10 text-center">
            <p className="text-[#6E5A63] text-[16px] font-medium m-0">
              {isBn ? "এখনো কোনো পণ্য যোগ করা হয়নি" : "No products yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-[24px]">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
