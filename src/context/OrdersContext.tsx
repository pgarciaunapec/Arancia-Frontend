import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type {
  Order,
  OrderStatus,
  PaymentMethod,
  DeliveryType,
  CartItem,
} from "../types";
import { apiRequest } from "../lib/api";
import type { ApiEnvelope } from "../lib/api";
import { mapBackendOrder } from "../lib/mappers";
import { subscribeToOrderStatusUpdates } from "../lib/realtime";
import { useAuth } from "./AuthContext";

interface OrdersContextValue {
  orders: Order[];
  createOrder: (data: CreateOrderData) => Promise<Order>;
  getOrdersByUser: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
    extra?: { deliveryAgentId?: string; vehicleId?: string },
  ) => Promise<void>;
  getAllOrders: () => Order[];
  refreshOrders: () => Promise<void>;
}

interface CreateOrderData {
  userId: string;
  contactName?: string;
  contactEmail?: string;
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
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: any[] }).data;
  }

  return [];
};

const isOrderStatus = (status: string): status is OrderStatus => {
  return [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "shipped",
    "delivered",
    "cancelled",
  ].includes(status);
};

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }

    if (isAdmin) {
      const response = await apiRequest<ApiEnvelope<any>>(
        "/admin/orders?limit=200",
        { auth: true },
      );
      const rawOrders = unpackArrayData(response.data);
      setOrders(
        rawOrders.map((raw) =>
          mapBackendOrder(raw, String(raw.user?._id || raw.user)),
        ),
      );
      return;
    }

    const response = await apiRequest<ApiEnvelope<any>>("/orders", {
      auth: true,
    });
    const rawOrders = unpackArrayData(response.data);
    setOrders(rawOrders.map((raw) => mapBackendOrder(raw, user?.id)));
  }, [isAdmin, isAuthenticated, user?.id]);

  useEffect(() => {
    refreshOrders().catch(() => setOrders([]));
  }, [refreshOrders]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const unsubscribe = subscribeToOrderStatusUpdates(
      {
        userId: user?.id,
        adminScope: isAdmin,
      },
      (event) => {
        if (!event.orderId || !isOrderStatus(event.status)) {
          return;
        }

        let hasMatch = false;

        setOrders((current) =>
          current.map((order) => {
            if (
              order.id !== event.orderId &&
              order.backendId !== event.orderId
            ) {
              return order;
            }

            hasMatch = true;
            return {
              ...order,
              status: event.status,
              updatedAt: event.updatedAt || order.updatedAt,
            };
          }),
        );

        if (!hasMatch) {
          refreshOrders().catch(() => {
            // Keep existing state if background refresh fails.
          });
        }
      },
    );

    return unsubscribe;
  }, [isAdmin, isAuthenticated, refreshOrders, user?.id]);

  const createOrder = useCallback(
    async (data: CreateOrderData): Promise<Order> => {
      if (!data.items.length) {
        throw new Error("No hay items para procesar en la orden");
      }

      const [address = "Sin dirección", city = "Santo Domingo"] = (
        data.deliveryAddress || "Sin dirección,Santo Domingo"
      )
        .split(",")
        .map((part) => part.trim());

      const orderResponse = await apiRequest<ApiEnvelope<any>>("/orders", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          items: data.items.map((item) => ({
            menuItem: item.backendId || item.id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            name: data.contactName || user?.name || "Cliente",
            address,
            city,
            zip: "00000",
          },
          isDelivery: data.deliveryType === "delivery",
          payment: {
            method: data.paymentMethod,
            cardNumber:
              data.paymentMethod === "card"
                ? data.cardNumber || `400000000000${data.cardLast4 || "0000"}`
                : undefined,
          },
        }),
      });

      const mapped = mapBackendOrder(orderResponse.data, data.userId);

      setOrders((current) => {
        const withoutCurrent = current.filter(
          (order) =>
            order.id !== mapped.id &&
            order.backendId !== mapped.backendId &&
            order.backendId !== mapped.id,
        );
        return [mapped, ...withoutCurrent];
      });

      return mapped;
    },
    [user?.name],
  );

  const getOrdersByUser = useCallback(
    (userId: string) =>
      orders.filter((order) => order.userId === userId || !order.userId),
    [orders],
  );

  const getOrderById = useCallback(
    (orderId: string) =>
      orders.find(
        (order) => order.id === orderId || order.backendId === orderId,
      ),
    [orders],
  );

  const updateOrderStatus = useCallback(
    async (
      orderId: string,
      status: Order["status"],
      extra?: { deliveryAgentId?: string; vehicleId?: string },
    ) => {
      if (!isAdmin) {
        return;
      }

        await apiRequest<ApiEnvelope<any>>(`/admin/orders/${orderId}/status`, {
          method: "PATCH",
        auth: true,
        body: JSON.stringify({
          status,
          deliveryAgentId: extra?.deliveryAgentId,
          vehicleId: extra?.vehicleId,
        }),
      });

      await refreshOrders();
    },
    [isAdmin, refreshOrders],
  );

  const getAllOrders = useCallback(() => orders, [orders]);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        getOrdersByUser,
        getOrderById,
        updateOrderStatus,
        getAllOrders,
        refreshOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};
