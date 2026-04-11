import React, { useState } from "react";
import { motion } from "motion/react";
import {
  CalendarRange,
  Filter,
  RotateCcw,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useOrders } from "../../context/OrdersContext";
import type { OrderStatus } from "../../types";
import { formatCurrencyDOP } from "../../lib/currency";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.2)",
};

const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmados" },
  { value: "preparing", label: "Preparando" },
  { value: "ready", label: "Listos" },
  { value: "shipped", label: "Enviados" },
  { value: "delivered", label: "Entregados" },
  { value: "cancelled", label: "Cancelados" },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: "preparing",
  preparing: "ready",
  ready: "shipped",
  shipped: "delivered",
};

const AdminOrders: React.FC = () => {
  const { getAllOrders, updateOrderStatus } = useOrders();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7d" | "30d">("all");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<
    "all" | "delivery" | "pickup" | "dine-in"
  >("all");

  const orders = getAllOrders();
  const filtered = orders
    .filter((o) => {
      const createdAt = new Date(o.createdAt);
      const now = new Date();

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today"
          ? createdAt.toDateString() === now.toDateString()
          : (() => {
              const days = dateFilter === "7d" ? 7 : 30;
              const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
              return createdAt >= cutoff;
            })());

      const matchesSearch =
        search === "" || o.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = filterStatus === "all" || o.status === filterStatus;

      const matchesDeliveryType =
        deliveryTypeFilter === "all" || o.deliveryType === deliveryTypeFilter;

      return matchesSearch && matchesStatus && matchesDate && matchesDeliveryType;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p style={{ color: COLORS.muted }}>
            {orders.length} pedido{orders.length !== 1 ? "s" : ""} en total
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card
        className="p-4"
        style={{
          backgroundColor: COLORS.secondary,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          role="toolbar"
          aria-label="Filtros de pedidos"
          className="flex flex-wrap gap-3 items-center"
        >
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="absolute left-3 top-2.5 text-white/30"
              size={16}
            />
            <input
              aria-label="Buscar pedidos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por ID..."
              className="w-full bg-black/20 pl-9 pr-4 py-2 rounded-lg border text-white text-sm focus:ring-2 outline-none"
              style={{ borderColor: COLORS.border }}
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1.5">
            <CalendarRange size={14} className="text-white/60" />
            <select
              aria-label="Filtrar por fecha"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(
                  event.target.value as "all" | "today" | "7d" | "30d",
                )
              }
              className="bg-transparent rounded-lg px-2 py-1 text-sm text-white outline-none"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="7d">Ultimos 7 dias</option>
              <option value="30d">Ultimos 30 dias</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1.5">
            <Truck size={14} className="text-white/60" />
            <select
              aria-label="Filtrar por tipo de entrega"
              value={deliveryTypeFilter}
              onChange={(event) =>
                setDeliveryTypeFilter(
                  event.target.value as "all" | "delivery" | "pickup" | "dine-in",
                )
              }
              className="bg-transparent rounded-lg px-2 py-1 text-sm text-white outline-none"
            >
              <option value="all">Todos los tipos</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Recogida</option>
              <option value="dine-in">Mesa</option>
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-white/80"
            onClick={() => {
              setSearch("");
              setFilterStatus("all");
              setDateFilter("all");
              setDeliveryTypeFilter("all");
            }}
          >
            <RotateCcw size={14} className="mr-2" /> Limpiar
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2 flex-wrap w-full overflow-x-auto pb-1">
            <Filter size={14} style={{ color: COLORS.muted }} />
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className="text-xs px-3 py-1.5 rounded-full border transition-all shrink-0"
                style={{
                  borderColor:
                    filterStatus === opt.value ? COLORS.primary : "transparent",
                  backgroundColor:
                    filterStatus === opt.value
                      ? "rgba(245,180,0,0.1)"
                      : "rgba(255,255,255,0.05)",
                  color:
                    filterStatus === opt.value ? COLORS.primary : COLORS.muted,
                }}
              >
                {opt.label}
              </button>
            ))}
        </div>
      </Card>

      {/* Orders Table */}
      <Card
        style={{
          backgroundColor: COLORS.secondary,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: COLORS.border }}>
                {[
                  "ID Pedido",
                  "Fecha/Hora",
                  "Items",
                  "Total",
                  "Tipo",
                  "Estado",
                  "Acción",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left p-4 font-medium"
                    style={{ color: COLORS.muted }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const nextStatus = NEXT_STATUS[order.status as OrderStatus];
                return (
                  <motion.tr
                    layout
                    key={order.id}
                    className="border-b hover:bg-white/3 transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                  >
                    <td className="p-4 text-white font-mono text-xs">
                      #{order.id.split("-").slice(-2).join("-")}
                    </td>
                    <td className="p-4" style={{ color: COLORS.muted }}>
                      <div>
                        {new Date(order.createdAt).toLocaleDateString("es-DO", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                      <div className="text-xs">
                        {new Date(order.createdAt).toLocaleTimeString("es-DO", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-white">
                      {order.items.length} items
                    </td>
                    <td
                      className="p-4 font-bold"
                      style={{ color: COLORS.primary }}
                    >
                      {formatCurrencyDOP(order.total)}
                    </td>
                    <td className="p-4" style={{ color: COLORS.muted }}>
                      {order.deliveryType === "delivery"
                        ? "🛵 Delivery"
                        : order.deliveryType === "pickup"
                          ? "📦 Recogida"
                          : "🍽️ Mesa"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "delivered"
                            ? "text-gray-400 bg-gray-500/10"
                            : order.status === "cancelled"
                              ? "text-red-400 bg-red-500/10"
                              : order.status === "shipped"
                                ? "text-purple-400 bg-purple-500/10"
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
                                : order.status === "ready"
                                  ? "Listo"
                                  : order.status === "shipped"
                                    ? "Enviado"
                                    : order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {nextStatus && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateOrderStatus(order.id, nextStatus)
                          }
                          className="text-xs border-white/20 text-white/70 hover:text-white whitespace-nowrap"
                        >
                          →{" "}
                          {nextStatus === "preparing"
                            ? "Preparar"
                            : nextStatus === "ready"
                              ? "Listo"
                              : nextStatus === "shipped"
                                ? "Enviar"
                                : "Entregar"}
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center" style={{ color: COLORS.muted }}>
              <ShoppingBag className="mx-auto mb-3 opacity-30" size={32} />
              <p>No se encontraron pedidos</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminOrders;
