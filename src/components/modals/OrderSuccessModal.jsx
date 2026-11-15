'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useModal } from '@/context/ModalContext';
import { useLanguage } from '@/context/LanguageContext';

export const OrderSuccessModal = () => {
  const { orderSuccessModal, setOrderSuccessModal } = useModal();
  const { formatPrice } = useLanguage();

  if (!orderSuccessModal?.order) return null;

  const order = orderSuccessModal.order;
  const customerName = order.firstName || order.customerName || 'Friend';
  const orderNumber = order.orderNumber || (order._id ? `#${String(order._id).slice(-6)}` : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#5B4752]/70 backdrop-blur-xs"
        onClick={() => setOrderSuccessModal(null)}
      />

      <div
        role="dialog"
        aria-labelledby="order-success-title"
        className="relative bg-white rounded-[28px] w-full max-w-[520px] p-6 sm:p-9 shadow-[0_40px_80px_-30px_rgba(20,8,14,0.6)] z-10 flex flex-col items-center text-center gap-4 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => setOrderSuccessModal(null)}
          className="icb absolute right-4 top-4"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-brand-dark" />
        </button>

        <div className="w-[72px] h-[72px] rounded-full bg-brand-roseLight text-brand-rose flex items-center justify-center">
          <Check className="w-9 h-9 stroke-[2.5]" />
        </div>

        <h2 id="order-success-title" className="d text-[32px] sm:text-[36px] text-brand-dark leading-none m-0">
          Thank you, <span className="s text-brand-rose font-normal">{customerName}!</span>
        </h2>

        <p className="text-brand-muted text-[15px] leading-relaxed max-w-sm m-0">
          Your order <strong className="text-brand-dark">{orderNumber}</strong> is confirmed. We&apos;ve sent the details to{' '}
          <strong className="text-brand-dark">{order.email || 'your email'}</strong>.
        </p>

        <div className="w-full bg-[#FFF7F8] rounded-[18px] p-4 sm:p-5 flex flex-col gap-2.5 text-left text-[14px]">
          <div className="flex justify-between">
            <span className="text-brand-muted">Items</span>
            <span className="font-semibold">{order.itemsCount ?? order.items?.length ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Delivery</span>
            <span className="font-semibold">{order.deliveryMethod || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">Payment</span>
            <span className="font-semibold">{order.paymentMethod || '—'}</span>
          </div>
          <div className="flex justify-between pt-2.5 border-t border-brand-border">
            <strong className="text-[15px]">Total paid</strong>
            <strong className="text-[17px] text-brand-dark">{formatPrice(order.total ?? 0)}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mt-2">
          <Button
            variant="ghost"
            to="/account"
            onClick={() => setOrderSuccessModal(null)}
          >
            Track order
          </Button>
          <Button
            variant="primary"
            to="/shop"
            onClick={() => setOrderSuccessModal(null)}
          >
            Keep shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
