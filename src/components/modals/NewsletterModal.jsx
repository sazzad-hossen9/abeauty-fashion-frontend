'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useModal } from '@/context/ModalContext';

export const NewsletterModal = () => {
  const { newsletterModalOpen, setNewsletterModalOpen } = useModal();

  if (!newsletterModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#5B4752]/70 backdrop-blur-xs"
        onClick={() => setNewsletterModalOpen(false)}
      />

      {/* Modal Dialog (matches Desktop-Modals 03) */}
      <div 
        role="dialog"
        aria-labelledby="newsletter-modal-title"
        className="relative bg-white rounded-[28px] w-full max-w-[440px] overflow-hidden shadow-[0_40px_80px_-30px_rgba(20,8,14,0.6)] z-10 animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={() => setNewsletterModalOpen(false)}
          className="icb absolute right-3 top-3 z-20 bg-white"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-brand-dark" />
        </button>

        {/* Glow Header Banner */}
        <div className="h-[150px] bg-[#F6D7E0] flex items-center justify-center">
          <span className="s text-[64px] text-brand-rose leading-none">Glow</span>
        </div>

        {/* Body content */}
        <div className="p-7 sm:p-8 flex flex-col gap-3 text-center">
          <h2 id="newsletter-modal-title" className="d text-[30px] text-brand-dark m-0">
            You're on the <span className="s text-brand-rose font-normal">Glow List</span>
          </h2>
          <p className="text-brand-muted text-[15px] leading-relaxed m-0">
            Check your inbox to confirm your email. Your first routine tips and early access perks are on the way.
          </p>

          <Button
            variant="primary"
            to="/shop"
            onClick={() => setNewsletterModalOpen(false)}
            className="mt-3 w-full"
          >
            Start shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

