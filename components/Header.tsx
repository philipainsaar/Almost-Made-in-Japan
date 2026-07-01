'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { SITE_ASSETS } from '@/lib/site-assets';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, openCart } = useCart();
  const count = cart?.totalQuantity || 0;

  return (
    <header className="site-header">
      <div className="mobile-nav-line">
        <button className="hamburger" aria-label="Open menu" onClick={() => setMenuOpen((value) => !value)}>
          <span />
          <span />
          <span />
        </button>
        <Link className="logo-link" href="/" aria-label="Almost Made in Japan home">
          <Image src={SITE_ASSETS.logo} alt="Almost Made in Japan" width={128} height={128} priority />
        </Link>
        <div className="header-actions">
          <button className="search-icon" aria-label="Search">
            <span />
          </button>
          <button className="bag-icon" aria-label="Open cart" onClick={openCart}>
            <span>{count || ''}</span>
          </button>
        </div>
      </div>

      <div className={`flyout-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/collections/necklaces">Necklaces</Link>
        <Link href="/collections/earrings">Earrings</Link>
        <Link href="/collections/hair-clips">Hair Clips</Link>
        <Link href="/collections/rings">Rings</Link>
        <Link href="/collections/accessories">Accessories</Link>
        <Link href="/collections/sunglasses">Sunglasses</Link>
      </div>
    </header>
  );
}
