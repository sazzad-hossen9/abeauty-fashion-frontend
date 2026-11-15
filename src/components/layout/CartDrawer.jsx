'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from '@/components/common/Link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { FreeShippingBar } from '@/components/common/FreeShippingBar';
import { Button } from '@/components/common/Button';
import { api } from '@/api/api';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    totalItemsCount,
    subtotal,
    removeFromCart,
    updateQty,
    addToCart
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const { isBn, formatPrice } = useLanguage();
  const [catalogProducts, setCatalogProducts] = useState([]);

  useEffect(() => {
    if (!isCartOpen || catalogProducts.length > 0) return;
    let isMounted = true;
    api.getProducts({ limit: 12 })
      .then((data) => {
        if (isMounted) setCatalogProducts(data.items || []);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [isCartOpen, catalogProducts.length]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  // Filter cross-sells (items not already in cart)
  const crossSells = catalogProducts.filter(
    p => !cartItems.some(item => item.name === p.name)
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1F1219]/45 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside 
        aria-label="Shopping bag"
        className="absolute right-0 top-0 bottom-0 w-[460px] max-w-[92vw] bg-white flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="h-[76px] flex items-center justify-between px-6 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="d text-[22px] sm:text-[24px] m-0 text-brand-dark">
              {isBn ? 'আপনার ব্যাগ' : 'Your bag'}
            </h2>
            <span className="text-[15px] text-brand-muted font-medium">
              ({totalItemsCount} {isBn ? 'টি পণ্য' : totalItemsCount === 1 ? 'item' : 'items'})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
            className="icb w-10 h-10"
          >
            <X className="w-5 h-5 text-brand-dark" />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="p-4 sm:p-5 border-b border-brand-border shrink-0">
          <FreeShippingBar />
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-5">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-3">
              <div className="w-16 h-16 rounded-full bg-brand-roseLight flex items-center justify-center text-brand-rose mb-1">
                <ShoppingBag className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="d text-[22px] text-brand-dark m-0">
                {isBn ? 'আপনার ব্যাগ খালি' : 'Your bag is empty'}
              </h3>
              <p className="text-[15px] text-brand-muted max-w-[260px] m-0">
                {isBn ? 'আমাদের স্কিনকেয়ার ও মেকআপ কালেকশন ঘুরে দেখুন।' : 'Explore our curated skincare, makeup, and beauty tools.'}
              </p>
              <Button
                variant="rose"
                size="sm"
                to="/shop"
                onClick={() => setIsCartOpen(false)}
                className="mt-2"
              >
                {isBn ? 'কেনাকাটা শুরু করুন' : 'Start shopping'}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 divide-y divide-brand-border">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="pt-4 first:pt-0 flex gap-4 items-center">
                    {/* Thumbnail */}
                    <div
                      className="w-[78px] h-[92px] rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden"
                      style={{ backgroundColor: item.tint || '#FBE4EA' }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.imageAlt || item.name}
                          fill
                          sizes="78px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-brand-muted opacity-70">
                          {item.cat || 'Beauty'}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <span className="text-[12px] text-brand-muted font-medium">
                        {item.cat}
                      </span>
                      <h4 className="font-semibold text-[15px] text-brand-dark leading-tight line-clamp-1 m-0">
                        {item.name}
                      </h4>
                      <span className="text-[13px] text-brand-muted">
                        {item.variant}
                      </span>

                      <div className="flex items-center justify-between mt-1.5">
                        {/* Qty +/- */}
                        <div className="flex items-center h-8 border border-brand-borderDark rounded-full px-1.5">
                          <button
                            onClick={() => updateQty(index, -1)}
                            className="w-6 h-6 flex items-center justify-center text-brand-dark hover:text-brand-rose"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-bold text-[13px]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(index, 1)}
                            className="w-6 h-6 flex items-center justify-center text-brand-dark hover:text-brand-rose"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-bold text-[15px] text-brand-dark">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCart(index)}
                      className="icb w-8 h-8 text-brand-muted hover:text-brand-rose shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cross sell pairings */}
              {crossSells.length > 0 && (
                <div className="mt-4 pt-4 border-t border-brand-border flex flex-col gap-3">
                  <span className="text-[13px] font-bold tracking-wider text-brand-muted uppercase">
                    {isBn ? 'ব্যাগটিতে আরও যোগ করতে পারেন' : 'Pairs well with your bag'}
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {crossSells.map(rec => (
                      <div
                        key={rec.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-brand-border bg-brand-pinkSubtle"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-10 h-12 rounded-lg shrink-0 flex items-center justify-center relative overflow-hidden"
                            style={{ backgroundColor: rec.tint }}
                          >
                            {rec.image && (
                              <Image
                                src={rec.image}
                                alt={rec.imageAlt || rec.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-[13px] text-brand-dark truncate">
                              {rec.name}
                            </span>
                            <span className="font-bold text-[13px] text-brand-rose">
                              {formatPrice(rec.price)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(rec, 'Standard', 1, false)}
                          className="btn sm !h-8 !px-3 !text-[12px] bg-brand-dark text-white hover:bg-brand-rose shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-brand-border bg-white flex flex-col gap-3 shrink-0">
            <div className="flex justify-between items-baseline">
              <span className="text-[15px] text-brand-muted font-medium">
                {isBn ? 'সাবটোটাল' : 'Subtotal'}
              </span>
              <span className="d text-[24px] text-brand-dark font-bold">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-[12px] text-brand-muted m-0 text-center">
              {isBn ? 'ট্যাক্স ও ডেলিভারি চার্জ চেকআউটে হিসাব করা হবে।' : 'Shipping & taxes calculated at checkout.'}
            </p>

            <div className="grid grid-cols-2 gap-2.5 mt-1">
              <Button
                variant="ghost"
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="!h-[50px] !text-[14px]"
              >
                {isBn ? 'ব্যাগ দেখুন' : 'View full bag'}
              </Button>

              <Button
                variant="rose"
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="!h-[50px] !text-[14px]"
              >
                {isBn ? 'চেকআউট' : 'Checkout'}
              </Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

