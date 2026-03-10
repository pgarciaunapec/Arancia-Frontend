import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Package,
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { adminApi, type Order } from "../../services/api";
import { toast } from "sonner";

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "delivered"];
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pendiente",
    color: "text-yellow-400 bg-yellow-400/10",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmado",
    color: "text-blue-400 bg-blue-400/10",
    icon: CheckCircle,
  },
  preparing: {
    label: "Preparando",
    color: "text-orange-400 bg-orange-400/10",
    icon: ChefHat,
  },
  ready: {
    label: "Listo",
    color: "text-green-400 bg-green-400/10",
    icon: Package,
  },
  delivered: {
    label: "Entregado",
    color: "text-green-500 bg-green-500/10",
    icon: Truck,
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-400 bg-red-400/10",
    icon: XCircle,
  },
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.orders.getAll({
        page,
        limit: 20,
        status: statusFilter || undefined,
      });
      if (res.data) setOrders(res.data);
      if (res.pagination) setTotalPages(res.pagination.pages);
    } catch {
      toast.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.orders.updateStatus(orderId, newStatus);
      toast.success(
        `Estado actualizado a: ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
      );
      fetchOrders();
    } catch {
      toast.error("Error al actualizar estado");
    }
  };

  const getNextStatus = (current: string): string | null => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Pedidos</h1>
          <p className="text-white/50 text-sm">Gestión de todos los pedidos</p>
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            setStatusFilter("");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${!statusFilter ? "bg-[#f5b400] text-[#2d1f0f]" : "bg-white/10 text-white/50"}`}
        >
          Todos
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => {
              setStatusFilter(key);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${statusFilter === key ? "bg-[#f5b400] text-[#2d1f0f]" : `${cfg.color} bg-opacity-20`}`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b400]" />
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            const nextStatus = getNextStatus(order.status);

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusIcon
                        size={14}
                        className={cfg.color.split(" ")[0]}
                      />
                      <span
                        className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-white/30 text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      {order.isDelivery && (
                        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                          Delivery
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-white/70">
                      {order.items.map((item, idx) => (
                        <span key={idx}>
                          {item.quantity}x {item.name}
                          {idx < order.items.length - 1 ? " • " : ""}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/30 text-xs">
                      {new Date(order.createdAt).toLocaleString("es-DO")}
                      {" • "}Pago:{" "}
                      <span
                        className={
                          order.paymentStatus === "paid"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {order.paymentStatus === "paid"
                          ? "Pagado"
                          : "Pendiente"}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xl font-bold text-[#f5b400]">
                      ${order.total.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      {nextStatus && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(order._id, nextStatus)
                          }
                        >
                          → {STATUS_CONFIG[nextStatus]?.label}
                        </Button>
                      )}
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400/60 hover:text-red-400"
                            onClick={() =>
                              handleStatusChange(order._id, "cancelled")
                            }
                          >
                            Cancelar
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {orders.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <Package size={48} className="mx-auto mb-3" />
              No se encontraron pedidos
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-white/50"
              >
                Anterior
              </Button>
              <span className="text-white/50 text-sm">
                {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-white/50"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
