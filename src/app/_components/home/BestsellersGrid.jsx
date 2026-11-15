"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "@/components/common/Link";
import { ProductCard } from "@/components/common/ProductCard";
import { api } from "@/api/api";
import { useLanguage } from "@/context/LanguageContext";

export const BestsellersGrid = () => {
  const [activeTab, setActiveTab] = useState("bestsellers");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isBn } = useLanguage();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts({ limit: 48 });
      setProducts(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const tabs = [
    { id: "bestsellers", label: isBn ? "বেস্টসেলার" : "Bestsellers" },
    { id: "new", label: isBn ? "নতুন" : "New in" },
    { id: "skincare", label: isBn ? "স্কিনকেয়ার" : "Skincare" },
    { id: "tools", label: isBn ? "টুলস" : "Tools" },
    { id: "sale", label: isBn ? "অফার" : "On sale" },
  ];

  const getFilteredProducts = () => {
    if (!Array.isArray(products) || products.length === 0) return [];
    switch (activeTab) {
      case "new":
        return products.filter((p) => p.isNew || p.badge === "New").slice(0, 4);
      case "skincare":
        return products.filter((p) => p.category === "Skincare").slice(0, 4);
      case "tools":
        return products.filter((p) => p.category === "Beauty Tools").slice(0, 4);
      case "sale":
        return products.filter((p) => p.wasPrice || p.badge === "Sale").slice(0, 4);
      default: {
        const bestsellers = products.filter((p) => p.isBestseller || p.badge === "Bestseller");
        return (bestsellers.length > 0 ? bestsellers : products).slice(0, 4);
      }
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section
      className={`w-full ${
        isBn
          ? "pt-[32px] sm:pt-[56px] lg:pt-[72px] pb-[36px] sm:pb-[64px] lg:pb-[88px]"
          : "pt-[40px] sm:pt-[56px] lg:pt-[72px] pb-[48px] sm:pb-[64px] lg:pb-[84px]"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-[20px] sm:mb-[28px] lg:mb-[36px] gap-3">
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
                এই সপ্তাহের <span style={{ color: "#C8325F" }}>বেস্টসেলার</span>
              </>
            ) : (
              <>
                Bestsellers{" "}
                <span
                  className="s font-normal"
                  style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontStyle: "italic",
                    color: "#C8325F",
                  }}
                >
                  this week
                </span>
              </>
            )}
          </h2>

          {isBn ? (
            <Link
              to="/shop"
              className="font-semibold underline text-[#1F1219] hover:text-[#C8325F] text-[14px] sm:text-[16px] transition-colors shrink-0"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              সব দেখুন
            </Link>
          ) : (
            <div className="flex items-center gap-[8px] overflow-x-auto pb-1 pt-[-5px] w-full sm:w-auto scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pill shrink-0 ${activeTab === tab.id ? "on" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
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
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-[20px] border border-[#F1E4E8] bg-[#FFF7F8] p-10 text-center">
            <p className="text-[#6E5A63] text-[16px] font-medium m-0">
              {isBn ? "এখনো কোনো পণ্য যোগ করা হয়নি" : "No products yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-[24px]">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
