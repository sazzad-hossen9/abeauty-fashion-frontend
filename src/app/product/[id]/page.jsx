import { ProductContent } from '@/app/_components/product/ProductContent';

export async function generateMetadata({ params }) {
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (apiBase && params?.id) {
    try {
      const res = await fetch(`${apiBase}/products/${encodeURIComponent(params.id)}`, {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const product = await res.json();
        if (product?.name) {
          return {
            title: `${product.name} — ABeauty & Fashion`,
            description: product.description || 'Curated beauty product from ABeauty & Fashion',
          };
        }
      }
    } catch {
      // Fallback to generic metadata below
    }
  }
  return {
    title: 'Product Details — ABeauty & Fashion',
    description: 'Curated beauty product from ABeauty & Fashion',
  };
}

export default function ProductDetailPage() {
  return <ProductContent />;
}
