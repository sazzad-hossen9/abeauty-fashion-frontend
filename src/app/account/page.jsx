import { Suspense } from 'react';
import { AccountContent } from '@/app/_components/account/AccountContent';

export const metadata = {
  title: 'My Account — ABeauty & Fashion',
  description: 'View orders, manage delivery addresses, and track shipments.',
};

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountContent />
    </Suspense>
  );
}
