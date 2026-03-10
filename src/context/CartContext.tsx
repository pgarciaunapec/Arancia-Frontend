import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, MenuItem } from '../types';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  tax: number;
  total: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CART_KEY = 'restaurant_cart';
const TAX_RATE = 0.18;

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === menuItem.id);
      if (existing) {
        return prev.map(i => i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        image: menuItem.image,
        category: menuItem.category,
      }];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, tax, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
