import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, MenuItem } from '../types';
import { apiRequest } from '../lib/api';
import type { ApiEnvelope } from '../lib/api';
import { mapBackendCartItem } from '../lib/mappers';
import { useAuth } from './AuthContext';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  tax: number;
  total: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CART_KEY = 'restaurant_guest_cart';
const TAX_RATE = 0.18;

const CartContext = createContext<CartContextValue | null>(null);

const parseLocalCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => parseLocalCart());

  const mergeGuestCart = useCallback(async () => {
    const guestItems = parseLocalCart();
    if (!guestItems.length) {
      return;
    }

    await apiRequest('/cart/merge', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        items: guestItems.map((item) => ({
          menuItemId: item.backendId || item.id,
          quantity: item.quantity,
        })),
      }),
    });

    localStorage.removeItem(CART_KEY);
  }, []);

  const hydrateFromBackend = useCallback(async () => {
    const response = await apiRequest<ApiEnvelope<any>>('/cart', { auth: true });
    const mapped = (response.data?.items || []).map(mapBackendCartItem);
    setItems(mapped);
  }, []);

  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      await hydrateFromBackend();
    }
  }, [hydrateFromBackend, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCart()
        .catch((error) => {
          console.error('Error merging guest cart:', error);
        })
        .finally(() => {
          hydrateFromBackend().catch((error) => {
            console.error('Error hydrating cart:', error);
            setItems([]);
          });
        });
      return;
    }

    setItems(parseLocalCart());
  }, [hydrateFromBackend, isAuthenticated, mergeGuestCart]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [isAuthenticated, items]);

  const addItem = useCallback(
    (menuItem: MenuItem) => {
      if (isAuthenticated) {
        apiRequest<ApiEnvelope<any>>('/cart', {
          method: 'POST',
          auth: true,
          body: JSON.stringify({ menuItemId: menuItem.backendId || menuItem.id, quantity: 1 }),
        })
          .then((response) => {
            const mapped = (response.data?.items || []).map(mapBackendCartItem);
            setItems(mapped);
          })
          .catch((error) => {
            console.error('Error adding item to cart:', error);
          });
        return;
      }

      setItems((prev) => {
        const existing = prev.find((item) => item.id === menuItem.id);
        if (existing) {
          return prev.map((item) => (item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item));
        }

        return [
          ...prev,
          {
            id: menuItem.id,
            backendId: menuItem.backendId,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            image: menuItem.image,
            category: menuItem.category,
            ingredients: menuItem.ingredients,
            description: menuItem.description,
          },
        ];
      });
    },
    [isAuthenticated]
  );

  const removeItem = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        apiRequest<ApiEnvelope<any>>(`/cart/${id}`, {
          method: 'DELETE',
          auth: true,
        })
          .then((response) => {
            const mapped = (response.data?.items || []).map(mapBackendCartItem);
            setItems(mapped);
          })
          .catch((error) => {
            console.error('Error removing item from cart:', error);
          });
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }

      if (isAuthenticated) {
        apiRequest<ApiEnvelope<any>>(`/cart/${id}`, {
          method: 'PUT',
          auth: true,
          body: JSON.stringify({ quantity }),
        })
          .then((response) => {
            const mapped = (response.data?.items || []).map(mapBackendCartItem);
            setItems(mapped);
          })
          .catch((error) => {
            console.error('Error updating cart quantity:', error);
          });
        return;
      }

      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    },
    [isAuthenticated, removeItem]
  );

  const clearCart = useCallback(() => {
    if (isAuthenticated) {
      apiRequest('/cart', {
        method: 'DELETE',
        auth: true,
      })
        .then(() => setItems([]))
        .catch((error) => {
          console.error('Error clearing cart:', error);
        });
      return;
    }

    setItems([]);
  }, [isAuthenticated]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, tax, total, addItem, removeItem, updateQuantity, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
