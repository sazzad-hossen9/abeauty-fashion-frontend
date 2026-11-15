'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from '@/components/common/Link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/api/api';
import { MobileDrawer } from './MobileDrawer';

export const Navbar = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, openLoginModal } = useAuth();
  const { lang, setLang, isBn, formatPrice } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const headerRef = useRef(null);
  const expandedInputRef = useRef(null);

  const isHome = pathname === '/';
  const isCheckout = pathname === '/checkout';
  const isSearchPage = pathname === '/search';
  const currentCategory = searchParams?.get('category') || '';
  const currentFilter = searchParams?.get('filter') || '';

  // Sync search input with URL query on /search or /shop?search=
  useEffect(() => {
    const q = searchParams?.get('q') || searchParams?.get('search') || '';
    if (q) {
      setSearchQuery(q);
    } else if (!isSearchPage) {
      setSearchQuery('');
    }
    setIsDropdownOpen(false);
    setIsSearchActive(isSearchPage);
  }, [pathname, searchParams, isSearchPage]);

  // Close search mode / dropdown on Escape or outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        if (!isSearchPage) {
          setIsSearchActive(false);
        }
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        if (!isSearchPage) {
          setIsSearchActive(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchPage]);

  // Focus expanded input when entering search mode & load products if not yet loaded
  useEffect(() => {
    if (isSearchActive && expandedInputRef.current) {
      expandedInputRef.current.focus();
    }
    if ((isSearchActive || isDropdownOpen) && catalogProducts.length === 0) {
      api.getProducts({ limit: 48 }).then((data) => setCatalogProducts(data.items || [])).catch(() => {});
    }
  }, [isSearchActive, isDropdownOpen, catalogProducts.length]);

  // Live search suggestions and matching products for Desktop-Search.dc.html lines 61-80
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return {
        products: catalogProducts.slice(0, 3),
        totalCount: catalogProducts.length,
        suggestions: ['serum for dry skin', 'serum vitamin c', 'hair serum', 'hyaluronic serum'],
      };
    }
    const matched = catalogProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.nameBn?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
    const dynamicSuggestions = [
      `${searchQuery.trim()} for dry skin`,
      `${searchQuery.trim()} vitamin c`,
      `hair ${searchQuery.trim()}`,
      `hydrating ${searchQuery.trim()}`,
    ];
    return {
      products: matched.slice(0, 3),
      totalCount: matched.length,
      suggestions: dynamicSuggestions,
    };
  }, [searchQuery, catalogProducts]);

  // Hide global Navbar on Checkout page (CheckoutContent renders its own minimal checkout header)
  if (isCheckout) {
    return null;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/search');
    }
  };

  const handleClearOrCloseSearch = () => {
    if (searchQuery) {
      setSearchQuery('');
      expandedInputRef.current?.focus();
    } else if (!isSearchPage) {
      setIsSearchActive(false);
      setIsDropdownOpen(false);
    }
  };

  const navLinks = [
    { name: isBn ? 'সব পণ্য' : 'Shop All', path: '/shop', key: 'all' },
    { name: isBn ? 'স্কিনকেয়ার' : 'Skincare', path: '/shop?category=Skincare', key: 'Skincare' },
    { name: isBn ? 'মেকআপ' : 'Makeup', path: '/shop?category=Makeup', key: 'Makeup' },
    { name: isBn ? 'হেয়ার কেয়ার' : 'Hair Care', path: '/shop?category=Hair+Care', key: 'Hair Care' },
    { name: isBn ? 'বিউটি টুলস' : 'Beauty Tools', path: '/shop?category=Beauty+Tools', key: 'Beauty Tools' },
    { name: isBn ? 'ব্লগ' : 'Journal', path: '/#journal', key: 'journal' },
    { name: isBn ? 'অফার' : 'Sale', path: '/shop?filter=sale', isSale: true, key: 'sale' },
  ];

  const isLinkActive = (link) => {
    if (pathname !== '/shop') return false;
    if (currentFilter === 'sale') return link.key === 'sale';
    if (currentCategory) return link.key === currentCategory;
    return link.key === 'all';
  };

  const showExpandedSearch = isSearchActive || isSearchPage;

  return (
    <>
      <header
        ref={headerRef}
        className="h-[76px] sm:h-[84px] border-b border-[#F1E4E8] bg-white sticky top-0 z-40 flex items-center w-full"
      >
        <div
          className={`max-w-[1440px] mx-auto w-full px-4 sm:px-8 lg:px-[56px] flex items-center justify-between ${
            showExpandedSearch ? 'lg:gap-[32px]' : ''
          }`}
        >
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="icb lg:hidden w-10 h-10 -ml-1"
            >
              <Menu className="w-6 h-6 text-brand-dark" />
            </button>

            <Logo />
          </div>

          {/* Center: EITHER Expanded Search Bar (Desktop-Search.dc.html) OR Standard Nav Links */}
          {showExpandedSearch ? (
            <form
              role="search"
              onSubmit={handleSearchSubmit}
              className="hidden md:block flex-1 max-w-[640px] relative mx-auto"
            >
              <div className="flex items-center gap-[10px] h-[50px] pl-[18px] pr-[8px] rounded-full bg-white shadow-[0_0_0_2px_#1F1219]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="text-[#1F1219] shrink-0"
                >
                  <circle cx="11" cy="11" r="7"></circle>
                  <path d="m20 20-3.5-3.5"></path>
                </svg>
                <input
                  ref={expandedInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  aria-label={isBn ? 'পণ্য ও গাইড খুঁজুন' : 'Search products and guides'}
                  placeholder={isBn ? 'সিরাম, হেয়ার ড্রায়ার খুঁজুন…' : 'Search products and guides…'}
                  className="border-0 outline-none font-medium text-[16px] text-[#1F1219] bg-transparent w-full placeholder:text-[#6E5A63]/60"
                  style={{ fontFamily: isBn ? "'Hind Siliguri', sans-serif" : "'DM Sans', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={handleClearOrCloseSearch}
                  className="icb !w-[36px] !h-[36px] shrink-0"
                  aria-label="Clear search"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6 6 18"></path>
                  </svg>
                </button>
              </div>
            </form>
          ) : (
            <nav aria-label="Main" className="hidden lg:flex items-center gap-[30px]">
              {navLinks.map((link) => {
                const active = isLinkActive(link);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-[15px] transition-colors no-underline ${
                      link.isSale || active
                        ? 'text-[#C8325F] font-bold hover:text-brand-roseHover'
                        : 'text-[#1F1219] font-medium hover:text-[#C8325F]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Actions: Search bar (in standard mode), Language (HOME PAGE ONLY), User, Wishlist, Bag */}
          <div className="flex items-center gap-1 sm:gap-[4px] shrink-0">
            {/* Standard Desktop Search Capsule (Hidden when expanded Search Mode is active) */}
            {!showExpandedSearch && (
              <form
                onSubmit={handleSearchSubmit}
                className={`hidden md:flex items-center gap-[8px] h-[44px] px-[16px] rounded-full bg-[#F8F1F3] transition-all mr-[8px] ${
                  isHome ? 'w-[210px]' : 'w-[250px]'
                }`}
              >
                <Search className="w-[14px] h-[14px] text-brand-dark shrink-0" strokeWidth={1.8} />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => {
                    setIsSearchActive(true);
                    setIsDropdownOpen(true);
                  }}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchActive(true);
                    setIsDropdownOpen(true);
                  }}
                  placeholder={isBn ? 'সিরাম, হেয়ার ড্রায়ার খুঁজুন…' : 'Search serums, dryers…'}
                  aria-label={isBn ? 'পণ্য খুঁজুন' : 'Search products'}
                  className="w-full bg-transparent border-0 outline-none text-[14px] font-sans text-[#1F1219] placeholder:text-[#6E5A63]/70"
                />
              </form>
            )}

            {/* Mobile search toggle button */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle search"
              className="icb md:hidden w-10 h-10"
            >
              <Search className="w-4 h-4 text-brand-dark" strokeWidth={1.8} />
            </button>

            {/* Language Toggle (EN / বাং) — HOME PAGE ONLY matching Main.dc.html & Desktop-Home-BN.dc.html */}
            {isHome && !showExpandedSearch && (
              <nav aria-label="Language" className="inline-flex bg-[#F8F1F3] rounded-full p-[3px] mr-[2px]">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`h-[36px] px-[12px] rounded-full inline-flex items-center text-[13px] font-bold transition-all cursor-pointer ${
                    lang === 'en'
                      ? 'bg-[#1F1219] text-white shadow-xs'
                      : 'text-[#6E5A63] hover:text-[#1F1219]'
                  }`}
                  aria-current={lang === 'en' ? 'true' : 'false'}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`h-[36px] px-[12px] rounded-full inline-flex items-center text-[13px] font-bold transition-all cursor-pointer ${
                    lang === 'bn'
                      ? 'bg-[#1F1219] text-white shadow-xs'
                      : 'text-[#6E5A63] hover:text-[#1F1219]'
                  }`}
                  aria-current={lang === 'bn' ? 'true' : 'false'}
                >
                  বাং
                </button>
              </nav>
            )}

            {/* User Account Button */}
            {user ? (
              <Link
                to="/account"
                aria-label={isBn ? 'আমার অ্যাকাউন্ট' : 'My account'}
                className={`icb !w-[44px] !h-[44px] ${
                  pathname === '/account' ? 'bg-brand-roseLight text-brand-rose' : ''
                }`}
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
              </Link>
            ) : (
              <button
                onClick={openLoginModal}
                aria-label={isBn ? 'সাইন ইন করুন' : 'Sign in'}
                className="icb !w-[44px] !h-[44px]"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
              </button>
            )}

            {/* Wishlist Button */}
            <Link
              to="/account?tab=wishlist"
              aria-label={isBn ? `উইশলিস্ট, ${wishlistCount}টি পণ্য` : `Wishlist, ${wishlistCount} items`}
              className="icb !w-[40px] !h-[40px]"
            >
              <Heart className="w-[21px] h-[21px]" strokeWidth={1.6} />
              {wishlistCount > 0 && (
                <span className="absolute top-[4px] right-[2px] min-w-[18px] h-[18px] rounded-full bg-[#1F1219] text-white text-[11px] font-bold flex items-center justify-center px-1">
                  {isBn ? wishlistCount.toLocaleString('bn-BD') : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={isBn ? `ব্যাগ, ${totalItemsCount}টি পণ্য` : `Bag, ${totalItemsCount} items`}
              className="icb !w-[44px] !h-[44px] relative"
            >
              <ShoppingBag className="w-[21px] h-[21px]" strokeWidth={1.6} />
              {totalItemsCount > 0 && (
                <span className="absolute top-[4px] right-[2px] min-w-[18px] h-[18px] rounded-full bg-[#C8325F] text-white text-[11px] font-bold flex items-center justify-center px-1">
                  {isBn ? totalItemsCount.toLocaleString('bn-BD') : totalItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Live Search Suggestions Dropdown Popover matching Desktop-Search.dc.html lines 61-80 */}
          {showExpandedSearch && isDropdownOpen && (
            <div
              role="listbox"
              aria-label="Search suggestions"
              className="hidden md:grid absolute top-[76px] left-1/2 -translate-x-1/2 w-[760px] max-w-[92vw] bg-white rounded-[24px] shadow-[0_30px_70px_-20px_rgba(42,18,32,0.35)] border border-[#F1E4E8] p-[20px] grid-cols-[220px_1fr] gap-[24px] z-50"
            >
              {/* Left Column: Suggestions & Recent */}
              <div className="flex flex-col gap-[4px] text-[15px]">
                <span className="mut text-[12px] font-bold tracking-[0.12em] uppercase mb-[6px]">
                  Suggestions
                </span>
                {searchResults.suggestions.map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSearchQuery(s);
                      setIsDropdownOpen(false);
                      router.push(`/search?q=${encodeURIComponent(s)}`);
                    }}
                    className={`text-left px-[10px] py-[8px] rounded-[10px] transition-colors border-0 cursor-pointer text-[14px] ${
                      idx === 0 ? 'bg-[#FCEEF1] font-medium' : 'bg-transparent hover:bg-[#FCEEF1]/60'
                    }`}
                  >
                    {s}
                  </button>
                ))}

                <span className="mut text-[12px] font-bold tracking-[0.12em] uppercase mt-[12px] mb-[6px]">
                  Recent
                </span>
                {['facial steamer', 'silk pillowcase'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSearchQuery(r);
                      setIsDropdownOpen(false);
                      router.push(`/search?q=${encodeURIComponent(r)}`);
                    }}
                    className="text-left mut px-[10px] py-[6px] rounded-[10px] hover:bg-[#F8F1F3] border-0 bg-transparent cursor-pointer text-[14px]"
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Right Column: Quick Products & Journal */}
              <div className="flex flex-col gap-[10px]">
                <span className="mut text-[12px] font-bold tracking-[0.12em] uppercase">
                  Products
                </span>
                {searchResults.products.length === 0 ? (
                  <p className="mut text-[14px] m-0 py-3">
                    {isBn ? 'কোনো পণ্য পাওয়া যায়নি।' : 'No matching products yet.'}
                  </p>
                ) : searchResults.products.map((p) => (
                  <Link
                    key={p.id || p._id}
                    to={`/product/${p.id || p._id}`}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsSearchActive(false);
                    }}
                    className="flex gap-[14px] items-center p-[6px] rounded-[14px] hover:bg-[#FFF7F8] transition-colors no-underline"
                  >
                    <span
                      className="w-[52px] h-[60px] rounded-[12px] shrink-0 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: p.tint || '#FBE4EA' }}
                    >
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.imageAlt || p.name}
                          fill
                          sizes="52px"
                          className="object-cover"
                        />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8C6676" strokeWidth="1.2">
                          <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                          <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                        </svg>
                      )}
                    </span>
                    <span className="flex-1 flex flex-col gap-[2px] min-w-0">
                      <span className="font-semibold text-[15px] text-[#1F1219] truncate">
                        {isBn && p.nameBn ? p.nameBn : p.name}
                      </span>
                      <span className="mut text-[13px]">
                        {p.category} · {p.sizes?.[0]?.name || 'Standard'}
                      </span>
                    </span>
                    <strong className="text-[15px] text-[#1F1219] shrink-0">
                      {formatPrice(p.price)}
                    </strong>
                  </Link>
                ))}

                <Link
                  to="/#journal"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsSearchActive(false);
                  }}
                  className="flex gap-[12px] items-center p-[12px] rounded-[14px] bg-[#FFF7F8] hover:bg-[#FCEEF1] transition-colors text-[14px] text-[#1F1219] no-underline"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C8325F"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H4zM20 5h-6"></path>
                  </svg>
                  <span>
                    <strong>Journal:</strong> How to layer a {searchQuery.trim() || 'serum'} in your routine
                  </span>
                </Link>

                <Link
                  to={`/search?q=${encodeURIComponent(searchQuery.trim() || 'serum')}`}
                  onClick={() => setIsDropdownOpen(false)}
                  className="font-bold text-[14px] underline px-[6px] py-[4px] text-[#1F1219] hover:text-[#C8325F]"
                >
                  See all {searchResults.totalCount} results for &ldquo;{searchQuery.trim() || 'serum'}&rdquo;
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile expandable search bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 py-3 bg-[#FFF7F8] border-b border-brand-border flex items-center gap-2 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 h-11 px-4 rounded-full bg-white border border-brand-border">
            <Search className="w-4 h-4 text-brand-muted shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent border-0 outline-none text-[14px] text-brand-dark"
            />
          </form>
          <button onClick={() => setIsMobileSearchOpen(false)} className="icb w-10 h-10">
            <X className="w-5 h-5 text-brand-dark" />
          </button>
        </div>
      )}

      {/* Mobile Slide-Over Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};
