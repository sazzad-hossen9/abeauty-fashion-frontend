'use client';

import React, { useEffect } from 'react';
import Link from '@/components/common/Link';
import { Button } from '@/components/common/Button';

export const TermsContent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex-1 bg-white">
      {/* Header Banner */}
      <section className="bg-brand-roseLight w-full py-12 sm:py-16 border-b border-brand-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-rose">Legal</span>
            <h1 className="d text-[42px] sm:text-[64px] lg:text-[76px] leading-none text-brand-dark m-0">
              Terms &amp; <span className="s text-brand-rose font-normal">Conditions</span>
            </h1>
            <span className="text-brand-muted text-[14px]">
              Last updated: October 2026 · Effective for all purchases
            </span>
          </div>

          <nav aria-label="Legal navigation" className="flex items-center gap-2">
            <Link to="/privacy" className="h-11 px-5 rounded-full font-medium text-[14px] bg-white border border-brand-borderDark text-brand-dark hover:border-brand-dark flex items-center no-underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="h-11 px-5 rounded-full font-bold text-[14px] bg-brand-dark text-white flex items-center no-underline">
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </section>

      {/* Main Terms Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-[56px] py-16 sm:py-20 flex flex-col gap-10">
        <section id="orders" className="flex flex-col gap-3">
          <h2 className="d text-[26px] text-brand-dark m-0">1. Orders &amp; Contract Formation</h2>
          <p className="text-[16px] text-brand-muted leading-relaxed m-0">
            By placing an order on abeautynfashion.com, you make an offer to purchase the selected items subject to these terms. All orders are subject to acceptance and item availability. When your order is dispatched, a legally binding sales contract is formed between you and ABeauty &amp; Fashion Ltd.
          </p>
        </section>

        <section id="pricing" className="flex flex-col gap-3">
          <h2 className="d text-[26px] text-brand-dark m-0">2. Pricing, Taxes &amp; Currency</h2>
          <p className="text-[16px] text-brand-muted leading-relaxed m-0">
            Prices displayed on the store are inclusive of standard local taxes where required. While we endeavor to ensure accurate catalog pricing, inadvertent typographical errors may occasionally occur. If a pricing error is discovered after order placement, we will promptly notify you with the option to reconfirm at the correct price or cancel for an immediate refund.
          </p>
        </section>

        <section id="shipping" className="flex flex-col gap-3">
          <h2 className="d text-[26px] text-brand-dark m-0">3. Shipping &amp; Delivery Policies</h2>
          <p className="text-[16px] text-brand-muted leading-relaxed m-0">
            Standard deliveries typically arrive within 3 to 5 business days. Express courier delivery takes 1 to 2 business days. Orders exceeding $50 (or ৳২,০০০ in Bangladesh) automatically unlock complimentary standard shipping.
          </p>
        </section>

        <section id="returns" className="flex flex-col gap-3">
          <h2 className="d text-[26px] text-brand-dark m-0">4. Easy 30-Day Returns Policy</h2>
          <p className="text-[16px] text-brand-muted leading-relaxed m-0">
            We want you to be completely thrilled with your beauty ritual. Unopened and unused items in original hygienic packaging may be returned within 30 days of receipt. Due to health regulations, opened cosmetics, skincare bottles with broken tamper seals, and personal hygiene tools cannot be returned unless found defective upon arrival.
          </p>
        </section>

        <section id="authenticity" className="flex flex-col gap-3">
          <h2 className="d text-[26px] text-brand-dark m-0">5. 100% Authenticity Guarantee</h2>
          <p className="text-[16px] text-brand-muted leading-relaxed m-0">
            Every product available through ABeauty &amp; Fashion is backed by our unconditional 100% authenticity guarantee. We partner exclusively with direct brand manufacturers and licensed global distributors.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsContent;
