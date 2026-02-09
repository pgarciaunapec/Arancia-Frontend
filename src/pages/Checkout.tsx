import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Truck, ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)'
};

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: 'Juan Pérez',
        email: 'juan@demo.com',
        address: 'Calle Demo 123',
        city: 'Santo Domingo',
        zip: '10101',
        card: '**** **** **** 4242',
        exp: '12/26',
        cvv: '123'
    });

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/booking-confirmation', {
                state: {
                    message: 'Pago Exitoso - Pedido #ORD-2026-XJL',
                    type: 'order'
                }
            });
        }, 2000);
    };

    return (
        <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-3xl font-bold mb-2 text-white">Finalizar Compra</h1>
                    <p style={{ color: COLORS.muted }}>Información Segura y Encriptada</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shipping Info */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Truck size={20} style={{ color: COLORS.primary }} />
                            Envío
                        </h3>

                        <Card className="p-6 space-y-4" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text" placeholder="Nombre Completo"
                                    className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                                    style={{ borderColor: COLORS.border }}
                                />
                                <input
                                    type="text" placeholder="Dirección de Envío"
                                    className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                                    style={{ borderColor: COLORS.border }}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text" placeholder="Ciudad"
                                        className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                    <input
                                        type="text" placeholder="Código Postal"
                                        className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                </div>
                            </div>
                        </Card>

                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-8">
                            <CreditCard size={20} style={{ color: COLORS.primary }} />
                            Método de Pago
                        </h3>

                        <Card className="p-6 space-y-4" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-white/10 rounded border border-white/20">
                                    <CreditCard className="text-white" />
                                </div>
                                <div className="p-2 bg-white/5 rounded opacity-50">
                                    <span className="font-bold text-xs text-white">PAYPAL</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                                    <input
                                        type="text" placeholder="Número de Tarjeta"
                                        className="w-full bg-black/20 pl-10 p-3 rounded-lg border focus:ring-2 outline-none text-white font-mono"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text" placeholder="MM/YY"
                                        className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white font-mono text-center"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                    <input
                                        type="text" placeholder="CVC"
                                        className="w-full bg-black/20 p-3 rounded-lg border focus:ring-2 outline-none text-white font-mono text-center"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Create Order Summary */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShieldCheck size={20} style={{ color: COLORS.primary }} />
                            Resumen del Pedido
                        </h3>

                        <Card className="p-6 sticky top-28" style={{ backgroundColor: '#1a1a1a', border: `2px solid ${COLORS.primary}` }}>
                            <div className="space-y-4 mb-6">
                                {[
                                    { name: 'Risotto de Setas', price: 24.00, qty: 1 },
                                    { name: 'Salmón a la Parrilla', price: 32.00, qty: 2 },
                                    { name: 'Tiramisú Clásico', price: 12.00, qty: 1 }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                        <div className="text-white">
                                            <span className="font-bold mr-2 text-white/60">{item.qty}x</span>
                                            {item.name}
                                        </div>
                                        <span className="text-white font-medium">${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex justify-between text-white/60">
                                    <span>Envío</span>
                                    <span style={{ color: COLORS.primary }}>Gratis</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white pt-4 border-t border-white/10">
                                    <span>Total a Pagar</span>
                                    <span style={{ color: COLORS.primary }}>$118.00</span>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full text-base font-bold h-14"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? 'Procesando...' : 'Pagar $118.00'}
                            </Button>

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
