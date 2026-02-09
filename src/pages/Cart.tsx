import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart, useAuth } from '../contexts';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { getImageUrl } from '../services/api';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)'
};

const Cart: React.FC = () => {
    const { items, subtotal, tax, total, isLoading, updateQuantity, removeItem } = useCart();
    const { isAuthenticated } = useAuth();

    const handleUpdateQuantity = async (menuItemId: string, currentQuantity: number, change: number) => {
        const newQuantity = Math.max(1, currentQuantity + change);
        await updateQuantity(menuItemId, newQuantity);
    };

    const handleRemoveItem = async (menuItemId: string) => {
        await removeItem(menuItemId);
    };

    if (isLoading) {
        return (
            <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8" style={{ color: COLORS.primary }} />
                        Tu Pedido
                    </h1>
                    <p style={{ color: COLORS.muted }}>Revisa tus platos seleccionados antes de confirmar.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.length === 0 ? (
                            <Card className="p-12 text-center border-dashed" style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: COLORS.border }}>
                                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: COLORS.white }} />
                                <h3 className="text-xl font-medium text-white mb-4">Tu carrito está vacío</h3>
                                <Button asChild>
                                    <Link to="/menu">Explorar Menú</Link>
                                </Button>
                            </Card>
                        ) : (
                            items.map((item) => (
                                <motion.div layout key={item.menuItem}>
                                    <Card className="p-4 flex gap-4 items-center" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                                        <div className="w-24 h-24 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ShoppingBag className="w-8 h-8 opacity-30" style={{ color: COLORS.white }} />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                                            <p className="text-sm font-medium" style={{ color: COLORS.primary }}>RD${item.price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.menuItem, item.quantity, -1)}
                                                className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-bold text-white w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.menuItem, item.quantity, 1)}
                                                className="p-2 hover:bg-white/10 rounded-md transition-colors text-white"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleRemoveItem(item.menuItem)}
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

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-28" style={{ backgroundColor: '#1a1a1a', border: `2px solid ${COLORS.primary}` }}>
                            <h3 className="text-xl font-bold mb-6 text-white pb-4 border-b border-white/10">Resumen</h3>

                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between text-white/80">
                                    <span>Subtotal</span>
                                    <span>RD${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/80">
                                    <span>Impuestos (18%)</span>
                                    <span>RD${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-white/10">
                                    <span>Total</span>
                                    <span style={{ color: COLORS.primary }}>RD${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {!isAuthenticated && items.length > 0 && (
                                <p className="text-xs text-amber-400 mb-4 text-center">
                                    Debes iniciar sesión para completar tu pedido
                                </p>
                            )}

                            <Button
                                size="lg"
                                className="w-full text-base"
                                asChild
                                disabled={items.length === 0 || !isAuthenticated}
                            >
                                <Link to={isAuthenticated ? "/checkout" : "/login"}>
                                    {isAuthenticated ? 'Proceder al Pago' : 'Iniciar Sesión'}
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>

                            <p className="text-xs text-center mt-4 opacity-50 text-white">
                                Pagos seguros encriptados SSL
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
