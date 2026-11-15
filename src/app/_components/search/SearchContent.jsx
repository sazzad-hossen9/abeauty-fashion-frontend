'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from '@/components/common/Link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/common/ProductCard';
import { api } from '@/api/api';
import { useLanguage } from '@/context/LanguageContext';

export const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isBn } = useLanguage();

  const query = searchParams?.get('q') || searchParams?.get('search') || '';
  const [activeTab, setActiveTab] = useState('products');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Best match');
  const [visibleCount, setVisibleCount] = useState(6);

  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSearchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodsRes, arts] = await Promise.all([api.getProducts({ limit: 48 }), api.getArticles()]);
      setProducts(prodsRes.items || []);
      setArticles(arts);
    } catch (err) {
      setError(err.message || 'Failed to load search results.');
      setProducts([]);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSearchData();
  }, [loadSearchData]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = products.filter((p) => {
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.nameBn?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.concerns?.some((c) => c.toLowerCase().includes(q)) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    });

    if (selectedCategories.length > 0) {
      res = res.filter((p) => selectedCategories.includes(p.category));
    }
    if (inStockOnly) {
      res = res.filter((p) => p.inStock !== false);
    }
    if (onSaleOnly) {
      res = res.filter((p) => p.wasPrice || p.badge === 'Sale');
    }

    if (sortBy === 'Most popular') {
      res = [...res].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (sortBy === 'Price: low to high') {
      res = [...res].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Newest') {
      res = [...res].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return res;
  }, [products, query, selectedCategories, inStockOnly, onSaleOnly, sortBy]);

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.tag?.toLowerCase().includes(q) ||
        a.titleBn?.toLowerCase().includes(q)
    );
  }, [articles, query]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedSkinType('');
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  return (
    <div className="flex-1 bg-white">
      <section className="w-full border-b border-[#F1E4E8]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] pt-[28px] lg:pt-[40px] pb-[20px] lg:pb-[28px] flex flex-col gap-[14px] lg:gap-[18px]">
          <span className="mut text-[14px]">
            {isBn ? 'অনুসন্ধানের ফলাফল' : 'Search results'}
          </span>

          <h1
            className="d text-[36px] sm:text-[48px] lg:text-[56px] leading-none text-[#1F1219] m-0 flex flex-wrap items-baseline gap-3"
            style={{
              fontFamily: isBn
                ? "'Anek Bangla', 'Hind Siliguri', sans-serif"
                : "'Bricolage Grotesque', system-ui, sans-serif",
            }}
          >
            <span>{query ? <>&ldquo;{query}&rdquo;</> : isBn ? 'সব পণ্য' : 'All products'}</span>
            <span
              className="mut text-[16px] sm:text-[20px] lg:text-[22px] font-medium tracking-normal"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {filteredProducts.length} products · {filteredArticles.length} articles
            </span>
          </h1>

          <div role="tablist" className="flex gap-[8px]">
            <button
              role="tab"
              aria-selected={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
              className={`pill ${activeTab === 'products' ? 'on' : ''}`}
            >
              Products ({filteredProducts.length})
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'articles'}
              onClick={() => setActiveTab('articles')}
              className={`pill ${activeTab === 'articles' ? 'on' : ''}`}
            >
              Journal articles ({filteredArticles.length})
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] pt-[24px] lg:pt-[32px] pb-[56px] lg:pb-[80px] flex flex-col lg:flex-row gap-8 lg:gap-[48px] items-start">
        <aside aria-label="Filters" className="hidden lg:flex w-[272px] shrink-0 flex-col gap-[26px]">
          <div className="flex justify-between items-center">
            <span className="d text-[22px] text-[#1F1219]">Filter</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[14px] font-semibold underline bg-transparent border-0 p-0 text-[#1F1219] hover:text-[#C8325F] cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <fieldset className="border-0 p-0 m-0 flex flex-col gap-[12px]">
            <legend className="fh mb-2">Category</legend>
            {['Skincare', 'Hair Care', 'Makeup', 'Beauty Tools'].map((cat) => (
              <label key={cat} className="ck">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span className="flex-1">{cat}</span>
                <span className="text-[#7A6570] text-[13px]">
                  {products.filter((p) => p.category === cat).length}
                </span>
              </label>
            ))}
          </fieldset>

          <fieldset className="border-0 pt-[24px] px-0 pb-0 m-0 flex flex-col gap-[12px] border-t border-[#F1E4E8]">
            <legend className="fh mb-2">Skin type</legend>
            <div className="flex flex-wrap gap-[8px]">
              {['Dry', 'Oily', 'Combination', 'Sensitive'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedSkinType((prev) => (prev === type ? '' : type))}
                  className={`pill !h-[36px] !text-[13px] ${selectedSkinType === type ? 'on' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-[12px] pt-[24px] border-t border-[#F1E4E8]">
            <span className="fh">More</span>
            <label className="ck">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In stock only</span>
            </label>
            <label className="ck">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
              />
              <span>On sale</span>
            </label>
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full flex flex-col gap-[24px]">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-[12px] sm:gap-x-[24px] gap-y-[24px] sm:gap-y-[32px]">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-[4/5] rounded-[20px] bg-[#F8F1F3] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center flex flex-col items-center gap-3">
              <h2 className="d text-[26px] text-[#1F1219] m-0">Could not load search results</h2>
              <p className="mut text-[15px] m-0">{error}</p>
              <button onClick={loadSearchData} className="btn sm rose mt-2">
                Try again
              </button>
            </div>
          ) : activeTab === 'products' ? (
            <>
              <div className="flex flex-wrap justify-between items-center gap-[16px]">
                <div className="flex gap-[8px] flex-wrap items-center">
                  {selectedCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className="pill !h-[34px] !text-[13px] !bg-[#FCEEF1] !border-[#FCEEF1] flex items-center gap-1.5"
                    >
                      <span>{cat}</span>
                      <span>✕</span>
                    </button>
                  ))}
                  {selectedSkinType && (
                    <button
                      onClick={() => setSelectedSkinType('')}
                      className="pill !h-[34px] !text-[13px] !bg-[#FCEEF1] !border-[#FCEEF1] flex items-center gap-1.5"
                    >
                      <span>{selectedSkinType} skin</span>
                      <span>✕</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-[10px] items-center shrink-0 ml-auto">
                  <label htmlFor="ssort" className="text-[14px] font-semibold">
                    Sort
                  </label>
                  <select
                    id="ssort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-[44px] border border-[#E3D3D9] rounded-full px-[16px] pr-[36px] text-[14px] font-medium text-[#1F1219] bg-white outline-none"
                  >
                    <option>Best match</option>
                    <option>Most popular</option>
                    <option>Price: low to high</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center gap-3">
                  <h2 className="d text-[26px] text-[#1F1219] m-0">
                    {products.length === 0
                      ? 'No products yet'
                      : `No matching products for “${query}”`}
                  </h2>
                  <p className="mut text-[15px] m-0">
                    {products.length === 0
                      ? 'Products added to the store catalog will appear here.'
                      : 'Try another keyword or clear your active filters.'}
                  </p>
                  {products.length > 0 && (
                    <button
                      onClick={() => {
                        handleClearAll();
                        router.push('/search?q=');
                      }}
                      className="btn sm rose mt-2"
                    >
                      Show all products
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-[12px] sm:gap-x-[24px] gap-y-[24px] sm:gap-y-[32px]">
                    {filteredProducts.slice(0, visibleCount).map((p) => (
                      <ProductCard key={p.id || p._id} product={p} />
                    ))}
                  </div>

                  {visibleCount < filteredProducts.length && (
                    <div className="flex justify-center pt-[16px]">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 6)}
                        className="btn ghost w-[260px]"
                      >
                        Show more results
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : filteredArticles.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center gap-3">
              <h2 className="d text-[26px] text-[#1F1219] m-0">No journal articles yet</h2>
              <p className="mut text-[15px] m-0">
                Published articles matching your search will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px]">
              {filteredArticles.map((article) => (
                <article key={article.id || article._id} className="flex flex-col gap-[12px]">
                  <div
                    className="ph w-full aspect-[16/10] rounded-[20px] overflow-hidden relative flex items-center justify-center"
                    style={{ backgroundColor: article.tint || '#FBE4EA' }}
                  >
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.imageAlt || article.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="phl">Article image</span>
                    )}
                  </div>
                  <span className="text-[12px] font-bold tracking-[0.1em] uppercase text-[#C8325F]">
                    {article.tag}
                  </span>
                  <Link
                    to="/about"
                    className="d text-[20px] font-bold text-[#1F1219] hover:text-[#C8325F] no-underline"
                  >
                    {article.title}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchContent;
