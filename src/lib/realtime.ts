import { io, type Socket } from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export type OrderStatusUpdatedEvent = {
  orderId: string;
  status: string;
  updatedAt: string;
  userId?: string;
};

type OrderSubscriptionPayload = {
  orderId?: string;
  userId?: string;
  adminScope?: boolean;
};

let socket: Socket | null = null;

const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: true,
    });
  }

  return socket;
};

export const subscribeToOrderStatusUpdates = (
  subscription: OrderSubscriptionPayload,
  onStatusUpdated: (event: OrderStatusUpdatedEvent) => void,
) => {
  const socketClient = getSocket();
  socketClient.emit("orders:subscribe", subscription);

  const handler = (event: OrderStatusUpdatedEvent) => {
    onStatusUpdated(event);
  };

  socketClient.on("orders:status-updated", handler);

  return () => {
    socketClient.off("orders:status-updated", handler);
  };
};
