import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Users,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationsContext";
import { formatCurrencyDOP } from "../lib/currency";

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
  const { getReservationsByUser, cancelReservation, updateReservation } =
    useReservations();
  const reservations = user ? getReservationsByUser(user.id) : [];

  const [editingReservationId, setEditingReservationId] = useState<string | null>(
    null,
  );
  const [editValues, setEditValues] = useState({
    date: "",
    time: "",
    guests: "2",
    notes: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const editingReservation = useMemo(
    () => reservations.find((item) => item.id === editingReservationId),
    [editingReservationId, reservations],
  );

  const editDelta = useMemo(() => {
    if (!editingReservation) {
      return 0;
    }

    const nextGuests = Number(editValues.guests || editingReservation.guests);
    const coverPerGuest = editingReservation.pricing?.coverPerGuest || 500;
    return (nextGuests - editingReservation.guests) * coverPerGuest;
  }, [editValues.guests, editingReservation]);

  const beginEdit = (reservationId: string) => {
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation) {
      return;
    }

    setEditingReservationId(reservation.id);
    setEditValues({
      date: reservation.date,
      time: reservation.time,
      guests: String(reservation.guests),
      notes: reservation.notes || "",
    });
    setEditError("");
    setEditSuccess("");
  };

  const cancelEdit = () => {
    setEditingReservationId(null);
    setEditError("");
  };

  const saveEdit = async () => {
    if (!editingReservation) {
      return;
    }

    const nextGuests = Number(editValues.guests);
    if (!nextGuests || nextGuests < 1) {
      setEditError("Debes indicar una cantidad de comensales válida.");
      return;
    }

    const isPaidReservation = editingReservation.status === "confirmed";

    try {
      setSavingEdit(true);
      setEditError("");

      await updateReservation(editingReservation.id, {
        date: editValues.date,
        time: editValues.time,
        guests: nextGuests,
        notes: editValues.notes,
        acceptAdditionalCharge: isPaidReservation && editDelta > 0,
      });

      setEditSuccess("Reserva actualizada correctamente.");
      setEditingReservationId(null);
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la reservación.",
      );
    } finally {
      setSavingEdit(false);
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
              const isEditing = editingReservationId === res.id;
              const canEditDirectly = res.status === "pending";
              const canAdjustPaid = res.status === "confirmed";
              return (
                <motion.div layout key={res.id}>
                  <Card
                    className="p-6 relative overflow-hidden"
                    style={{
                      backgroundColor: COLORS.secondary,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div
                      className={`absolute top-0 left-0 bottom-0 w-1.5 ${cfg.bg}`}
                    />
                    <div className="pl-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
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
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(canEditDirectly || canAdjustPaid) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => beginEdit(res.id)}
                              className="border-amber-400/30 text-amber-300 hover:bg-amber-400/10"
                            >
                              <Pencil size={14} className="mr-1" />
                              {canEditDirectly
                                ? "Editar"
                                : "Ajustar (reserva pagada)"}
                            </Button>
                          )}

                          {res.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelReservation(res.id)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
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

                    {isEditing && (
                      <div className="mt-5 ml-4 border-t border-white/10 pt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="date"
                            value={editValues.date}
                            onChange={(event) =>
                              setEditValues((prev) => ({
                                ...prev,
                                date: event.target.value,
                              }))
                            }
                            className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                            style={{ borderColor: COLORS.border }}
                          />
                          <input
                            type="time"
                            value={editValues.time}
                            onChange={(event) =>
                              setEditValues((prev) => ({
                                ...prev,
                                time: event.target.value,
                              }))
                            }
                            className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                            style={{ borderColor: COLORS.border }}
                          />
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={editValues.guests}
                            onChange={(event) =>
                              setEditValues((prev) => ({
                                ...prev,
                                guests: event.target.value,
                              }))
                            }
                            className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                            style={{ borderColor: COLORS.border }}
                          />
                          <input
                            type="text"
                            value={editValues.notes}
                            placeholder="Notas opcionales"
                            onChange={(event) =>
                              setEditValues((prev) => ({
                                ...prev,
                                notes: event.target.value,
                              }))
                            }
                            className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                            style={{ borderColor: COLORS.border }}
                          />
                        </div>

                        {res.status === "confirmed" && editDelta > 0 && (
                          <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                            Este ajuste incrementa la reserva y requiere cobro adicional de {formatCurrencyDOP(editDelta)}.
                          </div>
                        )}

                        {editError && (
                          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                            {editError}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelEdit}
                            className="border-white/20 text-white/80"
                          >
                            <X size={14} className="mr-1" /> Cancelar
                          </Button>
                          <Button
                            type="button"
                            onClick={saveEdit}
                            disabled={savingEdit}
                          >
                            <Save size={14} className="mr-1" />
                            {savingEdit
                              ? "Guardando..."
                              : res.status === "confirmed" && editDelta > 0
                                ? "Guardar y cobrar delta"
                                : "Guardar cambios"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}

            {editSuccess && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {editSuccess}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
