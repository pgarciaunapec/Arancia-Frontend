import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Clock3,
  ShieldCheck,
  Truck,
  ReceiptText,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { formatCurrencyDOP } from "../lib/currency";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.3)",
};

const Cart: React.FC = () => {
  const { items, count, subtotal, tax, total, updateQuantity, removeItem } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const freeDeliveryThreshold = 2000;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <ShoppingBag
                className="w-8 h-8"
                style={{ color: COLORS.primary }}
              />
              Tu Pedido
            </h1>

            {count > 0 && (
              <span
                className="text-sm font-semibold px-3 py-2 rounded-full"
                style={{
                  backgroundColor: COLORS.primary,
                  color: COLORS.secondary,
                }}
              >
                {count} {count === 1 ? "artículo" : "artículos"}
              </span>
            )}
          </div>

          <p style={{ color: COLORS.muted }}>
            Revisa, ajusta cantidades y confirma con un desglose transparente antes de pagar.
          </p>

          {items.length > 0 && (
            <Card
              className="p-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <Truck size={16} style={{ color: COLORS.primary }} />
                    Beneficio de envío
                  </p>
                  {amountForFreeDelivery > 0 ? (
                    <p className="text-sm" style={{ color: COLORS.muted }}>
                      Te faltan {formatCurrencyDOP(amountForFreeDelivery)} para envío gratis.
                    </p>
                  ) : (
                    <p className="text-sm text-green-400">¡Ya desbloqueaste envío gratis!</p>
                  )}
                </div>
                <p className="text-xs" style={{ color: COLORS.muted }}>
                  Meta: {formatCurrencyDOP(freeDeliveryThreshold)}
                </p>
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${freeDeliveryProgress}%`,
                    background: "linear-gradient(90deg, #f5b400 0%, #ff8c6b 100%)",
                  }}
                />
              </div>
            </Card>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <Card
                className="p-12 text-center border-dashed"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  borderColor: COLORS.border,
                }}
              >
                <ShoppingBag
                  className="w-16 h-16 mx-auto mb-4 opacity-20"
                  style={{ color: COLORS.white }}
                />
                <h3 className="text-xl font-medium text-white mb-4">
                  Tu carrito está vacío
                </h3>
                <Button asChild>
                  <Link to="/menu">Explorar Menú</Link>
                </Button>
              </Card>
            ) : (
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <Card
                      className="p-4 sm:p-5"
                      style={{
                        backgroundColor: COLORS.secondary,
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full sm:w-28 h-36 sm:h-28 rounded-xl object-cover"
                        />

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="font-bold text-lg text-white leading-tight">
                                {item.name}
                              </h3>
                              <p className="text-xs text-white/50 mt-1">
                                {item.category}
                              </p>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                              style={{ color: COLORS.muted }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {item.description && (
                            <p className="text-sm text-white/70 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-1.5">
                            {(item.ingredients || []).slice(0, 4).map((ingredient) => (
                              <span
                                key={`${item.id}-${ingredient}`}
                                className="text-[11px] px-2 py-1 rounded-full border border-white/20 text-white/75"
                              >
                                {ingredient}
                              </span>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: COLORS.primary }}
                            >
                              {formatCurrencyDOP(item.price)} c/u
                            </p>

                            <div className="flex items-center gap-3 bg-black/20 rounded-xl p-1.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-bold text-white w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <p className="font-bold text-white text-lg">
                              {formatCurrencyDOP(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {items.length > 0 && (
            <div className="lg:col-span-1">
              <Card
                className="p-6 sticky top-28"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10">
                  Resumen del Pedido
                </h3>
                <div className="space-y-3 mb-6">
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: COLORS.muted }}
                  >
                    <span>Subtotal ({count} items)</span>
                    <span className="text-white">{formatCurrencyDOP(subtotal)}</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: COLORS.muted }}
                  >
                    <span>ITBIS (18%)</span>
                    <span className="text-white">{formatCurrencyDOP(tax)}</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: COLORS.muted }}
                  >
                    <span>Cargo de servicio</span>
                    <span className="text-green-400">Incluido</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: COLORS.muted }}
                  >
                    <span>Envío estimado</span>
                    <span className="text-white">35 min</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div
                    className="rounded-xl p-3"
                    style={{
                      backgroundColor: "rgba(245, 180, 0, 0.12)",
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <p className="text-xs uppercase tracking-wide" style={{ color: COLORS.muted }}>
                      Total a pagar
                    </p>
                    <div className="mt-1 flex justify-between items-end font-bold">
                      <span className="text-white text-base">Total</span>
                      <span className="text-2xl" style={{ color: COLORS.primary }}>
                        {formatCurrencyDOP(total)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceder al Pago <ArrowRight size={18} />
                </Button>

                <div className="mt-4 space-y-2 text-xs" style={{ color: COLORS.muted }}>
                  <p className="flex items-center gap-2">
                    <ShieldCheck size={14} /> Pago cifrado y seguro.
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 size={14} /> Confirmación inmediata al procesar.
                  </p>
                  <p className="flex items-center gap-2">
                    <ReceiptText size={14} /> Recibirás comprobante de la orden.
                  </p>
                </div>

                <Link
                  to="/menu"
                  className="block text-center mt-4 text-sm hover:underline"
                  style={{ color: COLORS.muted }}
                >
                  + Agregar más items
                </Link>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
