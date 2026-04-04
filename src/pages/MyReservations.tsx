import React from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationsContext";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const statusConfig = {
  pending: {
    label: "Pendiente",
    color: "text-yellow-400",
    bg: "bg-yellow-400",
  },
  confirmed: {
    label: "Confirmada",
    color: "text-green-400",
    bg: "bg-green-400",
  },
  cancelled: { label: "Cancelada", color: "text-red-400", bg: "bg-red-400" },
  completed: { label: "Completada", color: "text-gray-400", bg: "bg-gray-400" },
};

const MyReservations: React.FC = () => {
  const { user } = useAuth();
  const { getReservationsByUser, cancelReservation } = useReservations();
  const reservations = user ? getReservationsByUser(user.id) : [];

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1 text-white">Mis Reservas</h1>
            <p style={{ color: COLORS.muted }}>
              Gestiona tus visitas y experiencias
            </p>
          </div>
          <Button asChild>
            <Link to="/reservations">+ Nueva Reserva</Link>
          </Button>
        </motion.div>

        {reservations.length === 0 ? (
          <Card
            className="p-12 text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: `1px dashed ${COLORS.border}`,
            }}
          >
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20 text-white" />
            <h3 className="text-xl font-medium text-white mb-4">
              No tienes reservas aún
            </h3>
            <Button asChild>
              <Link to="/reservations">Hacer una Reserva</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reservations.map((res) => {
              const cfg = statusConfig[res.status] || statusConfig.pending;
              return (
                <motion.div layout key={res.id}>
                  <Card
                    className="p-6 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                    style={{
                      backgroundColor: COLORS.secondary,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div
                      className={`absolute top-0 left-0 bottom-0 w-1.5 ${cfg.bg}`}
                    />
                    <div className="flex-1 pl-4 space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        {res.status === "confirmed" && (
                          <CheckCircle className="text-green-400" size={16} />
                        )}
                        {res.status === "cancelled" && (
                          <XCircle className="text-red-400" size={16} />
                        )}
                        {res.status === "completed" && (
                          <Clock className="text-gray-400" size={16} />
                        )}
                        <span
                          className={`font-bold uppercase tracking-wider text-xs ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-white/30 text-xs ml-auto">
                          #{res.id.split("-").slice(-1)[0]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1.5 text-white">
                          <Calendar
                            size={14}
                            style={{ color: COLORS.primary }}
                          />
                          {new Date(`${res.date}T12:00:00`).toLocaleDateString(
                            "es-DO",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1.5 text-white">
                          <Clock size={14} style={{ color: COLORS.primary }} />{" "}
                          {res.time}
                        </span>
                        <span className="flex items-center gap-1.5 text-white">
                          <Users size={14} style={{ color: COLORS.primary }} />{" "}
                          {res.guests}{" "}
                          {res.guests === 1 ? "persona" : "personas"}
                        </span>
                        <span
                          className="flex items-center gap-1.5"
                          style={{ color: COLORS.muted }}
                        >
                          <MapPin size={14} /> {res.location}
                          {res.tableNumber && ` · Mesa ${res.tableNumber}`}
                        </span>
                      </div>
                      {res.notes && (
                        <p
                          className="text-xs italic"
                          style={{ color: COLORS.muted }}
                        >
                          "{res.notes}"
                        </p>
                      )}
                    </div>
                    {res.status === "confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelReservation(res.id)}
                        className="shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Cancelar
                      </Button>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
