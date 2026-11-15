import { Suspense } from 'react';
import { ShopContent } from '@/app/_components/shop/ShopContent';

export const metadata = {
  title: 'Shop All Products — ABeauty & Fashion',
  description: 'Browse curated skincare, makeup, hair care, and beauty tools.',
};

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
