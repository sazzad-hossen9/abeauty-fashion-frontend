'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from '@/components/common/Link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, Heart, ShoppingBag, Lock, Truck, ArrowRight } from 'lucide-react';
import { FreeShippingBar } from '@/components/common/FreeShippingBar';
import { Button } from '@/components/common/Button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/api/api';

export const CartContent = () => {
  const {
    cartItems,
    totalItemsCount,
    subtotal,
    shippingCost,
    freeShippingAway,
    discountAmount,
    giftWrap,
    setGiftWrap,
    giftWrapCost,
    total,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    updateQty,
    removeFromCart,
    addToCart
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const { isBn, formatPrice } = useLanguage();
  const router = useRouter();
  const [catalogProducts, setCatalogProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;
    api.getProducts({ limit: 12 })
      .then((data) => {
        if (isMounted) setCatalogProducts(data.items || []);
      })
      .catch(() => {
        if (isMounted) setCatalogProducts([]);
      });
    return () => { isMounted = false; };
  }, []);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      await applyCoupon(couponCode);
    }
  };

  const handleMoveToWishlist = async (item, index) => {
    const res = await toggleWishlist({
      id: item.id || item.productId,
      name: item.name,
      price: item.price,
      tint: item.tint,
      category: item.cat
    });
    if (res?.success) {
      removeFromCart(index);
    }
  };

  // Recommendations for bottom cross-sell
  const crossSellRecs = catalogProducts.filter(
    p => !cartItems.some(item => item.name === p.name)
  ).slice(0, 4);

  return (
    <div className="flex-1 bg-white">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-10 sm:py-16">
        {cartItems.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-brand-roseLight flex items-center justify-center text-brand-rose mb-2">
              <ShoppingBag className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h1 className="d text-[36px] sm:text-[44px] text-brand-dark m-0">
              {isBn ? 'আপনার ব্যাগটি খালি' : 'Your bag is empty'}
            </h1>
            <p className="text-brand-muted text-[16px] max-w-sm m-0">
              {isBn 
                ? 'আপনার ব্যাগে বর্তমানে কোনো পণ্য নেই। আমাদের সেরা পণ্যগুলো দেখুন।'
                : 'Looks like you haven\'t added any items to your bag yet.'}
            </p>
            <Button variant="primary" to="/shop" className="mt-4">
              {isBn ? 'শপ ঘুরে দেখুন' : 'Explore the Shop'}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Items List & Free shipping */}
              <div className="lg:col-span-8 flex flex-col gap-7">
                {/* Header Title & Continue Shopping Link */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                  <h1 className="d text-[40px] sm:text-[54px] lg:text-[60px] leading-none text-brand-dark m-0">
                    Your <span className="s text-brand-rose font-normal">bag</span>{' '}
                    <span className="text-[24px] sm:text-[28px] text-brand-muted font-normal">
                      ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                    </span>
                  </h1>

                  <Link to="/shop" className="font-semibold text-[15px] text-brand-dark underline hover:text-brand-rose">
                    Continue shopping
                  </Link>
                </div>

                {/* Free shipping progress box */}
                <FreeShippingBar />

                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-brand-border text-[13px] font-bold tracking-wider uppercase text-brand-muted">
                  <span className="col-span-6">Product</span>
                  <span className="col-span-3 text-center">Quantity</span>
                  <span className="col-span-2 text-right">Total</span>
                  <span className="col-span-1"></span>
                </div>

                {/* Cart Items List */}
                <div className="flex flex-col divide-y divide-brand-border">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="py-6 first:pt-0 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
                      {/* Product Visual & Details */}
                      <div className="sm:col-span-6 flex items-center gap-4 sm:gap-5">
                        <div
                          className="w-[90px] sm:w-[112px] h-[108px] sm:h-[136px] rounded-[18px] flex items-center justify-center shrink-0 relative overflow-hidden"
                          style={{ backgroundColor: item.tint || '#FBE4EA' }}
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.imageAlt || item.name}
                              fill
                              sizes="(max-width: 640px) 90px, 112px"
                              className="object-cover"
                            />
                          ) : (
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8C6676" strokeWidth="1.1">
                              <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                              <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                            </svg>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="text-[12px] sm:text-[13px] text-brand-muted font-medium">
                            {item.cat}
                          </span>
                          <Link 
                            to={`/product/${item.id}`}
                            className="font-bold text-[16px] sm:text-[18px] text-brand-dark leading-tight hover:text-brand-rose line-clamp-1 no-underline"
                          >
                            {item.name}
                          </Link>
                          <span className="text-[13px] sm:text-[14px] text-brand-muted">
                            {item.variant}
                          </span>
                          <span className="text-[14px] font-semibold text-brand-dark">
                            {formatPrice(item.price)}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleMoveToWishlist(item, index)}
                            className="self-start text-[13px] font-semibold text-brand-dark underline hover:text-brand-rose mt-1 cursor-pointer bg-none border-0 p-0"
                          >
                            Move to wishlist
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controller */}
                      <div className="sm:col-span-3 flex justify-start sm:justify-center">
                        <div className="flex items-center justify-between h-12 w-[130px] sm:w-[140px] border border-brand-borderDark rounded-full px-2">
                          <button
                            onClick={() => updateQty(index, -1)}
                            className="icb w-8 h-8"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5 text-brand-dark" />
                          </button>
                          <span className="font-bold text-[15px] text-brand-dark">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(index, 1)}
                            className="icb w-8 h-8"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 text-brand-dark" />
                          </button>
                        </div>
                      </div>

                      {/* Row Total */}
                      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end">
                        <span className="sm:hidden text-brand-muted text-[14px]">Total:</span>
                        <span className="font-bold text-[17px] sm:text-[18px] text-brand-dark">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          onClick={() => removeFromCart(index)}
                          aria-label="Remove item"
                          className="icb w-10 h-10 text-brand-muted hover:text-brand-rose"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gift wrap option */}
                <label className="flex items-center gap-3 text-[15px] text-brand-dark cursor-pointer pt-2 select-none">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="w-[18px] h-[18px] accent-brand-rose rounded cursor-pointer m-0"
                  />
                  <span>Add luxury gift wrap and a handwritten note (+{formatPrice(4.00)})</span>
                </label>
              </div>

              {/* Right Column: Order Summary Aside */}
              <aside 
                aria-label="Order summary"
                className="lg:col-span-4 bg-white border border-brand-border rounded-[28px] p-6 sm:p-8 flex flex-col gap-4 shadow-[0_30px_60px_-40px_rgba(58,24,48,0.35)] sticky top-28"
              >
                <h2 className="d text-[26px] sm:text-[28px] text-brand-dark m-0">
                  Order summary
                </h2>

                <div className="flex justify-between text-[15px]">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="font-semibold text-brand-dark">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-[15px]">
                  <span className="text-brand-muted">Shipping</span>
                  <span className="font-semibold text-brand-dark">
                    {shippingCost === 0 ? (
                      <span className="text-brand-green font-bold">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                {giftWrap && (
                  <div className="flex justify-between text-[15px]">
                    <span className="text-brand-muted">Gift wrap</span>
                    <span className="font-semibold text-brand-dark">{formatPrice(giftWrapCost)}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-[15px] text-brand-green font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                {/* Coupon Code Section */}
                <form onSubmit={handleApplyCoupon} className="flex flex-col gap-1.5 pt-2">
                  <label htmlFor="coupon" className="text-[13px] font-semibold text-brand-dark">
                    Coupon code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 h-12 border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose min-w-0"
                    />
                    <button
                      type="submit"
                      className="btn ghost !h-12 !px-5 !text-[14px] shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <span className="text-[12px] text-brand-rose font-medium mt-1">
                      {couponError}
                    </span>
                  )}
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-[12px] text-brand-green mt-1">
                      <span>✓ {appliedCoupon.desc} applied</span>
                      <button onClick={removeCoupon} className="underline text-brand-muted hover:text-brand-rose">
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Total */}
                <div className="flex justify-between items-baseline pt-4 border-t border-brand-border">
                  <span className="font-bold text-[18px] text-brand-dark">Total</span>
                  <span className="d text-[32px] font-bold text-brand-dark">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Button
                  variant="rose"
                  to="/checkout"
                  className="w-full !h-[56px] text-[16px] gap-2 mt-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Secure checkout</span>
                </Button>

                {/* Express Payment Dividers */}
                <div className="flex items-center gap-3 text-[13px] text-brand-muted my-1">
                  <div className="flex-1 h-px bg-brand-border" />
                  <span>or pay with</span>
                  <div className="flex-1 h-px bg-brand-border" />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => router.push('/checkout')}
                    className="btn !h-12 bg-brand-gold text-brand-dark font-extrabold hover:opacity-90"
                  >
                    PayPal
                  </button>
                  <button
                    onClick={() => router.push('/checkout')}
                    className="btn !h-12 bg-black text-white hover:opacity-90"
                  >
                    Apple Pay
                  </button>
                </div>

                <p className="text-[12px] text-brand-muted text-center leading-relaxed m-0 mt-1">
                  Free shipping over $50 · Easy returns on unopened items
                </p>
              </aside>
            </div>

            {/* Bottom Section: Add $X more for free shipping */}
            {crossSellRecs.length > 0 && (
            <section className="mt-20 pt-16 border-t border-brand-border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-2">
                <h2 className="d text-[30px] sm:text-[40px] text-brand-dark m-0">
                  Add{' '}<span className="s text-[#C8325F] font-normal s-lead">${freeShippingAway > 0 ? freeShippingAway.toFixed(2) : '10'}</span>{' '}more for{' '}<span className="s text-[#C8325F] font-normal">free shipping</span>
                </h2>
                <span className="text-brand-muted text-[15px]">
                  Small picks that pair well with your bag
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {crossSellRecs.map((rec) => (
                  <div
                    key={rec.id || rec._id}
                    className="flex items-center gap-4 p-4 border border-brand-border rounded-[22px] bg-white hover:shadow-sm transition-shadow"
                  >
                    <div
                      className="w-[84px] h-[100px] rounded-2xl shrink-0 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: rec.tint }}
                    >
                      {rec.image ? (
                        <Image
                          src={rec.image}
                          alt={rec.imageAlt || rec.name}
                          fill
                          sizes="84px"
                          className="object-cover"
                        />
                      ) : (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#8C6676" strokeWidth="1.1">
                          <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                          <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                        </svg>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="text-[12px] text-brand-muted">{rec.category}</span>
                      <Link 
                        to={`/product/${rec.id || rec._id}`}
                        className="font-semibold text-[15px] text-brand-dark leading-snug line-clamp-1 no-underline hover:text-brand-rose"
                      >
                        {rec.name}
                      </Link>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-[15px] text-brand-dark">{formatPrice(rec.price)}</span>
                        <button
                          onClick={() => addToCart(rec, 'Standard', 1, false)}
                          className="btn sm !h-[34px] !px-3.5 !text-[13px] bg-brand-dark text-white hover:bg-brand-rose"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CartContent;
