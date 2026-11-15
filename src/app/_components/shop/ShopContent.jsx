'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from '@/components/common/Link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/common/ProductCard';
import { FilterSidebar } from '@/app/_components/shop/FilterSidebar';
import { MobileFilterSheet } from '@/app/_components/shop/MobileFilterSheet';
import { api } from '@/api/api';
import { useLanguage } from '@/context/LanguageContext';

const getPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 2) {
    return [1, 2, 3, '...', totalPages];
  }
  if (currentPage === 3) {
    return [1, 2, 3, 4, '...', totalPages];
  }
  if (currentPage >= totalPages - 1) {
    return [1, '...', totalPages - 2, totalPages - 1, totalPages];
  }
  if (currentPage === totalPages - 2 && totalPages === 6) {
    return [1, '...', 3, 4, 5, 6];
  }
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export const ShopContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSearchParams = React.useCallback((newParams) => {
    const q = newParams.toString();
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [router, pathname]);

  const { isBn } = useLanguage();

  const currentCategoryParam = searchParams.get('category') || '';
  const currentSearchParam = searchParams.get('search') || '';
  const currentFilterParam = searchParams.get('filter') || '';
  const currentConcernParam = searchParams.get('concern') || '';
  const currentTypeParam = searchParams.get('type') || '';

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [selectedTypes, setSelectedTypes] = useState(currentTypeParam ? [currentTypeParam] : []);
  const [selectedConcerns, setSelectedConcerns] = useState(currentConcernParam ? [currentConcernParam] : []);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedRating, setSelectedRating] = useState(null);
  const [availability, setAvailability] = useState({
    inStock: true,
    onSale: currentFilterParam === 'sale'
  });

  // Sorting and Pagination
  const [sortBy, setSortBy] = useState('Most popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [visibleCountMobile, setVisibleCountMobile] = useState(8);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Category navigation tabs matching Desktop-Shop.dc.html line 74
  const categoryPills = [
    { id: 'All skincare', label: isBn ? 'সব স্কিনকেয়ার' : 'All skincare' },
    { id: 'Cleansers', label: isBn ? 'ক্লিনজার' : 'Cleansers' },
    { id: 'Serums', label: isBn ? 'সিরাম' : 'Serums' },
    { id: 'Moisturisers', label: isBn ? 'ময়েশ্চারাইজার' : 'Moisturisers' },
    { id: 'Masks', label: isBn ? 'মাস্ক' : 'Masks' },
    { id: 'Sunscreen', label: isBn ? 'সানস্ক্রিন' : 'Sunscreen' },
    { id: 'Toners', label: isBn ? 'টোনার' : 'Toners' }
  ];

  const [activeCategoryPill, setActiveCategoryPill] = useState('All skincare');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts({ category: currentCategoryParam, limit: 48 });
      setProducts(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentCategoryParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset pagination to page 1 when category, filters, or sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategoryParam, currentSearchParam, selectedTypes, selectedConcerns, priceRange, selectedRating, availability, sortBy]);

  // Sync concern/type/filter query params
  useEffect(() => {
    if (currentConcernParam && !selectedConcerns.includes(currentConcernParam)) {
      setSelectedConcerns([currentConcernParam]);
    }
    if (currentTypeParam && !selectedTypes.includes(currentTypeParam)) {
      setSelectedTypes([currentTypeParam]);
    }
    if (currentFilterParam === 'sale') {
      setAvailability(prev => ({ ...prev, onSale: true }));
    }
  }, [currentConcernParam, currentTypeParam, currentFilterParam]);

  const handleClearAll = () => {
    setSelectedTypes([]);
    setSelectedConcerns([]);
    setPriceRange({ min: 0, max: 100 });
    setSelectedRating(null);
    setAvailability({ inStock: false, onSale: false });
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.delete('category');
    params.delete('search');
    params.delete('filter');
    params.delete('concern');
    params.delete('type');
    setSearchParams(params);
  };

  const handleCategoryPillClick = (pillId) => {
    setActiveCategoryPill(pillId);
    if (pillId === 'All skincare') {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([pillId]);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (currentSearchParam) {
      const q = currentSearchParam.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Product Type filter
    if (selectedTypes.length > 0) {
      result = result.filter(p => 
        selectedTypes.some(t => 
          p.subCategory?.toLowerCase() === t.toLowerCase() ||
          p.category?.toLowerCase() === t.toLowerCase() ||
          p.tags?.some(tag => tag.toLowerCase() === t.toLowerCase()) ||
          p.name?.toLowerCase().includes(t.toLowerCase())
        )
      );
    }

    // Skin Concern filter
    if (selectedConcerns.length > 0) {
      result = result.filter(p => 
        selectedConcerns.some(c => 
          p.concerns?.some(item => item.toLowerCase().includes(c.toLowerCase())) ||
          p.description?.toLowerCase().includes(c.toLowerCase())
        )
      );
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // Rating filter
    if (selectedRating) {
      result = result.filter(p => p.rating >= selectedRating);
    }

    // Availability filters
    if (availability.inStock) {
      result = result.filter(p => p.inStock);
    }
    if (availability.onSale) {
      result = result.filter(p => p.wasPrice || p.badge === 'Sale');
    }

    // Sorting
    switch (sortBy) {
      case 'Newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'Price: low to high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: high to low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'Top rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default: // 'Most popular'
        result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
    }

    return result;
  }, [
    products,
    currentSearchParam,
    selectedTypes,
    selectedConcerns,
    priceRange,
    selectedRating,
    availability,
    sortBy
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage) || 1;
  const desktopProducts = filteredAndSortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const mobileProducts = filteredAndSortedProducts.slice(0, visibleCountMobile);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  const handlePageChange = (pageNum) => {
    const next = Math.max(1, Math.min(totalPages, pageNum));
    if (next === currentPage) return;
    setCurrentPage(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const activeFiltersCount = selectedTypes.length + selectedConcerns.length + (selectedRating ? 1 : 0) + (availability.onSale ? 1 : 0);

  return (
    <div className="flex-1 bg-white">
      {/* Category Hero Banner matching Desktop-Shop.dc.html line 66 inside 1440px container */}
      <section className="w-full bg-[#FCEEF1]">
        <div className="max-w-[1440px] mx-auto w-full p-[20px_16px_22px] sm:p-[28px_32px_32px] lg:p-[40px_56px_44px] flex flex-col gap-[10px] sm:gap-[14px] lg:gap-[18px]">
          {/* Breadcrumb matching Desktop-Shop.dc.html line 67 */}
          <nav
            aria-label="Breadcrumb"
            className="mut text-[13px] sm:text-[14px] flex items-center gap-[6px] sm:gap-[8px] leading-[1.3]"
            style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
          >
            <Link to="/" className="mut hover:text-[#1F1219] no-underline transition-colors">
              {isBn ? 'হোম' : 'Home'}
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/shop" className="mut hover:text-[#1F1219] no-underline transition-colors">
              {isBn ? 'শপ' : 'Shop'}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#1F1219] font-semibold">
              {isBn ? 'স্কিনকেয়ার' : 'Skincare'}
            </span>
          </nav>

          {/* Title & Category Pills row matching Desktop-Shop.dc.html lines 68-76 */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 sm:gap-5 lg:gap-[48px]">
            <div className="flex flex-col gap-[10px] lg:gap-[12px] max-w-[640px]">
              <h1
                className="d text-[44px] sm:text-[64px] lg:text-[72px] leading-[1] text-[#1F1219] m-0 font-bold"
                style={{
                  fontFamily: isBn
                    ? "'Anek Bangla', 'Hind Siliguri', sans-serif"
                    : "'Bricolage Grotesque', system-ui, sans-serif",
                  letterSpacing: isBn ? 0 : '-0.03em',
                }}
              >
                {isBn ? (
                  <>
                    স্কিন<span style={{ color: '#C8325F' }}>কেয়ার</span>
                  </>
                ) : (
                  <>
                    Skin
                    <span
                      className="s font-normal"
                      style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontStyle: 'italic',
                        color: '#C8325F',
                        letterSpacing: '-0.01em',
                        marginLeft: 0,
                      }}
                    >
                      care
                    </span>
                  </>
                )}
              </h1>
              <p
                className="mut hidden sm:block text-[16px] lg:text-[17px] leading-[1.55] m-0 text-[#6E5A63]"
                style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
              >
                {isBn
                  ? 'ক্লিনজার, সিরাম ও ময়েশ্চারাইজার প্রতিটি ত্বকের যত্নে — সহজে গড়ে তুলুন আপনার পছন্দমতো পারফেক্ট রুটিন।'
                  : 'Cleansers, serums and moisturisers for every skin type — build a simple routine that actually sticks.'}
              </p>
            </div>

            {/* Category selection pills matching Desktop-Shop.dc.html lines 73-75 */}
            <div className="flex items-center gap-[8px] overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap lg:flex-wrap lg:justify-end w-full lg:w-auto lg:max-w-[620px] -mx-4 px-4 sm:mx-0 sm:px-0 mt-[6px] sm:mt-0">
              {categoryPills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => handleCategoryPillClick(pill.id)}
                  className={`pill shrink-0 ${activeCategoryPill === pill.id ? 'on' : ''}`}
                  style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter & Sort Bar for Tablet & Mobile matching Tablet-Shop.dc.html line 60 & Mobile-Shop.dc.html line 53 */}
      <div className="sticky top-0 z-30 bg-white lg:hidden border-b border-[#F1E4E8]">
        {/* Tablet bar */}
        <div className="hidden sm:flex items-center gap-[12px] p-[16px_32px]">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="pill !h-[48px] font-semibold flex items-center gap-[8px]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4"></path>
            </svg>
            <span>{isBn ? 'ফিল্টার' : 'Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="min-w-[22px] h-[22px] rounded-full bg-[#C8325F] text-white text-[12px] font-bold flex items-center justify-center px-1">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {selectedTypes.slice(0, 2).map((t) => (
            <span key={t} className="pill !h-[36px] !px-[12px] !text-[13px] !bg-[#FCEEF1] !border-[#FCEEF1] text-[#1F1219]">
              {t} ✕
            </span>
          ))}

          <span className="flex-1" />

          <label htmlFor="tsort" className="mut text-[14px] shrink-0">
            {isBn ? 'সাজান' : 'Sort'}
          </label>
          <select 
            id="tsort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-[48px] border border-[#E3D3D9] rounded-full px-[16px] pr-[36px] text-[14px] font-medium text-[#1F1219] bg-white outline-none"
          >
            <option>Most popular</option>
            <option>Newest</option>
            <option>Price: low to high</option>
            <option>Price: high to low</option>
            <option>Top rated</option>
          </select>
        </div>

        {/* Mobile bar */}
        <div className="flex sm:hidden p-[12px_16px] gap-[10px]">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="half"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4"></path>
            </svg>
            <span>{isBn ? 'ফিল্টার' : 'Filter'}</span>
            {activeFiltersCount > 0 && (
              <span className="min-w-[20px] h-[20px] rounded-full bg-[#C8325F] text-white text-[11px] font-bold inline-flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => {
              const options = ['Most popular', 'Newest', 'Price: low to high', 'Price: high to low', 'Top rated'];
              const nextIdx = (options.indexOf(sortBy) + 1) % options.length;
              setSortBy(options[nextIdx]);
            }}
            className="half"
          >
            <span>Sort: {sortBy.replace('Price: ', '')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Layout matching Desktop-Shop.dc.html line 79 */}
      <div className="max-w-[1440px] mx-auto p-[16px_16px_0] sm:p-[28px_32px_0] lg:p-[36px_56px_88px] flex gap-[48px] items-start">
        {/* Desktop Left Aside Sidebar matching Desktop-Shop.dc.html lines 80-128 */}
        <div className="hidden lg:block shrink-0">
          <FilterSidebar
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedConcerns={selectedConcerns}
            setSelectedConcerns={setSelectedConcerns}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            availability={availability}
            setAvailability={setAvailability}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Right Products Area matching Desktop-Shop.dc.html lines 130-165 */}
        <div className="flex-1 min-w-0 flex flex-col gap-[28px]">
          {/* Header row: count & Sort select matching Desktop-Shop.dc.html lines 131-137 */}
          <div className="hidden lg:flex justify-between items-center">
            <span className="mut text-[15px]">
              Showing <strong className="text-[#1F1219] font-bold">{filteredAndSortedProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)}</strong> of {filteredAndSortedProducts.length} products
            </span>
            <div className="flex gap-[12px] items-center">
              <label htmlFor="sort" className="text-[14px] font-semibold text-[#1F1219]">
                {isBn ? 'সাজান' : 'Sort by'}
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-[44px] border border-[#E3D3D9] rounded-full px-[18px] pr-[40px] text-[14px] font-medium text-[#1F1219] bg-white outline-none cursor-pointer focus:border-[#1F1219]"
              >
                <option>Most popular</option>
                <option>Newest</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>Top rated</option>
              </select>
            </div>
          </div>

          {/* Mobile/Tablet total count header */}
          <p className="lg:hidden mut text-[13px] sm:text-[14px] m-0 mb-[-10px]">
            {filteredAndSortedProducts.length} {isBn ? 'টি পণ্য পাওয়া গেছে' : 'products'}
          </p>

          {/* Products Grid matching Desktop-Shop.dc.html line 138 */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-[12px] sm:gap-x-[24px] gap-y-[24px] sm:gap-y-[32px]">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-[4/5] rounded-[20px] bg-[#F8F1F3] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <h3 className="d text-[24px] text-[#1F1219] m-0">Could not load products</h3>
              <p className="text-[15px] mut max-w-sm m-0">{error}</p>
              <button onClick={fetchProducts} className="btn sm rose mt-2">
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <h3 className="d text-[24px] text-[#1F1219] m-0">
                {isBn ? 'এখনো কোনো পণ্য নেই' : 'No products yet'}
              </h3>
              <p className="text-[15px] mut max-w-sm m-0">
                {isBn
                  ? 'নতুন পণ্য যোগ হলে এখানে দেখা যাবে।'
                  : 'Products added to the store catalog will appear here.'}
              </p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <h3 className="d text-[24px] text-[#1F1219] m-0">No matching products found</h3>
              <p className="text-[15px] mut max-w-sm m-0">
                Try adjusting your filters or search terms to explore other curated products.
              </p>
              <button
                onClick={handleClearAll}
                className="btn sm rose mt-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop 3-column Grid (lines 138-158) */}
              <div className="hidden lg:grid grid-cols-3 gap-x-[24px] gap-y-[32px]">
                {desktopProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>

              {/* Mobile & Tablet 2-column Grid matching Tablet-Shop.dc.html line 71 & Mobile-Shop.dc.html line 60 */}
              <div className="grid lg:hidden grid-cols-2 gap-x-[12px] sm:gap-x-[20px] gap-y-[24px] sm:gap-y-[32px]">
                {mobileProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            </>
          )}

          {/* Desktop Pagination matching Desktop-Shop.dc.html lines 159-163 */}
          {filteredAndSortedProducts.length > 0 && (
            <nav aria-label="Pagination" className="hidden lg:flex justify-center items-center gap-[8px] pt-[32px]">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pg disabled:cursor-default"
                aria-label="Previous page"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 6-6 6 6 6"></path>
                </svg>
              </button>

              {paginationItems.map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-[6px] mut" aria-hidden="true">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePageChange(item)}
                    className={`pg ${currentPage === item ? 'on' : ''}`}
                    aria-current={currentPage === item ? 'page' : undefined}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pg disabled:cursor-default"
                aria-label="Next page"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 6 6 6-6 6"></path>
                </svg>
              </button>
            </nav>
          )}

          {/* Tablet & Mobile Progress & Load More matching Tablet-Shop.dc.html lines 92-96 & Mobile-Shop.dc.html lines 80-84 */}
          {filteredAndSortedProducts.length > 0 && (
            <div className="flex lg:hidden flex-col items-center gap-[12px] sm:gap-[14px] pt-[36px] sm:pt-[48px] pb-[48px] sm:pb-[72px]">
              <span className="mut text-[13px] sm:text-[14px]">
                Showing {mobileProducts.length} of {filteredAndSortedProducts.length}
              </span>
              <div className="w-[200px] sm:w-[240px] h-[4px] rounded-[4px] bg-[#F1E4E8] overflow-hidden">
                <div 
                  className="h-full bg-[#1F1219] rounded-[4px] transition-all duration-300" 
                  style={{ width: `${Math.min(100, (mobileProducts.length / filteredAndSortedProducts.length) * 100)}%` }} 
                />
              </div>
              {visibleCountMobile < filteredAndSortedProducts.length && (
                <button 
                  onClick={() => setVisibleCountMobile(prev => prev + 6)} 
                  className="btn ghost w-full sm:w-[260px]"
                >
                  {isBn ? 'আরও দেখুন' : 'Load more'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet matching Mobile-Search-Filter.dc.html */}
      <MobileFilterSheet
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        totalResults={filteredAndSortedProducts.length}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedConcerns={selectedConcerns}
        setSelectedConcerns={setSelectedConcerns}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        availability={availability}
        setAvailability={setAvailability}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default ShopContent;
