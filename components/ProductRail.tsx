'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from './ProductCard';
import type { ShopifyProduct } from '@/lib/shopify';

export function ProductRail({ products }: { products: ShopifyProduct[] }) {
  const [page, setPage] = useState(1);
  const total = Math.max(1, products.length);

  return (
    <section className="product-rail-section page-pad">
      <h2>FAVOURITES ･:*+.</h2>
      <div className="product-rail">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="rail-controls">
        <button onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button>
        <span>{page}/{total}</span>
        <button onClick={() => setPage((value) => Math.min(total, value + 1))}>›</button>
      </div>
      <Link className="view-all-button" href="/collections/jewelry">View all</Link>
    </section>
  );
}
