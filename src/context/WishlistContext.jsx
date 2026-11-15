'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { safeStorage } from '@/utils/storage';
import { api } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import { getPrimaryProductImage, sanitizeMediaUrl, isValidHttpUrl } from '@/utils/media';

const WishlistContext = createContext();

const getItemKey = (item) => String(item?.id || item?.productId || item?._id || item?.name || '');

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated, authReady } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  const loadWishlist = useCallback(async () => {
    if (!authReady) return;
    setWishlistError(null);

    if (!isAuthenticated || !user?.id) {
      const saved = safeStorage.getJSON('abf_wishlist', []);
      const items = Array.isArray(saved) ? saved : [];
      setWishlist(items);
      if (items.some((it) => !it.image)) {
        api.getProducts({ limit: 48 }).then((res) => {
          if (res?.items?.length) {
            setWishlist((curr) =>
              curr.map((it) => {
                if (it.image) return it;
                const match = res.items.find(
                  (p) =>
                    p.name?.trim().toLowerCase() === it.name?.trim().toLowerCase() ||
                    p.slug === it.slug ||
                    p.id === it.id ||
                    p.id === it.productId
                );
                return match?.image
                  ? { ...it, image: match.image, imageAlt: match.imageAlt || it.name, slug: it.slug || match.slug || match.id }
                  : it;
              })
            );
          }
        }).catch(() => {});
      }
      return;
    }

    setWishlistLoading(true);
    try {
      const remoteWishlist = await api.getWishlist(user.id);
      setWishlist(Array.isArray(remoteWishlist) ? remoteWishlist : []);
    } catch (err) {
      setWishlistError(err.message || 'Failed to load wishlist.');
      setWishlist([]);
    } finally {
      setWishlistLoading(false);
    }
  }, [authReady, isAuthenticated, user?.id]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Persist to localStorage only for guest sessions
  useEffect(() => {
    if (!authReady || isAuthenticated) return;
    safeStorage.setJSON('abf_wishlist', wishlist);
  }, [wishlist, authReady, isAuthenticated]);

  const isInWishlist = (productOrId) => {
    const id = typeof productOrId === 'string' ? productOrId : getItemKey(productOrId);
    if (!id) return false;
    return wishlist.some(
      (item) =>
        String(item.id || '') === id ||
        String(item.productId || '') === id ||
        String(item._id || '') === id ||
        String(item.name || '') === id
    );
  };

  const toggleWishlist = async (product) => {
    if (!product) return { success: false, error: 'Invalid product' };
    setWishlistError(null);

    const primaryImg = getPrimaryProductImage(product);
    const resolvedImage = product.image || (isValidHttpUrl(primaryImg?.url) ? sanitizeMediaUrl(primaryImg.url) : null);
    const resolvedAlt = product.imageAlt || primaryImg?.alt || product.name || 'Product';
    const enrichedProduct = {
      ...product,
      image: resolvedImage,
      imageAlt: resolvedAlt,
      slug: product.slug || product.id || product._id,
    };

    const targetKey = getItemKey(enrichedProduct);
    const isCurrentlyIn = isInWishlist(enrichedProduct);

    if (!isAuthenticated || !user?.id) {
      if (isCurrentlyIn) {
        setWishlist((prev) => prev.filter((item) => getItemKey(item) !== targetKey));
      } else {
        setWishlist((prev) => [enrichedProduct, ...prev]);
      }
      return { success: true, saved: !isCurrentlyIn };
    }

    if (isCurrentlyIn) {
      const existing = wishlist.find((item) => getItemKey(item) === targetKey);
      const deleteId = existing?._id || existing?.id || product._id || product.id;
      const res = await api.removeFromWishlist(deleteId, user.id);
      if (!res?.success) {
        setWishlistError(res?.error || 'Could not remove item from wishlist.');
        return { success: false, error: res?.error };
      }
      setWishlist((prev) => prev.filter((item) => getItemKey(item) !== targetKey));
      return { success: true, saved: false };
    }

    const res = await api.addToWishlist(enrichedProduct, user.id);
    if (!res?.success) {
      setWishlistError(res?.error || 'Could not save item to wishlist.');
      return { success: false, error: res?.error };
    }
    const savedItem = res.item || enrichedProduct;
    setWishlist((prev) => [savedItem, ...prev]);
    return { success: true, saved: true };
  };

  const removeFromWishlist = async (id) => {
    setWishlistError(null);
    const target = String(id || '');

    if (!isAuthenticated || !user?.id) {
      setWishlist((prev) =>
        prev.filter(
          (item) =>
            String(item.id || '') !== target &&
            String(item.productId || '') !== target &&
            String(item._id || '') !== target &&
            String(item.name || '') !== target
        )
      );
      return { success: true };
    }

    const res = await api.removeFromWishlist(target, user.id);
    if (!res?.success) {
      setWishlistError(res?.error || 'Could not remove item from wishlist.');
      return { success: false, error: res?.error };
    }
    setWishlist((prev) =>
      prev.filter(
        (item) =>
          String(item.id || '') !== target &&
          String(item.productId || '') !== target &&
          String(item._id || '') !== target &&
          String(item.name || '') !== target
      )
    );
    return { success: true };
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        wishlistLoading,
        wishlistError,
        refreshWishlist: loadWishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
