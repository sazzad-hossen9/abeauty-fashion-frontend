"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "./Link";
import { Eye, Check } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useModal } from "@/context/ModalContext";
import { useLanguage } from "@/context/LanguageContext";
import { getPrimaryProductImage } from "@/utils/media";

export const ProductCard = ({ product, showCategory = true }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { openQuickView } = useModal();
  const { isBn, formatPrice } = useLanguage();

  const [addedAnimation, setAddedAnimation] = useState(false);
  const [failedImageUrl, setFailedImageUrl] = useState(null);

  const isFavorited = isInWishlist(product);
  const targetId = product.slug || product.id || product._id;
  const primaryImage = getPrimaryProductImage(product);
  const showImage = Boolean(primaryImage && failedImageUrl !== primaryImage.url);
  const firstVariant = Array.isArray(product.variants) ? product.variants[0] : null;
  const displayPrice = product.price ?? firstVariant?.price ?? 0;
  const displayWasPrice = product.wasPrice ?? firstVariant?.compareAtPrice ?? null;
  const displayRating = product.rating ?? product.ratingAvg ?? 0;
  const normalizedCategoryKey = String(product.category || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant =
      product.sizes?.[0]?.name ||
      firstVariant?.label ||
      product.shades?.[0] ||
      "Standard";
    addToCart(
      {
        ...product,
        id: targetId,
        price: displayPrice,
        image: primaryImage?.url || product.image,
        imageAlt: primaryImage?.alt || product.imageAlt || product.name,
      },
      defaultVariant,
      1,
      true
    );
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      ...product,
      id: targetId,
      price: displayPrice,
      image: primaryImage?.url || product.image,
      imageAlt: primaryImage?.alt || product.imageAlt || product.name,
    });
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView({ ...product, id: targetId, price: displayPrice, wasPrice: displayWasPrice });
  };

  // Badge styling matching Main.dc.html & Desktop-Home-BN.dc.html line 165
  const rawBadge = product.badge ? String(product.badge) : "";
  const badgeText = rawBadge
    ? rawBadge.charAt(0).toUpperCase() + rawBadge.slice(1)
    : "";
  const isSale = badgeText.toLowerCase() === "sale" || badgeText === "ছাড়";
  const isNew = badgeText.toLowerCase() === "new" || badgeText === "নতুন";

  const categoryBnMap = {
    skincare: "স্কিনকেয়ার",
    makeup: "মেকআপ",
    "hair-care": "হেয়ার কেয়ার",
    "personal-care": "পার্সোনাল কেয়ার",
    "beauty-tools": "বিউটি টুলস",
    fragrance: "সুগন্ধি",
  };

  const categoryEnMap = {
    skincare: "Skincare",
    makeup: "Makeup",
    "hair-care": "Hair Care",
    "personal-care": "Personal Care",
    "beauty-tools": "Beauty Tools",
    fragrance: "Fragrance",
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-[14px] group relative select-none w-full">
      {/* Visual Image container with strict 4/5 aspect ratio and radius 20px matching Main.dc.html line 125 */}
      <div
        className="relative aspect-[4/5] w-full rounded-[16px] sm:rounded-[20px] overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-md"
        style={{ backgroundColor: product.tint || "#FBE4EA" }}
      >
        <Link
          to={`/product/${targetId}`}
          className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 text-brand-dark no-underline"
          aria-label={product.name}
        >
          {/* Product image (next/image for valid http(s) URLs; SVG placeholder when missing/"***") */}
          {showImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setFailedImageUrl(primaryImage.url)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="transform transition-transform duration-500 group-hover:scale-105 flex flex-col items-center justify-center text-[#8C6676]">
              {normalizedCategoryKey === "skincare" ? (
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="sm:w-[72px] sm:h-[72px]"
                >
                  <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                  <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                  <path d="M7 12h10M7 17h10"></path>
                </svg>
              ) : normalizedCategoryKey === "beauty-tools" ? (
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="sm:w-[72px] sm:h-[72px]"
                >
                  <path d="M4 9a5 5 0 0 1 5-5h7a4 4 0 0 1 0 8h-3l-2 8H8l1-8a5 5 0 0 1-5-3z"></path>
                </svg>
              ) : normalizedCategoryKey === "makeup" ? (
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="sm:w-[72px] sm:h-[72px]"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                </svg>
              ) : (
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="sm:w-[72px] sm:h-[72px]"
                >
                  <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"></path>
                </svg>
              )}
            </div>
          )}
        </Link>

        {/* Dynamic Badge matching Main.dc.html line 127 & Desktop-Home-BN.dc.html line 165 */}
        {badgeText && (
          <span
            className={`badge ${isSale ? "sale" : isNew ? "new" : ""}`}
            style={{
              fontFamily: isBn
                ? "'Hind Siliguri', sans-serif"
                : "'DM Sans', sans-serif",
            }}
          >
            {isBn
              ? isSale
                ? "ছাড়"
                : isNew
                  ? "নতুন"
                  : "বেস্টসেলার"
              : badgeText}
          </span>
        )}

        {/* Wishlist Button (Top Right, right: 6px/10px, top: 6px/10px) */}
        <button
          onClick={handleWishlistToggle}
          aria-label={
            isFavorited
              ? isBn
                ? "উইশলিস্ট থেকে মুছুন"
                : "Remove from wishlist"
              : isBn
                ? "উইশলিস্টে যোগ করুন"
                : "Add to wishlist"
          }
          className={`icb absolute right-[6px] sm:right-[10px] top-[6px] sm:top-[10px] !w-[34px] !h-[34px] sm:!w-[40px] sm:!h-[40px] !bg-white shadow-xs hover:scale-105 transition-all z-10 ${
            isFavorited ? "!text-brand-rose" : "!text-brand-dark"
          }`}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill={isFavorited ? "#C8325F" : "none"}
            stroke={isFavorited ? "#C8325F" : "currentColor"}
            strokeWidth="1.6"
            strokeLinejoin="round"
            aria-hidden="true"
            className="sm:w-[19px] sm:h-[19px]"
          >
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path>
          </svg>
        </button>

        {/* Placeholder label matching Desktop-Home-BN.dc.html line 108 */}
        {!showImage && (
          <span
            className="phl pointer-events-none"
            style={{
              fontFamily: isBn
                ? "'Hind Siliguri', sans-serif"
                : "'DM Sans', sans-serif",
            }}
          >
            {isBn ? "পণ্যের ছবি" : "Product photo"}
          </span>
        )}

        {/* Quick View Button (hover overlay) */}
        <button
          onClick={handleQuickViewClick}
          aria-label={isBn ? "এক ঝলক দেখুন" : "Quick view"}
          className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-x-4 top-1/2 -translate-y-1/2 h-10 rounded-full bg-white/90 backdrop-blur-xs text-brand-dark text-[13px] font-semibold items-center justify-center gap-2 shadow-xs hover:bg-white z-10"
        >
          <Eye className="w-4 h-4" />
          <span>{isBn ? "এক ঝলক দেখুন" : "Quick view"}</span>
        </button>

        {/* Quick Add To Bag Button (Bottom Right) matching Desktop-Home-BN.dc.html line 109 */}
        <button
          onClick={handleQuickAdd}
          aria-label={isBn ? "ব্যাগে যোগ করুন" : "Quick add to bag"}
          className={`icb absolute right-[6px] sm:right-[10px] bottom-[6px] sm:bottom-[10px] !w-[34px] !h-[34px] sm:!w-[40px] sm:!h-[40px] shadow-xs z-10 transition-all ${
            addedAnimation
              ? "!bg-brand-green !text-white scale-110"
              : "!bg-[#1F1219] !text-white hover:!bg-brand-rose"
          }`}
        >
          {addedAnimation ? (
            <Check
              className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce"
              strokeWidth={2.4}
            />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              className="sm:w-[18px] sm:h-[18px]"
            >
              <path d="M12 5v14M5 12h14"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Product Details Info matching Desktop-Home-BN.dc.html lines 110-111 */}
      <div className="flex flex-col">
        {/* Category row with fixed height */}
        <div
          className="text-[#6E5A63] text-[12px] sm:text-[14px] font-medium mb-[2px] sm:mb-[4px] h-[16px] sm:h-[18px] leading-[16px] sm:leading-[18px] truncate"
          style={{
            fontFamily: isBn
              ? "'Hind Siliguri', sans-serif"
              : "'DM Sans', sans-serif",
          }}
        >
          {showCategory
            ? isBn
              ? categoryBnMap[normalizedCategoryKey] || product.category
              : categoryEnMap[normalizedCategoryKey] || product.category
            : ""}
        </div>

        {/* Title with exact 38px/42px height for 2-line clamp matching Desktop-Home-BN.dc.html line 110 */}
        <div className="h-[38px] sm:h-[28px] overflow-hidden">
          <Link
            to={`/product/${targetId}`}
            className="font-semibold text-[14px] sm:text-[17px] leading-[1.3] sm:leading-[1.4] text-[#1F1219] hover:text-brand-rose transition-colors line-clamp-2 no-underline block"
            style={{
              fontFamily: isBn
                ? "'Hind Siliguri', sans-serif"
                : "'DM Sans', sans-serif",
            }}
            title={isBn && product.nameBn ? product.nameBn : product.name}
          >
            {isBn && product.nameBn ? product.nameBn : product.name}
          </Link>
        </div>

        {/* Price and rating / COD row matching Desktop-Home-BN.dc.html line 111 */}
        <div className="flex items-center justify-between ">
          <div className="flex items-baseline gap-1.5 sm:gap-[8px]">
            <span
              className="price text-[15px] sm:text-[17px] font-bold text-[#1F1219]"
              style={{
                fontFamily: isBn
                  ? "'Hind Siliguri', sans-serif"
                  : "'DM Sans', sans-serif",
              }}
            >
              {formatPrice(displayPrice)}
            </span>
            {displayWasPrice && (
              <span
                className="was text-[12px] sm:text-[14px] text-[#7A6570] line-through"
                style={{
                  fontFamily: isBn
                    ? "'Hind Siliguri', sans-serif"
                    : "'DM Sans', sans-serif",
                }}
              >
                {formatPrice(displayWasPrice)}
              </span>
            )}
          </div>

          {isBn ? (
            <span
              className="text-[12px] sm:text-[13px] font-semibold text-[#2E6B45]"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              COD
            </span>
          ) : (
            <span
              className="text-[12px] sm:text-[13px] font-semibold flex items-center gap-[4px] text-[#1F1219]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="stars text-brand-rose" aria-hidden="true">
                ★
              </span>
              <span>{displayRating}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
