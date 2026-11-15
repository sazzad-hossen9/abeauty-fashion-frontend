const DEFAULT_TINTS = ['#FBE4EA', '#FCE6D9', '#FAF0D4', '#E2EEE5', '#ECE4F6', '#E2ECF6'];

/**
 * Validates that a candidate media URL is a genuine http(s) URL
 * and not a placeholder like "***", "", or null.
 */
export function isValidHttpUrl(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed === '***') return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Sanitizes and normalizes an image URL (upgrades http to https where applicable).
 */
export function sanitizeMediaUrl(value) {
  if (!isValidHttpUrl(value)) return null;
  let clean = String(value).trim();
  if (clean.startsWith('http://')) {
    clean = 'https://' + clean.slice(7);
  }
  return clean;
}

/**
 * Returns the first valid product image ({ url, alt }) from product.image or media[],
 * or null when no valid URL exists yet.
 */
export function getPrimaryProductImage(product) {
  if (!product || typeof product !== 'object') return null;

  // 1. Check top-level image field first
  if (isValidHttpUrl(product.image)) {
    return {
      url: sanitizeMediaUrl(product.image),
      alt: product.imageAlt || product.name || 'Product image',
    };
  }

  // 2. Scan media array
  if (Array.isArray(product.media) && product.media.length > 0) {
    // Prefer direct image URLs (e.g. from i.ibb.co or ending in image extensions)
    const directImg = product.media.find(
      (m) =>
        m &&
        m.type !== 'video' &&
        isValidHttpUrl(m.url) &&
        (m.url.includes('i.ibb.co') ||
          /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(m.url))
    );
    if (directImg) {
      return {
        url: sanitizeMediaUrl(directImg.url),
        alt: directImg.alt || product.name || 'Product image',
      };
    }

    // Fallback to any non-video valid URL in media
    const anyImg = product.media.find(
      (m) => m && m.type !== 'video' && isValidHttpUrl(m.url)
    );
    if (anyImg) {
      return {
        url: sanitizeMediaUrl(anyImg.url),
        alt: anyImg.alt || product.name || 'Product image',
      };
    }
  }

  return null;
}

/**
 * Maps product.media[] into sanitized gallery entries with validated URLs/posters
 * and subtle alternating backdrop tints for missing URL placeholders.
 */
export function getProductMediaGallery(product) {
  const baseTint = product?.tint || '#FBE4EA';
  const raw = Array.isArray(product?.media) ? product.media : [];
  if (raw.length === 0) {
    const primary = getPrimaryProductImage(product);
    return [
      {
        id: 'primary-img-0',
        type: 'image',
        url: primary ? primary.url : null,
        poster: null,
        alt: primary?.alt || product?.name || 'Product image',
        tint: baseTint,
      },
    ];
  }

  return raw.map((item, idx) => ({
    id: item?._id || item?.url || `media-${idx}`,
    type: item?.type === 'video' ? 'video' : 'image',
    provider: item?.provider || 'file',
    videoId: item?.videoId || null,
    url: isValidHttpUrl(item?.url) ? sanitizeMediaUrl(item.url) : null,
    poster: isValidHttpUrl(item?.poster) ? sanitizeMediaUrl(item.poster) : null,
    alt: item?.alt || product?.name || 'Product media',
    tint: item?.type === 'video' ? '#2A1220' : idx === 0 ? baseTint : DEFAULT_TINTS[idx % DEFAULT_TINTS.length],
  }));
}
