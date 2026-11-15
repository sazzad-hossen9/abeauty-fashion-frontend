'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from '@/components/common/Link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { api } from '@/api/api';
import { useLanguage } from '@/context/LanguageContext';

export const NotFoundContent = () => {
  const [query, setQuery] = useState('');
  const [recommendedItems, setRecommendedItems] = useState([]);
  const router = useRouter();
  const { formatPrice } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    api
      .getProducts({ limit: 4 })
      .then(({ items }) => {
        if (isMounted) setRecommendedItems((items || []).slice(0, 4));
      })
      .catch(() => {
        if (isMounted) setRecommendedItems([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex-1 bg-white">
      <section className="bg-brand-roseLight w-full py-20 sm:py-28 flex flex-col items-center text-center gap-5 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] flex flex-col items-center text-center gap-5 relative z-10">
          <span
            aria-hidden="true"
            className="d absolute text-[240px] sm:text-[360px] lg:text-[420px] leading-none text-[#F7DCE3] top-6 select-none pointer-events-none -z-0"
          >
            404
          </span>

          <span className="s text-[36px] sm:text-[44px] text-brand-rose relative z-10">
            Oops —
          </span>

          <h1 className="d text-[44px] sm:text-[60px] lg:text-[72px] leading-[1.05] text-brand-dark max-w-[800px] m-0 relative z-10">
            This page went for a facial.
          </h1>

          <p className="text-brand-muted text-[16px] sm:text-[18px] leading-relaxed max-w-[560px] m-0 relative z-10">
            The link may be old or the page has moved. Try a search below, or pick up where most people go next.
          </p>

          <form
            onSubmit={handleSearch}
            className="relative z-10 flex items-center gap-2 w-full max-w-[560px] bg-white rounded-full p-1.5 border border-brand-borderDark mt-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products or guides…"
              className="flex-1 border-0 outline-none px-4 sm:px-5 py-2 text-[15px] sm:text-[16px] text-brand-dark bg-transparent"
            />
            <button type="submit" className="btn !h-11 !px-6 text-[14px]">
              Search
            </button>
          </form>

          <div className="relative z-10 flex flex-wrap justify-center gap-2 max-w-xl mt-2">
            <Link to="/shop?category=Skincare" className="pill no-underline">Skincare</Link>
            <Link to="/shop?category=Makeup" className="pill no-underline">Makeup</Link>
            <Link to="/shop?category=Hair+Care" className="pill no-underline">Hair Care</Link>
            <Link to="/shop?category=Beauty+Tools" className="pill no-underline">Beauty Tools</Link>
            <Link to="/#journal" className="pill no-underline">Beauty Journal</Link>
            <Link to="/contact" className="pill no-underline">Contact us</Link>
          </div>

          <Button variant="ghost" to="/" className="relative z-10 mt-3">
            Back to home
          </Button>
        </div>
      </section>

      {recommendedItems.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-16 sm:py-20">
          <h2 className="d text-[30px] sm:text-[40px] text-brand-dark mb-8 m-0">
            Loved by our <span className="s text-brand-rose font-normal">customers</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedItems.map((item) => (
              <Link
                key={item.id || item._id}
                to={`/product/${item.id || item._id}`}
                className="flex items-center gap-4 p-3.5 border border-brand-border rounded-[22px] bg-white hover:shadow-sm transition-all no-underline"
              >
                <div
                  className="w-[84px] h-[100px] rounded-2xl shrink-0 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: item.tint || '#FBE4EA' }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.imageAlt || item.name}
                      fill
                      sizes="84px"
                      className="object-cover"
                    />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8C6676" strokeWidth="1.1">
                      <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                      <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                    </svg>
                  )}
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[12px] text-brand-muted">{item.category}</span>
                  <span className="font-semibold text-[15px] text-brand-dark line-clamp-1">{item.name}</span>
                  <strong className="text-[15px] text-brand-dark">{formatPrice(item.price)}</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default NotFoundContent;
