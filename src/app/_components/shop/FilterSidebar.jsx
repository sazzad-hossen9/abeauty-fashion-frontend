'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const FilterSidebar = ({
  selectedTypes,
  setSelectedTypes,
  selectedConcerns,
  setSelectedConcerns,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  availability,
  setAvailability,
  onClearAll
}) => {
  const { isBn } = useLanguage();
  const trackRef = useRef(null);
  const [minText, setMinText] = useState(String(priceRange.min));
  const [maxText, setMaxText] = useState(String(priceRange.max));

  useEffect(() => {
    setMinText(String(priceRange.min));
  }, [priceRange.min]);

  useEffect(() => {
    setMaxText(String(priceRange.max));
  }, [priceRange.max]);

  const startDrag = (handle) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    const updateFromClientX = (clientX) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const val = Math.round(pct * 100);
      setPriceRange((prev) => {
        if (handle === 'min') {
          return { ...prev, min: Math.min(val, prev.max - 1) };
        }
        return { ...prev, max: Math.max(val, prev.min + 1) };
      });
    };

    const onPointerMove = (ev) => {
      updateFromClientX(ev.clientX);
    };
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleTrackClick = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const val = Math.round(pct * 100);
    setPriceRange((prev) => {
      const distMin = Math.abs(val - prev.min);
      const distMax = Math.abs(val - prev.max);
      if (distMin <= distMax) {
        return { ...prev, min: Math.min(val, prev.max - 1) };
      }
      return { ...prev, max: Math.max(val, prev.min + 1) };
    });
  };

  const productTypes = [
    { id: 'Cleansers', label: isBn ? 'ক্লিনজার' : 'Cleansers' },
    { id: 'Serums', label: isBn ? 'সিরাম' : 'Serums' },
    { id: 'Moisturisers', label: isBn ? 'ময়েশ্চারাইজার' : 'Moisturisers' },
    { id: 'Masks & treatments', label: isBn ? 'মাস্ক ও ট্রিটমেন্ট' : 'Masks & treatments' },
    { id: 'Sunscreen', label: isBn ? 'সানস্ক্রিন' : 'Sunscreen' }
  ];

  const skinConcerns = [
    { id: 'Dryness', label: isBn ? 'শুষ্কতা' : 'Dryness' },
    { id: 'Dullness', label: isBn ? 'মলিনতা' : 'Dullness' },
    { id: 'Breakouts', label: isBn ? 'ব্রণ' : 'Breakouts' },
    { id: 'Fine lines', label: isBn ? 'সূক্ষ্ম বলিরেখা' : 'Fine lines' },
    { id: 'Sensitivity', label: isBn ? 'সংবেদনশীলতা' : 'Sensitivity' }
  ];

  const toggleType = (typeId) => {
    setSelectedTypes(prev =>
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  const toggleConcern = (concernId) => {
    setSelectedConcerns(prev =>
      prev.includes(concernId) ? prev.filter(c => c !== concernId) : [...prev, concernId]
    );
  };

  const activeFiltersCount = selectedTypes.length + selectedConcerns.length + (selectedRating ? 1 : 0) + (availability.onSale ? 1 : 0);

  // Calculate percentage for dual price slider track (min 0, max 100)
  const minPercent = Math.max(0, Math.min(100, (priceRange.min / 100) * 100));
  const maxPercent = Math.max(0, Math.min(100, 100 - (priceRange.max / 100) * 100));

  return (
    <aside aria-label="Filters" className="w-[272px] shrink-0 flex flex-col gap-[28px]">
      {/* Header matching Desktop-Shop.dc.html line 81 */}
      <div className="flex justify-between items-center pb-[16px] border-b border-[#F1E4E8]">
        <span className="d text-[22px] font-bold text-[#1F1219]">
          {isBn ? 'ফিল্টার' : 'Filters'}
        </span>
        <button
          onClick={onClearAll}
          className="text-[14px] font-semibold text-[#1F1219] underline hover:text-[#C8325F] cursor-pointer bg-none border-0 p-0"
        >
          {isBn ? 'সব মুছুন' : 'Clear all'}
        </button>
      </div>

      {/* Active Tags matching Desktop-Shop.dc.html line 84 */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-[8px]">
          {selectedTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className="pill !h-[34px] !px-[12px] !text-[13px] !bg-[#FCEEF1] !border-[#FCEEF1] text-[#1F1219] flex items-center gap-[6px] cursor-pointer"
              aria-label={`Remove ${type} filter`}
            >
              <span>{type}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18"></path>
              </svg>
            </button>
          ))}

          {selectedConcerns.map(concern => (
            <button
              key={concern}
              onClick={() => toggleConcern(concern)}
              className="pill !h-[34px] !px-[12px] !text-[13px] !bg-[#FCEEF1] !border-[#FCEEF1] text-[#1F1219] flex items-center gap-[6px] cursor-pointer"
              aria-label={`Remove ${concern} filter`}
            >
              <span>{concern}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18"></path>
              </svg>
            </button>
          ))}

          {availability.onSale && (
            <button
              onClick={() => setAvailability(prev => ({ ...prev, onSale: false }))}
              className="pill !h-[34px] !px-[12px] !text-[13px] !bg-[#FCEEF1] !border-[#FCEEF1] text-[#1F1219] flex items-center gap-[6px] cursor-pointer"
            >
              <span>On sale</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18"></path>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Product Type matching Desktop-Shop.dc.html line 88 */}
      <fieldset className="border-0 p-0 m-0 flex flex-col gap-[14px]">
        <legend className="fh w-full mb-[10px] text-[#1F1219]">
          {isBn ? 'পণ্যের ধরন' : 'Product type'}
        </legend>
        {productTypes.map(t => (
          <label key={t.id} className="ck">
            <input
              type="checkbox"
              checked={selectedTypes.includes(t.id)}
              onChange={() => toggleType(t.id)}
            />
            <span>{t.label}</span>
          </label>
        ))}
      </fieldset>

      {/* Skin Concern matching Desktop-Shop.dc.html line 96 */}
      <fieldset className="border-0 p-0 m-0 flex flex-col gap-[14px] pt-[24px] border-t border-[#F1E4E8]">
        <legend className="fh w-full mb-[10px] text-[#1F1219]">
          {isBn ? 'ত্বকের সমস্যা' : 'Skin concern'}
        </legend>
        {skinConcerns.map(c => (
          <label key={c.id} className="ck">
            <input
              type="checkbox"
              checked={selectedConcerns.includes(c.id)}
              onChange={() => toggleConcern(c.id)}
            />
            <span>{c.label}</span>
          </label>
        ))}
      </fieldset>

      {/* Price Slider matching Desktop-Shop.dc.html line 104 */}
      <div className="flex flex-col gap-[16px] pt-[24px] border-t border-[#F1E4E8]">
        <span className="fh text-[#1F1219]">{isBn ? 'মূল্য সীমা' : 'Price'}</span>
        
        {/* Interactive Dual Range Slider */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative h-[20px] flex items-center select-none touch-none cursor-pointer"
        >
          <div className="absolute left-0 right-0 top-[9px] h-[3px] bg-[#F1E4E8] rounded-[3px]" />
          <div
            className="absolute top-[9px] h-[3px] bg-[#C8325F] rounded-[3px]"
            style={{ left: `${minPercent}%`, right: `${maxPercent}%` }}
          />
          <span
            role="slider"
            tabIndex={0}
            aria-label="Minimum price slider"
            aria-valuemin={0}
            aria-valuemax={priceRange.max}
            aria-valuenow={priceRange.min}
            onPointerDown={startDrag('min')}
            className="absolute top-[0.5px] w-[20px] h-[20px] rounded-full bg-white shadow-[0_0_0_2px_#C8325F] -ml-[10px] cursor-grab active:cursor-grabbing z-10"
            style={{ left: `${minPercent}%` }}
          />
          <span
            role="slider"
            tabIndex={0}
            aria-label="Maximum price slider"
            aria-valuemin={priceRange.min}
            aria-valuemax={100}
            aria-valuenow={priceRange.max}
            onPointerDown={startDrag('max')}
            className="absolute top-[0.5px] w-[20px] h-[20px] rounded-full bg-white shadow-[0_0_0_2px_#C8325F] -mr-[10px] cursor-grab active:cursor-grabbing z-10"
            style={{ right: `${maxPercent}%` }}
          />
        </div>

        {/* Min / Max Input Fields matching Desktop-Shop.dc.html line 112 (no spinner arrows, clean numeric typing) */}
        <div className="flex gap-[10px] items-center">
          <label className="flex-1 flex items-center gap-[6px] h-[44px] border border-[#E3D3D9] rounded-[12px] px-[12px] text-[14px] focus-within:border-[#1F1219] transition-colors bg-white">
            <span className="mut">{isBn ? '৳' : '$'}</span>
            <input
              type="text"
              inputMode="numeric"
              aria-label="Minimum price"
              value={minText}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
                setMinText(digits);
                const num = digits === '' ? 0 : Math.min(100, Number(digits));
                setPriceRange((prev) => ({
                  ...prev,
                  min: Math.min(num, prev.max),
                }));
              }}
              onBlur={() => setMinText(String(priceRange.min))}
              className="border-0 outline-none w-full bg-transparent text-[#1F1219] font-inherit"
            />
          </label>
          <span className="mut" aria-hidden="true">–</span>
          <label className="flex-1 flex items-center gap-[6px] h-[44px] border border-[#E3D3D9] rounded-[12px] px-[12px] text-[14px] focus-within:border-[#1F1219] transition-colors bg-white">
            <span className="mut">{isBn ? '৳' : '$'}</span>
            <input
              type="text"
              inputMode="numeric"
              aria-label="Maximum price"
              value={maxText}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
                setMaxText(digits);
                const num = digits === '' ? 0 : Math.min(100, Number(digits));
                setPriceRange((prev) => ({
                  ...prev,
                  max: Math.max(prev.min, num),
                }));
              }}
              onBlur={() => setMaxText(String(priceRange.max))}
              className="border-0 outline-none w-full bg-transparent text-[#1F1219] font-inherit"
            />
          </label>
        </div>
      </div>

      {/* Rating matching Desktop-Shop.dc.html line 118 */}
      <div className="flex flex-col gap-[14px] pt-[24px] border-t border-[#F1E4E8]">
        <span className="fh text-[#1F1219]">{isBn ? 'রেটিং' : 'Rating'}</span>
        <label className="ck">
          <input
            type="radio"
            name="r"
            checked={selectedRating === 4.8}
            onChange={() => setSelectedRating(selectedRating === 4.8 ? null : 4.8)}
          />
          <span className="stars" aria-hidden="true">★★★★★</span>
          <span>&amp; up</span>
        </label>
        <label className="ck">
          <input
            type="radio"
            name="r"
            checked={selectedRating === 4.0}
            onChange={() => setSelectedRating(selectedRating === 4.0 ? null : 4.0)}
          />
          <span className="stars" aria-hidden="true">★★★★</span>
          <span style={{ color: '#E3D3D9' }} aria-hidden="true">★</span>
          <span>4 &amp; up</span>
        </label>
      </div>

      {/* Availability matching Desktop-Shop.dc.html line 123 */}
      <div className="flex flex-col gap-[14px] pt-[24px] border-t border-[#F1E4E8]">
        <span className="fh text-[#1F1219]">{isBn ? 'প্রাপ্যতা' : 'Availability'}</span>
        <label className="ck">
          <input
            type="checkbox"
            checked={availability.inStock}
            onChange={(e) => setAvailability(prev => ({ ...prev, inStock: e.target.checked }))}
          />
          <span>{isBn ? 'স্টকে আছে' : 'In stock'}</span>
        </label>
        <label className="ck">
          <input
            type="checkbox"
            checked={availability.onSale}
            onChange={(e) => setAvailability(prev => ({ ...prev, onSale: e.target.checked }))}
          />
          <span>{isBn ? 'অফার চলছে' : 'On sale'}</span>
        </label>
      </div>
    </aside>
  );
};
