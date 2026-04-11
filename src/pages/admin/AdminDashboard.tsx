import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Package,
  Clock,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { useOrders } from "../../context/OrdersContext";
import { useAdmin } from "../../context/AdminContext";
import { apiRequest } from "../../lib/api";
import type { ApiEnvelope } from "../../lib/api";
import { formatCurrencyDOP } from "../../lib/currency";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.2)",
};

const AdminDashboard: React.FC = () => {
  const { getAllOrders } = useOrders();
  const { inventory, cashSession, lowStockAlerts, refreshAlerts } = useAdmin();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    totalOrders: 0,
    activeOrders: 0,
    pendingOrders: 0,
    todayOrders: 0,
    todayReservations: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    activeDeliveries: 0,
    occupiedTables: 0,
    totalTables: 0,
  });
  const [loading, setLoading] = useState(true);

  const orders = getAllOrders();
  const lowStock = useMemo(
    () =>
      lowStockAlerts.length
        ? lowStockAlerts
        : inventory.filter((i) => i.status !== "ok"),
    [inventory, lowStockAlerts],
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await apiRequest<ApiEnvelope<any>>(
          "/admin/dashboard",
          { auth: true },
        );
        const data = response.data || {};
        setMetrics({
          totalUsers: Number(data.totalUsers || 0),
          newUsersToday: Number(data.newUsersToday || 0),
          totalOrders: Number(data.totalOrders || 0),
          activeOrders: Number(data.activeOrders || 0),
          pendingOrders: Number(data.pendingOrders || 0),
          todayOrders: Number(data.todayOrders || 0),
          todayReservations: Number(data.todayReservations || 0),
          totalRevenue: Number(data.totalRevenue || 0),
          todayRevenue: Number(data.todayRevenue || 0),
          activeDeliveries: Number(data.activeDeliveries || 0),
          occupiedTables: Number(data.occupiedTables || 0),
          totalTables: Number(data.totalTables || 0),
        });
        await refreshAlerts();
      } catch (error) {
        console.error("Error loading admin dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [refreshAlerts]);

  const stats = [
    {
      label: "Ventas Totales",
      value: formatCurrencyDOP(metrics.totalRevenue),
      icon: <DollarSign size={20} />,
      color: "#22c55e",
    },
    {
      label: "Pedidos Activos",
      value: metrics.activeOrders,
      icon: <ShoppingBag size={20} />,
      color: COLORS.primary,
    },
    {
      label: "Ingresos Hoy",
      value: formatCurrencyDOP(metrics.todayRevenue),
      icon: <Clock size={20} />,
      color: "#3b82f6",
    },
    {
      label: "Nuevos Usuarios",
      value: metrics.newUsersToday,
      icon: <Users size={20} />,
      color: "#a855f7",
    },
    {
      label: "Reservas Hoy",
      value: metrics.todayReservations,
      icon: <Calendar size={20} />,
      color: "#06b6d4",
    },
    {
      label: "Alertas Stock",
      value: lowStock.length,
      icon: <Package size={20} />,
      color: lowStock.length > 0 ? "#ef4444" : "#22c55e",
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p style={{ color: COLORS.muted }}>
          {new Date().toLocaleDateString("es-DO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        {loading && (
          <p className="text-xs mt-1" style={{ color: COLORS.muted }}>
            Actualizando métricas...
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card
              className="p-4"
              style={{
                backgroundColor: COLORS.secondary,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <TrendingUp size={12} style={{ color: COLORS.muted }} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: COLORS.muted }}>
                {stat.label}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card
          className="p-6"
          style={{
            backgroundColor: COLORS.secondary,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingBag size={16} style={{ color: COLORS.primary }} /> Últimos
            Pedidos
          </h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between text-sm py-2 border-b border-white/5"
              >
                <div>
                  <p className="text-white font-medium">
                    #{order.id.split("-").slice(-2).join("-")}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.muted }}>
                    {new Date(order.createdAt).toLocaleTimeString("es-DO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    · {order.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: COLORS.primary }} className="font-bold">
                    {formatCurrencyDOP(order.total)}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "delivered"
                        ? "text-gray-400 bg-gray-500/10"
                        : order.status === "cancelled"
                          ? "text-red-400 bg-red-500/10"
                          : "text-green-400 bg-green-500/10"
                    }`}
                  >
                    {order.status === "delivered"
                      ? "Entregado"
                      : order.status === "cancelled"
                        ? "Cancelado"
                        : order.status === "confirmed"
                          ? "Confirmado"
                          : order.status === "preparing"
                            ? "Preparando"
                              : order.status === "shipped"
                                ? "Enviado"
                              : order.status}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p
                className="text-center py-6 text-sm"
                style={{ color: COLORS.muted }}
              >
                Sin pedidos aún
              </p>
            )}
          </div>
        </Card>

        {/* Low Stock + Cash Session */}
        <div className="space-y-6">
          <Card
            className="p-6"
            style={{
              backgroundColor: COLORS.secondary,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Package size={16} style={{ color: COLORS.primary }} /> Alertas de
              Inventario
            </h3>
            {lowStock.length === 0 ? (
              <p className="text-sm text-green-400">
                ✓ Todo el inventario está al nivel correcto
              </p>
            ) : (
              <div className="space-y-2">
                {lowStock.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-white/80">{item.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        item.status === "out"
                          ? "text-red-400 bg-red-500/10"
                          : "text-yellow-400 bg-yellow-500/10"
                      }`}
                    >
                      {item.status === "out"
                        ? "Agotado"
                        : `Bajo (${item.quantity} ${item.unit})`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            className="p-6"
            style={{
              backgroundColor: COLORS.secondary,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign size={16} style={{ color: COLORS.primary }} /> Caja
            </h3>
            {cashSession ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: COLORS.muted }}>Estado</span>
                  <span
                    className={
                      cashSession.isOpen ? "text-green-400" : "text-gray-400"
                    }
                  >
                    {cashSession.isOpen ? "● Abierta" : "○ Cerrada"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: COLORS.muted }}>Balance inicial</span>
                  <span className="text-white">
                    {formatCurrencyDOP(cashSession.openingBalance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: COLORS.muted }}>Ventas totales</span>
                  <span style={{ color: COLORS.primary }}>
                    {formatCurrencyDOP(cashSession.totalSales)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: COLORS.muted }}>
                No hay sesión de caja abierta
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
