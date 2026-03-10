import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Star, Mail, Phone, MapPin, ShoppingBag, Crown } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrdersContext';
import type { User } from '../../types';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.2)',
};

const AdminClients: React.FC = () => {
    const { getAllUsers, updateUser } = useAuth();
    const { getAllOrders } = useOrders();
    const [search, setSearch] = useState('');
    const [filterVIP, setFilterVIP] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const customers = getAllUsers().filter(u => u.role === 'customer');
    const orders = getAllOrders();

    const filtered = customers.filter(u => {
        const q = search.toLowerCase();
        const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        const matchVIP = !filterVIP || u.isVIP;
        return matchSearch && matchVIP;
    });

    const getUserOrders = (userId: string) => orders.filter(o => o.userId === userId);
    const getUserSpend = (userId: string) => getUserOrders(userId).reduce((s, o) => s + o.total, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Clientes</h1>
                <p style={{ color: COLORS.muted }}>{customers.length} cliente{customers.length !== 1 ? 's' : ''} registrado{customers.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Filters */}
            <Card className="p-4 flex gap-4 flex-wrap items-center" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar clientes..."
                        className="w-full bg-black/20 pl-9 pr-4 py-2 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                        style={{ borderColor: COLORS.border }} />
                </div>
                <button onClick={() => setFilterVIP(!filterVIP)}
                    className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border transition-all"
                    style={{
                        borderColor: filterVIP ? COLORS.primary : 'transparent',
                        backgroundColor: filterVIP ? 'rgba(245,180,0,0.1)' : 'rgba(255,255,255,0.05)',
                        color: filterVIP ? COLORS.primary : COLORS.muted,
                    }}>
                    <Crown size={14} /> Solo VIP
                </button>
            </Card>

            {/* Client Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(client => {
                    const clientOrders = getUserOrders(client.id);
                    const spend = getUserSpend(client.id);
                    return (
                        <motion.div layout key={client.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <Card className="p-5 hover:border-primary/30 transition-all cursor-pointer"
                                style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}
                                onClick={() => setSelectedUser(client)}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                                            style={{ backgroundColor: 'rgba(245,180,0,0.15)', color: COLORS.primary }}>
                                            {client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">{client.name}</p>
                                            <p className="text-xs" style={{ color: COLORS.muted }}>
                                                Desde {new Date(client.createdAt).toLocaleDateString('es-DO', { month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    {client.isVIP && (
                                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                                            style={{ backgroundColor: 'rgba(245,180,0,0.15)', color: COLORS.primary }}>
                                            <Star size={10} fill="currentColor" /> VIP
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-1.5 text-xs mb-4">
                                    <div className="flex items-center gap-2" style={{ color: COLORS.muted }}>
                                        <Mail size={12} /> {client.email}
                                    </div>
                                    {client.phone && (
                                        <div className="flex items-center gap-2" style={{ color: COLORS.muted }}>
                                            <Phone size={12} /> {client.phone}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center">
                                    <div>
                                        <p className="font-bold text-white">{clientOrders.length}</p>
                                        <p className="text-xs" style={{ color: COLORS.muted }}>Pedidos</p>
                                    </div>
                                    <div>
                                        <p className="font-bold" style={{ color: COLORS.primary }}>RD${spend.toFixed(0)}</p>
                                        <p className="text-xs" style={{ color: COLORS.muted }}>Gastado</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{client.loyaltyPoints}</p>
                                        <p className="text-xs" style={{ color: COLORS.muted }}>Puntos</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button size="sm" variant="outline"
                                        className="flex-1 text-xs border-white/10 text-white/50"
                                        onClick={(e) => { e.stopPropagation(); updateUser(client.id, { isVIP: !client.isVIP }); }}>
                                        {client.isVIP ? 'Quitar VIP' : '⭐ Dar VIP'}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Client Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedUser(null)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-lg p-6 rounded-2xl"
                        style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl"
                                style={{ backgroundColor: 'rgba(245,180,0,0.15)', color: COLORS.primary }}>
                                {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                                <p className="text-sm" style={{ color: COLORS.muted }}>{selectedUser.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            {[
                                { icon: <Phone size={14} />, label: 'Teléfono', value: selectedUser.phone || 'N/A' },
                                { icon: <MapPin size={14} />, label: 'Dirección', value: selectedUser.address || 'N/A' },
                                { icon: <ShoppingBag size={14} />, label: 'Pedidos', value: getUserOrders(selectedUser.id).length.toString() },
                                { icon: <Star size={14} />, label: 'Puntos Lealtad', value: selectedUser.loyaltyPoints.toString() },
                            ].map(row => (
                                <div key={row.label} className="flex items-center gap-3 p-3 rounded-lg bg-black/20">
                                    <span style={{ color: COLORS.primary }}>{row.icon}</span>
                                    <span style={{ color: COLORS.muted }}>{row.label}</span>
                                    <span className="ml-auto text-white">{row.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button className="flex-1" onClick={() => { updateUser(selectedUser.id, { isVIP: !selectedUser.isVIP }); setSelectedUser(null); }}>
                                {selectedUser.isVIP ? 'Quitar VIP' : '⭐ Dar VIP'}
                            </Button>
                            <Button variant="outline" className="border-white/20 text-white/60" onClick={() => setSelectedUser(null)}>
                                Cerrar
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminClients;
