/**
 * useOrders Hook
 * Maneja órdenes del usuario
 */

import { useState, useCallback } from "react";
import { OrderService, type Order } from "../services/order.service";

export interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  createOrder: (
    items: any[],
    shippingAddress?: any,
    isDelivery?: boolean,
  ) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<void>;
  refetch: (token: string) => Promise<void>;
}

export const useOrders = (token: string | null): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (authToken: string) => {
    if (!authToken) return;
    try {
      setIsLoading(true);
      setError(null);
      const userOrders = await OrderService.getUserOrders(authToken);
      setOrders(userOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar órdenes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(
    async (
      items: any[],
      shippingAddress?: any,
      isDelivery?: boolean,
    ): Promise<Order> => {
      if (!token) throw new Error("No autenticado");
      try {
        setIsLoading(true);
        const order = await OrderService.create(
          token,
          items,
          shippingAddress,
          isDelivery,
        );
        // Refetch orders
        await refetch(token);
        return order;
      } finally {
        setIsLoading(false);
      }
    },
    [token, refetch],
  );

  const cancelOrder = useCallback(
    async (orderId: string) => {
      if (!token) throw new Error("No autenticado");
      try {
        setIsLoading(true);
        await OrderService.cancel(token, orderId);
        await refetch(token);
      } finally {
        setIsLoading(false);
      }
    },
    [token, refetch],
  );

  return {
    orders,
    isLoading,
    error,
    createOrder,
    cancelOrder,
    refetch,
  };
};
