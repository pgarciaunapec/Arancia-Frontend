import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Truck, MapPin, Phone, User, Package } from "lucide-react";
import { Button } from "../../components/ui/button";
import { adminApi, type DeliveryData } from "../../services/api";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "text-yellow-400 bg-yellow-400/10" },
  confirmed: { label: "Confirmado", color: "text-blue-400 bg-blue-400/10" },
  preparing: { label: "Preparando", color: "text-orange-400 bg-orange-400/10" },
  ready: { label: "Listo", color: "text-purple-400 bg-purple-400/10" },
  in_transit: { label: "En Camino", color: "text-cyan-400 bg-cyan-400/10" },
  delivered: { label: "Entregado", color: "text-green-500 bg-green-500/10" },
};

const FLOW = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "in_transit",
  "delivered",
];

const AdminDelivery: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignAgent, setAssignAgent] = useState<string | null>(null);
  const [agentForm, setAgentForm] = useState({ name: "", phone: "" });

  const fetchDeliveries = async () => {
    try {
      const res = await adminApi.delivery.getActive();
      if (res.data) setDeliveries(res.data);
    } catch {
      toast.error("Error al cargar entregas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleAdvanceStatus = async (id: string, currentStatus: string) => {
    const idx = FLOW.indexOf(currentStatus);
    if (idx === -1 || idx >= FLOW.length - 1) return;
    const nextStatus = FLOW[idx + 1];

    if (
      nextStatus === "in_transit" &&
      !deliveries.find((d) => d._id === id)?.agent
    ) {
      setAssignAgent(id);
      return;
    }

    try {
      await adminApi.delivery.updateStatus(id, { status: nextStatus });
      toast.success(
        `Estado actualizado a: ${STATUS_LABELS[nextStatus]?.label}`,
      );
      fetchDeliveries();
    } catch {
      toast.error("Error al actualizar");
    }
  };

  const handleAssignAndSend = async () => {
    if (!assignAgent || !agentForm.name || !agentForm.phone) {
      toast.error("Completa los datos del repartidor");
      return;
    }
    try {
      await adminApi.delivery.updateStatus(assignAgent, {
        status: "in_transit",
        agent: agentForm,
      });
      toast.success("Repartidor asignado y en camino");
      setAssignAgent(null);
      setAgentForm({ name: "", phone: "" });
      fetchDeliveries();
    } catch {
      toast.error("Error al asignar");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b400]" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Delivery</h1>
      <p className="text-white/50 text-sm mb-8">
        Gestión de entregas activas ({deliveries.length})
      </p>

      {/* Agent assignment modal */}
      {assignAgent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        >
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} className="text-[#f5b400]" />
              Asignar Repartidor
            </h3>
            <div className="space-y-3 mb-6">
              <input
                placeholder="Nombre del repartidor"
                value={agentForm.name}
                onChange={(e) =>
                  setAgentForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none"
              />
              <input
                placeholder="Teléfono"
                value={agentForm.phone}
                onChange={(e) =>
                  setAgentForm((p) => ({ ...p, phone: e.target.value }))
                }
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white outline-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAssignAndSend} className="flex-1">
                Asignar y Enviar
              </Button>
              <Button
                variant="ghost"
                onClick={() => setAssignAgent(null)}
                className="text-white/50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {deliveries.map((d, i) => {
          const cfg = STATUS_LABELS[d.status] || STATUS_LABELS.pending;
          const idx = FLOW.indexOf(d.status);
          const hasNext = idx < FLOW.length - 1;

          return (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Truck size={14} className={cfg.color.split(" ")[0]} />
                    <span
                      className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-white/30 text-xs">
                      #
                      {(typeof d.order === "string" ? d.order : d.order._id)
                        .slice(-8)
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-white/70">
                    <MapPin
                      size={14}
                      className="text-[#f5b400] shrink-0 mt-0.5"
                    />
                    <div>
                      <p>{d.deliveryAddress.name}</p>
                      <p className="text-white/40">
                        {d.deliveryAddress.address}, {d.deliveryAddress.city}
                      </p>
                    </div>
                  </div>

                  {d.agent && (
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <User size={14} className="text-cyan-400" />
                      <span>{d.agent.name}</span>
                      <Phone size={12} />
                      <span>{d.agent.phone}</span>
                    </div>
                  )}

                  <p className="text-white/30 text-xs">
                    Estimado: {d.estimatedMinutes} min
                    {d.estimatedArrival &&
                      ` • Llegada: ${new Date(d.estimatedArrival).toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {hasNext && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStatus(d._id, d.status)}
                    >
                      → {STATUS_LABELS[FLOW[idx + 1]]?.label}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {deliveries.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <Package size={48} className="mx-auto mb-3" />
            No hay entregas activas
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDelivery;
