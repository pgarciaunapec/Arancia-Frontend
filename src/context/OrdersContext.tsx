import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Order, PaymentMethod, DeliveryType, CartItem } from '../types';
import { apiRequest } from '../lib/api';
import type { ApiEnvelope } from '../lib/api';
import { mapBackendOrder } from '../lib/mappers';
import { useAuth } from './AuthContext';

interface OrdersContextValue {
  orders: Order[];
  createOrder: (data: CreateOrderData) => Promise<Order>;
  getOrdersByUser: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getAllOrders: () => Order[];
  refreshOrders: () => Promise<void>;
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
  cardNumber?: string;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const unpackArrayData = (payload: unknown): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: any[] }).data;
  }

  return [];
};

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    if (isAdmin) {
      const response = await apiRequest<ApiEnvelope<any>>('/orders/admin/all?limit=200', { auth: true });
      const rawOrders = unpackArrayData(response.data);
      setOrders(rawOrders.map((raw) => mapBackendOrder(raw, String(raw.user?._id || raw.user))));
      return;
    }

    const response = await apiRequest<ApiEnvelope<any>>('/orders', { auth: true });
    const rawOrders = unpackArrayData(response.data);
    setOrders(rawOrders.map((raw) => mapBackendOrder(raw, user?.id)));
  }, [isAdmin, isAuthenticated, user?.id]);

  useEffect(() => {
    refreshOrders().catch(() => setOrders([]));
  }, [refreshOrders]);

  const createOrder = useCallback(async (data: CreateOrderData): Promise<Order> => {
    if (!data.items.length) {
      throw new Error('No hay items para procesar en la orden');
    }

    const [address = 'Sin dirección', city = 'Santo Domingo'] = (data.deliveryAddress || 'Sin dirección,Santo Domingo').split(',').map((part) => part.trim());

    const orderResponse = await apiRequest<ApiEnvelope<any>>('/orders', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        items: data.items.map((item) => ({
          menuItem: item.backendId || item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          name: user?.name || 'Cliente',
          address,
          city,
          zip: '00000',
        },
        isDelivery: data.deliveryType === 'delivery',
      }),
    });

    const backendOrder = orderResponse.data;

    await apiRequest<ApiEnvelope<any>>('/payments', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        orderId: String(backendOrder._id),
        method: data.paymentMethod,
        cardNumber: data.paymentMethod === 'card' ? data.cardNumber || `400000000000${data.cardLast4 || '0000'}` : undefined,
      }),
    });

    const paidOrderResponse = await apiRequest<ApiEnvelope<any>>(`/orders/${backendOrder._id}`, { auth: true });
    const mapped = mapBackendOrder(paidOrderResponse.data, data.userId);

    await refreshOrders();
    return mapped;
  }, [refreshOrders, user?.name]);

  const getOrdersByUser = useCallback(
    (userId: string) => orders.filter((order) => order.userId === userId || !order.userId),
    [orders]
  );

  const getOrderById = useCallback((orderId: string) => orders.find((order) => order.id === orderId || order.backendId === orderId), [orders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    if (!isAdmin) {
      return;
    }

    await apiRequest<ApiEnvelope<any>>(`/orders/${orderId}/status`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify({ status }),
    });

    await refreshOrders();
  }, [isAdmin, refreshOrders]);

  const getAllOrders = useCallback(() => orders, [orders]);

  return (
    <OrdersContext.Provider value={{ orders, createOrder, getOrdersByUser, getOrderById, updateOrderStatus, getAllOrders, refreshOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
};
