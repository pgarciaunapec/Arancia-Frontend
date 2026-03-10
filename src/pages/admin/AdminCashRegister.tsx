import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, Lock, Unlock, ShoppingBag, CreditCard, Banknote } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAdmin } from '../../context/AdminContext';
import { useOrders } from '../../context/OrdersContext';
import { useAuth } from '../../context/AuthContext';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.2)',
};

const AdminCashRegister: React.FC = () => {
    const { cashSession, openCashSession, closeCashSession } = useAdmin();
    const { getAllOrders } = useOrders();
    const { user } = useAuth();

    const [openAmount, setOpenAmount] = useState('');
    const [closeAmount, setCloseAmount] = useState('');

    const orders = getAllOrders();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt.startsWith(todayStr) && o.status !== 'cancelled');
    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
    const todayCard = todayOrders.filter(o => o.transaction?.method === 'card').reduce((s, o) => s + o.total, 0);
    const todayCash = todayOrders.filter(o => o.transaction?.method === 'cash').reduce((s, o) => s + o.total, 0);
    const todayTransfer = todayOrders.filter(o => o.transaction?.method === 'transfer').reduce((s, o) => s + o.total, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Caja Diaria</h1>
                <p style={{ color: COLORS.muted }}>
                    {new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Session Card */}
            <Card className="p-6" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {cashSession?.isOpen ? (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/10">
                                <Unlock size={22} className="text-green-400" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-500/10">
                                <Lock size={22} className="text-red-400" />
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-white">Sesión de Caja</p>
                            <p className="text-sm" style={{ color: COLORS.muted }}>
                                {cashSession?.isOpen ? `Abierta por ${cashSession.openedBy}` : 'Caja cerrada'}
                            </p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${cashSession?.isOpen ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {cashSession?.isOpen ? '● Abierta' : '○ Cerrada'}
                    </div>
                </div>

                {!cashSession?.isOpen ? (
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-white/80 block mb-2">Balance de Apertura (RD$)</label>
                            <input type="number" value={openAmount} onChange={e => setOpenAmount(e.target.value)}
                                placeholder="Ej: 5000"
                                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                                style={{ borderColor: COLORS.border }} />
                        </div>
                        <Button onClick={() => { if (openAmount) openCashSession(parseFloat(openAmount), user?.name || 'Admin'); setOpenAmount(''); }}
                            className="flex items-center gap-2">
                            <Unlock size={16} /> Abrir Caja
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-white/80 block mb-2">Balance de Cierre (RD$)</label>
                            <input type="number" value={closeAmount} onChange={e => setCloseAmount(e.target.value)}
                                placeholder={`Esperado: ${(cashSession.openingBalance + todayCash).toFixed(0)}`}
                                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                                style={{ borderColor: COLORS.border }} />
                        </div>
                        <Button variant="outline" onClick={() => { if (closeAmount) closeCashSession(parseFloat(closeAmount)); setCloseAmount(''); }}
                            className="flex items-center gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                            <Lock size={16} /> Cerrar Caja
                        </Button>
                    </div>
                )}
            </Card>

            {/* Revenue Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Ventas', value: `RD$${todayRevenue.toFixed(0)}`, icon: <TrendingUp size={20} />, color: '#22c55e' },
                    { label: 'Pedidos', value: todayOrders.length.toString(), icon: <ShoppingBag size={20} />, color: COLORS.primary },
                    { label: 'Tarjeta', value: `RD$${todayCard.toFixed(0)}`, icon: <CreditCard size={20} />, color: '#3b82f6' },
                    { label: 'Efectivo', value: `RD$${todayCash.toFixed(0)}`, icon: <Banknote size={20} />, color: '#22c55e' },
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card className="p-5" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                            <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs mt-1" style={{ color: COLORS.muted }}>{stat.label}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Today's Orders */}
            <Card className="p-6" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign size={16} style={{ color: COLORS.primary }} /> Transacciones de Hoy
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b" style={{ borderColor: COLORS.border }}>
                                {['Hora', 'Pedido', 'Items', 'Método', 'Total'].map(h => (
                                    <th key={h} className="text-left p-3 font-medium" style={{ color: COLORS.muted }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {todayOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                                <tr key={order.id} className="border-b hover:bg-white/3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <td className="p-3" style={{ color: COLORS.muted }}>
                                        {new Date(order.createdAt).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="p-3 font-mono text-xs text-white">#{order.id.split('-').slice(-2).join('-')}</td>
                                    <td className="p-3 text-white">{order.items.length}</td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            order.transaction?.method === 'card' ? 'text-blue-400 bg-blue-500/10' :
                                            order.transaction?.method === 'transfer' ? 'text-purple-400 bg-purple-500/10' :
                                            'text-green-400 bg-green-500/10'
                                        }`}>
                                            {order.transaction?.method === 'card' ? 'Tarjeta' :
                                             order.transaction?.method === 'transfer' ? 'Transferencia' : 'Efectivo'}
                                        </span>
                                    </td>
                                    <td className="p-3 font-bold" style={{ color: COLORS.primary }}>RD${order.total.toFixed(0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {todayOrders.length === 0 && (
                        <p className="text-center py-8" style={{ color: COLORS.muted }}>Sin transacciones hoy</p>
                    )}
                </div>
                {todayOrders.length > 0 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10 font-bold">
                        <span className="text-white">Total del Día</span>
                        <span style={{ color: COLORS.primary }} className="text-xl">RD${todayRevenue.toFixed(0)}</span>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminCashRegister;
