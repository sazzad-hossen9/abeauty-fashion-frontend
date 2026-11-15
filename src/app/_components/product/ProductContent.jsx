'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { useParams } from 'next/navigation';
import { Heart, Plus, Minus, Truck, RotateCcw, ChevronDown, Check, ShieldCheck, Star } from 'lucide-react';
import { ImageGallery } from '@/app/_components/product/ImageGallery';
import { RoutineBundle } from '@/app/_components/product/RoutineBundle';
import { ReviewsSection } from '@/app/_components/product/ReviewsSection';
import { ProductCard } from '@/components/common/ProductCard';
import { Button } from '@/components/common/Button';
import { api } from '@/api/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';

export const ProductContent = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isBn, formatPrice } = useLanguage();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected options state
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedShade, setSelectedShade] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Accordion open states
  const [openAccordion, setOpenAccordion] = useState({
    details: true,
    howToUse: false,
    ingredients: false,
    shipping: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Fetch product & related products from backend API
  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    Promise.all([
      api.getProductBySlug(id),
      api.getRelatedProducts(id).catch(() => []),
    ])
      .then(([data, related]) => {
        if (!isMounted) return;
        setProduct(data || null);
        setRelatedProducts(Array.isArray(related) ? related.slice(0, 4) : []);
        setSelectedSizeIndex(0);
        if (data?.shades && data.shades.length > 0) {
          setSelectedShade(data.shades[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load product.');
        setProduct(null);
        setRelatedProducts([]);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 h-[520px] rounded-[32px] bg-[#F8F1F3] animate-pulse" />
          <div className="lg:col-span-5 flex flex-col gap-4 pt-4">
            <div className="h-6 w-32 rounded bg-[#F8F1F3] animate-pulse" />
            <div className="h-12 w-3/4 rounded bg-[#F8F1F3] animate-pulse" />
            <div className="h-24 w-full rounded bg-[#F8F1F3] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex-1 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-24 flex flex-col items-center justify-center text-center gap-4">
          <h1 className="d text-[36px] sm:text-[44px] text-brand-dark m-0">
            {error ? 'Could not load product' : 'No products yet'}
          </h1>
          <p className="text-brand-muted text-[16px] max-w-md m-0">
            {error || 'This product was not found or has not been added to the catalog yet.'}
          </p>
          <Button variant="primary" to="/shop" className="mt-2">
            Explore the Shop
          </Button>
        </div>
      </div>
    );
  }

  const sizes = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : [{ name: 'Standard', price: product.price }];
  const currentVariant = sizes[selectedSizeIndex] || sizes[0];
  const currentPrice = currentVariant?.price ?? product.price ?? 0;
  const currentWasPrice = currentVariant?.compareAtPrice ?? product.wasPrice ?? null;
  const isVariantInStock = currentVariant?.stock !== undefined ? currentVariant.stock > 0 : product.inStock !== false;
  const isFavorited = isInWishlist(product);

  const handleAddToCart = () => {
    if (!isVariantInStock) return;
    const selectedVariantName = currentVariant?.name || selectedShade || 'Standard';
    addToCart(
      {
        ...product,
        id: product.slug || product.id || product._id,
        price: currentPrice,
        image: product.image,
        imageAlt: product.imageAlt || product.name,
      },
      selectedVariantName,
      quantity,
      true
    );
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="flex-1 bg-white">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] py-6 text-brand-muted text-[14px] flex flex-wrap items-center gap-2">
        <Link to="/" className="text-brand-muted hover:text-brand-dark no-underline">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-brand-muted hover:text-brand-dark no-underline">{product.category}</Link>
        {product.subCategory && (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-brand-muted">{product.subCategory}</span>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-brand-dark font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Product Section: Gallery + Purchase Form */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px] pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <ImageGallery product={product} />
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6 pt-2">
          {/* Header Title & Rating */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold tracking-[0.16em] uppercase text-brand-rose">
              {product.category} {product.subCategory ? `· ${product.subCategory}` : ''}
            </span>

            <h1 className="d text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.04] text-brand-dark m-0">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-[14px] mt-1">
              <div className="stars text-[15px] tracking-wider" aria-hidden="true">★★★★★</div>
              <strong className="text-brand-dark">{product.rating ?? 0}</strong>
              <a href="#reviews" className="text-brand-muted underline hover:text-brand-dark">
                {product.reviewCount ?? 0} reviews
              </a>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="d text-[32px] sm:text-[36px] font-bold text-brand-dark">
              {formatPrice(currentPrice)}
            </span>
            {currentWasPrice && (
              <span className="line-through text-brand-muted text-[18px]">
                {formatPrice(currentWasPrice)}
              </span>
            )}
            {product.taxIncluded !== false && (
              <span className="text-[13px] text-brand-muted">Tax included</span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-brand-muted text-[15px] sm:text-[16px] leading-relaxed m-0">
            {product.description}
          </p>

          {/* Feature Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center h-8 px-3 rounded-full bg-[#F8F1F3] text-[13px] font-semibold text-brand-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Size / Variant Options */}
          {sizes.length > 1 && (
            <fieldset className="border-0 p-0 m-0 flex flex-col gap-3">
              <legend className="font-bold text-[15px] text-brand-dark mb-1">
                Size: <span className="font-medium text-brand-muted">{sizes[selectedSizeIndex]?.name}</span>
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((s, idx) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`flex flex-col items-start gap-0.5 px-4 py-2.5 rounded-2xl border text-left transition-all ${
                      selectedSizeIndex === idx
                        ? 'border-brand-dark bg-white ring-1 ring-brand-dark shadow-xs'
                        : 'border-brand-borderDark bg-white hover:border-brand-dark'
                    }`}
                  >
                    <strong className="text-[14px] text-brand-dark">{s.name}</strong>
                    <span className="text-[13px] text-brand-muted">{formatPrice(s.price)}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {/* Shade Options (if applicable) */}
          {product.shades && product.shades.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="font-bold text-[15px] text-brand-dark">
                Shade: <span className="font-medium text-brand-muted">{selectedShade || product.shades[0]}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.shades.map(shade => (
                  <button
                    key={shade}
                    type="button"
                    onClick={() => setSelectedShade(shade)}
                    className={`h-9 px-3.5 rounded-full text-[13px] font-semibold transition-all ${
                      selectedShade === shade
                        ? 'bg-brand-dark text-white'
                        : 'bg-[#F8F1F3] text-brand-dark hover:bg-brand-roseLight'
                    }`}
                  >
                    {shade}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Bag */}
          <div className="flex items-center gap-3 mt-1">
            {/* Quantity Adjuster */}
            <div className="flex items-center h-[56px] border border-brand-borderDark rounded-full px-2 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="icb w-10 h-10"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-brand-dark" />
              </button>
              <span className="w-8 text-center font-bold text-[15px] text-brand-dark">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="icb w-10 h-10"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 text-brand-dark" />
              </button>
            </div>

            {/* Main Add to Bag Button */}
            <Button
              variant="rose"
              onClick={handleAddToCart}
              disabled={!isVariantInStock}
              className={`flex-1 !h-[56px] !text-[16px] transition-all ${
                addedAnimation ? 'bg-brand-green' : ''
              }`}
            >
              {!isVariantInStock ? (
                'Out of stock'
              ) : addedAnimation ? (
                <>
                  <Check className="w-5 h-5 mr-1" /> Added to bag!
                </>
              ) : (
                `Add to bag — ${formatPrice(currentPrice * quantity)}`
              )}
            </Button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              className={`w-[56px] h-[56px] rounded-full inline-flex items-center justify-center border border-brand-borderDark shrink-0 transition-colors ${
                isFavorited ? 'text-brand-rose border-brand-rose bg-brand-roseLight' : 'text-brand-dark hover:bg-brand-roseLight'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-brand-rose text-brand-rose' : ''}`} strokeWidth={1.8} />
            </button>
          </div>

          {/* Stock notice */}
          <div className={`flex items-center gap-2 text-[14px] font-semibold ${isVariantInStock ? 'text-brand-green' : 'text-brand-rose'}`}>
            <span className={`w-2 h-2 rounded-full ${isVariantInStock ? 'bg-brand-green animate-pulse' : 'bg-brand-rose'}`} />
            {isVariantInStock
              ? `In stock — ${product.shippingNote || 'ships within 24 hours'}`
              : 'Currently out of stock'}
          </div>

          {/* Shipping & Returns value cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex gap-3 items-center p-3.5 rounded-2xl bg-brand-pinkSubtle border border-brand-border">
              <Truck className="w-5 h-5 text-brand-rose shrink-0" strokeWidth={1.8} />
              <div className="flex flex-col text-[13px] leading-snug">
                <strong>Free shipping</strong>
                <span className="text-brand-muted">on orders over $50</span>
              </div>
            </div>

            <div className="flex gap-3 items-center p-3.5 rounded-2xl bg-brand-pinkSubtle border border-brand-border">
              <RotateCcw className="w-5 h-5 text-brand-rose shrink-0" strokeWidth={1.8} />
              <div className="flex flex-col text-[13px] leading-snug">
                <strong>Easy returns</strong>
                <span className="text-brand-muted">on unopened items</span>
              </div>
            </div>
          </div>

          {/* Accordion list matching design Desktop-Product.dc.html lines 119-123 */}
          <div className="flex flex-col divide-y divide-brand-border pt-2 border-t border-brand-border">
            {/* Details */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('details')}
                className="w-full flex justify-between items-center font-bold text-[16px] text-brand-dark text-left"
              >
                <span>Details</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion.details ? 'rotate-180 text-brand-rose' : ''}`} />
              </button>
              {openAccordion.details && (
                <p className="mt-3 text-[15px] text-brand-muted leading-relaxed m-0">
                  {product.details || "Product specifications have not been added yet."}
                </p>
              )}
            </div>

            {/* How to use */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('howToUse')}
                className="w-full flex justify-between items-center font-bold text-[16px] text-brand-dark text-left"
              >
                <span>How to use</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion.howToUse ? 'rotate-180 text-brand-rose' : ''}`} />
              </button>
              {openAccordion.howToUse && (
                <p className="mt-3 text-[15px] text-brand-muted leading-relaxed m-0">
                  {product.howToUse || "Usage instructions have not been added yet."}
                </p>
              )}
            </div>

            {/* Ingredients */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('ingredients')}
                className="w-full flex justify-between items-center font-bold text-[16px] text-brand-dark text-left"
              >
                <span>Ingredients</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion.ingredients ? 'rotate-180 text-brand-rose' : ''}`} />
              </button>
              {openAccordion.ingredients && (
                <p className="mt-3 text-[15px] text-brand-muted leading-relaxed m-0">
                  {product.ingredients || "Ingredient list has not been added yet."}
                </p>
              )}
            </div>

            {/* Shipping & returns */}
            <div className="py-4">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex justify-between items-center font-bold text-[16px] text-brand-dark text-left"
              >
                <span>Shipping &amp; returns</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion.shipping ? 'rotate-180 text-brand-rose' : ''}`} />
              </button>
              {openAccordion.shipping && (
                <p className="mt-3 text-[15px] text-brand-muted leading-relaxed m-0">
                  {product.shippingInfo || "Free standard shipping on orders over $50. Unopened and unused items may be returned within 30 days of delivery."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Routine Bundle Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        <RoutineBundle />
      </div>

      {/* Customer Reviews Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[56px]">
        <ReviewsSection product={product} />
      </div>

      {/* Related Products: You may also love */}
      {relatedProducts.length > 0 && (
        <section className="px-4 sm:px-8 lg:px-[56px] py-16 border-t border-brand-border max-w-[1440px] mx-auto">
          <h2 className="d text-[32px] sm:text-[44px] text-brand-dark mb-8 m-0">
            You may also{' '}<span className="s text-[#C8325F]">love</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id || rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductContent;
