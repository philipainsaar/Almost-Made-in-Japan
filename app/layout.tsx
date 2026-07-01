import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Bitcount_Prop_Single } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import { CartDrawer } from '@/components/CartDrawer';

const bitcount = Bitcount_Prop_Single({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-main',
});

export const metadata: Metadata = {
  title: 'Almost Made in Japan Shop',
  description: 'A Shopify-powered jewelry shop for Almost Made in Japan.'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={bitcount.variable}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
