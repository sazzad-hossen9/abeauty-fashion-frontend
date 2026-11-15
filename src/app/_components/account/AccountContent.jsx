'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from '@/components/common/Link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Heart, MapPin, CreditCard, User, LogOut, X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/api/api';

export const AccountContent = () => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const {
    user,
    authReady,
    isAuthenticated,
    logout,
    openLoginModal,
    openRegisterModal,
    updateProfile,
  } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, wishlistLoading, wishlistError, removeFromWishlist } = useWishlist();
  const { isBn, formatPrice } = useLanguage();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const [savedAddress, setSavedAddress] = useState({
    street: '',
    apt: '',
    city: '',
    state: '',
    zip: '',
  });
  const [addressStatus, setAddressStatus] = useState({ notice: '', error: '' });

  useEffect(() => {
    setSavedAddress({
      street: user?.address?.street || '',
      apt: user?.address?.apt || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
    });
  }, [user]);

  const loadOrders = useCallback(async () => {
    if (!authReady || !isAuthenticated || !user?.id) {
      setOrders([]);
      setLoadingOrders(false);
      setOrdersError(null);
      return;
    }

    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const data = await api.getOrders(user.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrdersError(err.message || 'Failed to load orders.');
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [authReady, isAuthenticated, user?.id]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleTabChange = (tabId) => {
    router.push(`/account?tab=${String(tabId).trim()}`, { scroll: false });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setAddressStatus({ notice: '', error: '' });
    const res = await updateProfile({ address: savedAddress });
    if (res.success) {
      setAddressStatus({ notice: 'Saved successfully!', error: '' });
      setTimeout(() => setAddressStatus({ notice: '', error: '' }), 2500);
    } else {
      setAddressStatus({ notice: '', error: res.error || 'Could not save address.' });
    }
  };

  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-[19px] h-[19px]" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-[19px] h-[19px]" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-[19px] h-[19px]" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="w-[19px] h-[19px]" /> },
    { id: 'payment', label: 'Payment methods', icon: <CreditCard className="w-[19px] h-[19px]" /> },
    { id: 'profile', label: 'Account details', icon: <User className="w-[19px] h-[19px]" /> },
  ];

  if (!authReady) {
    return (
      <div className="flex-1 bg-white py-20 text-center text-brand-muted">
        Loading account...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex-1 bg-white">
        <section className="bg-brand-roseLight w-full py-12 sm:py-16 border-b border-brand-border">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] flex flex-col gap-2">
            <span className="text-[14px] sm:text-[15px] text-brand-muted font-medium">
              {isBn ? 'আমার অ্যাকাউন্ট' : 'My account'}
            </span>
            <h1 className="d text-[40px] sm:text-[54px] leading-none text-brand-dark m-0">
              Please <span className="s text-brand-rose font-normal">log in</span>
            </h1>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-16">
          <div className="ab-card max-w-lg mx-auto text-center flex flex-col items-center gap-4 p-8 sm:p-10">
            <div className="w-16 h-16 rounded-full bg-brand-roseLight flex items-center justify-center text-brand-rose">
              <User className="w-7 h-7" />
            </div>
            <h2 className="d text-[26px] text-brand-dark m-0">
              {isBn ? 'অ্যাকাউন্ট দেখতে সাইন ইন করুন' : 'Sign in to view your account'}
            </h2>
            <p className="text-brand-muted text-[15px] m-0">
              {isBn
                ? 'আপনার অর্ডার ইতিহাস, ঠিকানা ও সেভ করা উইশলিস্ট দেখতে অনুগ্রহ করে লগ ইন করুন।'
                : 'Log in or create an account to view your orders, saved addresses, and synced wishlist.'}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              <Button variant="primary" onClick={openLoginModal}>
                {isBn ? 'সাইন ইন' : 'Sign in'}
              </Button>
              <Button variant="ghost" onClick={openRegisterModal}>
                {isBn ? 'নতুন অ্যাকাউন্ট' : 'Create account'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const firstName = user.firstName || user.email?.split('@')[0] || 'there';
  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="flex-1 bg-white">
      {/* Welcome Banner */}
      <section className="bg-brand-roseLight w-full py-10 sm:py-12 border-b border-brand-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[14px] sm:text-[15px] text-brand-muted font-medium">
              {isBn ? 'আমার অ্যাকাউন্ট' : 'My account'}
            </span>
            <h1 className="d text-[42px] sm:text-[54px] lg:text-[60px] leading-none text-brand-dark m-0">
              Hi, <span className="s text-brand-rose font-normal">{firstName}</span>
            </h1>
          </div>

          <Button variant="primary" to="/shop">
            {isBn ? 'কেনাকাটা চালিয়ে যান' : 'Continue shopping'}
          </Button>
        </div>
      </section>

      {/* Main Account Area: Sidebar + Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-10 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* Sidebar Menu */}
          <nav aria-label="Account navigation" className="w-full lg:w-[260px] shrink-0 flex flex-col gap-1">
            {navMenuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-3 h-12 px-4 rounded-[14px] font-medium text-[15px] transition-colors text-left ${
                    isActive
                      ? 'bg-brand-dark text-white'
                      : 'text-brand-dark hover:bg-brand-roseLight'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="flex items-center gap-3 h-12 px-4 rounded-[14px] font-medium text-[15px] text-brand-muted hover:text-brand-rose hover:bg-brand-roseLight transition-colors text-left mt-3 pt-3 border-t border-brand-border"
            >
              <LogOut className="w-[19px] h-[19px]" />
              <span>Log out</span>
            </button>
          </nav>

          {/* Right Tab Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-8 w-full">
            {/* ================= TAB: DASHBOARD ================= */}
            {currentTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="ab-card flex flex-col gap-1.5 shadow-xs">
                    <span className="text-brand-muted text-[14px]">Orders</span>
                    <span className="d text-[38px] sm:text-[40px] text-brand-dark leading-none">
                      {orders.length}
                    </span>
                    <button
                      onClick={() => handleTabChange('orders')}
                      className="text-[14px] font-semibold text-brand-dark underline hover:text-brand-rose self-start mt-2"
                    >
                      View all orders
                    </button>
                  </div>

                  <div className="ab-card flex flex-col gap-1.5 bg-brand-roseLight border-brand-roseLight shadow-xs">
                    <span className="text-brand-muted text-[14px]">Latest order</span>
                    <span className="d text-[24px] sm:text-[26px] text-brand-rose leading-tight">
                      {latestOrder?.status || 'No recent orders'}
                    </span>
                    {latestOrder ? (
                      <button
                        onClick={() => setSelectedOrderDetails(latestOrder)}
                        className="text-[14px] font-semibold text-brand-dark underline hover:text-brand-rose self-start mt-2"
                      >
                        Track order
                      </button>
                    ) : (
                      <Link
                        to="/shop"
                        className="text-[14px] font-semibold text-brand-dark underline hover:text-brand-rose self-start mt-2"
                      >
                        Shop now
                      </Link>
                    )}
                  </div>

                  <div className="ab-card flex flex-col gap-1.5 shadow-xs">
                    <span className="text-brand-muted text-[14px]">Wishlist</span>
                    <span className="d text-[38px] sm:text-[40px] text-brand-dark leading-none">
                      {wishlist.length}
                    </span>
                    <button
                      onClick={() => handleTabChange('wishlist')}
                      className="text-[14px] font-semibold text-brand-dark underline hover:text-brand-rose self-start mt-2"
                    >
                      See saved items
                    </button>
                  </div>
                </div>

                {/* Recent orders table */}
                <div className="ab-card !p-0 overflow-hidden shadow-xs">
                  <div className="flex justify-between items-center p-6 pb-4">
                    <h2 className="d text-[22px] sm:text-[24px] text-brand-dark m-0">
                      Recent orders
                    </h2>
                    <button
                      onClick={() => handleTabChange('orders')}
                      className="text-[14px] font-semibold text-brand-dark underline hover:text-brand-rose"
                    >
                      View all
                    </button>
                  </div>

                  {loadingOrders ? (
                    <div className="p-6 text-brand-muted text-[15px]">Loading orders...</div>
                  ) : ordersError ? (
                    <div className="p-6 flex flex-col items-start gap-2">
                      <p className="text-[#A3244B] text-[14px] m-0">{ordersError}</p>
                      <button onClick={loadOrders} className="btn ghost !h-9 !px-4 !text-[13px]">
                        Try again
                      </button>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-8 border-t border-brand-border text-center flex flex-col items-center gap-3">
                      <p className="text-brand-muted text-[15px] m-0">
                        You haven&apos;t placed any orders yet
                      </p>
                      <Button variant="primary" to="/shop" className="!h-10 !px-5 !text-[14px]">
                        Shop now
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-t border-brand-border text-[12px] font-bold tracking-wider uppercase text-brand-muted">
                            <th className="py-3 px-6">Order</th>
                            <th className="py-3 px-6">Date</th>
                            <th className="py-3 px-6">Status</th>
                            <th className="py-3 px-6">Total</th>
                            <th className="py-3 px-6 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border text-[15px]">
                          {orders.slice(0, 3).map((ord) => (
                            <tr key={ord._id || ord.orderNumber} className="hover:bg-brand-pinkSubtle/60 transition-colors">
                              <td className="py-4 px-6 font-bold text-brand-dark">
                                {ord.orderNumber || `#${String(ord._id || '').slice(-4)}`}
                              </td>
                              <td className="py-4 px-6 text-brand-muted">{ord.date}</td>
                              <td className="py-4 px-6">
                                <span
                                  className="status-badge"
                                  style={{
                                    backgroundColor: ord.statusColor?.bg || '#FCEEF1',
                                    color: ord.statusColor?.fg || '#A3244B',
                                  }}
                                >
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 font-bold text-brand-dark">
                                {formatPrice(ord.total)}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  className="btn ghost !h-[38px] !px-4 !text-[13px]"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Saved for later items grid */}
                <div className="ab-card shadow-xs">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="d text-[22px] sm:text-[24px] text-brand-dark m-0">
                      Saved for later
                    </h2>
                    <button
                      onClick={() => handleTabChange('wishlist')}
                      className="text-[14px] font-semibold text-brand-dark underline hover:text-brand-rose"
                    >
                      Open wishlist
                    </button>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="py-8 text-center flex flex-col items-center gap-3">
                      <p className="text-brand-muted text-[15px] m-0">Your wishlist is empty</p>
                      <Button variant="ghost" to="/shop" className="!h-10 !px-5 !text-[14px]">
                        Shop now
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                      {wishlist.slice(0, 4).map((p) => (
                        <div key={p.id || p._id || p.name} className="flex flex-col gap-2.5">
                          <div
                            className="aspect-square rounded-[18px] flex items-center justify-center relative overflow-hidden"
                            style={{ backgroundColor: p.tint || '#F1E8DF' }}
                          >
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.imageAlt || p.name}
                                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                                className="object-cover"
                              />
                            ) : (
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8C6676" strokeWidth="1">
                                <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                                <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                              </svg>
                            )}
                          </div>
                          <Link
                            to={`/product/${p.id || p._id}`}
                            className="font-semibold text-[14px] text-brand-dark line-clamp-1 no-underline hover:text-brand-rose"
                          >
                            {p.name}
                          </Link>
                          <div className="flex justify-between items-center mt-auto">
                            <strong className="text-[15px]">{formatPrice(p.price)}</strong>
                            <button
                              onClick={() => addToCart(p, 'Standard', 1, true)}
                              className="btn !h-[34px] !px-3.5 !text-[13px] bg-brand-dark text-white hover:bg-brand-rose"
                            >
                              Add to bag
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ================= TAB: ORDERS ================= */}
            {currentTab === 'orders' && (
              <div className="ab-card shadow-xs">
                <h2 className="d text-[24px] sm:text-[28px] text-brand-dark mb-6">
                  Order History ({orders.length})
                </h2>

                {loadingOrders ? (
                  <p className="text-brand-muted text-[15px]">Loading orders...</p>
                ) : ordersError ? (
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-[#A3244B] text-[15px] m-0">{ordersError}</p>
                    <Button variant="ghost" size="sm" onClick={loadOrders}>
                      Try again
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-10 text-center flex flex-col items-center gap-3">
                    <p className="text-brand-muted text-[16px] m-0">
                      You haven&apos;t placed any orders yet
                    </p>
                    <Button variant="primary" to="/shop">
                      Shop now
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-brand-border">
                    {orders.map((ord) => (
                      <div key={ord._id || ord.orderNumber} className="py-5 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3">
                            <strong className="text-[17px] text-brand-dark">{ord.orderNumber}</strong>
                            <span
                              className="status-badge"
                              style={{
                                backgroundColor: ord.statusColor?.bg || '#FCEEF1',
                                color: ord.statusColor?.fg || '#A3244B',
                              }}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <span className="text-[14px] text-brand-muted">Placed on {ord.date}</span>
                          <span className="text-[13px] text-brand-muted">{ord.deliveryMethod}</span>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          <span className="font-bold text-[18px] text-brand-dark">{formatPrice(ord.total)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrderDetails(ord)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB: WISHLIST ================= */}
            {currentTab === 'wishlist' && (
              <div className="ab-card shadow-xs">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="d text-[24px] sm:text-[28px] text-brand-dark m-0">
                    My Wishlist ({wishlist.length})
                  </h2>
                </div>

                {wishlistError && (
                  <div className="mb-4 p-3 rounded-xl bg-brand-roseLight text-[13px] text-[#A3244B]">
                    {wishlistError}
                  </div>
                )}

                {wishlistLoading ? (
                  <div className="py-12 text-center text-brand-muted">Loading wishlist...</div>
                ) : wishlist.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center gap-3">
                    <p className="text-brand-muted text-[16px] m-0">Your wishlist is empty</p>
                    <Button variant="primary" to="/shop">
                      Shop now
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {wishlist.map((item) => (
                      <div key={item._id || item.id || item.name} className="flex flex-col gap-3 p-4 rounded-2xl border border-brand-border bg-white">
                        <div
                          className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden"
                          style={{ backgroundColor: item.tint || '#FBE4EA' }}
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.imageAlt || item.name}
                              fill
                              sizes="(max-width: 640px) 50vw, 25vw"
                              className="object-cover"
                            />
                          ) : (
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8C6676" strokeWidth="1">
                              <rect x="10" y="2" width="4" height="3" rx=".5"></rect>
                              <path d="M9 5h6v1.5c1.2.6 2 1.8 2 3.2V20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9.7c0-1.4.8-2.6 2-3.2z"></path>
                            </svg>
                          )}
                          <button
                            onClick={() => removeFromWishlist(item._id || item.id || item.name)}
                            className="icb absolute top-2 right-2 w-8 h-8 bg-white/90 z-10 shadow-xs"
                            aria-label="Remove"
                          >
                            <X className="w-4 h-4 text-brand-dark" />
                          </button>
                        </div>
                        <strong className="text-[15px] truncate">{item.name}</strong>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-bold text-[16px]">{formatPrice(item.price)}</span>
                          <button
                            onClick={() => addToCart(item, 'Standard', 1, true)}
                            className="btn sm rose !h-8 !px-3 !text-[12px]"
                          >
                            Add to bag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB: ADDRESSES ================= */}
            {currentTab === 'addresses' && (
              <div className="ab-card shadow-xs max-w-xl">
                <h2 className="d text-[24px] sm:text-[28px] text-brand-dark mb-4">
                  Saved Address
                </h2>
                {addressStatus.error && (
                  <div className="mb-3 p-3 rounded-xl bg-brand-roseLight text-[13px] text-[#A3244B]">
                    {addressStatus.error}
                  </div>
                )}
                <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Street address</label>
                    <input
                      type="text"
                      value={savedAddress.street}
                      onChange={(e) => setSavedAddress({ ...savedAddress, street: e.target.value })}
                      placeholder="House / street address"
                      className="w-full h-11 border border-brand-borderDark rounded-xl px-4 text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1">Apartment, suite</label>
                    <input
                      type="text"
                      value={savedAddress.apt}
                      onChange={(e) => setSavedAddress({ ...savedAddress, apt: e.target.value })}
                      placeholder="Apartment, floor, suite"
                      className="w-full h-11 border border-brand-borderDark rounded-xl px-4 text-[14px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-semibold mb-1">City</label>
                      <input
                        type="text"
                        value={savedAddress.city}
                        onChange={(e) => setSavedAddress({ ...savedAddress, city: e.target.value })}
                        placeholder="City"
                        className="w-full h-11 border border-brand-borderDark rounded-xl px-4 text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold mb-1">ZIP code</label>
                      <input
                        type="text"
                        value={savedAddress.zip}
                        onChange={(e) => setSavedAddress({ ...savedAddress, zip: e.target.value })}
                        placeholder="Postal code"
                        className="w-full h-11 border border-brand-borderDark rounded-xl px-4 text-[14px]"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="rose" className="self-start mt-2">
                    {addressStatus.notice || 'Update address'}
                  </Button>
                </form>
              </div>
            )}

            {/* ================= TAB: PAYMENT METHODS ================= */}
            {currentTab === 'payment' && (
              <div className="ab-card shadow-xs max-w-xl flex flex-col gap-5">
                <h2 className="d text-[24px] sm:text-[28px] text-brand-dark mb-1">
                  Payment Methods
                </h2>
                {user.savedPayment ? (
                  <div className="p-4 rounded-2xl border border-brand-border bg-brand-pinkSubtle flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-brand-rose" />
                      <div>
                        <strong className="block text-[15px]">{user.savedPayment}</strong>
                        <span className="text-[13px] text-brand-muted">Default saved method</span>
                      </div>
                    </div>
                    <span className="text-brand-green font-semibold text-[13px]">Active</span>
                  </div>
                ) : (
                  <p className="text-brand-muted text-[15px] m-0">
                    No saved payment methods yet. You can choose card, bKash, PayPal, or Cash on Delivery at checkout.
                  </p>
                )}
              </div>
            )}

            {/* ================= TAB: PROFILE DETAILS ================= */}
            {currentTab === 'profile' && (
              <div className="ab-card shadow-xs max-w-xl">
                <h2 className="d text-[24px] sm:text-[28px] text-brand-dark mb-4">
                  Account Details
                </h2>
                <div className="flex flex-col gap-4 text-[14px]">
                  <div>
                    <span className="text-brand-muted block text-[13px]">Full Name</span>
                    <strong className="text-[16px]">
                      {[user.firstName, user.lastName].filter(Boolean).join(' ') || '—'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[13px]">Email Address</span>
                    <strong className="text-[16px]">{user.email}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[13px]">Phone</span>
                    <strong className="text-[16px]">{user.phone || 'Not provided'}</strong>
                  </div>
                  <div>
                    <span className="text-brand-muted block text-[13px]">Member Since</span>
                    <strong className="text-[16px]">{user.memberSince || '—'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setSelectedOrderDetails(null)} />
          <div className="relative bg-white text-brand-dark w-full max-w-lg rounded-[28px] p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedOrderDetails(null)} className="icb absolute right-4 top-4" aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <span className="text-[12px] font-bold tracking-wider uppercase text-brand-rose">Order Details</span>
            <h3 className="d text-[26px] mt-1 mb-2">{selectedOrderDetails.orderNumber}</h3>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="status-badge"
                style={{
                  backgroundColor: selectedOrderDetails.statusColor?.bg || '#FCEEF1',
                  color: selectedOrderDetails.statusColor?.fg || '#A3244B',
                }}
              >
                {selectedOrderDetails.status}
              </span>
              <span className="text-[13px] text-brand-muted">Placed on {selectedOrderDetails.date}</span>
            </div>

            <div className="flex flex-col gap-3 py-3 border-t border-b border-brand-border text-[14px]">
              <div className="flex justify-between">
                <span className="text-brand-muted">Shipping Address:</span>
                <span className="font-medium text-right max-w-xs">{selectedOrderDetails.shippingAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Delivery Method:</span>
                <span className="font-medium">{selectedOrderDetails.deliveryMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Payment:</span>
                <span className="font-medium">{selectedOrderDetails.paymentMethod}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-4">
              <span className="font-bold text-[16px]">Total Paid:</span>
              <span className="d text-[24px] font-bold text-brand-dark">{formatPrice(selectedOrderDetails.total)}</span>
            </div>

            <Button variant="primary" onClick={() => setSelectedOrderDetails(null)} className="mt-5 w-full">
              Close Order Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountContent;
