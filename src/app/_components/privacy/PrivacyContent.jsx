'use client';

import React, { useEffect } from 'react';
import Link from '@/components/common/Link';
import { Printer } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const PrivacyContent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "who",
      n: "01",
      t: "Who we are",
      p: "ABeauty & Fashion Ltd. operates abeautynfashion.com. For all data protection and privacy inquiries, reach us at privacy@abeautynfashion.com."
    },
    {
      id: "collect",
      n: "02",
      t: "Information we collect",
      p: "We collect information you explicitly provide: full name, shipping and billing addresses, contact phone number, order history, customer support queries, and product reviews. We also automatically collect browser types, IP address, device fingerprints, and pages viewed through secure cookies."
    },
    {
      id: "use",
      n: "03",
      t: "How we use your information",
      p: "Your data is strictly utilized to process e-commerce orders, coordinate courier deliveries, issue real-time SMS/email status notifications, recommend relevant routine pairings, and combat fraudulent checkout transactions."
    },
    {
      id: "security",
      n: "04",
      t: "Data security & payment processing",
      p: "All payments are processed via PCI-DSS Level 1 certified gateways (Visa, Mastercard, bKash, Nagad). We never store raw credit card numbers or security CVV codes on our servers."
    },
    {
      id: "rights",
      n: "05",
      t: "Your privacy rights",
      p: "You hold full rights to access, amend, download, or delete your personal customer profile. Simply message us through our contact center to request immediate profile erasure."
    }
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Header Banner */}
      <section className="bg-brand-roseLight w-full py-12 sm:py-16 border-b border-brand-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-rose">Legal</span>
            <h1 className="d text-[42px] sm:text-[64px] lg:text-[76px] leading-none text-brand-dark m-0">
              Privacy <span className="s text-brand-rose font-normal">Policy</span>
            </h1>
            <span className="text-brand-muted text-[14px]">
              Last updated: October 2026 · Reading time ~4 min
            </span>
          </div>

          <nav aria-label="Legal navigation" className="flex items-center gap-2">
            <Link to="/privacy" className="h-11 px-5 rounded-full font-bold text-[14px] bg-brand-dark text-white flex items-center no-underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="h-11 px-5 rounded-full font-medium text-[14px] bg-white border border-brand-borderDark text-brand-dark hover:border-brand-dark flex items-center no-underline">
              Terms &amp; Conditions
            </Link>
          </nav>
        </div>
      </section>

      {/* Main Legal Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Sticky Table of Contents */}
        <aside className="hidden lg:flex lg:col-span-4 flex-col gap-2 sticky top-28">
          <span className="text-[12px] font-bold tracking-widest uppercase text-brand-muted px-3.5 mb-2">
            On this page
          </span>
          {sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="py-2.5 px-3.5 rounded-xl text-[14px] text-brand-muted hover:bg-brand-roseLight hover:text-brand-dark transition-colors no-underline"
            >
              {s.n}. {s.t}
            </a>
          ))}
          <button
            onClick={() => window.print()}
            className="btn ghost !h-10 !px-4 text-[13px] self-start mt-4 gap-2 ml-3.5"
          >
            <Printer className="w-4 h-4" />
            Print policy
          </button>
        </aside>

        {/* Content Body */}
        <article className="lg:col-span-8 flex flex-col gap-10 max-w-2xl">
          <p className="text-[18px] text-brand-dark leading-relaxed font-medium m-0">
            This Privacy Policy explains how ABeauty &amp; Fashion Ltd. ("ABeauty &amp; Fashion", "we", "us") collects, uses, encrypts and protects your personal information when you visit our website, read our beauty journal, or purchase from our e-commerce store.
          </p>

          <div className="flex flex-col gap-8 divide-y divide-brand-border">
            {sections.map(s => (
              <section key={s.id} id={s.id} className="pt-8 first:pt-0 flex flex-col gap-3">
                <h2 className="d text-[24px] sm:text-[28px] text-brand-dark flex items-baseline gap-3 m-0">
                  <span className="s text-brand-rose font-normal text-[28px]">{s.n}</span>
                  {s.t}
                </h2>
                <p className="text-[16px] text-brand-muted leading-relaxed m-0">
                  {s.p}
                </p>
              </section>
            ))}
          </div>

          <div className="p-8 rounded-[24px] bg-brand-pinkSubtle border border-brand-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <div>
              <strong className="text-[17px] text-brand-dark block">Questions about your personal data?</strong>
              <span className="text-[14px] text-brand-muted">Email privacy@abeautynfashion.com or send a message.</span>
            </div>
            <Button variant="primary" size="sm" to="/contact">
              Contact us
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PrivacyContent;
