'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { api } from '@/api/api';
import { useLanguage } from '@/context/LanguageContext';

export const ReviewsSection = ({ product }) => {
  const { isBn } = useLanguage();
  const productId = product?.id || product?._id;

  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilterTag, setActiveFilterTag] = useState('Most helpful');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [newReview, setNewReview] = useState({
    name: '',
    skin: 'Dry skin',
    rating: 5,
    title: '',
    body: '',
  });

  useEffect(() => {
    let isMounted = true;
    if (!productId) {
      setReviewsList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .getReviews(productId)
      .then((data) => {
        if (isMounted) {
          setReviewsList(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setReviewsList([]);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [productId]);

  const filterTags = ['Most helpful', 'With photos', 'Dry skin', 'Sensitive skin'];

  const distribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsList.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] += 1;
    });
    const total = reviewsList.length;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star],
      pct: total > 0 ? Math.round((counts[star] / total) * 100) : 0,
    }));
  }, [reviewsList]);

  const averageRating = useMemo(() => {
    if (reviewsList.length === 0) return Number(product?.rating) || 0;
    const sum = reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return Number((sum / reviewsList.length).toFixed(1));
  }, [reviewsList, product?.rating]);

  const displayedReviews = useMemo(() => {
    if (activeFilterTag === 'Dry skin' || activeFilterTag === 'Sensitive skin') {
      return reviewsList.filter((r) => r.skin?.toLowerCase() === activeFilterTag.toLowerCase());
    }
    return reviewsList;
  }, [reviewsList, activeFilterTag]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!newReview.name.trim() || !newReview.title.trim() || !newReview.body.trim()) return;

    setSubmitting(true);
    const res = await api.createReview({
      productId,
      who: newReview.name,
      skin: newReview.skin,
      rating: newReview.rating,
      title: newReview.title,
      body: newReview.body,
    });
    setSubmitting(false);

    if (!res.success || !res.review) {
      setSubmitError(res.error || 'Could not submit review.');
      return;
    }

    setReviewsList([res.review, ...reviewsList]);
    setIsWriteModalOpen(false);
    setNewReview({ name: '', skin: 'Dry skin', rating: 5, title: '', body: '' });
  };

  return (
    <section id="reviews" className="py-12 sm:py-16 border-t border-brand-border max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <h2 className="d text-[32px] sm:text-[40px] text-brand-dark m-0">
            {isBn ? 'গ্রাহকদের রিভিউ' : 'Customer Reviews'}
          </h2>

          <div className="flex items-center gap-4">
            <span className="d text-[54px] sm:text-[64px] leading-none text-brand-dark">
              {averageRating}
            </span>
            <div className="flex flex-col">
              <div className="stars text-[18px] sm:text-[20px] tracking-widest" aria-hidden="true">
                ★★★★★
              </div>
              <span className="text-[14px] text-brand-muted">
                {isBn
                  ? `${reviewsList.length}টি রিভিউর ভিত্তিতে`
                  : `Based on ${reviewsList.length} ${reviewsList.length === 1 ? 'review' : 'reviews'}`}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-[14px]">
            {distribution.map((row) => (
              <div key={row.star} className="flex items-center gap-3">
                <span className="w-3.5 text-brand-dark font-medium">{row.star}</span>
                <div className="h-2 rounded-full bg-brand-border flex-1 overflow-hidden">
                  <div className="h-full bg-brand-rose rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="text-brand-muted w-9 text-right text-[13px]">{row.count}</span>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => setIsWriteModalOpen(true)}
            className="!h-12 w-full"
          >
            {isBn ? 'একটি রিভিউ লিখুন' : 'Write a review'}
          </Button>
        </div>

        <div className="lg:col-span-8 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filterTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveFilterTag(tag)}
                className={`h-8 px-3.5 rounded-full text-[13px] font-semibold transition-all ${
                  activeFilterTag === tag
                    ? 'bg-brand-dark text-white'
                    : 'bg-[#F8F1F3] text-brand-dark hover:bg-brand-roseLight'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-brand-muted text-[15px]">Loading reviews...</p>
          ) : displayedReviews.length === 0 ? (
            <div className="rounded-[20px] border border-brand-border bg-brand-pinkSubtle p-8 text-center">
              <p className="text-brand-muted text-[15px] m-0">
                {isBn ? 'এখনো কোনো রিভিউ নেই।' : 'No reviews yet. Be the first to review this product.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-brand-border">
              {displayedReviews.map((rev) => (
                <article key={rev.id || rev._id} className="py-6 first:pt-0 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-8">
                  <div className="sm:col-span-4 flex flex-col gap-1.5 text-[14px]">
                    <strong className="text-brand-dark font-semibold text-[15px]">{rev.who}</strong>
                    <span className="text-brand-muted text-[13px]">{rev.skin}</span>
                    {rev.verified && (
                      <span className="flex items-center gap-1.5 text-brand-green font-semibold text-[13px] mt-0.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Verified buyer
                      </span>
                    )}
                    <span className="text-[12px] text-brand-muted">{rev.date}</span>
                  </div>

                  <div className="sm:col-span-8 flex flex-col gap-2">
                    <div className="stars text-[15px] tracking-wider" aria-hidden="true">
                      {'★'.repeat(Math.min(5, Math.max(1, Number(rev.rating) || 5)))}
                    </div>
                    <h4 className="text-[17px] font-bold text-brand-dark leading-tight m-0">
                      {rev.title}
                    </h4>
                    <p className="text-brand-muted text-[15px] leading-relaxed m-0">
                      {rev.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setIsWriteModalOpen(false)} />
          <div className="relative bg-white text-brand-dark w-full max-w-lg rounded-[28px] p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="icb absolute right-4 top-4"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="d text-[26px] mb-1">Write your review</h3>
            <p className="text-[14px] text-brand-muted mb-4">
              Share your experience with {product?.name}
            </p>

            {submitError && (
              <div className="p-3 mb-3 rounded-xl bg-brand-roseLight text-[13px] text-[#A3244B]">
                {submitError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[13px] font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-brand-borderDark text-[14px] outline-none focus:border-brand-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Skin Type / Concern</label>
                  <select
                    value={newReview.skin}
                    onChange={(e) => setNewReview({ ...newReview, skin: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-brand-borderDark text-[14px] outline-none focus:border-brand-rose"
                  >
                    <option>Dry skin</option>
                    <option>Sensitive skin</option>
                    <option>Combination skin</option>
                    <option>Oily skin</option>
                    <option>Normal skin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold mb-1">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="w-full h-11 px-3 rounded-xl border border-brand-borderDark text-[14px] outline-none focus:border-brand-rose"
                  >
                    <option value={5}>★★★★★ (5 stars)</option>
                    <option value={4}>★★★★☆ (4 stars)</option>
                    <option value={3}>★★★☆☆ (3 stars)</option>
                    <option value={2}>★★☆☆☆ (2 stars)</option>
                    <option value={1}>★☆☆☆☆ (1 star)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl border border-brand-borderDark text-[14px] outline-none focus:border-brand-rose"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-1">Your Review</label>
                <textarea
                  rows={3}
                  required
                  value={newReview.body}
                  onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-brand-borderDark text-[14px] outline-none focus:border-brand-rose resize-none"
                />
              </div>

              <Button type="submit" variant="primary" disabled={submitting} className="w-full mt-2">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
