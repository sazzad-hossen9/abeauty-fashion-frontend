'use client';

import React from 'react';
import { Send, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useModal } from '@/context/ModalContext';

export const ContactSuccessModal = () => {
  const { contactSuccessModal, setContactSuccessModal } = useModal();

  if (!contactSuccessModal) return null;

  const email = contactSuccessModal.email || 'your email';
  const refCode = contactSuccessModal.ref || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#5B4752]/70 backdrop-blur-xs"
        onClick={() => setContactSuccessModal(null)}
      />

      {/* Modal Dialog (matches Desktop-Modals 04) */}
      <div 
        role="dialog"
        aria-labelledby="contact-success-title"
        className="relative bg-white rounded-[28px] w-full max-w-[440px] p-8 sm:p-9 shadow-[0_40px_80px_-30px_rgba(20,8,14,0.6)] z-10 flex flex-col items-center text-center gap-3.5 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => setContactSuccessModal(null)}
          className="icb absolute right-4 top-4"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-brand-dark" />
        </button>

        <div className="w-[72px] h-[72px] rounded-full bg-brand-roseLight text-brand-rose flex items-center justify-center">
          <Send className="w-8 h-8 ml-0.5 stroke-[1.8]" />
        </div>

        <h2 id="contact-success-title" className="d text-[30px] text-brand-dark m-0">
          Message <span className="s text-brand-rose font-normal">sent</span>
        </h2>

        <p className="text-brand-muted text-[15px] leading-relaxed m-0">
          Thanks for reaching out! We'll reply to <strong className="text-brand-dark">{email}</strong> within 24 hours. Your enquiry reference number is <strong className="text-brand-dark">{refCode}</strong>.
        </p>

        <Button
          variant="primary"
          onClick={() => setContactSuccessModal(null)}
          className="mt-3 w-full"
        >
          Back to home
        </Button>
      </div>
    </div>
  );
};

