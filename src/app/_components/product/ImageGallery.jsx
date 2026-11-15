'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Sparkles, ZoomIn } from 'lucide-react';
import { getProductMediaGallery } from '@/utils/media';

export const ImageGallery = ({ product }) => {
  const galleryItems = getProductMediaGallery(product);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [failedUrls, setFailedUrls] = useState({});

  const markUrlFailed = (url) => {
    if (!url) return;
    setFailedUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  };

  useEffect(() => {
    setActiveImageIndex(0);
    setFailedUrls({});
  }, [product?._id, product?.slug]);

  const safeIndex = activeImageIndex < galleryItems.length ? activeImageIndex : 0;
  const activeItem = galleryItems[safeIndex] || galleryItems[0];
  const isVideoSlide = activeItem?.type === 'video';

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-5">
      {/* Thumbnails row / column */}
      <div className="flex sm:flex-col gap-3 overflow-x-auto sm:w-[92px] shrink-0 pb-2 sm:pb-0 scrollbar-none">
        {galleryItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveImageIndex(index)}
            aria-label={item.alt}
            className={`w-[72px] sm:w-[92px] h-[88px] sm:h-[112px] rounded-2xl shrink-0 p-0 overflow-hidden relative flex items-center justify-center transition-all ${
              safeIndex === index
                ? 'border-2 border-brand-dark shadow-sm'
                : 'border border-brand-border hover:opacity-85'
            }`}
            style={{ backgroundColor: item.tint }}
          >
            {item.type === 'video' ? (
              <>
                {item.poster && !failedUrls[item.poster] && (
                  <Image
                    src={item.poster}
                    alt={item.alt}
                    fill
                    sizes="92px"
                    onError={() => markUrlFailed(item.poster)}
                    className="object-cover opacity-80"
                  />
                )}
                <div className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center text-white relative z-10">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </>
            ) : item.url && !failedUrls[item.url] ? (
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="92px"
                onError={() => markUrlFailed(item.url)}
                className="object-cover"
              />
            ) : (
              <div className="text-[#8C6676] opacity-75">
                <Sparkles className="w-6 h-6" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Large Visual Stage */}
      <div
        className={`flex-1 min-h-[380px] sm:min-h-[540px] lg:h-[700px] rounded-[32px] overflow-hidden relative flex items-center justify-center transition-all duration-300 group ${
          isVideoSlide ? '' : 'cursor-crosshair'
        }`}
        style={{ backgroundColor: activeItem?.tint || '#FBE4EA' }}
        onMouseEnter={() => !isVideoSlide && setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {isVideoSlide ? (
          activeItem.provider === 'youtube' && activeItem.videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${encodeURIComponent(activeItem.videoId)}`}
              title={activeItem.alt}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : activeItem.url ? (
            <video
              src={activeItem.url}
              poster={activeItem.poster || undefined}
              controls
              playsInline
              className="w-full h-full object-cover bg-black"
            />
          ) : (
            <div className="absolute inset-0 bg-brand-deep flex flex-col items-center justify-center text-white p-6 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-rose flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
              <span className="d text-[22px]">Video Demonstration</span>
              <p className="text-[14px] text-brand-lightMuted max-w-sm">
                Watch how {product?.name} applies in a daily routine.
              </p>
              <button
                type="button"
                onClick={() => setActiveImageIndex(0)}
                className="btn sm ghost !text-white !shadow-[inset_0_0_0_1.5px_#ffffff]"
              >
                Back to photo
              </button>
            </div>
          )
        ) : (
          <>
            {activeItem?.url && !failedUrls[activeItem.url] ? (
              <Image
                src={activeItem.url}
                alt={activeItem.alt}
                fill
                priority={safeIndex === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                onError={() => markUrlFailed(activeItem.url)}
                className={`object-cover transition-transform duration-500 ${
                  isZoomed ? 'scale-125' : 'scale-100'
                }`}
              />
            ) : (
              <div
                className={`transform transition-transform duration-500 flex flex-col items-center justify-center text-[#8C6676] ${
                  isZoomed ? 'scale-125' : 'scale-100'
                }`}
              >
                <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                  <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                  <path d="M7 12h10M7 17h10"></path>
                </svg>
              </div>
            )}

            {/* Badge overlay */}
            {product?.badge && (
              <span className="badge left-5 top-5 !text-[13px] !h-7 !px-3 z-10">
                {product.badge}
              </span>
            )}

            {/* Hint label */}
            <span className="absolute left-6 bottom-6 text-[11px] font-bold tracking-widest uppercase text-[#6B4F5B] flex items-center gap-1.5 opacity-80 z-10">
              <ZoomIn className="w-3.5 h-3.5" />
              Hover to zoom
            </span>
          </>
        )}
      </div>
    </div>
  );
};
