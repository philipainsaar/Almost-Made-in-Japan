'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { formatMoney } from '@/lib/format';
import { SITE_ASSETS } from '@/lib/site-assets';
import type { ShopifyProduct } from '@/lib/shopify';

export function FeaturedProduct({ product }: { product: ShopifyProduct }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading } = useCart();
  const variant = product.variants.find((item) => item.availableForSale) || product.variants[0];
  const image = product.featuredImage?.url || SITE_ASSETS.demoProduct;

  return (
    <section className="featured-product page-pad">
      <Link href={`/products/${product.handle}`} className="featured-image-link">
        <img src={image} alt={product.featuredImage?.altText || product.title} />
      </Link>
      <div className="featured-copy">
        <h2>{product.title}</h2>
        <p className="featured-price">{formatMoney(product.priceRange.minVariantPrice)}</p>
        <p className="tax-note">Taxes included.</p>
        <label>Quantity</label>
        <div className="quantity-box">
          <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((value) => value + 1)}>+</button>
        </div>
        <button
          className="add-cart-main"
          disabled={!variant?.availableForSale || isLoading}
          onClick={() => variant && addItem(variant.id, quantity)}
        >
          {variant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </button>
      </div>
    </section>
  );
}
