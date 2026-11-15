import { getPrimaryProductImage, sanitizeMediaUrl, isValidHttpUrl } from '@/utils/media';

const API_BASE_URL = (
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  ''
).replace(/\/+$/, '');

const REQUEST_TIMEOUT_MS = 10000;

async function requestJson(path, { method = 'GET', body, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL environment variable is not configured.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      const errText = await response.text().catch(() => '');
      if (errText) {
        try {
          const parsed = JSON.parse(errText);
          if (parsed?.error || parsed?.message) {
            message = parsed.error || parsed.message;
          }
        } catch {
          message = errText;
        }
      }
      const err = new Error(message);
      err.status = response.status;
      throw err;
    }

    return await response.json();
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

const CATEGORY_LABELS = {
  skincare: 'Skincare',
  makeup: 'Makeup',
  'hair-care': 'Hair Care',
  'hair care': 'Hair Care',
  'personal-care': 'Personal Care',
  'personal care': 'Personal Care',
  fragrance: 'Fragrance',
  'beauty-tools': 'Beauty Tools',
  'beauty tools': 'Beauty Tools',
};

function normalizeCategory(val) {
  if (!val) return '';
  const key = String(val).trim().toLowerCase();
  return CATEGORY_LABELS[key] || val;
}

function normalizeProduct(p) {
  if (!p || typeof p !== 'object') return p;
  const variants = Array.isArray(p.variants) ? p.variants : [];
  const sizes = Array.isArray(p.sizes) && p.sizes.length > 0
    ? p.sizes
    : variants.map((v, idx) => ({
        name: v.label || v.name || 'Standard',
        price: Number(v.price) || 0,
        compareAtPrice: v.compareAtPrice ?? null,
        sku: v.sku,
        stock: v.stock,
        selected: idx === 0,
      }));
  const firstPrice = p.price ?? variants[0]?.price ?? sizes[0]?.price ?? 0;
  const firstWasPrice = p.wasPrice ?? variants[0]?.compareAtPrice ?? null;
  const rawBadge = p.badge ? String(p.badge) : '';
  const badge = rawBadge ? rawBadge.charAt(0).toUpperCase() + rawBadge.slice(1) : '';

  const primaryImg = getPrimaryProductImage(p);
  const directImage = primaryImg?.url || (isValidHttpUrl(p.image) ? sanitizeMediaUrl(p.image) : null);
  const imageAlt = primaryImg?.alt || p.imageAlt || p.name || 'Product image';

  return {
    ...p,
    id: p.id || p.slug || p._id,
    image: directImage,
    imageAlt,
    category: normalizeCategory(p.category),
    subCategory: normalizeCategory(p.subCategory || p.subcategory),
    badge,
    sizes,
    price: Number(firstPrice) || 0,
    wasPrice: firstWasPrice != null ? Number(firstWasPrice) : null,
    rating: Number(p.rating ?? p.ratingAvg ?? 0),
    reviewCount: Number(p.reviewCount ?? p.ratingCount ?? 0),
    inStock: p.inStock ?? (variants.length > 0 ? variants.some((v) => (v.stock ?? 0) > 0) : true),
    isBestseller: Boolean(p.isBestseller ?? rawBadge.toLowerCase() === 'bestseller'),
    isNew: Boolean(p.isNew ?? rawBadge.toLowerCase() === 'new'),
    shippingInfo: p.shippingInfo || p.shippingReturns || '',
  };
}

/**
 * Clean backend API service with timeout handling and zero mock/fallback records.
 */
export const api = {
  // ==================== PRODUCTS ====================
  getProducts: async (params = {}) => {
    const queryObj =
      typeof params === 'string'
        ? { category: params }
        : params && typeof params === 'object'
        ? params
        : {};

    const pairs = [];
    for (const [key, value] of Object.entries(queryObj)) {
      if (value === undefined || value === null) continue;
      const str = String(value).trim();
      if (!str) continue;
      if (key === 'category' && ['all', 'shop all', 'shop-all'].includes(str.toLowerCase())) {
        continue;
      }
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(str)}`);
    }

    const qs = pairs.length > 0 ? `?${pairs.join('&')}` : '';
    const data = await requestJson(`/products${qs}`);
    const rawItems = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
      ? data.items
      : [];
    const items = rawItems.map(normalizeProduct);
    return {
      items,
      total: typeof data?.total === 'number' ? data.total : items.length,
      page: typeof data?.page === 'number' ? data.page : 1,
      limit: typeof data?.limit === 'number' ? data.limit : 12,
      totalPages: typeof data?.totalPages === 'number' ? data.totalPages : items.length > 0 ? 1 : 0,
    };
  },

  getProductBySlug: async (slug) => {
    if (!slug) throw new Error('Product slug is required');
    try {
      const data = await requestJson(`/products/${encodeURIComponent(slug)}`);
      return data ? normalizeProduct(data) : null;
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  getProductById: async (id) => {
    return api.getProductBySlug(id);
  },

  getRelatedProducts: async (slug) => {
    if (!slug) return [];
    try {
      const data = await requestJson(`/products/${encodeURIComponent(slug)}/related`);
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      return list.map(normalizeProduct);
    } catch (err) {
      if (err.status === 404) return [];
      throw err;
    }
  },

  // ==================== ARTICLES ====================
  getArticles: async () => {
    const data = await requestJson('/articles');
    return Array.isArray(data) ? data : [];
  },

  // ==================== REVIEWS ====================
  getReviews: async (productId) => {
    const qs = productId ? `?productId=${encodeURIComponent(productId)}` : '';
    const data = await requestJson(`/reviews${qs}`);
    return Array.isArray(data) ? data : [];
  },

  createReview: async (reviewData) => {
    try {
      const data = await requestJson('/reviews', { method: 'POST', body: reviewData });
      return { success: true, review: data.review, ...data };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to submit review' };
    }
  },

  // ==================== ORDERS ====================
  getOrders: async (userId) => {
    if (!userId) {
      throw new Error('Please log in to view your orders.');
    }
    const data = await requestJson(`/orders?userId=${encodeURIComponent(userId)}`);
    return Array.isArray(data) ? data : [];
  },

  createOrder: async (orderData) => {
    try {
      const data = await requestJson('/orders', { method: 'POST', body: orderData });
      if (!data?.success || !data?.order) {
        return { success: false, error: data?.error || 'Failed to place order' };
      }
      return { success: true, order: data.order, ...data };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to place order' };
    }
  },

  // ==================== WISHLIST ====================
  getWishlist: async (userId) => {
    if (!userId) {
      throw new Error('Please log in to view your saved wishlist.');
    }
    const data = await requestJson(`/wishlist?userId=${encodeURIComponent(userId)}`);
    const raw = Array.isArray(data) ? data : [];
    return raw.map(normalizeProduct);
  },

  addToWishlist: async (product, userId) => {
    if (!userId) {
      return { success: false, error: 'Please log in to sync your wishlist.' };
    }
    try {
      const data = await requestJson('/wishlist', {
        method: 'POST',
        body: { userId, ...product },
      });
      return { success: true, ...data };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to save item to wishlist' };
    }
  },

  removeFromWishlist: async (id, userId) => {
    if (!userId) {
      return { success: false, error: 'Please log in to update your wishlist.' };
    }
    if (!id) {
      return { success: false, error: 'Wishlist item ID is required' };
    }
    try {
      const qs = `?userId=${encodeURIComponent(userId)}`;
      const data = await requestJson(`/wishlist/${encodeURIComponent(id)}${qs}`, {
        method: 'DELETE',
      });
      return { success: true, ...data };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to remove item from wishlist' };
    }
  },

  // ==================== USERS / AUTH ====================
  loginUser: async (credentials) => {
    try {
      const data = await requestJson('/users/login', { method: 'POST', body: credentials });
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'Sign in failed' };
    }
  },

  registerUser: async (payload) => {
    try {
      const data = await requestJson('/users/register', { method: 'POST', body: payload });
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  },

  updateUserProfile: async (userId, updates) => {
    if (!userId) {
      return { success: false, error: 'Please log in to update your profile.' };
    }
    try {
      const data = await requestJson(`/users/${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        body: updates,
      });
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  },

  // ==================== COUPONS & CONTACT ====================
  validateCoupon: async (code) => {
    try {
      const data = await requestJson('/coupons/validate', {
        method: 'POST',
        body: { code },
      });
      return { success: true, coupon: data.coupon };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid coupon code' };
    }
  },

  submitContact: async (formData) => {
    try {
      const data = await requestJson('/contact', { method: 'POST', body: formData });
      return { success: true, ref: data.ref };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to send message' };
    }
  },
};
