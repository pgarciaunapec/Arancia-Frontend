import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Plus, Search, AlertTriangle, Edit2, Trash2, X, Save } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAdmin } from '../../context/AdminContext';
import type { InventoryItem } from '../../types';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.2)',
};

const CATEGORIES = ['Carnes', 'Mariscos', 'Frutas', 'Verduras', 'Granos', 'Harinas', 'Aceites', 'Licores', 'Lácteos', 'Otros'];

const blankForm = { name: '', category: 'Carnes', quantity: 0, unit: 'kg', minStock: 5, costPerUnit: 0, supplier: '' };

const AdminInventory: React.FC = () => {
    const { inventory, updateInventoryItem, addInventoryItem, removeInventoryItem } = useAdmin();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'ok' | 'low' | 'out'>('all');
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState(blankForm);

    const filtered = inventory.filter(item => {
        const q = search.toLowerCase();
        const matchSearch = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        const matchStatus = filterStatus === 'all' || item.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleUpdate = () => {
        if (!editItem) return;
        updateInventoryItem(editItem.id, {
            name: editItem.name, category: editItem.category,
            quantity: editItem.quantity, unit: editItem.unit,
            minStock: editItem.minStock, costPerUnit: editItem.costPerUnit,
            supplier: editItem.supplier,
        });
        setEditItem(null);
    };

    const handleAdd = () => {
        if (!newItem.name) return;
        addInventoryItem(newItem);
        setNewItem(blankForm);
        setShowAddForm(false);
    };

    const totals = {
        ok: inventory.filter(i => i.status === 'ok').length,
        low: inventory.filter(i => i.status === 'low').length,
        out: inventory.filter(i => i.status === 'out').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Inventario</h1>
                    <p style={{ color: COLORS.muted }}>{inventory.length} items · {totals.low + totals.out} alertas</p>
                </div>
                <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                    <Plus size={16} /> Nuevo Item
                </Button>
            </div>

            {/* Alert Bar */}
            {(totals.low > 0 || totals.out > 0) && (
                <Card className="p-4 flex items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <AlertTriangle className="text-red-400 shrink-0" size={20} />
                    <p className="text-sm text-red-300">
                        {totals.out > 0 && <span className="font-bold">{totals.out} item{totals.out !== 1 ? 's' : ''} agotado{totals.out !== 1 ? 's' : ''}. </span>}
                        {totals.low > 0 && <span>{totals.low} item{totals.low !== 1 ? 's' : ''} con stock bajo.</span>}
                        {' '}Considera reabastecer pronto.
                    </p>
                </Card>
            )}

            {/* Filters */}
            <Card className="p-4 flex gap-4 flex-wrap items-center" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar items..."
                        className="w-full bg-black/20 pl-9 pr-4 py-2 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                        style={{ borderColor: COLORS.border }} />
                </div>
                <div className="flex gap-2">
                    {([
                        { value: 'all', label: 'Todos', count: inventory.length },
                        { value: 'ok', label: '✓ OK', count: totals.ok },
                        { value: 'low', label: '⚠ Bajo', count: totals.low },
                        { value: 'out', label: '✗ Agotado', count: totals.out },
                    ] as { value: typeof filterStatus; label: string; count: number }[]).map(opt => (
                        <button key={opt.value} onClick={() => setFilterStatus(opt.value)}
                            className="text-xs px-3 py-1.5 rounded-full border transition-all"
                            style={{
                                borderColor: filterStatus === opt.value ? COLORS.primary : 'transparent',
                                backgroundColor: filterStatus === opt.value ? 'rgba(245,180,0,0.1)' : 'rgba(255,255,255,0.05)',
                                color: filterStatus === opt.value ? COLORS.primary : COLORS.muted,
                            }}>
                            {opt.label} ({opt.count})
                        </button>
                    ))}
                </div>
            </Card>

            {/* Table */}
            <Card style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b" style={{ borderColor: COLORS.border }}>
                                {['Item', 'Categoría', 'Cantidad', 'Stock Mín.', 'Costo/U', 'Proveedor', 'Estado', ''].map(h => (
                                    <th key={h} className="text-left p-4 font-medium" style={{ color: COLORS.muted }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => (
                                <motion.tr layout key={item.id} className="border-b hover:bg-white/2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                                    <td className="p-4 font-medium text-white">{item.name}</td>
                                    <td className="p-4" style={{ color: COLORS.muted }}>{item.category}</td>
                                    <td className="p-4">
                                        <span className={item.status === 'out' ? 'text-red-400 font-bold' : item.status === 'low' ? 'text-yellow-400 font-bold' : 'text-white'}>
                                            {item.quantity} {item.unit}
                                        </span>
                                    </td>
                                    <td className="p-4" style={{ color: COLORS.muted }}>{item.minStock} {item.unit}</td>
                                    <td className="p-4" style={{ color: COLORS.primary }}>RD${item.costPerUnit}</td>
                                    <td className="p-4" style={{ color: COLORS.muted }}>{item.supplier}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            item.status === 'ok' ? 'text-green-400 bg-green-500/10' :
                                            item.status === 'low' ? 'text-yellow-400 bg-yellow-500/10' :
                                            'text-red-400 bg-red-500/10'
                                        }`}>
                                            {item.status === 'ok' ? 'OK' : item.status === 'low' ? 'Bajo' : 'Agotado'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditItem({ ...item })} className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: COLORS.muted }}>
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => removeInventoryItem(item.id)} className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-colors" style={{ color: COLORS.muted }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <p className="text-center py-10" style={{ color: COLORS.muted }}>No se encontraron items</p>
                    )}
                </div>
            </Card>

            {/* Edit Modal */}
            {editItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setEditItem(null)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-lg p-6 rounded-2xl" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Editar Item</h2>
                            <button onClick={() => setEditItem(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Nombre', key: 'name', type: 'text' },
                                { label: 'Cantidad', key: 'quantity', type: 'number' },
                                { label: 'Stock Mínimo', key: 'minStock', type: 'number' },
                                { label: 'Costo/Unidad', key: 'costPerUnit', type: 'number' },
                                { label: 'Proveedor', key: 'supplier', type: 'text' },
                                { label: 'Unidad', key: 'unit', type: 'text' },
                            ].map(field => (
                                <div key={field.key} className="space-y-1">
                                    <label className="text-xs text-white/60">{field.label}</label>
                                    <input type={field.type} value={(editItem as Record<string, unknown>)[field.key] as string | number}
                                        onChange={e => {
                                            const val = field.type === 'number' ? (e.target.value === '' ? 0 : parseFloat(e.target.value) || 0) : e.target.value;
                                            setEditItem({ ...editItem, [field.key]: val });
                                        }}
                                        className="w-full bg-black/20 p-2.5 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                                        style={{ borderColor: COLORS.border }} />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleUpdate} className="flex-1 flex items-center gap-2"><Save size={16} /> Guardar</Button>
                            <Button variant="outline" className="border-white/20 text-white/60" onClick={() => setEditItem(null)}>Cancelar</Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Add Modal */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowAddForm(false)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-lg p-6 rounded-2xl" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Nuevo Item de Inventario</h2>
                            <button onClick={() => setShowAddForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1 col-span-2">
                                <label className="text-xs text-white/60">Nombre</label>
                                <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                    placeholder="Nombre del item"
                                    className="w-full bg-black/20 p-2.5 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/60">Categoría</label>
                                <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    className="w-full bg-black/20 p-2.5 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/60">Unidad</label>
                                <input type="text" value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                    placeholder="kg, litros, unidades..."
                                    className="w-full bg-black/20 p-2.5 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/60">Cantidad Inicial</label>
                                <input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-black/20 p-2.5 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/60">Stock Mínimo</label>
                                <input type="number" value={newItem.minStock} onChange={e => setNewItem({ ...newItem, minStock: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-black/20 p-2.5 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/60">Costo por Unidad (RD$)</label>
                                <input type="number" value={newItem.costPerUnit} onChange={e => setNewItem({ ...newItem, costPerUnit: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-black/20 p-2.5 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-white/60">Proveedor</label>
                                <input type="text" value={newItem.supplier} onChange={e => setNewItem({ ...newItem, supplier: e.target.value })}
                                    placeholder="Nombre del proveedor"
                                    className="w-full bg-black/20 p-2.5 rounded-lg border text-white text-sm focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleAdd} className="flex-1 flex items-center gap-2"><Plus size={16} /> Agregar</Button>
                            <Button variant="outline" className="border-white/20 text-white/60" onClick={() => setShowAddForm(false)}>Cancelar</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminInventory;
