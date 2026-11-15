'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { Mail, Phone, MapPin, Truck, ChevronDown, Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useModal } from '@/context/ModalContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/api/api';

export const ContactContent = () => {
  const { setContactSuccessModal } = useModal();
  const { isBn } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Order & delivery',
    orderNumber: '',
    message: '',
    agreed: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitError('');
    setSubmitting(true);
    const res = await api.submitContact(formData);
    setSubmitting(false);
    if (!res?.success) {
      setSubmitError(res?.error || 'Could not send message. Please try again.');
      return;
    }
    setContactSuccessModal({
      email: formData.email,
      ref: res.ref
    });
    setFormData({
      name: '',
      email: '',
      topic: 'Order & delivery',
      orderNumber: '',
      message: '',
      agreed: false
    });
  };

  const faqs = [
    {
      q: "Where is my order?",
      a: "You'll get a real-time tracking link by email as soon as your order ships from our warehouse. You can also view live delivery progress anytime from My Account › Orders."
    },
    {
      q: "How do returns work?",
      a: "Unopened items in original condition can be returned within 30 days of delivery. Just drop our support team an email with your order number to get an instant return shipping label."
    },
    {
      q: "Can you help me choose a product?",
      a: "Yes! You can take our 60-second routine quiz on the homepage, or message our certified skincare specialists right here describing your current skin concerns and routine."
    },
    {
      q: "Are your products authentic?",
      a: "100% yes. We source directly from the official brand manufacturers and verified global distributors only. Each item comes with authenticity sealing."
    },
    {
      q: "I'm a brand — how do we work together?",
      a: "We are always excited to discover clean, highly effective beauty and fashion products. Select 'Brand partnerships' in the topic dropdown above to get in touch with our curation board."
    }
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Header Banner */}
      <section className="bg-brand-roseLight w-full py-16 sm:py-20 border-b border-brand-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] flex flex-col items-center text-center gap-4">
        <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-rose">
          {isBn ? 'যোগাযোগ করুন' : 'Contact us'}
        </span>
        <h1 className="d text-[46px] sm:text-[68px] lg:text-[80px] leading-[0.98] text-brand-dark m-0">
          We'd love to <span className="s text-brand-rose font-normal">hear</span> from you
        </h1>
        <p className="text-brand-muted text-[16px] sm:text-[18px] leading-relaxed max-w-[620px] m-0">
          Questions about an order, a product or your routine? Send us a message and our team will get back to you within 24 hours.
        </p>
        </div>
      </section>

      {/* Main Section: Form + Contact Details */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Send a message Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 border border-brand-border rounded-[32px] p-6 sm:p-10 flex flex-col gap-5 shadow-[0_30px_60px_-45px_rgba(58,24,48,0.4)] bg-white"
        >
          <h2 className="d text-[28px] sm:text-[34px] text-brand-dark m-0">
            Send a message
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-1">Full name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maya Rahman"
                className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-1">Email address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-1">Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full h-[52px] border border-brand-borderDark rounded-xl px-3 text-[15px] outline-none focus:border-brand-rose bg-white cursor-pointer"
              >
                <option>Order &amp; delivery</option>
                <option>Returns &amp; refunds</option>
                <option>Product advice</option>
                <option>Brand partnerships</option>
                <option>Something else</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-1">
                Order number <span className="text-brand-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                placeholder="#1042"
                className="w-full h-[52px] border border-brand-borderDark rounded-xl px-4 text-[15px] outline-none focus:border-brand-rose"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-brand-dark mb-1">Message</label>
            <textarea
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="How can our beauty specialists help you?"
              className="w-full p-4 border border-brand-borderDark rounded-xl text-[15px] outline-none focus:border-brand-rose resize-y min-h-[140px]"
            />
          </div>

          <label className="flex items-start gap-3 text-[13px] sm:text-[14px] text-brand-muted leading-relaxed cursor-pointer select-none">
            <input
              type="checkbox"
              required
              checked={formData.agreed}
              onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
              className="w-4 h-4 accent-brand-rose rounded cursor-pointer mt-1 shrink-0"
            />
            <span>
              I agree that ABeauty &amp; Fashion may use these details to reply to my enquiry, as described in the{' '}
              <Link to="/privacy" className="underline text-brand-dark">Privacy Policy</Link>.
            </span>
          </label>

          {submitError && (
            <div className="p-3 rounded-xl bg-brand-roseLight border border-brand-rose/30 text-[13px] font-medium text-[#A3244B]">
              {submitError}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-5 pt-2">
            <Button type="submit" variant="rose" disabled={submitting} className="gap-2">
              <span>{submitting ? 'Sending...' : 'Send message'}</span>
              <Send className="w-4 h-4" />
            </Button>
            <span className="text-[13px] text-brand-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              Protected by spam filtering
            </span>
          </div>
        </form>

        {/* Aside Contact Details */}
        <aside aria-label="Official Contact Information" className="lg:col-span-5 flex flex-col gap-4">
          {/* Email card */}
          <div className="flex gap-4 items-start p-5 sm:p-6 rounded-[22px] bg-white border border-brand-border shadow-xs">
            <div className="w-12 h-12 rounded-full bg-brand-roseLight flex items-center justify-center shrink-0 text-brand-rose">
              <Mail className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-1">
              <strong className="text-[16px] text-brand-dark">Email</strong>
              <a href="mailto:support@abeautynfashion.com" className="text-brand-dark underline font-medium hover:text-brand-rose text-[15px]">
                support@abeautynfashion.com
              </a>
              <span className="text-brand-muted text-[13px]">Best for order questions &amp; tracking</span>
            </div>
          </div>

          {/* Phone card */}
          <div className="flex gap-4 items-start p-5 sm:p-6 rounded-[22px] bg-white border border-brand-border shadow-xs">
            <div className="w-12 h-12 rounded-full bg-brand-roseLight flex items-center justify-center shrink-0 text-brand-rose">
              <Phone className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-1">
              <strong className="text-[16px] text-brand-dark">Phone / WhatsApp</strong>
              <span className="text-[15px] font-medium text-brand-dark">+880 1712-345678</span>
              <span className="text-brand-muted text-[13px]">Mon–Sat, 9:00 AM – 8:00 PM</span>
            </div>
          </div>

          {/* Business Address card */}
          <div className="flex gap-4 items-start p-5 sm:p-6 rounded-[22px] bg-white border border-brand-border shadow-xs">
            <div className="w-12 h-12 rounded-full bg-brand-roseLight flex items-center justify-center shrink-0 text-brand-rose">
              <MapPin className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-1">
              <strong className="text-[16px] text-brand-dark">Business address</strong>
              <span className="text-[14px] text-brand-dark leading-relaxed">
                ABeauty &amp; Fashion Ltd.<br />
                House 42, Road 11, Block D, Banani<br />
                Dhaka 1213, Bangladesh
              </span>
            </div>
          </div>

          {/* Where's my order? Quick track card */}
          <div className="flex gap-4 items-start p-6 rounded-[22px] bg-brand-maroon text-white border border-brand-maroon shadow-md">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-brand-accentPink">
              <Truck className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <div className="flex flex-col gap-1.5">
              <strong className="text-[16px] text-white">Where's my order?</strong>
              <span className="text-brand-lightMuted text-[14px] leading-relaxed">
                Track it instantly with your order number and email.
              </span>
              <Link to="/account" className="text-white font-bold text-[14px] underline hover:text-brand-accentPink mt-1">
                Track order →
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-2.5 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="icb w-11 h-11 border border-brand-borderDark text-brand-dark hover:bg-brand-roseLight">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5"></rect>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="icb w-11 h-11 border border-brand-borderDark text-brand-dark hover:bg-brand-roseLight">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"></path>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="icb w-11 h-11 border border-brand-borderDark text-brand-dark hover:bg-brand-roseLight">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <path d="M14 3v11a3.5 3.5 0 1 1-3.5-3.5"></path>
                <path d="M14 3c.5 2.5 2.5 4.5 5 5"></path>
              </svg>
            </a>
          </div>
        </aside>
      </section>

      {/* Quick Answers Accordion FAQs */}
      <section id="faq" className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] pb-20 sm:pb-28 border-t border-brand-border pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <h2 className="d text-[34px] sm:text-[44px] leading-tight text-brand-dark m-0">
              Quick <span className="s text-brand-rose font-normal">answers</span>
            </h2>
            <p className="text-brand-muted text-[15px] sm:text-[16px] leading-relaxed m-0">
              Most questions are answered here — faster than waiting for an email reply.
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-col divide-y divide-brand-border">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left font-bold text-[17px] text-brand-dark cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-brand-dark transition-transform ${isOpen ? 'rotate-180 text-brand-rose' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-[15px] text-brand-muted leading-relaxed m-0">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactContent;
