import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Receipt,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import type { Invoice, OrderStatus } from "../types";
import { formatCurrencyDOP } from "../lib/currency";
import { apiRequest } from "../lib/api";
import type { ApiEnvelope } from "../lib/api";
import { mapBackendInvoice } from "../lib/mappers";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pendiente",
    color: "text-yellow-400",
    bg: "bg-yellow-500",
    icon: <Clock size={14} />,
  },
  confirmed: {
    label: "Confirmado",
    color: "text-blue-400",
    bg: "bg-blue-500",
    icon: <CheckCircle size={14} />,
  },
  preparing: {
    label: "Preparando",
    color: "text-orange-400",
    bg: "bg-orange-500",
    icon: <Package size={14} />,
  },
  ready: {
    label: "Listo",
    color: "text-green-400",
    bg: "bg-green-500",
    icon: <CheckCircle size={14} />,
  },
  shipped: {
    label: "Enviado",
    color: "text-purple-400",
    bg: "bg-purple-500",
    icon: <Truck size={14} />,
  },
  delivered: {
    label: "Entregado",
    color: "text-gray-400",
    bg: "bg-gray-500",
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-400",
    bg: "bg-red-500",
    icon: <XCircle size={14} />,
  },
};

interface UserNotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
}

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const { getOrdersByUser } = useOrders();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [invoiceByOrder, setInvoiceByOrder] = useState<
    Record<string, Invoice | undefined>
  >({});
  const [invoiceLoadingId, setInvoiceLoadingId] = useState<string | null>(null);
  const [invoiceError, setInvoiceError] = useState("");
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  const orders = user ? getOrdersByUser(user.id) : [];
  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const loadNotifications = async () => {
      try {
        const response = await apiRequest<ApiEnvelope<UserNotification[]>>(
          "/notifications?unread=true&limit=5",
          { auth: true },
        );

        const payload = response as ApiEnvelope<UserNotification[]> & {
          unreadCount?: number;
        };

        setNotifications(payload.data || []);
        setUnreadCount(Number(payload.unreadCount || 0));
      } catch {
        // Keep existing data if notifications polling fails.
      }
    };

    loadNotifications();

    const intervalId = window.setInterval(() => {
      loadNotifications();
    }, 8000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [user]);

  const markNotificationsAsRead = async () => {
    try {
      await apiRequest("/notifications/read-all", {
        method: "PATCH",
        auth: true,
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch {
      // Ignore mark-as-read failure and keep notifications visible.
    }
  };

  const openInvoiceForOrder = async (orderId: string) => {
    setInvoiceError("");

    const cached = invoiceByOrder[orderId];
    if (cached) {
      setActiveInvoice(cached);
      return;
    }

    setInvoiceLoadingId(orderId);
    try {
      const response = await apiRequest<ApiEnvelope<any>>(
        `/invoices/order/${orderId}`,
        { auth: true },
      );
      const mapped = mapBackendInvoice(response.data);
      setInvoiceByOrder((prev) => ({
        ...prev,
        [orderId]: mapped,
      }));
      setActiveInvoice(mapped);
    } catch (error) {
      setInvoiceError(
        error instanceof Error
          ? error.message
          : "No se pudo cargar el comprobante.",
      );
    } finally {
      setInvoiceLoadingId(null);
    }
  };

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1 text-white flex items-center gap-3">
              <ShoppingBag style={{ color: COLORS.primary }} /> Mis Pedidos
            </h1>
            <p style={{ color: COLORS.muted }}>
              Historial y seguimiento de tus pedidos
            </p>
          </div>
          <Button asChild>
            <Link to="/menu">+ Nuevo Pedido</Link>
          </Button>
        </motion.div>

        {unreadCount > 0 && (
          <Card
            className="p-4 mb-6"
            style={{
              backgroundColor: "rgba(245, 180, 0, 0.1)",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">
                  Tienes {unreadCount} actualización
                  {unreadCount !== 1 ? "es" : ""} nueva
                  {unreadCount !== 1 ? "s" : ""} de pedidos
                </p>
                <div className="mt-2 space-y-1 text-sm" style={{ color: COLORS.muted }}>
                  {notifications.map((notification) => (
                    <p key={notification._id}>
                      {notification.message}
                    </p>
                  ))}
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={markNotificationsAsRead}>
                Marcar como leídas
              </Button>
            </div>
          </Card>
        )}

        {invoiceError && (
          <Card className="p-3 mb-4 border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
            {invoiceError}
          </Card>
        )}

        {sorted.length === 0 ? (
          <Card
            className="p-12 text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: `1px dashed ${COLORS.border}`,
            }}
          >
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20 text-white" />
            <h3 className="text-xl font-medium text-white mb-4">
              Aún no tienes pedidos
            </h3>
            <Button asChild>
              <Link to="/menu">Explorar Menú</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sorted.map((order) => {
              const cfg = statusConfig[order.status] || statusConfig.pending;
              const isExpanded = expandedId === order.id;
              return (
                <motion.div layout key={order.id}>
                  <Card
                    className="overflow-hidden"
                    style={{
                      backgroundColor: COLORS.secondary,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div
                      className="p-5 cursor-pointer flex items-center justify-between gap-4 flex-wrap"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : order.id)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-white">
                          #{order.id.split("-").slice(-2).join("-")}
                        </div>
                        <span
                          className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${cfg.color}`}
                          style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                        >
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span style={{ color: COLORS.muted }}>
                          {new Date(order.createdAt).toLocaleDateString(
                            "es-DO",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: COLORS.primary }}
                        >
                          {formatCurrencyDOP(order.total)}
                        </span>
                        <span className="text-white/40">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-white/40" />
                        ) : (
                          <ChevronDown size={16} className="text-white/40" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-white/10 p-5 space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p
                              className="text-xs uppercase tracking-wider mb-3"
                              style={{ color: COLORS.muted }}
                            >
                              Items del Pedido
                            </p>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-white/80">
                                    {item.name}{" "}
                                    <span className="text-white/40">
                                      x{item.quantity}
                                    </span>
                                  </span>
                                  <span style={{ color: COLORS.primary }}>
                                    {formatCurrencyDOP(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p
                              className="text-xs uppercase tracking-wider mb-3"
                              style={{ color: COLORS.muted }}
                            >
                              Detalles
                            </p>
                            <div className="flex justify-between">
                              <span style={{ color: COLORS.muted }}>Tipo</span>
                              <span className="text-white capitalize">
                                {order.deliveryType === "delivery"
                                  ? "Delivery"
                                  : order.deliveryType === "pickup"
                                    ? "Recogida"
                                    : "En Mesa"}
                              </span>
                            </div>
                            {order.deliveryAddress && (
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                <span style={{ color: COLORS.muted }}>
                                  <MapPin size={12} className="inline mr-1" />
                                  Dirección
                                </span>
                                <span className="text-white text-left sm:text-right break-words sm:max-w-[220px]">
                                  {order.deliveryAddress}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span style={{ color: COLORS.muted }}>Pago</span>
                              <span className="text-white capitalize">
                                {order.transaction?.method === "card"
                                  ? `Tarjeta ****${order.transaction.cardLast4}`
                                  : order.transaction?.method === "cash"
                                    ? "Efectivo"
                                    : "Transferencia"}
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-white/10 pt-2 mt-2 font-bold">
                              <span style={{ color: COLORS.muted }}>Total</span>
                              <span style={{ color: COLORS.primary }}>
                                {formatCurrencyDOP(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => void openInvoiceForOrder(order.id)}
                            disabled={invoiceLoadingId === order.id}
                            className="w-full"
                          >
                            <Receipt size={16} className="mr-2" />
                            {invoiceLoadingId === order.id
                              ? "Cargando comprobante..."
                              : "Ver Comprobante"}
                          </Button>

                          {(order.status === "confirmed" ||
                            order.status === "preparing" ||
                            order.status === "shipped") && (
                            <Button
                              size="sm"
                              onClick={() => navigate(`/track/${order.id}`)}
                              className="w-full"
                            >
                              <Truck size={16} className="mr-2" /> Rastrear Pedido
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {activeInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <Card
              className="w-full max-w-md p-6"
              style={{
                backgroundColor: COLORS.secondary,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <h3 className="text-xl font-bold text-white">Comprobante</h3>
              <p className="text-sm mt-1" style={{ color: COLORS.muted }}>
                Código: {activeInvoice.code}
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.muted }}>
                Emitido: {new Date(activeInvoice.issuedAt).toLocaleString("es-DO")}
              </p>

              <div className="mt-4 rounded-lg bg-white p-4 flex items-center justify-center">
                <img
                  src={activeInvoice.qrImageDataUrl}
                  alt={`QR ${activeInvoice.code}`}
                  className="w-52 h-52 object-contain"
                />
              </div>

              <div className="mt-4 text-sm text-white flex justify-between">
                <span>Total</span>
                <span style={{ color: COLORS.primary }}>
                  {formatCurrencyDOP(activeInvoice.total)}
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActiveInvoice(null)}
                >
                  Cerrar
                </Button>
                <a
                  href={activeInvoice.qrImageDataUrl}
                  download={`${activeInvoice.code}.png`}
                  className="flex-1"
                >
                  <Button type="button" className="w-full">
                    Descargar QR
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
