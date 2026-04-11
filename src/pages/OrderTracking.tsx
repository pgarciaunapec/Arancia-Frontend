import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
    ArrowLeft,
    CheckCircle2,
    ChefHat,
    Clock,
    House,
    MapPin,
    Truck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useOrders } from "../context/OrdersContext";
import type { OrderStatus } from "../types";
import { apiRequest } from "../lib/api";
import type { ApiEnvelope } from "../lib/api";
import { mapBackendOrder } from "../lib/mappers";
import {
    clearCheckoutRedirectFlag,
    useCheckoutState,
} from "../store/checkoutStore";

const COLORS = {
    primary: "#f59e0b",
    panel: "#111827",
    border: "rgba(148, 163, 184, 0.35)",
    muted: "rgba(226, 232, 240, 0.75)",
};

const timelineSteps = [
    {
        key: "received",
        statuses: ["pending", "confirmed"],
        label: "Recibido",
        description: "Tu pedido fue registrado correctamente.",
        icon: <CheckCircle2 size={18} />,
    },
    {
        key: "kitchen",
        statuses: ["preparing", "ready"],
        label: "Cocina",
        description: "Estamos preparando tu pedido en este momento.",
        icon: <ChefHat size={18} />,
    },
    {
        key: "on_the_way",
        statuses: ["shipped"],
        label: "Camino",
        description: "Tu pedido salio y va en ruta.",
        icon: <Truck size={18} />,
    },
    {
        key: "delivered",
        statuses: ["delivered"],
        label: "Entregado",
        description: "Pedido completado. Gracias por ordenar con Arancia.",
        icon: <House size={18} />,
    },
];

const resolveStepIndex = (status: OrderStatus) => {
    if (status === "cancelled") {
        return -1;
    }

    return timelineSteps.findIndex((step) =>
        step.statuses.includes(status as (typeof step.statuses)[number]),
    );
};

