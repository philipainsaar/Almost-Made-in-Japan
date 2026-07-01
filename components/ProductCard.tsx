'use client';

import Link from 'next/link';
import { formatMoney } from '@/lib/format';
import { SITE_ASSETS } from '@/lib/site-assets';
import type { ShopifyProduct } from '@/lib/shopify';

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const image = product.featuredImage?.url || SITE_ASSETS.demoProduct;

  return (
    <article className="product-card">
      <Link href={`/products/${product.handle}`} className="product-image-link">
        <img src={image} alt={product.featuredImage?.altText || product.title} />
        {!product.availableForSale && <span className="sold-pill">Sold out</span>}
      </Link>
      <Link href={`/products/${product.handle}`} className="product-title">{product.title}</Link>
      <p>{formatMoney(product.priceRange.minVariantPrice)}</p>
    </article>
  );
}
