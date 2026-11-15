'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ModalProvider } from '@/context/ModalContext';

export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

