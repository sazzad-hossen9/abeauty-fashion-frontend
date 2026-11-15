'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { safeStorage } from '@/utils/storage';
import { api } from '@/api/api';
import { getPrimaryProductImage, sanitizeMediaUrl, isValidHttpUrl } from '@/utils/media';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    const saved = safeStorage.getJSON('abf_cart', []);
    if (Array.isArray(saved)) {
      setCartItems(saved);
      // Auto backfill product images if any saved items in localStorage are missing an image
      const missingImg = saved.some((item) => !item.image);
      if (missingImg) {
        api.getProducts({ limit: 48 }).then((res) => {
          if (res?.items?.length) {
            setCartItems((curr) =>
              curr.map((item) => {
                if (item.image) return item;
                const match = res.items.find(
                  (p) =>
                    p.name?.trim().toLowerCase() === item.name?.trim().toLowerCase() ||
                    p.slug === item.slug ||
                    p.id === item.id ||
                    p.id === item.productId
                );
                if (match?.image) {
                  return {
                    ...item,
                    image: match.image,
                    imageAlt: match.imageAlt || item.name,
                    slug: item.slug || match.slug || match.id,
                  };
                }
                return item;
              })
            );
          }
        }).catch(() => {});
      }
    }
    hasHydratedRef.current = true;
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [isAddedModalOpen, setIsAddedModalOpen] = useState(false);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    safeStorage.setJSON('abf_cart', cartItems);
  }, [cartItems]);

  const FREE_SHIPPING_THRESHOLD = 50.00;

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
  const freeShippingAway = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  let shippingCost = 0;
  if (subtotal > 0) {
    shippingCost = appliedCoupon?.freeShip || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99;
  }

  const discountAmount = appliedCoupon ? subtotal * (Number(appliedCoupon.rate) || 0) : 0;
  const giftWrapCost = giftWrap ? 4.00 : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingCost + giftWrapCost);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);

  const addToCart = (product, variant = 'Standard', qty = 1, showSlideOver = true) => {
    if (!product) return;
    const primaryImg = getPrimaryProductImage(product);
    const resolvedImage = product.image || (isValidHttpUrl(primaryImg?.url) ? sanitizeMediaUrl(primaryImg.url) : null);
    const resolvedAlt = product.imageAlt || primaryImg?.alt || product.name || 'Product';
    const resolvedSlug = product.slug || product.id || product._id;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          (item.id === (product.id || product._id) || item.name === product.name) &&
          item.variant === variant
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + qty,
          image: next[existingIndex].image || resolvedImage,
          imageAlt: next[existingIndex].imageAlt || resolvedAlt,
        };
        return next;
      }
      const newItem = {
        id: product.id || product._id,
        productId: product._id || product.id,
        slug: resolvedSlug,
        name: product.name,
        cat: product.category,
        variant,
        price: Number(product.price) || 0,
        qty,
        image: resolvedImage,
        imageAlt: resolvedAlt,
        tint: product.tint || '#FBE4EA',
      };
      return [...prev, newItem];
    });

    setLastAddedItem({ ...product, variant, qty, image: resolvedImage });
    if (showSlideOver) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index, delta) => {
    setCartItems((prev) => {
      const next = [...prev];
      const newQty = (next[index]?.qty || 1) + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      next[index] = { ...next[index], qty: newQty };
      return next;
    });
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    const clean = String(code || '').trim().toUpperCase();
    if (!clean) {
      setCouponError('Please enter a coupon code.');
      return false;
    }
    const res = await api.validateCoupon(clean);
    if (res.success && res.coupon) {
      setAppliedCoupon(res.coupon);
      return true;
    }
    setCouponError(res.error || 'Invalid coupon code.');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        subtotal,
        shippingCost,
        freeShippingAway,
        freeShippingProgress,
        FREE_SHIPPING_THRESHOLD,
        discountAmount,
        giftWrap,
        setGiftWrap,
        giftWrapCost,
        total,
        isCartOpen,
        setIsCartOpen,
        couponCode,
        setCouponCode,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        lastAddedItem,
        isAddedModalOpen,
        setIsAddedModalOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
