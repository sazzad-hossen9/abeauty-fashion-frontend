import { Suspense } from 'react';
import './globals.css';
import { DM_Sans, Bricolage_Grotesque, Instrument_Serif, Anek_Bangla, Hind_Siliguri } from 'next/font/google';
import Providers from '@/components/providers/Providers';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { QuickViewModal } from '@/components/modals/QuickViewModal';
import { AuthModal } from '@/components/modals/AuthModal';
import { OrderSuccessModal } from '@/components/modals/OrderSuccessModal';
import { NewsletterModal } from '@/components/modals/NewsletterModal';
import { ContactSuccessModal } from '@/components/modals/ContactSuccessModal';
import { CookieConsent } from '@/components/modals/CookieConsent';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  weight: ['400'],
  subsets: ['latin'],
  style: ['italic', 'normal'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

const anekBangla = Anek_Bangla({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['bengali'],
  variable: '--font-anek-bangla',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});


export const metadata = {
  metadataBase: new URL('https://abeautynfashion.com'),
  title: 'ABeauty & Fashion — Curated Beauty, Makeup & Skincare',
  description: 'Curated original beauty products, clean skincare formulations, hair care, and wellness tools with nationwide delivery.',
  icons: {
    icon: '/logo.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${dmSans.variable} ${bricolage.variable} ${instrumentSerif.variable} ${anekBangla.variable} ${hindSiliguri.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col m-0 p-0 font-sans bg-white text-brand-dark antialiased selection:bg-brand-roseLight selection:text-brand-rose">
        <Providers>
          {/* Top Announcement Bar */}
          <AnnouncementBar />

          {/* Sticky Navbar */}
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>

          {/* Main Page View */}
          <div className="flex-1 flex flex-col">
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </div>

          {/* Shared Footer */}
          <Footer />

          {/* Global Drawers & Modals */}
          <CartDrawer />
          <QuickViewModal />
          <AuthModal />
          <OrderSuccessModal />
          <NewsletterModal />
          <ContactSuccessModal />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
