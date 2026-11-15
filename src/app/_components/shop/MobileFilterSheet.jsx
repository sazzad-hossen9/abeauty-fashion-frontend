'use client';

import React from 'react';
import { FilterSidebar } from './FilterSidebar';
import { useLanguage } from '@/context/LanguageContext';

export const MobileFilterSheet = ({
  isOpen,
  onClose,
  totalResults,
  ...filterProps
}) => {
  const { isBn } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop matching Mobile-Search-Filter.dc.html line 32 */}
      <div 
        className="absolute inset-0 bg-[#1F1219]/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Dialog matching Mobile-Search-Filter.dc.html lines 33-52 */}
      <div 
        role="dialog" 
        aria-labelledby="mobile-filter-title" 
        className="absolute left-0 right-0 bottom-0 top-[64px] bg-white rounded-t-[28px] flex flex-col z-10 animate-in slide-in-from-bottom duration-300"
      >
        {/* Handle and Header row matching lines 34-37 */}
        <div className="p-[10px_16px_8px] flex flex-col gap-[8px] border-b border-[#F1E4E8] shrink-0">
          <span aria-hidden="true" className="self-center w-[44px] h-[5px] rounded-[5px] bg-[#E3D3D9]" />
          <div className="flex justify-between items-center">
            <button 
              onClick={onClose} 
              className="icb !w-[44px] !h-[44px]" 
              aria-label="Close filters"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18"></path>
              </svg>
            </button>
            <h2 id="mobile-filter-title" className="d text-[20px] font-bold text-[#1F1219] m-0">
              {isBn ? 'ফিল্টার' : 'Filter'}
            </h2>
            <button 
              onClick={filterProps.onClearAll} 
              className="text-[14px] font-semibold text-[#1F1219] underline px-[6px] bg-transparent border-0 cursor-pointer"
            >
              {isBn ? 'মুছুন' : 'Clear'}
            </button>
          </div>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center">
          <div className="w-full max-w-[340px]">
            <FilterSidebar {...filterProps} />
          </div>
        </div>

        {/* Bottom Actions matching Mobile-Search-Filter.dc.html line 51 */}
        <div className="p-[14px_16px_24px] border-t border-[#F1E4E8] grid grid-cols-[1fr_1.6fr] gap-[10px] shadow-[0_-16px_30px_-24px_rgba(42,18,32,0.35)] bg-white shrink-0">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn ghost !h-[52px]"
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn !h-[52px]"
          >
            {isBn ? `${totalResults}টি পণ্য দেখুন` : `Show ${totalResults} results`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterSheet;
