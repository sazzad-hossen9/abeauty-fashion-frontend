import { Suspense } from 'react';
import { SearchContent } from '@/app/_components/search/SearchContent';

export const metadata = {
  title: 'Search Results — ABeauty & Fashion',
  description: 'Search curated skincare, makeup, hair care, beauty tools and journal guides.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}

