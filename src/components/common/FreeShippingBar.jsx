'use client';

import React from 'react';
import { Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export const FreeShippingBar = ({ className = '' }) => {
  const { subtotal, freeShippingAway, freeShippingProgress, FREE_SHIPPING_THRESHOLD } = useCart();
  const { isBn, formatPrice } = useLanguage();

  const isUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className={`bg-brand-roseLight rounded-[20px] p-4 sm:p-5 flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-brand-dark">
        <Truck className="w-5 h-5 text-brand-rose shrink-0" strokeWidth={1.8} />
        {isUnlocked ? (
          <span>
            {isBn ? (
              <strong>অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়ে গেছেন 🎉</strong>
            ) : (
              <strong>Congratulations! You unlocked free shipping 🎉</strong>
            )}
          </span>
        ) : (
          <span>
            {isBn ? (
              <>ফ্রি ডেলিভারি পেতে আরও <strong>{formatPrice(freeShippingAway)}</strong> টাকার পণ্য যোগ করুন</>
            ) : (
              <>You're <strong>${freeShippingAway.toFixed(2)}</strong> away from <strong>free shipping</strong></>
            )}
          </span>
        )}
      </div>

      <div
        className="h-2 rounded-full bg-white overflow-hidden"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuenow={freeShippingProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-brand-rose rounded-full transition-all duration-300"
          style={{ width: `${freeShippingProgress}%` }}
        />
      </div>
    </div>
  );
};

