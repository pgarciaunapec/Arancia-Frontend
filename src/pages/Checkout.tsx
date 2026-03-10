import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, MapPin, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import type { DeliveryType, PaymentMethod } from '../types';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)'
};

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, subtotal, tax, total, clearCart } = useCart();
    const { createOrder } = useOrders();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: user?.address || '',
        city: 'Santo Domingo',
        cardNumber: '',
        cardExp: '',
        cardCvv: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        setLoading(true);

        setTimeout(() => {
            const cardLast4 = formData.cardNumber.replace(/\s/g, '').slice(-4) || '0000';
            const order = createOrder({
                userId: user?.id || 'guest',
                items,
                subtotal,
                tax,
                total,
                deliveryType,
                deliveryAddress: deliveryType === 'delivery' ? `${formData.address}, ${formData.city}` : undefined,
                paymentMethod,
                cardLast4: paymentMethod === 'card' ? cardLast4 : undefined,
            });

            clearCart();
            setLoading(false);
            navigate('/booking-confirmation', {
                state: {
                    message: `Pedido Confirmado - ${order.id}`,
                    type: 'order',
                    orderId: order.id,
                    order,
                }
            });
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Tu carrito está vacío</h2>
                    <Button onClick={() => navigate('/menu')}>Ir al Menú</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
            <div className="max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2 text-white">Finalizar Compra</h1>
                    <p style={{ color: COLORS.muted }} className="flex items-center justify-center gap-2">
                        <ShieldCheck size={16} /> Información Segura y Encriptada
                    </p>
                </motion.div>

                <form onSubmit={handlePayment}>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left – Form */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Delivery Type */}
                            <Card className="p-6" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                                <h3 className="text-lg font-bold text-white mb-4">Tipo de Entrega</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {([
                                        { value: 'delivery', label: 'Delivery', icon: <Truck size={20} /> },
                                        { value: 'pickup', label: 'Recogida', icon: <Package size={20} /> },
                                        { value: 'dine-in', label: 'En Mesa', icon: <MapPin size={20} /> },
                                    ] as { value: DeliveryType; label: string; icon: React.ReactNode }[]).map(opt => (
                                        <button
                                            key={opt.value} type="button"
                                            onClick={() => setDeliveryType(opt.value)}
                                            className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all"
                                            style={{
                                                borderColor: deliveryType === opt.value ? COLORS.primary : 'transparent',
                                                backgroundColor: deliveryType === opt.value ? 'rgba(245,180,0,0.1)' : 'rgba(0,0,0,0.2)',
                                                color: deliveryType === opt.value ? COLORS.primary : COLORS.muted,
                                            }}
                                        >
                                            {opt.icon}
                                            <span className="text-xs font-medium">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </Card>

                            {/* Shipping Info */}
                            {deliveryType === 'delivery' && (
                                <Card className="p-6 space-y-4" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Truck size={18} style={{ color: COLORS.primary }} /> Dirección de Envío
                                    </h3>
                                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre Completo" required
                                        className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none" style={{ borderColor: COLORS.border }} />
                                    <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección de Envío" required
                                        className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none" style={{ borderColor: COLORS.border }} />
                                    <input name="city" value={formData.city} onChange={handleChange} placeholder="Ciudad"
                                        className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none" style={{ borderColor: COLORS.border }} />
                                    <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Correo (para confirmar)" required
                                        className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none" style={{ borderColor: COLORS.border }} />
                                </Card>
                            )}

                            {/* Payment Method */}
                            <Card className="p-6 space-y-4" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <CreditCard size={18} style={{ color: COLORS.primary }} /> Método de Pago
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {([
                                        { value: 'card', label: 'Tarjeta' },
                                        { value: 'cash', label: 'Efectivo' },
                                        { value: 'transfer', label: 'Transferencia' },
                                    ] as { value: PaymentMethod; label: string }[]).map(opt => (
                                        <button key={opt.value} type="button"
                                            onClick={() => setPaymentMethod(opt.value)}
                                            className="py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all"
                                            style={{
                                                borderColor: paymentMethod === opt.value ? COLORS.primary : 'transparent',
                                                backgroundColor: paymentMethod === opt.value ? 'rgba(245,180,0,0.1)' : 'rgba(0,0,0,0.2)',
                                                color: paymentMethod === opt.value ? COLORS.primary : COLORS.muted,
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="space-y-3 mt-2">
                                        <input name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                                            placeholder="Número de Tarjeta (1234 5678 9012 3456)" required
                                            className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none" style={{ borderColor: COLORS.border }} />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input name="cardExp" value={formData.cardExp} onChange={handleChange}
                                                placeholder="MM/AA" required
                                                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none" style={{ borderColor: COLORS.border }} />
                                            <input name="cardCvv" value={formData.cardCvv} onChange={handleChange}
                                                placeholder="CVV" required
                                                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none" style={{ borderColor: COLORS.border }} />
                                        </div>
                                    </div>
                                )}
                                {paymentMethod === 'transfer' && (
                                    <div className="bg-black/20 rounded-lg p-4 text-sm space-y-1" style={{ color: COLORS.muted }}>
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
                            <Card className="p-6 sticky top-28" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                                <h3 className="text-xl font-bold text-white mb-4 pb-4 border-b border-white/10">Resumen</h3>
                                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span style={{ color: COLORS.muted }}>{item.name} x{item.quantity}</span>
                                            <span className="text-white">RD${(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2 border-t border-white/10 pt-4 mb-6">
                                    <div className="flex justify-between text-sm" style={{ color: COLORS.muted }}>
                                        <span>Subtotal</span><span className="text-white">RD${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm" style={{ color: COLORS.muted }}>
                                        <span>ITBIS (18%)</span><span className="text-white">RD${tax.toFixed(0)}</span>
                                    </div>
                                    {deliveryType === 'delivery' && (
                                        <div className="flex justify-between text-sm text-green-400">
                                            <span>Envío</span><span>GRATIS</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-2 mt-2">
                                        <span className="text-white">Total</span>
                                        <span style={{ color: COLORS.primary }}>RD${total.toFixed(0)}</span>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Procesando...
                                        </div>
                                    ) : `Pagar RD$${total.toFixed(0)}`}
                                </Button>

                                <div className="flex items-center justify-center gap-2 mt-4 text-xs" style={{ color: COLORS.muted }}>
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
