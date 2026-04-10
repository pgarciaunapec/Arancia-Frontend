import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
            <ShoppingBag
              className="w-8 h-8"
              style={{ color: COLORS.primary }}
            />
            Tu Pedido
            {count > 0 && (
              <span
                className="text-lg font-normal px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: COLORS.primary,
                  color: COLORS.secondary,
                }}
              >
                {count} {count === 1 ? "artículo" : "artículos"}
              </span>
            )}
          </h1>
          <p style={{ color: COLORS.muted }}>
            Revisa tus platos seleccionados antes de confirmar.
          </p>
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
              items.map((item) => (
                <motion.div layout key={item.id}>
                  <Card
                    className="p-4 flex gap-4 items-center"
                    style={{
                      backgroundColor: COLORS.secondary,
                      border: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-white/40 mb-1">
                        {item.category}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: COLORS.primary }}
                      >
                        RD${item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="font-bold text-white">
                        RD${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-3 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors ml-2"
                      style={{ color: COLORS.muted }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </Card>
                </motion.div>
              ))
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
                    <span className="text-white">
                      RD${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: COLORS.muted }}
                  >
                    <span>ITBIS (18%)</span>
                    <span className="text-white">RD${tax.toFixed(0)}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-white">Total</span>
                    <span style={{ color: COLORS.primary }}>
                      RD${total.toFixed(0)}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceder al Pago <ArrowRight size={18} />
                </Button>
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
