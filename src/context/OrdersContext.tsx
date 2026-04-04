import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Order, PaymentMethod, DeliveryType } from '../types';
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

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    if (isAdmin) {
      const response = await apiRequest<ApiEnvelope<any[]>>('/admin/orders?limit=200', { auth: true });
      setOrders((response.data || []).map((raw) => mapBackendOrder(raw, String(raw.user?._id || raw.user))));
      return;
    }

    const response = await apiRequest<ApiEnvelope<any[]>>('/orders', { auth: true });
    setOrders((response.data || []).map((raw) => mapBackendOrder(raw, user?.id)));
  }, [isAdmin, isAuthenticated, user?.id]);

  useEffect(() => {
    refreshOrders().catch(() => setOrders([]));
  }, [refreshOrders]);

  const createOrder = useCallback(async (data: CreateOrderData): Promise<Order> => {
    const [address = 'Sin dirección', city = 'Santo Domingo'] = (data.deliveryAddress || 'Sin dirección,Santo Domingo').split(',').map((part) => part.trim());

    const orderResponse = await apiRequest<ApiEnvelope<any>>('/orders', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
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

    await apiRequest<ApiEnvelope<any>>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
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
