import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Order, PaymentTransaction, PaymentMethod, DeliveryType, CartItem } from '../types';

interface OrdersContextValue {
  orders: Order[];
  createOrder: (data: CreateOrderData) => Order;
  getOrdersByUser: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getAllOrders: () => Order[];
}

interface CreateOrderData {
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  cardLast4?: string;
  tableNumber?: number;
}

const ORDERS_KEY = 'restaurant_orders';

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

// Seed some demo orders
const seedOrders = (): Order[] => [
  {
    id: 'ORD-2026-001',
    userId: 'user-001',
    items: [
      { id: 1, name: 'Agrio', price: 150, quantity: 2, image: 'https://lh3.googleusercontent.com/d/1tGEPmnXDq7AL38aStHexEm081CUNEbkZ' },
      { id: 22, name: 'Croquetas de Pollo', price: 220, quantity: 1, image: 'https://lh3.googleusercontent.com/d/1W_v3msi-wuzWFMPpTmNTsFs8sV3OdviS' },
    ],
    subtotal: 520,
    tax: 93.6,
    total: 613.6,
    status: 'delivered',
    deliveryType: 'delivery',
    deliveryAddress: 'Calle Demo 123, Santo Domingo',
    estimatedMinutes: 35,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
    transaction: {
      id: 'TXN-2026-001',
      orderId: 'ORD-2026-001',
      userId: 'user-001',
      amount: 520,
      tax: 93.6,
      total: 613.6,
      method: 'card',
      status: 'paid',
      cardLast4: '4242',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
];

const getStoredOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  const initial = seedOrders();
  localStorage.setItem(ORDERS_KEY, JSON.stringify(initial));
  return initial;
};

const OrdersContext = createContext<OrdersContextValue | null>(null);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = useCallback((data: CreateOrderData): Order => {
    const orderId = generateId('ORD');
    const transactionId = generateId('TXN');
    const now = new Date().toISOString();

    const transaction: PaymentTransaction = {
      id: transactionId,
      orderId,
      userId: data.userId,
      amount: data.subtotal,
      tax: data.tax,
      total: data.total,
      method: data.paymentMethod,
      status: 'paid',
      cardLast4: data.cardLast4,
      createdAt: now,
    };

    const order: Order = {
      id: orderId,
      userId: data.userId,
      items: data.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      status: 'confirmed',
      deliveryType: data.deliveryType,
      deliveryAddress: data.deliveryAddress,
      estimatedMinutes: data.deliveryType === 'delivery' ? 35 : data.deliveryType === 'pickup' ? 20 : 15,
      transaction,
      tableNumber: data.tableNumber,
      createdAt: now,
      updatedAt: now,
    };

    setOrders(prev => [order, ...prev]);
    return order;
  }, []);

  const getOrdersByUser = useCallback((userId: string) => {
    return orders.filter(o => o.userId === userId);
  }, [orders]);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(o => o.id === orderId);
  }, [orders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    ));
  }, []);

  const getAllOrders = useCallback(() => orders, [orders]);

  return (
    <OrdersContext.Provider value={{ orders, createOrder, getOrdersByUser, getOrderById, updateOrderStatus, getAllOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
};
