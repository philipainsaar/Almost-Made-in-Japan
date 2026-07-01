'use client';

import Image from 'next/image';
import { useCart } from './CartProvider';
import { formatMoney } from '@/lib/format';

export function CartDrawer() {
  const { cart, isOpen, isLoading, error, closeCart, updateItem, removeItem, checkout } = useCart();
  const lines = cart?.lines || [];

  return (
    <>
      <button className={`cart-backdrop ${isOpen ? 'show' : ''}`} onClick={closeCart} aria-label="Close cart" />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="cart-head">
          <h2>Your bag</h2>
          <button onClick={closeCart} aria-label="Close cart">×</button>
        </div>

        {error && <p className="cart-error">{error}</p>}
        {isLoading && <p className="cart-note">Adding sparkle…</p>}

        {!lines.length && <p className="cart-empty">Your bag is floating in space.</p>}

        <div className="cart-lines">
          {lines.map((line) => {
            const image = line.merchandise.image || line.merchandise.product.featuredImage;
            return (
              <article className="cart-line" key={line.id}>
                <div className="cart-line-img">
                  {image?.url ? <Image src={image.url} alt={image.altText || line.merchandise.product.title} width={96} height={96} /> : null}
                </div>
                <div>
                  <h3>{line.merchandise.product.title}</h3>
                  <p>{formatMoney(line.merchandise.price)}</p>
                  <div className="mini-qty">
                    <button onClick={() => updateItem(line.id, Math.max(1, line.quantity - 1))}>−</button>
                    <span>{line.quantity}</span>
                    <button onClick={() => updateItem(line.id, line.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-line" onClick={() => removeItem(line.id)}>Remove</button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Subtotal</span>
            <strong>{formatMoney(cart?.cost.subtotalAmount)}</strong>
          </div>
          <button className="checkout-button" onClick={checkout} disabled={!cart?.checkoutUrl || !lines.length}>
            Continue to Shopify checkout
          </button>
          <p>Taxes and shipping are calculated by Shopify at checkout.</p>
        </div>
      </aside>
    </>
  );
}
