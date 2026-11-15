'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from '@/components/common/Link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, ShieldCheck, Check, Truck, CreditCard } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/api/api';

export const CheckoutContent = () => {
  const {
    cartItems,
    subtotal,
    discountAmount,
    giftWrap,
    giftWrapCost,
    couponCode,
    setCouponCode,
    appliedCoupon,
    applyCoupon,
    clearCart
  } = useCart();

  const { user } = useAuth();
  const { setOrderSuccessModal } = useModal();
  const { isBn, formatPrice } = useLanguage();
  const router = useRouter();

  // Form Fields State
  const [formData, setFormData] = useState({
    email: user?.email || '',
    emailMarketing: true,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.address?.street || '',
    apartment: user?.address?.apt || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    phone: user?.phone || '',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    sameBilling: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) return;
    setFormData(prev => ({
      ...prev,
      email: prev.email || user.email || '',
      firstName: prev.firstName || user.firstName || '',
      lastName: prev.lastName || user.lastName || '',
      address: prev.address || user.address?.street || '',
      apartment: prev.apartment || user.address?.apt || '',
      city: prev.city || user.address?.city || '',
      state: prev.state || user.address?.state || '',
      zip: prev.zip || user.address?.zip || '',
      phone: prev.phone || user.phone || '',
    }));
  }, [user]);

  // Shipping calculation
  const isFreeStandard = subtotal >= 50;
  const standardShippingRate = isFreeStandard ? 0 : 4.99;
  const expressShippingRate = 9.99;
  const actualShippingCost = formData.deliveryMethod === 'express' ? expressShippingRate : standardShippingRate;

  const total = Math.max(0, subtotal - discountAmount + actualShippingCost + (giftWrap ? giftWrapCost : 0));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setOrderError('');
    setIsSubmitting(true);

    const cardDigits = formData.cardNumber.replace(/\D/g, '');
    const orderPayload = {
      userId: user?.id || null,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: `${formData.address}, ${formData.apartment ? formData.apartment + ', ' : ''}${formData.city}, ${formData.state} ${formData.zip}`.trim(),
      deliveryMethod: formData.deliveryMethod === 'express' ? 'Express · 1–2 days' : 'Standard · 3–5 days',
      paymentMethod: formData.paymentMethod === 'card'
        ? (cardDigits.length >= 4 ? `Card ···· ${cardDigits.slice(-4)}` : 'Credit / Debit Card')
        : formData.paymentMethod === 'bkash'
        ? 'bKash Mobile Wallet'
        : formData.paymentMethod === 'cod'
        ? 'Cash on Delivery'
        : 'PayPal',
      items: cartItems,
      subtotal,
      discount: discountAmount,
      shipping: actualShippingCost,
      total,
    };

    const response = await api.createOrder(orderPayload);
    setIsSubmitting(false);

    if (!response?.success || !response?.order) {
      setOrderError(response?.error || 'Could not place your order. Please try again.');
      return;
    }

    clearCart();
    setOrderSuccessModal({ order: response.order });
    router.push('/account');
  };

  return (
    <div className="flex-1 bg-brand-pinkBg">
      {/* Checkout Minimal Header matching Desktop-Checkout.dc.html lines 39-43 */}
      <header className="h-[76px] sm:h-[84px] border-b border-[#F1E4E8] bg-white sticky top-0 z-30 flex items-center w-full">
        <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-8 lg:px-[56px] flex items-center justify-between">
        <Link
          to="/cart"
          className="flex items-center gap-2 font-semibold text-[14px] sm:text-[15px] text-brand-dark hover:text-brand-rose no-underline w-36 sm:w-[200px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to bag</span>
        </Link>

        <Logo />

        <div className="flex items-center justify-end gap-2 text-[13px] sm:text-[14px] font-semibold text-[#2E6B45] w-36 sm:w-[200px]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Secure checkout</span>
        </div>
        </div>
      </header>

      {/* Progress Steps Header */}
      <ol aria-label="Checkout progress" className="list-none m-0 py-6 px-4 flex justify-center items-center gap-3 sm:gap-4 text-[13px] sm:text-[14px] font-semibold">
        <li className="flex items-center gap-2 text-brand-green">
          <span className="w-6 h-6 rounded-full bg-brand-greenLight flex items-center justify-center text-brand-green">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </span>
          <span className="hidden sm:inline">Bag</span>
        </li>
        <li aria-hidden="true" className="w-8 sm:w-16 h-px bg-brand-borderDark" />
        <li aria-current="step" className="flex items-center gap-2 text-brand-dark">
          <span className="w-6 h-6 rounded-full bg-brand-dark text-white flex items-center justify-center text-[12px]">
            2
          </span>
          <span>Details &amp; delivery</span>
        </li>
        <li aria-hidden="true" className="w-8 sm:w-16 h-px bg-brand-borderDark" />
        <li className="flex items-center gap-2 text-brand-muted">
          <span className="w-6 h-6 rounded-full border border-brand-borderDark flex items-center justify-center text-[12px]">
            3
          </span>
          <span className="hidden sm:inline">Payment</span>
        </li>
        <li aria-hidden="true" className="w-8 sm:w-16 h-px bg-brand-borderDark" />
        <li className="flex items-center gap-2 text-brand-muted">
          <span className="w-6 h-6 rounded-full border border-brand-borderDark flex items-center justify-center text-[12px]">
            4
          </span>
          <span className="hidden sm:inline">Confirmation</span>
        </li>
      </ol>

      {/* Main Checkout Form & Summary */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form Cards */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 flex flex-col gap-6">
            {/* Express Checkout Options */}
            <div className="bg-white border border-brand-border rounded-[24px] p-5 sm:p-7 flex flex-col gap-3.5">
              <span className="text-[12px] font-bold tracking-widest uppercase text-brand-muted text-center">
                Express checkout
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                  className="btn !h-[48px] bg-brand-gold text-brand-dark font-extrabold hover:opacity-90"
                >
                  PayPal
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className="btn !h-[48px] bg-black text-white hover:opacity-90"
                >
                  Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className="btn !h-[48px] bg-white text-brand-dark shadow-[inset_0_0_0_1px_#D9C6CE] hover:bg-[#F8F1F3]"
                >
                  G Pay
                </button>
              </div>
            </div>

            {/* 1. Contact Information */}
            <div className="bg-white border border-brand-border rounded-[24px] p-5 sm:p-7 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="d text-[20px] sm:text-[22px] flex items-center gap-2.5 text-brand-dark m-0">
                  <span className="w-7 h-7 rounded-full bg-brand-dark text-white text-[13px] flex items-center justify-center font-sans font-bold">
                    1
                  </span>
                  Contact
                </h2>
                {!user && (
                  <span className="text-[14px] text-brand-muted">
                    Have an account? <Link to="/account" className="underline font-semibold text-brand-dark hover:text-brand-rose">Log in</Link>
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-brand-dark mb-1">Email address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                />
              </div>

              <label className="flex items-center gap-2.5 text-[14px] text-brand-dark cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="emailMarketing"
                  checked={formData.emailMarketing}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-brand-rose rounded cursor-pointer"
                />
                <span>Email me with news and members-only offers</span>
              </label>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white border border-brand-border rounded-[24px] p-5 sm:p-7 flex flex-col gap-4">
              <h2 className="d text-[20px] sm:text-[22px] flex items-center gap-2.5 text-brand-dark m-0">
                <span className="w-7 h-7 rounded-full bg-brand-dark text-white text-[13px] flex items-center justify-center font-sans font-bold">
                  2
                </span>
                Shipping address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-1">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-1">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-semibold text-brand-dark mb-1">Street address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 124 Cherry Blossom Lane"
                    className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-semibold text-brand-dark mb-1">Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="e.g. Apt 4B"
                    className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-brand-dark mb-1">State / Div</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full h-[52px] border border-brand-borderDark rounded-xl px-3 text-[14px] outline-none focus:border-brand-rose"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-brand-dark mb-1">ZIP code</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full h-[52px] border border-brand-borderDark rounded-xl px-3 text-[14px] outline-none focus:border-brand-rose"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[13px] font-semibold text-brand-dark mb-1">Phone (for delivery updates)</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
                  />
                </div>
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="bg-white border border-brand-border rounded-[24px] p-5 sm:p-7 flex flex-col gap-3.5">
              <h2 className="d text-[20px] sm:text-[22px] flex items-center gap-2.5 text-brand-dark m-0">
                <span className="w-7 h-7 rounded-full bg-brand-dark text-white text-[13px] flex items-center justify-center font-sans font-bold">
                  3
                </span>
                Delivery method
              </h2>

              <label 
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  formData.deliveryMethod === 'standard'
                    ? 'border-brand-dark bg-brand-pinkSubtle'
                    : 'border-brand-borderDark hover:bg-[#F8F1F3]'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="standard"
                  checked={formData.deliveryMethod === 'standard'}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-brand-rose cursor-pointer"
                />
                <div className="flex-1">
                  <strong className="text-[15px] text-brand-dark block">Standard Delivery</strong>
                  <span className="text-[13px] text-brand-muted">3–5 business days</span>
                </div>
                <strong className="text-[15px] text-brand-dark">
                  {isFreeStandard ? 'Free' : formatPrice(4.99)}
                </strong>
              </label>

              <label 
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  formData.deliveryMethod === 'express'
                    ? 'border-brand-dark bg-brand-pinkSubtle'
                    : 'border-brand-borderDark hover:bg-[#F8F1F3]'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="express"
                  checked={formData.deliveryMethod === 'express'}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-brand-rose cursor-pointer"
                />
                <div className="flex-1">
                  <strong className="text-[15px] text-brand-dark block">Express Delivery</strong>
                  <span className="text-[13px] text-brand-muted">1–2 business days</span>
                </div>
                <strong className="text-[15px] text-brand-dark">{formatPrice(9.99)}</strong>
              </label>
            </div>

            {/* 4. Payment */}
            <div className="bg-white border border-brand-border rounded-[24px] p-5 sm:p-7 flex flex-col gap-4">
              <h2 className="d text-[20px] sm:text-[22px] flex items-center gap-2.5 text-brand-dark m-0">
                <span className="w-7 h-7 rounded-full bg-brand-dark text-white text-[13px] flex items-center justify-center font-sans font-bold">
                  4
                </span>
                Payment
              </h2>

              {/* Card option */}
              <label 
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'card'
                    ? 'border-brand-dark bg-brand-pinkSubtle'
                    : 'border-brand-borderDark hover:bg-[#F8F1F3]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-brand-rose cursor-pointer"
                />
                <div className="flex-1 font-semibold text-[15px]">Credit or debit card</div>
                <span className="text-[12px] font-bold text-brand-muted">VISA · MC · AMEX</span>
              </label>

              {formData.paymentMethod === 'card' && (
                <div className="grid grid-cols-2 gap-3.5 p-3 rounded-2xl bg-white border border-brand-border">
                  <div className="col-span-2">
                    <label className="block text-[13px] font-semibold text-brand-dark mb-1">Card number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 1234 1234 1234"
                      className="w-full h-11 border border-brand-borderDark rounded-xl px-3.5 text-[14px] outline-none focus:border-brand-rose"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-brand-dark mb-1">Expiry</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM / YY"
                      className="w-full h-11 border border-brand-borderDark rounded-xl px-3.5 text-[14px] outline-none focus:border-brand-rose"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-brand-dark mb-1">Security code</label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      placeholder="CVC"
                      className="w-full h-11 border border-brand-borderDark rounded-xl px-3.5 text-[14px] outline-none focus:border-brand-rose"
                    />
                  </div>
                </div>
              )}

              {/* bKash option */}
              <label 
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'bkash'
                    ? 'border-brand-dark bg-brand-pinkSubtle'
                    : 'border-brand-borderDark hover:bg-[#F8F1F3]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bkash"
                  checked={formData.paymentMethod === 'bkash'}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-brand-rose cursor-pointer"
                />
                <div className="flex-1 font-semibold text-[15px]">bKash / Nagad Mobile Wallet</div>
                <span className="text-[12px] font-bold text-[#E2136E]">বিকাশ / নগদ</span>
              </label>

              {/* Cash on Delivery option */}
              <label 
                className={`flex items-center gap-3.5 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  formData.paymentMethod === 'cod'
                    ? 'border-brand-dark bg-brand-pinkSubtle'
                    : 'border-brand-borderDark hover:bg-[#F8F1F3]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-brand-rose cursor-pointer"
                />
                <div className="flex-1 font-semibold text-[15px]">Cash on Delivery (COD)</div>
                <span className="text-[12px] font-bold text-brand-green">Pay at doorstep</span>
              </label>
            </div>

            {orderError && (
              <div className="p-4 rounded-2xl bg-brand-roseLight border border-brand-rose/30 text-[14px] font-medium text-[#A3244B]">
                {orderError}
              </div>
            )}

            {/* Submit Order Action Button */}
            <Button
              type="submit"
              variant="rose"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full !h-[60px] !text-[17px] gap-2 shadow-lg"
            >
              <Lock className="w-5 h-5" />
              <span>
                {isSubmitting ? 'Placing order...' : `Place order — ${formatPrice(total)}`}
              </span>
            </Button>

            <p className="text-brand-muted text-[13px] text-center m-0">
              By placing your order you agree to our{' '}
              <Link to="/terms" className="underline text-brand-dark">Terms &amp; Conditions</Link> and{' '}
              <Link to="/privacy" className="underline text-brand-dark">Privacy Policy</Link>.
            </p>
          </form>

          {/* Right Column: Order Summary Aside */}
          <aside 
            aria-label="Your order summary"
            className="lg:col-span-5 bg-white border border-brand-border rounded-[28px] p-6 sm:p-7 flex flex-col gap-5 shadow-sm sticky top-28"
          >
            <div className="flex justify-between items-center pb-2 border-b border-brand-border">
              <h2 className="d text-[22px] sm:text-[24px] text-brand-dark m-0">
                Your order
              </h2>
              <Link to="/cart" className="text-[14px] font-semibold text-brand-dark underline hover:text-brand-rose">
                Edit bag
              </Link>
            </div>

            {/* Items with visual badges */}
            <div className="flex flex-col gap-4 divide-y divide-brand-border">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="pt-3 first:pt-0 flex items-center gap-3.5">
                  <div
                    className="w-[72px] h-[84px] rounded-[14px] flex items-center justify-center shrink-0 relative"
                    style={{ backgroundColor: item.tint || '#FBE4EA' }}
                  >
                    {item.image ? (
                      <div className="absolute inset-0 rounded-[14px] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.imageAlt || item.name}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8C6676" strokeWidth="1.1">
                        <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                        <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                      </svg>
                    )}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-dark text-white font-bold text-[12px] flex items-center justify-center shadow-xs z-10">
                      {item.qty}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <strong className="text-[14px] sm:text-[15px] text-brand-dark truncate">{item.name}</strong>
                    <span className="text-[13px] text-brand-muted">{item.variant}</span>
                  </div>

                  <span className="font-bold text-[15px] text-brand-dark shrink-0">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown costs */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-brand-border text-[14px]">
              <div className="flex justify-between">
                <span className="text-brand-muted">Subtotal</span>
                <span className="font-semibold text-brand-dark">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Shipping</span>
                <span className="font-semibold text-brand-dark">
                  {actualShippingCost === 0 ? (
                    <span className="text-brand-green font-bold">Free</span>
                  ) : (
                    formatPrice(actualShippingCost)
                  )}
                </span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span className="text-brand-muted">Gift wrap</span>
                  <span className="font-semibold text-brand-dark">{formatPrice(giftWrapCost)}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-brand-green font-semibold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-4 border-t border-brand-border">
              <span className="font-bold text-[17px] text-brand-dark">Total</span>
              <span className="d text-[30px] font-bold text-brand-dark">
                {formatPrice(total)}
              </span>
            </div>

            {/* Trust highlights */}
            <div className="bg-brand-roseLight rounded-2xl p-3.5 flex flex-col gap-2 text-[13px] text-brand-dark mt-1">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-rose shrink-0" />
                100% authentic products guaranteed
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-rose shrink-0" />
                Fast doorstep courier dispatch
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
