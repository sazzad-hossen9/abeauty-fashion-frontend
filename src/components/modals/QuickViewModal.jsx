'use client';

import React from 'react';
import Image from 'next/image';
import Link from '@/components/common/Link';
import { X, Heart, Plus, Sparkles, Check } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/common/Button';
import { getPrimaryProductImage } from '@/utils/media';

export const QuickViewModal = () => {
  const { quickViewProduct, closeQuickView } = useModal();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isBn, formatPrice } = useLanguage();

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct);

  const handleAddToCart = () => {
    const img = getPrimaryProductImage(quickViewProduct);
    addToCart(
      {
        ...quickViewProduct,
        image: quickViewProduct.image || img?.url,
        imageAlt: quickViewProduct.imageAlt || img?.alt || quickViewProduct.name,
      },
      'Standard',
      1,
      true
    );
    closeQuickView();
  };

  const handleToggleWishlist = () => {
    const img = getPrimaryProductImage(quickViewProduct);
    toggleWishlist({
      ...quickViewProduct,
      image: quickViewProduct.image || img?.url,
      imageAlt: quickViewProduct.imageAlt || img?.alt || quickViewProduct.name,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#5B4752]/70 backdrop-blur-xs transition-opacity duration-200" 
        onClick={closeQuickView}
      />

      {/* Modal Dialog (matches Desktop-Modals 06) */}
      <div 
        role="dialog"
        aria-labelledby="quick-view-title"
        className="relative bg-white rounded-[28px] w-full max-w-[620px] p-5 sm:p-7 shadow-[0_40px_80px_-30px_rgba(20,8,14,0.6)] z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={closeQuickView}
          className="icb absolute right-3 top-3 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-brand-dark" />
        </button>

        {/* Visual Frame */}
        <div
          className="sm:col-span-5 h-[240px] sm:h-[340px] rounded-[20px] overflow-hidden flex items-center justify-center relative"
          style={{ backgroundColor: quickViewProduct.tint || '#E2ECF6' }}
        >
          {(() => {
            const img = getPrimaryProductImage(quickViewProduct);
            return img ? (
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, 260px"
                className="object-cover"
              />
            ) : (
              <>
                <Sparkles className="w-12 h-12 text-[#4A5A6E]" strokeWidth={1.2} />
                <span className="absolute bottom-3 text-[10px] font-bold tracking-widest text-[#4A5A6E] uppercase">
                  {quickViewProduct.category}
                </span>
              </>
            );
          })()}
        </div>

        {/* Details Side */}
        <div className="sm:col-span-7 flex flex-col justify-between py-1">
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold tracking-[0.14em] uppercase text-brand-rose">
              {quickViewProduct.category}
            </span>

            <h3 id="quick-view-title" className="d text-[24px] sm:text-[26px] leading-[1.15] text-brand-dark m-0">
              {quickViewProduct.name}
            </h3>

            <div className="flex items-baseline gap-2.5 mt-1">
              <span className="font-bold text-[22px] sm:text-[24px] text-brand-dark">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.wasPrice && (
                <span className="line-through text-brand-muted text-[16px]">
                  {formatPrice(quickViewProduct.wasPrice)}
                </span>
              )}
            </div>

            <p className="text-brand-muted text-[14px] leading-relaxed line-clamp-3 m-0 mt-1">
              {quickViewProduct.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex gap-2.5">
              <Button
                variant="rose"
                onClick={handleAddToCart}
                className="flex-1 !h-[50px]"
              >
                {isBn ? 'ব্যাগে যোগ করুন' : 'Add to bag'}
              </Button>

              <button
                onClick={handleToggleWishlist}
                aria-label="Add to wishlist"
                className={`w-[50px] h-[50px] rounded-full inline-flex items-center justify-center border border-brand-borderDark transition-colors ${
                  isFavorited ? 'text-brand-rose border-brand-rose bg-brand-roseLight' : 'text-brand-dark hover:bg-brand-roseLight'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-brand-rose text-brand-rose' : ''}`} strokeWidth={1.8} />
              </button>
            </div>

            <Link
              to={`/product/${quickViewProduct.id || quickViewProduct._id}`}
              onClick={closeQuickView}
              className="text-[14px] font-semibold text-brand-dark underline hover:text-brand-rose text-center no-underline"
            >
              {isBn ? 'সম্পূর্ণ বিবরণ দেখুন →' : 'View full details →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

