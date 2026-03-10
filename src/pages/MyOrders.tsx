import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  CreditCard,
  XCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  orderApi,
  paymentApi,
  type Order,
  type PaymentData,
} from "../services/api";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const statusConfig: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: "Pendiente", color: "text-yellow-400", icon: Clock },
  confirmed: { label: "Confirmado", color: "text-blue-400", icon: CheckCircle },
  preparing: { label: "Preparando", color: "text-orange-400", icon: Package },
  ready: { label: "Listo", color: "text-green-400", icon: CheckCircle },
  delivered: { label: "Entregado", color: "text-green-500", icon: Truck },
  cancelled: { label: "Cancelado", color: "text-red-400", icon: XCircle },
};

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "payments">("orders");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, paymentsRes] = await Promise.all([
          orderApi.getAll(),
          paymentApi.getMyPayments(),
        ]);
        if (ordersRes.data) setOrders(ordersRes.data);
        if (paymentsRes.data) setPayments(paymentsRes.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5b400]" />
      </div>
    );
  }

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 text-white">Mis Pedidos</h1>
          <p style={{ color: COLORS.muted }}>Historial de pedidos y pagos</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setTab("orders")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${tab === "orders" ? "bg-[#f5b400] text-[#2d1f0f]" : "bg-white/10 text-white/60 hover:text-white"}`}
          >
            <Package size={16} className="inline mr-2" />
            Pedidos ({orders.length})
          </button>
          <button
            onClick={() => setTab("payments")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${tab === "payments" ? "bg-[#f5b400] text-[#2d1f0f]" : "bg-white/10 text-white/60 hover:text-white"}`}
          >
            <CreditCard size={16} className="inline mr-2" />
            Pagos ({payments.length})
          </button>
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package size={64} className="mx-auto mb-4 text-white/20" />
                <p className="text-white/50 text-lg">No tienes pedidos aún</p>
                <Button className="mt-4" onClick={() => navigate("/menu")}>
                  Ver Menú
                </Button>
              </div>
            ) : (
              orders.map((order) => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = cfg.icon;
                return (
                  <motion.div key={order._id} layout>
                    <Card
                      className="p-6"
                      style={{
                        backgroundColor: COLORS.secondary,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <StatusIcon size={16} className={cfg.color} />
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}
                            >
                              {cfg.label}
                            </span>
                            {order.isDelivery && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                Delivery
                              </span>
                            )}
                          </div>
                          <p className="text-white font-bold">
                            Pedido #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-white/50 text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "es-DO",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                          <div className="text-sm text-white/70">
                            {order.items.map((item, i) => (
                              <span key={i}>
                                {item.quantity}x {item.name}
                                {i < order.items.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: COLORS.primary }}
                          >
                            ${order.total.toFixed(2)}
                          </span>
                          {order.isDelivery &&
                            order.status !== "cancelled" &&
                            order.status !== "delivered" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  navigate(`/delivery/${order._id}`)
                                }
                              >
                                Rastrear
                              </Button>
                            )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Payments Tab */}
        {tab === "payments" && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-16">
                <CreditCard size={64} className="mx-auto mb-4 text-white/20" />
                <p className="text-white/50 text-lg">
                  No tienes pagos registrados
                </p>
              </div>
            ) : (
              payments.map((payment) => (
                <Card
                  key={payment._id}
                  className="p-6"
                  style={{
                    backgroundColor: COLORS.secondary,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-white font-bold">
                        Ref: {payment.reference}
                      </p>
                      <p className="text-white/50 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "es-DO",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-white/60 capitalize">
                          {payment.method === "cash"
                            ? "Efectivo"
                            : payment.method === "card"
                              ? "Tarjeta"
                              : "Transferencia"}
                        </span>
                        {payment.last4Digits && (
                          <span className="text-white/40">
                            ****{payment.last4Digits}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: COLORS.primary }}
                      >
                        ${payment.amount.toFixed(2)}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase ${
                          payment.status === "completed"
                            ? "text-green-400"
                            : payment.status === "pending"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {payment.status === "completed"
                          ? "Completado"
                          : payment.status === "pending"
                            ? "Pendiente"
                            : "Fallido"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
