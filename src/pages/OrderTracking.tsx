import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Clock, ChefHat, Package, Truck, Home, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useOrders } from '../context/OrdersContext';
import type { OrderStatus } from '../types';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)'
};

const trackingSteps: { status: OrderStatus; label: string; sublabel: string; icon: React.ReactNode }[] = [
    { status: 'confirmed',  label: 'Pedido Confirmado',   sublabel: 'Tu pedido fue recibido',       icon: <CheckCircle size={22} /> },
    { status: 'preparing',  label: 'Preparando',          sublabel: 'Nuestro chef está cocinando',   icon: <ChefHat size={22} /> },
    { status: 'ready',      label: 'Listo',               sublabel: 'Tu pedido está listo',          icon: <Package size={22} /> },
    { status: 'delivering', label: 'En Camino',           sublabel: 'El repartidor está en ruta',    icon: <Truck size={22} /> },
    { status: 'delivered',  label: 'Entregado',           sublabel: '¡Buen provecho!',               icon: <Home size={22} /> },
];

const statusOrder: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'delivering', 'delivered'];

const OrderTracking: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { getOrderById, updateOrderStatus } = useOrders();
    const order = orderId ? getOrderById(orderId) : undefined;

    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!order || order.status === 'delivered' || order.status === 'cancelled') return;
        const interval = setInterval(() => {
            setElapsed(e => {
                const newElapsed = e + 1;
                // Simulate automatic order progression
                if (newElapsed === 10 && order.status === 'confirmed') updateOrderStatus(orderId!, 'preparing');
                if (newElapsed === 25 && order.status === 'preparing') updateOrderStatus(orderId!, 'ready');
                if (newElapsed === 35 && order.status === 'ready' && order.deliveryType === 'delivery') updateOrderStatus(orderId!, 'delivering');
                if (newElapsed === 60) updateOrderStatus(orderId!, 'delivered');
                return newElapsed;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [order?.status, orderId, updateOrderStatus]);

    if (!order) {
        return (
            <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Pedido no encontrado</h2>
                    <Button onClick={() => navigate('/my-orders')}>Mis Pedidos</Button>
                </div>
            </div>
        );
    }

    const currentIndex = statusOrder.indexOf(order.status as OrderStatus);
    const estimatedRemaining = order.estimatedMinutes ? Math.max(0, order.estimatedMinutes - Math.floor(elapsed / 60)) : null;

    return (
        <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <button onClick={() => navigate('/my-orders')} className="flex items-center gap-2 mb-6 text-sm hover:underline" style={{ color: COLORS.muted }}>
                        <ArrowLeft size={16} /> Mis Pedidos
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Rastrear Pedido</h1>
                        <p className="text-sm font-mono" style={{ color: COLORS.primary }}>#{order.id}</p>
                        {order.deliveryAddress && (
                            <p className="flex items-center justify-center gap-1 mt-2 text-sm" style={{ color: COLORS.muted }}>
                                <MapPin size={14} /> {order.deliveryAddress}
                            </p>
                        )}
                    </div>

                    {/* ETA Card */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && estimatedRemaining !== null && (
                        <Card className="p-6 text-center mb-8" style={{ backgroundColor: 'rgba(245,180,0,0.1)', border: `1px solid ${COLORS.primary}` }}>
                            <Clock className="mx-auto mb-2" style={{ color: COLORS.primary }} />
                            <p className="text-4xl font-bold text-white mb-1">{estimatedRemaining} min</p>
                            <p className="text-sm" style={{ color: COLORS.muted }}>Tiempo estimado de entrega</p>
                        </Card>
                    )}

                    {order.status === 'delivered' && (
                        <Card className="p-6 text-center mb-8" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.4)' }}>
                            <CheckCircle className="mx-auto mb-2 text-green-400" size={32} />
                            <p className="text-2xl font-bold text-white mb-1">¡Pedido Entregado!</p>
                            <p className="text-sm text-green-400">Esperamos que disfrutes tu comida 🎉</p>
                        </Card>
                    )}

                    {/* Steps */}
                    <Card className="p-6" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                        <div className="space-y-0">
                            {trackingSteps.map((step, idx) => {
                                const isCompleted = currentIndex >= idx;
                                const isActive = currentIndex === idx;
                                return (
                                    <div key={step.status} className="flex gap-4">
                                        {/* Line */}
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? '' : 'opacity-30'}`}
                                                style={{ backgroundColor: isCompleted ? COLORS.primary : 'rgba(255,255,255,0.1)', color: isCompleted ? COLORS.secondary : COLORS.muted }}>
                                                {step.icon}
                                            </div>
                                            {idx < trackingSteps.length - 1 && (
                                                <div className={`w-0.5 flex-1 my-1 transition-all duration-500 ${idx < currentIndex ? '' : 'opacity-20'}`}
                                                    style={{ backgroundColor: idx < currentIndex ? COLORS.primary : 'rgba(255,255,255,0.2)', minHeight: '32px' }} />
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className={`pb-6 transition-all duration-300 ${isCompleted ? '' : 'opacity-30'}`}>
                                            <p className={`font-bold text-sm ${isActive ? 'text-white' : isCompleted ? 'text-white/70' : 'text-white/30'}`}>
                                                {step.label}
                                                {isActive && (
                                                    <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full animate-pulse"
                                                        style={{ backgroundColor: 'rgba(245,180,0,0.2)', color: COLORS.primary }}>
                                                        Ahora
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs mt-0.5" style={{ color: COLORS.muted }}>{step.sublabel}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => navigate('/my-orders')} className="border-white/20 text-white/60">
                            Mis Pedidos
                        </Button>
                        <Button asChild>
                            <a href="tel:+18095550001">Llamar al Restaurante</a>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderTracking;
