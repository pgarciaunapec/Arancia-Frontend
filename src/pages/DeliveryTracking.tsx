import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
  Phone,
  MapPin,
  ChefHat,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { deliveryApi, type DeliveryData } from "../services/api";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const STEPS = [
  { key: "pending", label: "Pedido Recibido", icon: Package },
  { key: "confirmed", label: "Confirmado", icon: CheckCircle },
  { key: "preparing", label: "Preparando", icon: ChefHat },
  { key: "ready", label: "Listo para Enviar", icon: Package },
  { key: "in_transit", label: "En Camino", icon: Truck },
  { key: "delivered", label: "Entregado", icon: CheckCircle },
];

const DeliveryTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<DeliveryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    const fetch = async () => {
      try {
        const res = await deliveryApi.getByOrder(orderId);
        if (res.data) setDelivery(res.data);
      } catch {
        setError("No se encontró información de entrega para este pedido");
      } finally {
        setLoading(false);
      }
    };
    fetch();

    // Poll every 15 seconds
    const interval = setInterval(fetch, 15000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5b400]" />
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Truck size={64} className="mx-auto mb-4 text-white/30" />
          <p className="text-white/50 text-lg mb-4">
            {error || "Delivery no encontrado"}
          </p>
          <Button onClick={() => navigate("/my-orders")}>
            Volver a Pedidos
          </Button>
        </div>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === delivery.status);
  const countdown = delivery.estimatedArrival
    ? Math.max(
        0,
        Math.round(
          (new Date(delivery.estimatedArrival).getTime() - Date.now()) / 60000,
        ),
      )
    : delivery.estimatedMinutes;

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="text-white/60 mb-4"
          onClick={() => navigate("/my-orders")}
        >
          <ArrowLeft size={16} className="mr-2" /> Volver a Pedidos
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Rastreo de Entrega
          </h1>
          <p style={{ color: COLORS.muted }}>
            Pedido #{orderId?.slice(-8).toUpperCase()}
          </p>
        </motion.div>

        {/* Countdown */}
        {delivery.status !== "delivered" && delivery.status !== "cancelled" && (
          <Card
            className="p-8 mt-8 text-center"
            style={{
              backgroundColor: COLORS.secondary,
              border: `2px solid ${COLORS.primary}`,
            }}
          >
            <Clock size={32} className="mx-auto mb-3 text-[#f5b400]" />
            <p className="text-white/60 text-sm mb-1">
              Tiempo estimado de llegada
            </p>
            <p className="text-5xl font-bold text-[#f5b400]">{countdown}</p>
            <p className="text-white/40 text-sm">minutos</p>
          </Card>
        )}

        {delivery.status === "delivered" && (
          <Card
            className="p-8 mt-8 text-center"
            style={{
              backgroundColor: COLORS.secondary,
              border: `2px solid #22c55e`,
            }}
          >
            <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
            <p className="text-2xl font-bold text-white">¡Entregado!</p>
            <p className="text-white/60 text-sm mt-1">
              Tu pedido ha sido entregado exitosamente
            </p>
          </Card>
        )}

        {/* Steps Timeline */}
        <Card
          className="p-6 mt-6"
          style={{
            backgroundColor: COLORS.secondary,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <div className="space-y-0">
            {STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCurrent
                          ? "bg-[#f5b400] scale-110 shadow-lg shadow-[#f5b400]/30"
                          : isCompleted
                            ? "bg-[#f5b400]/30"
                            : "bg-white/10"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          isCompleted ? "text-[#f5b400]" : "text-white/30"
                        }
                      />
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-8 ${isCompleted ? "bg-[#f5b400]/50" : "bg-white/10"}`}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <p
                      className={`font-medium ${isCurrent ? "text-[#f5b400]" : isCompleted ? "text-white" : "text-white/30"}`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <span className="text-xs text-[#f5b400]/70 animate-pulse">
                        • En progreso
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Agent Info */}
        {delivery.agent && (
          <Card
            className="p-6 mt-6"
            style={{
              backgroundColor: COLORS.secondary,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Truck size={18} className="text-[#f5b400]" />
              Tu Repartidor
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{delivery.agent.name}</p>
                <p className="text-white/50 text-sm flex items-center gap-1">
                  <Phone size={12} /> {delivery.agent.phone}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Delivery Address */}
        <Card
          className="p-6 mt-6"
          style={{
            backgroundColor: COLORS.secondary,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <MapPin size={18} className="text-[#f5b400]" />
            Dirección de Entrega
          </h3>
          <p className="text-white/80">{delivery.deliveryAddress.name}</p>
          <p className="text-white/60 text-sm">
            {delivery.deliveryAddress.address}
          </p>
          <p className="text-white/60 text-sm">
            {delivery.deliveryAddress.city} {delivery.deliveryAddress.zip}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryTracking;
