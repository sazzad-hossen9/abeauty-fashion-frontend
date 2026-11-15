'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Check, Plus } from 'lucide-react';
import { api } from '@/api/api';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

const STEP_TINTS = { 1: '#E2EEE5', 2: '#FBE4EA', 3: '#ECE4F6' };

export const RoutineBundle = ({ products: passedProducts }) => {
  const { addToCart } = useCart();
  const { isBn, formatPrice } = useLanguage();
  const [addedAll, setAddedAll] = useState(false);
  const [bundleProducts, setBundleProducts] = useState([]);

  useEffect(() => {
    if (Array.isArray(passedProducts)) {
      const steps = passedProducts
        .filter((p) => p?.bundleStep?.number)
        .sort((a, b) => a.bundleStep.number - b.bundleStep.number)
        .slice(0, 3);
      setBundleProducts(steps);
      return;
    }

    let isMounted = true;
    api
      .getProducts({ limit: 48 })
      .then(({ items }) => {
        if (!isMounted) return;
        const steps = (items || [])
          .filter((p) => p?.bundleStep?.number)
          .sort((a, b) => a.bundleStep.number - b.bundleStep.number)
          .slice(0, 3);
        setBundleProducts(steps);
      })
      .catch(() => {
        if (isMounted) setBundleProducts([]);
      });
    return () => {
      isMounted = false;
    };
  }, [passedProducts]);

  if (bundleProducts.length < 3) {
    return null;
  }

  const routineSteps = bundleProducts.map((product) => ({
    step: `Step ${product.bundleStep.number} · ${product.bundleStep.label}`,
    stepBn: `ধাপ ${product.bundleStep.number} · ${product.bundleStep.label}`,
    product,
    name: product.name,
    price: Number(product.price) || 0,
    tint: product.tint || STEP_TINTS[product.bundleStep.number] || '#FBE4EA',
  }));

  const originalTotal = routineSteps.reduce((acc, s) => acc + s.price, 0);
  const discountedTotal = originalTotal * 0.9;

  const handleAddAll = () => {
    routineSteps.forEach((s) => {
      const variant = s.product.sizes?.[0]?.name || 'Standard';
      addToCart(s.product, variant, 1, false);
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <section className="bg-brand-roseLight rounded-[32px] p-6 sm:p-10 lg:p-12 my-12 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <span className="text-[12px] font-bold tracking-[0.14em] uppercase text-brand-rose">
            {isBn ? 'বান্ডেল অফার · ১০% ছাড়' : 'Bundle & save 10%'}
          </span>
          <h2 className="d text-[32px] sm:text-[40px] leading-[1.05] text-brand-dark m-0">
            {isBn ? (
              <>সম্পূর্ণ করুন <span className="text-[#C8325F] font-semibold">রুটিন</span></>
            ) : (
              <>Complete the <span className="s text-[#C8325F] font-normal">routine</span></>
            )}
          </h2>
          <p className="text-brand-muted text-[15px] leading-relaxed m-0">
            {isBn
              ? 'ক্লিনজ, হাইড্রেট এবং ময়েশ্চার সিল — ত্বক সুস্থ ও সতেজ রাখতে আমাদের জার্নাল প্রস্তাবিত ৩টি ধাপ।'
              : 'Cleanse, hydrate, seal. The three steps our journal recommends for dry and dehydrated skin.'}
          </p>
        </div>

        <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
            {routineSteps.map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-[22px] p-3.5 flex gap-3.5 items-center shadow-xs"
              >
                <div
                  className="w-[70px] sm:w-[78px] h-[84px] sm:h-[92px] rounded-[14px] flex items-center justify-center shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: s.tint }}
                >
                  {s.product?.image ? (
                    <Image
                      src={s.product.image}
                      alt={s.product.imageAlt || s.name}
                      fill
                      sizes="78px"
                      className="object-cover"
                    />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8C6676" strokeWidth="1.2">
                      <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                      <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                    </svg>
                  )}
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-brand-muted">
                    {isBn ? s.stepBn : s.step}
                  </span>
                  <strong className="text-[14px] text-brand-dark leading-tight line-clamp-2">
                    {s.name}
                  </strong>
                  <span className="font-bold text-[14px] text-brand-dark">
                    {formatPrice(s.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center sm:items-start gap-2.5 w-full sm:w-[190px] shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="d text-[26px] sm:text-[28px] text-brand-dark font-bold">
                {formatPrice(discountedTotal)}
              </span>
              <span className="line-through text-brand-muted text-[15px]">
                {formatPrice(originalTotal)}
              </span>
            </div>

            <button
              onClick={handleAddAll}
              className={`btn w-full h-12 px-5 text-[14px] transition-all flex items-center justify-center gap-1.5 ${
                addedAll ? 'bg-brand-green text-white' : 'bg-brand-dark text-white hover:bg-brand-rose'
              }`}
            >
              {addedAll ? (
                <>
                  <Check className="w-4 h-4" /> Added all 3!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add all 3 to bag
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
