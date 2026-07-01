'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Cart } from '@/lib/shopify';

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  checkout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('amij_cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem('amij_cart');
      }
    }
  }, []);

  useEffect(() => {
    if (cart) window.localStorage.setItem('amij_cart', JSON.stringify(cart));
  }, [cart]);

  async function postCart(path: string, body: unknown) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Cart request failed');
      setCart(json.cart);
      setIsOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cart request failed');
    } finally {
      setIsLoading(false);
    }
  }

  const value = useMemo<CartContextValue>(() => ({
    cart,
    isOpen,
    isLoading,
    error,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: async (merchandiseId, quantity = 1) => {
      await postCart('/api/cart/add', { cartId: cart?.id, merchandiseId, quantity });
    },
    updateItem: async (lineId, quantity) => {
      await postCart('/api/cart/update', { cartId: cart?.id, lineId, quantity });
    },
    removeItem: async (lineId) => {
      await postCart('/api/cart/remove', { cartId: cart?.id, lineId });
    },
    checkout: () => {
      if (!cart?.checkoutUrl) return;
      window.location.href = cart.checkoutUrl;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [cart, isOpen, isLoading, error]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}
