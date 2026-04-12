import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useForm } from "@tanstack/react-form";
import {
  Calendar,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";
import { useReservations } from "../context/ReservationsContext";
import { validateWithYup } from "../lib/forms/yupTanstack";
import { reservationSchema } from "../schemas/forms.schema";
import {
  formatDominicanPhoneInput,
  normalizeDominicanPhone,
} from "../lib/phone";
import { apiRequest } from "../lib/api";
import type { ApiEnvelope } from "../lib/api";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const reservationSelectStyle: React.CSSProperties = {
  borderColor: "rgba(245, 180, 0, 0.7)",
  color: COLORS.white,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  outlineColor: COLORS.primary,
};

interface AvailableTable {
  _id: string;
  number: number;
  capacity: number;
  zone: string;
}

const Reservations: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createReservation } = useReservations();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [availableTables, setAvailableTables] = useState<AvailableTable[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: {
          from: { pathname: "/reservations" },
          message: "Necesitas una cuenta para reservar una mesa.",
        },
      });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    defaultValues: {
      date: "",
      time: "",
      guests: "2",
      name: user?.name || "",
      email: user?.email || "",
      phone: formatDominicanPhoneInput(user?.phone || ""),
      notes: "",
    },
    validators: {
      onChange: ({ value }) => validateWithYup(reservationSchema, value),
      onSubmit: ({ value }) => validateWithYup(reservationSchema, value),
    },
    onSubmitInvalid: () => {
      setSubmissionError("Revisa los campos resaltados antes de continuar.");
      setShowErrors(true);
    },
    onSubmit: async ({ value }) => {
      try {
        setIsSubmitting(true);
        setSubmissionError("");

        const reservation = await createReservation({
          name: value.name,
          email: value.email,
          phone: normalizeDominicanPhone(value.phone),
          date: value.date,
          time: value.time,
          guests: Number(value.guests),
          notes: value.notes,
        });

        navigate("/booking-confirmation", {
          state: {
            booking: {
              ...value,
              reservationId: reservation.id,
              tableNumber: reservation.tableNumber,
            },
          },
        });
      } catch (error) {
        setSubmissionError(
          error instanceof Error
            ? error.message
            : "No se pudo confirmar la reserva.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const validationErrors =
    (validateWithYup(reservationSchema, form.state.values)?.fields as Record<
      string,
      string
    >) || {};

  useEffect(() => {
    const guests = Number(form.state.values.guests || 0);
    if (!isAuthenticated || !Number.isFinite(guests) || guests < 1) {
      setAvailableTables([]);
      return;
    }

    let cancelled = false;

    const loadAvailability = async () => {
      try {
        const response = await apiRequest<ApiEnvelope<any>>(
          `/reservations/availability?guests=${guests}`,
          { auth: true },
        );

        const payload = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];

        if (!cancelled) {
          setAvailableTables(payload as AvailableTable[]);
        }
      } catch {
        if (!cancelled) {
          setAvailableTables([]);
        }
      }
    };

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [form.state.values.guests, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const nextValue =
      name === "phone" ? formatDominicanPhoneInput(value) : value;
    form.setFieldValue(name as never, nextValue as never);
    if (submissionError) {
      setSubmissionError("");
    }
  };

  const nextStep = () => {
    setShowErrors(true);

    const stepFields =
      step === 1
        ? ["date", "time", "guests"]
        : ["name", "phone", "email", "notes"];

    const hasErrors = stepFields.some((field) =>
      Boolean(validationErrors[field]),
    );
    if (hasErrors) {
      setSubmissionError(
        "Completa correctamente los campos requeridos antes de continuar.",
      );
      return;
    }

    setSubmissionError("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: COLORS.white }}
          >
            Reserva tu{" "}
            <span style={{ color: COLORS.primary }}>Experiencia</span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: COLORS.muted }}
          >
            Asegura tu lugar en nuestra mesa y déjanos deleitar tus sentidos.
          </p>
        </div>

        <Card
          className="p-8 md:p-12 overflow-hidden relative"
          style={{
            backgroundColor: COLORS.secondary,
            border: `2px solid ${COLORS.primary}`,
          }}
        >
          {/* Progress Steps */}
          <div className="flex justify-between mb-12 relative z-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all duration-300 ${s <= step ? "scale-110" : "opacity-50"}`}
                  style={{
                    backgroundColor: s <= step ? COLORS.primary : "transparent",
                    color: s <= step ? COLORS.secondary : COLORS.white,
                    border: `2px solid ${s <= step ? COLORS.primary : COLORS.muted}`,
                  }}
                >
                  {s < step ? <CheckCircle size={20} /> : s}
                </div>
                <span
                  className="text-xs uppercase tracking-wider font-medium"
                  style={{ color: s <= step ? COLORS.primary : COLORS.muted }}
                >
                  {s === 1 ? "Detalles" : s === 2 ? "Contacto" : "Confirmar"}
                </span>
              </div>
            ))}
            {/* Progress Bar Background */}
            <div className="absolute top-5 left-0 right-0 h-0.5 -z-10 bg-white/10" />
            {/* Active Progress Bar */}
            <div
              className="absolute top-5 left-0 h-0.5 -z-10 transition-all duration-500 ease-out"
              style={{
                width: `${((step - 1) / 2) * 100}%`,
                backgroundColor: COLORS.primary,
              }}
            />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setShowErrors(true);
              void form.handleSubmit();
            }}
          >
            {/* Step 1: Reservation Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      Fecha
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        style={{ color: COLORS.muted }}
                      />
                      <input
                        type="date"
                        name="date"
                        required
                        value={String(form.state.values.date)}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: COLORS.border,
                          color: COLORS.white,
                          outlineColor: COLORS.primary,
                        }}
                      />
                    </div>
                    {showErrors && validationErrors.date && (
                      <p className="text-xs text-red-400">
                        {validationErrors.date}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      Hora
                    </label>
                    <div className="relative">
                      <Clock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        style={{ color: COLORS.muted }}
                      />
                      <select
                        name="time"
                        required
                        value={String(form.state.values.time)}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all appearance-none"
                        style={reservationSelectStyle}
                      >
                        <option
                          value=""
                          disabled
                          style={{
                            color: "#d6d6d6",
                            backgroundColor: "#2d1f0f",
                          }}
                        >
                          Selecciona una hora
                        </option>
                        <option
                          value="12:00"
                          style={{
                            color: "#ffffff",
                            backgroundColor: "#2d1f0f",
                          }}
                        >
                          12:00 PM
                        </option>
                        <option
                          value="13:00"
                          style={{
                            color: "#ffffff",
                            backgroundColor: "#2d1f0f",
                          }}
                        >
                          01:00 PM
                        </option>
                        <option
                          value="14:00"
                          style={{
                            color: "#ffffff",
                            backgroundColor: "#2d1f0f",
                          }}
                        >
                          02:00 PM
                        </option>
                        <option
                          value="19:00"
                          style={{
                            color: "#ffffff",
                            backgroundColor: "#2d1f0f",
                          }}
                        >
                          07:00 PM
                        </option>
                        <option
                          value="20:00"
                          style={{
                            color: "#ffffff",
                            backgroundColor: "#2d1f0f",
                          }}
                        >
                          08:00 PM
                        </option>
                        <option
                          value="21:00"
                          style={{
                            color: "#ffffff",
                            backgroundColor: "#2d1f0f",
                          }}
                        >
                          09:00 PM
                        </option>
                      </select>
                    </div>
                    {showErrors && validationErrors.time && (
                      <p className="text-xs text-red-400">
                        {validationErrors.time}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      Número de Personas
                    </label>
                    <div className="relative">
                      <Users
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        style={{ color: COLORS.muted }}
                      />
                      <select
                        name="guests"
                        required
                        value={String(form.state.values.guests)}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all appearance-none"
                        style={reservationSelectStyle}
                      >
                        {Array.from(
                          { length: 20 },
                          (_, index) => index + 1,
                        ).map((num) => (
                          <option
                            key={num}
                            value={num}
                            style={{
                              color: "#ffffff",
                              backgroundColor: "#2d1f0f",
                            }}
                          >
                            {num} {num === 1 ? "Persona" : "Personas"}
                          </option>
                        ))}
                      </select>
                    </div>
                    {showErrors && validationErrors.guests && (
                      <p className="text-xs text-red-400">
                        {validationErrors.guests}
                      </p>
                    )}

                    <div className="mt-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs">
                      <p style={{ color: COLORS.muted }}>
                        Mesas disponibles ahora: {availableTables.length}
                      </p>
                      {availableTables.length > 0 && (
                        <p className="text-white mt-1">
                          Ejemplo:{" "}
                          {availableTables
                            .slice(0, 3)
                            .map((table) => `#${table.number}`)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button type="button" onClick={nextStep} size="lg">
                    Siguiente
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        style={{ color: COLORS.muted }}
                      />
                      <input
                        type="text"
                        name="name"
                        required
                        value={String(form.state.values.name)}
                        onChange={handleInputChange}
                        placeholder="Ej. Juan Pérez"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: COLORS.border,
                          color: COLORS.white,
                        }}
                      />
                    </div>
                    {showErrors && validationErrors.name && (
                      <p className="text-xs text-red-400">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        style={{ color: COLORS.muted }}
                      />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={String(form.state.values.phone)}
                        onChange={handleInputChange}
                        placeholder="Ej. +1 (809) 555-0123"
                        autoComplete="tel"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: COLORS.border,
                          color: COLORS.white,
                        }}
                      />
                    </div>
                    {showErrors && validationErrors.phone && (
                      <p className="text-xs text-red-400">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                        style={{ color: COLORS.muted }}
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={String(form.state.values.email)}
                        onChange={handleInputChange}
                        placeholder="Ej. juan@ejemplo.com"
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: COLORS.border,
                          color: COLORS.white,
                        }}
                      />
                    </div>
                    {showErrors && validationErrors.email && (
                      <p className="text-xs text-red-400">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label
                      className="text-sm font-medium"
                      style={{ color: COLORS.primary }}
                    >
                      Notas Especiales (Opcional)
                    </label>
                    <div className="relative">
                      <MessageSquare
                        className="absolute left-3 top-4 w-5 h-5 pointer-events-none"
                        style={{ color: COLORS.muted }}
                      />
                      <textarea
                        name="notes"
                        value={String(form.state.values.notes)}
                        onChange={handleInputChange}
                        placeholder="Ej. Alergias, ocasión especial, preferencia de mesa..."
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          borderColor: COLORS.border,
                          color: COLORS.white,
                        }}
                      />
                    </div>
                    {showErrors && validationErrors.notes && (
                      <p className="text-xs text-red-400">
                        {validationErrors.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    size="lg"
                  >
                    Atrás
                  </Button>
                  <Button type="button" onClick={nextStep} size="lg">
                    Revisar Reserva
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-black/20 rounded-xl p-6 border border-white/10">
                  <h3
                    className="text-xl font-bold mb-4 flex items-center gap-2"
                    style={{ color: COLORS.primary }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Resumen de la Reserva
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm md:text-base">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span style={{ color: COLORS.muted }}>Fecha:</span>
                      <span className="font-medium text-white">
                        {String(form.state.values.date)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span style={{ color: COLORS.muted }}>Hora:</span>
                      <span className="font-medium text-white">
                        {String(form.state.values.time)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span style={{ color: COLORS.muted }}>Personas:</span>
                      <span className="font-medium text-white">
                        {String(form.state.values.guests)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span style={{ color: COLORS.muted }}>Nombre:</span>
                      <span className="font-medium text-white">
                        {String(form.state.values.name)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span style={{ color: COLORS.muted }}>Email:</span>
                      <span className="font-medium text-white">
                        {String(form.state.values.email)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span style={{ color: COLORS.muted }}>Teléfono:</span>
                      <span className="font-medium text-white">
                        {String(form.state.values.phone)}
                      </span>
                    </div>
                    {String(form.state.values.notes) && (
                      <div className="md:col-span-2 pt-2">
                        <span
                          className="block mb-1"
                          style={{ color: COLORS.muted }}
                        >
                          Notas:
                        </span>
                        <p className="text-white italic bg-white/5 p-3 rounded-lg text-sm">
                          {String(form.state.values.notes)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {submissionError && (
                  <p className="text-sm text-red-400">{submissionError}</p>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    size="lg"
                  >
                    Modificar
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="px-8"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Confirmar Reserva"}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reservations;