const OrderTracking: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { getOrderById } = useOrders();
    const checkoutRedirectEnabled = useCheckoutState(
        (state) => state.redirectToTracking,
    );
    const lastCheckoutOrderId = useCheckoutState((state) => state.lastOrderId);
    const [loading, setLoading] = useState(true);
    const [liveOrder, setLiveOrder] =
        useState<ReturnType<typeof mapBackendOrder> | null>(null);
    const [liveEstimatedMinutes, setLiveEstimatedMinutes] = useState<number | null>(
        null,
    );
    const fallbackOrder = orderId ? getOrderById(orderId) : undefined;

    const mapDeliveryStatusToOrderStatus = (status?: string): OrderStatus | null => {
        if (status === "in_transit") return "shipped";
        if (status === "delivered") return "delivered";
        if (status === "pending" || status === "assigned") return "confirmed";
        return null;
    };

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const load = async (showLoading = false) => {
            if (showLoading && isMounted) {
                setLoading(true);
            }

            try {
                const [orderResponse, deliveryResponse] = await Promise.allSettled([
                    apiRequest<ApiEnvelope<any>>(`/orders/${orderId}`, { auth: true }),
                    apiRequest<ApiEnvelope<any>>(`/delivery/${orderId}`, { auth: true }),
                ]);

                if (
                    isMounted &&
                    orderResponse.status === "fulfilled" &&
                    orderResponse.value?.data
                ) {
                    setLiveOrder(mapBackendOrder(orderResponse.value.data));
                }

                if (
                    isMounted &&
                    deliveryResponse.status === "fulfilled" &&
                    deliveryResponse.value?.data
                ) {
                    const delivery = deliveryResponse.value.data;
                    setLiveEstimatedMinutes(Number(delivery.estimatedMinutes || 0));

                    setLiveOrder((current) => {
                        if (!current) return current;
                        const mappedStatus = mapDeliveryStatusToOrderStatus(delivery.status);
                        return {
                            ...current,
                            status: mappedStatus || current.status,
                            estimatedMinutes: Number(
                                delivery.estimatedMinutes || current.estimatedMinutes || 0,
                            ),
                        };
                    });
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        load(true);

        const intervalId = window.setInterval(() => {
            load(false);
        }, 8000);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, [orderId]);

    useEffect(() => {
        if (
            orderId &&
            checkoutRedirectEnabled &&
            lastCheckoutOrderId === orderId
        ) {
            clearCheckoutRedirectFlag();
        }
    }, [checkoutRedirectEnabled, lastCheckoutOrderId, orderId]);

    const order = useMemo(() => liveOrder || fallbackOrder, [liveOrder, fallbackOrder]);
    const arrivedFromCheckout =
        Boolean((location.state as { fromCheckout?: boolean } | null)?.fromCheckout) ||
        (checkoutRedirectEnabled && lastCheckoutOrderId === orderId);

    if (loading) {
        return (
            <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Cargando estado del pedido...</h2>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Pedido no encontrado</h2>
                    <Button onClick={() => navigate("/my-orders")}>Mis Pedidos</Button>
                </div>
            </div>
        );
    }

    const currentStepIndex = resolveStepIndex(order.status);
    const estimatedRemaining = liveEstimatedMinutes ?? order.estimatedMinutes ?? null;
    const isCancelled = order.status === "cancelled";

    return (
        <div className="relative w-full min-h-screen overflow-hidden pt-20 sm:pt-24 pb-16">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1577086664693-894d8405334a?auto=format&fit=crop&w=1800&q=80"
                    alt="Mapa de seguimiento"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/70" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-slate-950/85" />
            </div>

            <div className="relative z-10 px-4">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => navigate("/my-orders")}
                        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white"
                    >
                        <ArrowLeft size={16} /> Volver a mis pedidos
                    </button>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card
                            className="backdrop-blur-md border p-6 sm:p-8"
                            style={{
                                backgroundColor: "rgba(15, 23, 42, 0.82)",
                                borderColor: COLORS.border,
                            }}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                <div>
                                    {arrivedFromCheckout && (
                                        <span className="inline-flex mb-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-wider text-emerald-200">
                                            Pedido confirmado y en seguimiento
                                        </span>
                                    )}
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Seguimiento de pedido</p>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">Orden #{order.id}</h1>
                                    {order.deliveryAddress && (
                                        <p className="mt-2 text-sm text-slate-300 inline-flex items-center gap-1.5">
                                            <MapPin size={14} /> {order.deliveryAddress}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-2xl px-4 py-3 border border-amber-300/30 bg-amber-400/10 min-w-[170px]">
                                    <p className="text-xs text-amber-100/80 uppercase tracking-wider">Tiempo estimado</p>
                                    <p className="text-2xl font-bold text-amber-300 mt-1">
                                        {estimatedRemaining !== null ? `${estimatedRemaining} min` : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {isCancelled && (
                                <div className="mb-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                    Esta orden fue cancelada. Si necesitas ayuda, contacta al restaurante.
                                </div>
                            )}

                            <div className="space-y-5">
                                {timelineSteps.map((step, index) => {
                                    const isActive = currentStepIndex === index;
                                    const isDone = currentStepIndex > index || (!isCancelled && currentStepIndex === timelineSteps.length - 1 && index <= currentStepIndex);
                                    const isPending = currentStepIndex < index || isCancelled;

                                    return (
                                        <div key={step.key} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className="h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                                                    style={{
                                                        backgroundColor: isDone || isActive ? COLORS.primary : "rgba(148, 163, 184, 0.25)",
                                                        color: isDone || isActive ? "#111827" : "#cbd5e1",
                                                    }}
                                                >
                                                    {step.icon}
                                                </div>
                                                {index < timelineSteps.length - 1 && (
                                                    <div
                                                        className="w-[2px] flex-1 mt-2"
                                                        style={{
                                                            minHeight: "26px",
                                                            backgroundColor: isDone ? COLORS.primary : "rgba(148, 163, 184, 0.3)",
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <div className="pb-4 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className="font-semibold"
                                                        style={{
                                                            color: isPending ? COLORS.muted : "#f8fafc",
                                                        }}
                                                    >
                                                        {step.label}
                                                    </p>
                                                    {isActive && !isCancelled && (
                                                        <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-amber-400/20 text-amber-300 animate-pulse">
                                                            En curso
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm mt-1 text-slate-300">
                                                    {step.key === "on_the_way" && order.deliveryType !== "delivery"
                                                        ? "Pedido casi listo para retiro en tienda."
                                                        : step.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate("/my-orders")}
                                    className="border-slate-400/50 text-slate-100 hover:bg-slate-700/40"
                                >
                                    Ver todos mis pedidos
                                </Button>
                                <Button asChild>
                                    <a href="tel:+18095550001">Contactar restaurante</a>
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
