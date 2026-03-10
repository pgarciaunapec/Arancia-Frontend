import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Users,
  CalendarX2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { reservationApi, type Reservation } from "../services/api";
import { toast } from "sonner";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const STATUS_MAP: Record<
  string,
  { label: string; icon: React.ReactNode; bar: string }
> = {
  confirmed: {
    label: "Confirmada",
    icon: <CheckCircle className="text-green-500" size={16} />,
    bar: "bg-green-500",
  },
  pending: {
    label: "Pendiente",
    icon: <Clock className="text-yellow-500" size={16} />,
    bar: "bg-yellow-500",
  },
  cancelled: {
    label: "Cancelada",
    icon: <XCircle className="text-red-500" size={16} />,
    bar: "bg-red-500",
  },
  completed: {
    label: "Completada",
    icon: <Clock className="text-gray-500" size={16} />,
    bar: "bg-gray-500",
  },
};

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      const res = await reservationApi.getMyReservations();
      if (res.data) setReservations(res.data);
    } catch {
      toast.error("Error al cargar reservaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const cancelReservation = async (id: string) => {
    setCancelling(id);
    try {
      await reservationApi.cancel(id);
      toast.success("Reservación cancelada");
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "cancelled" } : r)),
      );
    } catch {
      toast.error("Error al cancelar reservación");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b400]" />
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
          <h1 className="text-3xl font-bold mb-2 text-white">Mis Reservas</h1>
          <p style={{ color: COLORS.muted }}>
            Gestiona tus visitas y experiencias
          </p>
        </motion.div>

        {reservations.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <CalendarX2 size={48} className="mx-auto mb-3" />
            <p>No tienes reservaciones</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {reservations.map((res) => {
            const cfg = STATUS_MAP[res.status] || STATUS_MAP.pending;
            return (
              <motion.div layout key={res._id}>
                <Card
                  className="p-6 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                  style={{
                    backgroundColor: COLORS.secondary,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <div
                    className={`absolute top-0 left-0 bottom-0 w-2 ${cfg.bar}`}
                  />

                  <div className="flex-1 pl-4 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      {cfg.icon}
                      <span className="font-bold uppercase tracking-wider text-xs text-white/50">
                        {cfg.label}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Calendar size={20} style={{ color: COLORS.primary }} />
                      {new Date(res.date).toLocaleDateString("es-DO", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <Clock size={14} style={{ color: COLORS.primary }} />
                        {res.time}
                      </div>
                      {res.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} style={{ color: COLORS.primary }} />
                          {res.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users size={14} style={{ color: COLORS.primary }} />
                        <span className="font-bold text-white">
                          {res.guests}
                        </span>{" "}
                        Personas
                      </div>
                    </div>

                    {res.notes && (
                      <p className="text-xs text-white/40 italic">
                        {res.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-auto pl-4 sm:pl-0">
                    {(res.status === "confirmed" ||
                      res.status === "pending") && (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={cancelling === res._id}
                        onClick={() => cancelReservation(res._id)}
                      >
                        {cancelling === res._id ? "Cancelando..." : "Cancelar"}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyReservations;
