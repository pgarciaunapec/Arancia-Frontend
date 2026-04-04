import React, { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { apiRequest } from "../../lib/api";
import type { ApiEnvelope } from "../../lib/api";

type DeliveryStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "failed";

interface DeliveryRecord {
  _id: string;
  status: DeliveryStatus;
  estimatedMinutes?: number;
  order?: { _id: string; total?: number };
  user?: { name?: string; email?: string; phone?: string };
  agent?: { name?: string; phone?: string };
  createdAt?: string;
}

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  pending: "Pendiente",
  assigned: "Asignado",
  in_transit: "En tránsito",
  delivered: "Entregado",
  failed: "Fallido",
};

const NEXT_STATUS: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
  pending: "assigned",
  assigned: "in_transit",
  in_transit: "delivered",
};

const AdminDelivery: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeliveries = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<ApiEnvelope<DeliveryRecord[]>>(
        "/admin/delivery",
        { auth: true },
      );
      setDeliveries(response.data || []);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cargar delivery",
      );
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const activeCount = useMemo(
    () =>
      deliveries.filter((item) =>
        ["pending", "assigned", "in_transit"].includes(item.status),
      ).length,
    [deliveries],
  );

  const updateStatus = async (
    delivery: DeliveryRecord,
    status: DeliveryStatus,
  ) => {
    try {
      await apiRequest(`/admin/delivery/${delivery._id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status }),
      });
      await loadDeliveries();
    } catch {
      setError("No se pudo actualizar el estado del delivery");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Delivery</h1>
        <p className="text-sm text-white/60">Activos: {activeCount}</p>
      </div>

      {error && (
        <Card className="p-4 text-red-400 bg-red-500/10 border-red-500/30">
          {error}
        </Card>
      )}

      <Card className="p-4 bg-[#2d1f0f] border border-white/10">
        {loading ? (
          <p className="text-white/70">Cargando deliveries...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-white/70">No hay deliveries para mostrar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/60">
                  <th className="text-left p-3">Orden</th>
                  <th className="text-left p-3">Cliente</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">ETA</th>
                  <th className="text-left p-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => {
                  const nextStatus = NEXT_STATUS[delivery.status];
                  return (
                    <tr
                      key={delivery._id}
                      className="border-b border-white/5 text-white/90"
                    >
                      <td className="p-3 font-mono text-xs">
                        #
                        {delivery.order?._id?.slice(-6) ||
                          delivery._id.slice(-6)}
                      </td>
                      <td className="p-3">
                        {delivery.user?.name || "Cliente"}
                      </td>
                      <td className="p-3">{STATUS_LABEL[delivery.status]}</td>
                      <td className="p-3">
                        {delivery.estimatedMinutes
                          ? `${delivery.estimatedMinutes} min`
                          : "-"}
                      </td>
                      <td className="p-3">
                        {nextStatus ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white"
                            onClick={() => updateStatus(delivery, nextStatus)}
                          >
                            → {STATUS_LABEL[nextStatus]}
                          </Button>
                        ) : (
                          <span className="text-xs text-white/40">
                            Sin acción
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDelivery;
