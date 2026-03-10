import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  Banknote,
  ArrowRightLeft,
  Package,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { orderApi, paymentApi } from "../services/api";
import { toast } from "sonner";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

type PaymentMethod = "cash" | "card" | "transfer";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [isDelivery, setIsDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [shippingData, setShippingData] = useState({
    name: user?.name || "",
    address: user?.address || "",
    city: "",
    zip: "",
  });
  const [cardNumber, setCardNumber] = useState("");
  const [transferRef, setTransferRef] = useState("");

  if (items.length === 0) {
    return (
      <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto mb-4 text-white/30" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Tu carrito está vacío
          </h2>
          <p style={{ color: COLORS.muted }} className="mb-6">
            Agrega items del menú para continuar
          </p>
          <Button onClick={() => navigate("/menu")}>Ver Menú</Button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (
      isDelivery &&
      (!shippingData.name ||
        !shippingData.address ||
        !shippingData.city ||
        !shippingData.zip)
    ) {
      toast.error("Completa la dirección de envío");
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order
      const orderRes = await orderApi.create({
        shippingAddress: shippingData,
        isDelivery,
      });

      if (!orderRes.data) throw new Error("No se pudo crear el pedido");
      const orderId = orderRes.data._id;

      // 2. Process payment
      const paymentData: Parameters<typeof paymentApi.process>[0] = {
        orderId,
        method: paymentMethod,
      };
      if (paymentMethod === "card" && cardNumber) {
        paymentData.cardNumber = cardNumber.replace(/\s/g, "");
      }
      if (paymentMethod === "transfer" && transferRef) {
        paymentData.transferReference = transferRef;
      }

      await paymentApi.process(paymentData);

      // 3. Clear cart
      await clearCart();

      toast.success("¡Pedido realizado exitosamente!");

      if (isDelivery) {
        navigate(`/delivery/${orderId}`);
      } else {
        navigate("/booking-confirmation", {
          state: {
            message: `Pago Exitoso — Pedido #${orderRes.data.orderNumber || orderId.slice(-8).toUpperCase()}`,
            type: "order",
          },
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al procesar el pago";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2 text-white">
            Finalizar Compra
          </h1>
          <p style={{ color: COLORS.muted }}>Información Segura y Encriptada</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Delivery Toggle */}
            <Card
              className="p-4"
              style={{
                backgroundColor: COLORS.secondary,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDelivery}
                  onChange={(e) => setIsDelivery(e.target.checked)}
                  className="w-5 h-5 accent-[#f5b400]"
                />
                <Truck size={20} style={{ color: COLORS.primary }} />
                <span className="text-white font-medium">
                  Quiero delivery a domicilio
                </span>
              </label>
            </Card>

            {/* Shipping Form */}
            {isDelivery && step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <Truck size={20} style={{ color: COLORS.primary }} />
                  Dirección de Envío
                </h3>
                <Card
                  className="p-6 space-y-4"
                  style={{
                    backgroundColor: COLORS.secondary,
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <input
                    type="text"
                    placeholder="Nombre Completo"
                    value={shippingData.name}
                    onChange={(e) =>
                      setShippingData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                    style={{ borderColor: COLORS.border }}
                  />
                  <input
                    type="text"
                    placeholder="Dirección de Envío"
                    value={shippingData.address}
                    onChange={(e) =>
                      setShippingData((p) => ({
                        ...p,
                        address: e.target.value,
                      }))
                    }
                    className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                    style={{ borderColor: COLORS.border }}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={shippingData.city}
                      onChange={(e) =>
                        setShippingData((p) => ({ ...p, city: e.target.value }))
                      }
                      className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                      style={{ borderColor: COLORS.border }}
                    />
                    <input
                      type="text"
                      placeholder="Código Postal"
                      value={shippingData.zip}
                      onChange={(e) =>
                        setShippingData((p) => ({ ...p, zip: e.target.value }))
                      }
                      className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                      style={{ borderColor: COLORS.border }}
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Payment Method Selection */}
            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <CreditCard size={20} style={{ color: COLORS.primary }} />
                  Método de Pago
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    {
                      key: "cash" as PaymentMethod,
                      icon: Banknote,
                      label: "Efectivo",
                    },
                    {
                      key: "card" as PaymentMethod,
                      icon: CreditCard,
                      label: "Tarjeta",
                    },
                    {
                      key: "transfer" as PaymentMethod,
                      icon: ArrowRightLeft,
                      label: "Transferencia",
                    },
                  ].map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setPaymentMethod(key)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === key ? "border-[#f5b400] bg-[#f5b400]/10" : "border-white/10 bg-black/20 hover:border-white/30"}`}
                    >
                      <Icon
                        size={24}
                        className={
                          paymentMethod === key
                            ? "text-[#f5b400]"
                            : "text-white/60"
                        }
                      />
                      <span
                        className={`text-sm font-medium ${paymentMethod === key ? "text-[#f5b400]" : "text-white/60"}`}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <Card
                    className="p-6 space-y-4"
                    style={{
                      backgroundColor: COLORS.secondary,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Número de Tarjeta"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                        className="w-full bg-black/20 pl-10 p-3 rounded-lg border focus:ring-2 outline-none text-white font-mono"
                        style={{ borderColor: COLORS.border }}
                      />
                    </div>
                  </Card>
                )}

                {paymentMethod === "transfer" && (
                  <Card
                    className="p-6 space-y-4"
                    style={{
                      backgroundColor: COLORS.secondary,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <p className="text-sm text-white/60 mb-2">
                      Realiza la transferencia a:{" "}
                      <span className="font-bold text-[#f5b400]">
                        Banco Arancia — Cuenta 0000-1234-5678
                      </span>
                    </p>
                    <input
                      type="text"
                      placeholder="Referencia de Transferencia"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                      style={{ borderColor: COLORS.border }}
                    />
                  </Card>
                )}
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck size={20} style={{ color: COLORS.primary }} />
              Resumen del Pedido
            </h3>

            <Card
              className="p-6 sticky top-28"
              style={{
                backgroundColor: "#1a1a1a",
                border: `2px solid ${COLORS.primary}`,
              }}
            >
              <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm border-b border-white/5 pb-2"
                  >
                    <div className="text-white">
                      <span className="font-bold mr-2 text-white/60">
                        {item.quantity}x
                      </span>
                      {item.name}
                    </div>
                    <span className="text-white font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>IVA (18%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {isDelivery && (
                  <div className="flex justify-between text-white/60">
                    <span>Envío</span>
                    <span style={{ color: COLORS.primary }}>Gratis</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-white/10">
                  <span>Total a Pagar</span>
                  <span style={{ color: COLORS.primary }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {step === "shipping" ? (
                <Button
                  size="lg"
                  className="w-full text-base font-bold h-14"
                  onClick={handlePlaceOrder}
                >
                  {isDelivery ? "Continuar al Pago" : "Ir al Pago"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full text-base font-bold h-14"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("shipping")}
                    disabled={loading}
                  >
                    Volver
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-white/40">
                <Lock size={12} />
                Transacción Segura 256-bit SSL
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
