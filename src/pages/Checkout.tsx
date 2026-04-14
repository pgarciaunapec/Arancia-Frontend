import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useForm } from "@tanstack/react-form";
import { CreditCard, Truck, ShieldCheck, MapPin, Package } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import type { DeliveryType } from "../types";
import { checkoutSchema } from "../schemas/forms.schema";
import { validateWithYup } from "../lib/forms/yupTanstack";
import { registerSuccessfulCheckout } from "../store/checkoutStore";
import { formatCurrencyDOP } from "../lib/currency";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

type PaymentMethod = "cash" | "card" | "transfer";

const normalizeCardNumber = (value: string) => value.replace(/\s/g, "").trim();

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, clearCart, refreshCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const validateCheckoutByMode = (values: {
    name: string;
    email: string;
    address: string;
    city: string;
    cardNumber: string;
    cardExp: string;
    cardCvv: string;
  }) => {
    const validation = validateWithYup(checkoutSchema, values);
    const fields = { ...(validation?.fields || {}) } as Record<string, string>;

    if (deliveryType !== "delivery") {
      delete fields.address;
      delete fields.city;
      delete fields.name;
      delete fields.email;
    }

    if (paymentMethod !== "card") {
      delete fields.cardNumber;
      delete fields.cardExp;
      delete fields.cardCvv;
    } else {
      const normalizedCard = normalizeCardNumber(values.cardNumber);
      if (!normalizedCard) {
        fields.cardNumber = "El número de tarjeta es obligatorio.";
      } else if (normalizedCard.length < 13 || normalizedCard.length > 19) {
        fields.cardNumber =
          "El número de tarjeta debe tener entre 13 y 19 dígitos.";
      }

      if (!values.cardExp.trim()) {
        fields.cardExp = "La fecha de expiración es obligatoria.";
      } else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(values.cardExp.trim())) {
        fields.cardExp = "La fecha debe tener formato MM/AA.";
      }

      if (!values.cardCvv.trim()) {
        fields.cardCvv = "El CVV es obligatorio.";
      } else if (!/^[0-9]{3,4}$/.test(values.cardCvv.trim())) {
        fields.cardCvv = "El CVV debe tener 3 o 4 dígitos.";
      }
    }

    if (Object.keys(fields).length === 0) {
      return undefined;
    }

    return {
      fields,
      form: "Hay datos de pago o envío por corregir.",
    };
  };

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "Calle Principal 123",
      city: "Santo Domingo",
      cardNumber: "4532123456789010",
      cardExp: "12/25",
      cardCvv: "123",
    },
    onSubmit: async ({ value }) => {
      const validation = validateCheckoutByMode(value);
      if (validation) {
        setSubmitError(
          validation.form || "Hay datos por corregir antes de pagar.",
        );
        return;
      }

      setSubmitError("");
      await submitPayment(value);
    },
  });

  const submitPayment = async (values: {
    name: string;
    email: string;
    address: string;
    city: string;
    cardNumber: string;
    cardExp: string;
    cardCvv: string;
  }) => {
    if (items.length === 0) return;
    setLoading(true);

    try {
      const cleanCardNumber = normalizeCardNumber(values.cardNumber);
      const cardLast4 = cleanCardNumber.slice(-4) || "0000";
      const order = await createOrder({
        userId: user?.id || "guest",
        items,
        subtotal,
        tax,
        total,
        deliveryType,
        contactName: values.name,
        contactEmail: values.email,
        deliveryAddress:
          deliveryType === "delivery"
            ? `${values.address}, ${values.city}`
            : undefined,
        paymentMethod,
        cardLast4: paymentMethod === "card" ? cardLast4 : undefined,
        cardNumber: paymentMethod === "card" ? cleanCardNumber : undefined,
      });

      clearCart();
      refreshCart().catch(() => undefined);
      registerSuccessfulCheckout(order.id);
      setLoading(false);
      navigate(`/track/${order.id}`, {
        state: {
          fromCheckout: true,
          order,
        },
        replace: true,
      });
    } catch {
      setLoading(false);
      navigate("/booking-confirmation", {
        state: {
          message: "No se pudo completar el pago. Intenta de nuevo.",
          type: "error",
        },
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Tu carrito está vacío
          </h2>
          <Button onClick={() => navigate("/menu")}>Ir al Menú</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2 text-white">
            Finalizar Compra
          </h1>
          <p
            style={{ color: COLORS.muted }}
            className="flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} /> Información Segura y Encriptada
          </p>
        </motion.div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left – Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Delivery Type */}
              <Card
                className="p-6"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  Tipo de Entrega
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      {
                        value: "delivery",
                        label: "Delivery",
                        icon: <Truck size={20} />,
                      },
                      {
                        value: "pickup",
                        label: "Recogida",
                        icon: <Package size={20} />,
                      },
                      {
                        value: "dine-in",
                        label: "En Mesa",
                        icon: <MapPin size={20} />,
                      },
                    ] as {
                      value: DeliveryType;
                      label: string;
                      icon: React.ReactNode;
                    }[]
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSubmitError("");
                        setDeliveryType(opt.value);
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all"
                      style={{
                        borderColor:
                          deliveryType === opt.value
                            ? COLORS.primary
                            : "transparent",
                        backgroundColor:
                          deliveryType === opt.value
                            ? "rgba(245,180,0,0.1)"
                            : "rgba(0,0,0,0.2)",
                        color:
                          deliveryType === opt.value
                            ? COLORS.primary
                            : COLORS.muted,
                      }}
                    >
                      {opt.icon}
                      <span className="text-xs font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Shipping Info */}
              {deliveryType === "delivery" && (
                <Card
                  className="p-6 space-y-4"
                  style={{
                    backgroundColor: COLORS.secondary,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Truck size={18} style={{ color: COLORS.primary }} />{" "}
                    Dirección de Envío
                  </h3>
                  <input
                    name="name"
                    value={String(form.state.values.name)}
                    onChange={(event) =>
                      form.setFieldValue("name", event.target.value)
                    }
                    placeholder="Nombre Completo"
                    className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                    style={{ borderColor: COLORS.border }}
                  />
                  <input
                    name="address"
                    value={String(form.state.values.address)}
                    onChange={(event) =>
                      form.setFieldValue("address", event.target.value)
                    }
                    placeholder="Dirección de Envío"
                    disabled
                    className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none opacity-75 cursor-not-allowed"
                    style={{ borderColor: COLORS.border }}
                  />
                  <input
                    name="city"
                    value={String(form.state.values.city)}
                    onChange={(event) =>
                      form.setFieldValue("city", event.target.value)
                    }
                    placeholder="Ciudad"
                    disabled
                    className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none opacity-75 cursor-not-allowed"
                    style={{ borderColor: COLORS.border }}
                  />
                  <input
                    name="email"
                    value={String(form.state.values.email)}
                    onChange={(event) =>
                      form.setFieldValue("email", event.target.value)
                    }
                    type="email"
                    placeholder="Correo (para confirmar)"
                    className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                    style={{ borderColor: COLORS.border }}
                  />
                </Card>
              )}

              {/* Payment Method */}
              <Card
                className="p-6 space-y-4"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard size={18} style={{ color: COLORS.primary }} />{" "}
                  Método de Pago
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { value: "card", label: "Tarjeta" },
                      { value: "cash", label: "Efectivo" },
                      { value: "transfer", label: "Transferencia" },
                    ] as { value: PaymentMethod; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSubmitError("");
                        setPaymentMethod(opt.value);
                      }}
                      className="py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all"
                      style={{
                        borderColor:
                          paymentMethod === opt.value
                            ? COLORS.primary
                            : "transparent",
                        backgroundColor:
                          paymentMethod === opt.value
                            ? "rgba(245,180,0,0.1)"
                            : "rgba(0,0,0,0.2)",
                        color:
                          paymentMethod === opt.value
                            ? COLORS.primary
                            : COLORS.muted,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-3 mt-2">
                    <input
                      name="cardNumber"
                      value={String(form.state.values.cardNumber)}
                      onChange={(event) =>
                        form.setFieldValue("cardNumber", event.target.value)
                      }
                      placeholder="Número de Tarjeta (1234 5678 9012 3456)"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      disabled
                      className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none opacity-75 cursor-not-allowed"
                      style={{ borderColor: COLORS.border }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        name="cardExp"
                        value={String(form.state.values.cardExp)}
                        onChange={(event) =>
                          form.setFieldValue("cardExp", event.target.value)
                        }
                        placeholder="MM/AA"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        disabled
                        className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none opacity-75 cursor-not-allowed"
                        style={{ borderColor: COLORS.border }}
                      />
                      <input
                        name="cardCvv"
                        value={String(form.state.values.cardCvv)}
                        onChange={(event) =>
                          form.setFieldValue("cardCvv", event.target.value)
                        }
                        placeholder="CVV"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        disabled
                        className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none opacity-75 cursor-not-allowed"
                        style={{ borderColor: COLORS.border }}
                      />
                    </div>
                  </div>
                )}
                {paymentMethod === "transfer" && (
                  <div
                    className="bg-black/20 rounded-lg p-4 text-sm space-y-1"
                    style={{ color: COLORS.muted }}
                  >
                    <p className="font-medium text-white">Datos Bancarios:</p>
                    <p>Banco Popular Dominicano</p>
                    <p>Cuenta: 123-456789-0</p>
                    <p>A nombre de: Restaurante El Sabor</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Right – Summary */}
            <div className="lg:col-span-2">
              <Card
                className="p-6 sticky top-28"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <h3 className="text-xl font-bold text-white mb-4 pb-4 border-b border-white/10">
                  Resumen
                </h3>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span style={{ color: COLORS.muted }}>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-white">
                        {formatCurrencyDOP(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-white/10 pt-4 mb-6">
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: COLORS.muted }}
                  >
                    <span>Subtotal</span>
                    <span className="text-white">
                      {formatCurrencyDOP(subtotal)}
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: COLORS.muted }}
                  >
                    <span>ITBIS (18%)</span>
                    <span className="text-white">{formatCurrencyDOP(tax)}</span>
                  </div>
                  {deliveryType === "delivery" && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Envío</span>
                      <span>GRATIS</span>
                    </div>
                  )}
                  <div
                    className="mt-2 rounded-xl p-3"
                    style={{
                      backgroundColor: "rgba(245, 180, 0, 0.12)",
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <p
                      className="text-xs uppercase tracking-wide"
                      style={{ color: COLORS.muted }}
                    >
                      Total a pagar
                    </p>
                    <div className="mt-1 flex justify-between items-end font-bold">
                      <span className="text-white text-base">Total</span>
                      <span
                        className="text-2xl"
                        style={{ color: COLORS.primary }}
                      >
                        {formatCurrencyDOP(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </div>
                  ) : (
                    `Pagar ${formatCurrencyDOP(total)}`
                  )}
                </Button>

                {submitError && (
                  <p className="mt-3 text-sm text-red-300 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2">
                    {submitError}
                  </p>
                )}

                <div
                  className="flex items-center justify-center gap-2 mt-4 text-xs"
                  style={{ color: COLORS.muted }}
                >
                  <ShieldCheck size={14} />
                  Pago 100% seguro
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
