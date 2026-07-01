'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { formatMoney } from '@/lib/format';
import { SITE_ASSETS } from '@/lib/site-assets';
import type { ShopifyProduct } from '@/lib/shopify';

export function ProductDetails({ product }: { product: ShopifyProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState(product.variants[0]?.id);
  const { addItem, isLoading } = useCart();
  const selected = product.variants.find((variant) => variant.id === variantId) || product.variants[0];
  const image = selected?.image?.url || product.featuredImage?.url || SITE_ASSETS.demoProduct;

  return (
    <section className="product-detail page-pad">
      <img className="product-detail-image" src={image} alt={product.featuredImage?.altText || product.title} />
      <div className="product-detail-copy">
        <h1>{product.title}</h1>
        <p className="featured-price">{formatMoney(selected?.price || product.priceRange.minVariantPrice)}</p>
        <p className="tax-note">Taxes included.</p>

        {product.variants.length > 1 && (
          <label className="variant-select">
            Variant
            <select value={variantId} onChange={(event) => setVariantId(event.target.value)}>
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>{variant.title}</option>
              ))}
            </select>
          </label>
        )}

        <label>Quantity</label>
        <div className="quantity-box">
          <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((value) => value + 1)}>+</button>
        </div>
        <button
          className="add-cart-main"
          disabled={!selected?.availableForSale || isLoading}
          onClick={() => selected && addItem(selected.id, quantity)}
        >
          {selected?.availableForSale ? 'Add to cart' : 'Sold out'}
        </button>
        {product.description && <p className="product-description">{product.description}</p>}
      </div>
    </section>
  );
}
