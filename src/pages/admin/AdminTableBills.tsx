import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { apiRequest } from '../../lib/api';
import type { ApiEnvelope } from '../../lib/api';
import { useAdmin } from '../../context/AdminContext';

type TableBillStatus = 'open' | 'closed' | 'cancelled';
type PaymentMethod = 'cash' | 'card' | 'transfer';

interface TableBill {
  _id: string;
  status: TableBillStatus;
  total: number;
  discount?: number;
  paymentMethod?: PaymentMethod;
  table?: { _id: string; number?: number; zone?: string };
  items?: Array<{ menuItem?: string; name?: string; quantity?: number; price?: number }>;
  createdAt?: string;
}

interface MenuOption {
  _id: string;
  name: string;
  price: number;
}

const AdminTableBills: React.FC = () => {
  const { tables } = useAdmin();
  const [bills, setBills] = useState<TableBill[]>([]);
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const [tableId, setTableId] = useState('');
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
  const [selectedMenuItemByBill, setSelectedMenuItemByBill] = useState<Record<string, string>>({});
  const [itemQuantityByBill, setItemQuantityByBill] = useState<Record<string, number>>({});
  const [discountByBill, setDiscountByBill] = useState<Record<string, number>>({});
  const [paymentMethodByBill, setPaymentMethodByBill] = useState<Record<string, PaymentMethod>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const availableTables = useMemo(() => tables.filter((table) => table.status === 'available'), [tables]);

  const loadBills = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest<ApiEnvelope<TableBill[]>>('/admin/table-bills', { auth: true });
      setBills(response.data || []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las cuentas');
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMenuOptions = async () => {
    try {
      const response = await apiRequest<ApiEnvelope<any[]>>('/menu');
      const options = (response.data || []).map((item) => ({
        _id: String(item._id || item.id),
        name: item.name,
        price: Number(item.price || 0),
      }));
      setMenuOptions(options);
    } catch {
      setMenuOptions([]);
    }
  };

  useEffect(() => {
    loadBills();
    loadMenuOptions();
  }, []);

  const openBill = async () => {
    if (!tableId) return;
    try {
      await apiRequest('/admin/table-bills', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ tableId }),
      });
      setTableId('');
      await loadBills();
    } catch {
      setError('No se pudo abrir la cuenta de mesa');
    }
  };

  const closeBill = async (id: string) => {
    try {
      await apiRequest(`/admin/table-bills/${id}/close`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ paymentMethod: paymentMethodByBill[id] || 'cash' }),
      });
      setExpandedBillId(null);
      await loadBills();
    } catch {
      setError('No se pudo cerrar la cuenta');
    }
  };

  const addItem = async (billId: string) => {
    const menuItemId = selectedMenuItemByBill[billId];
    const quantity = itemQuantityByBill[billId] || 1;
    if (!menuItemId || quantity < 1) return;

    try {
      await apiRequest(`/admin/table-bills/${billId}/items`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ menuItemId, quantity }),
      });
      setSelectedMenuItemByBill((prev) => ({ ...prev, [billId]: '' }));
      setItemQuantityByBill((prev) => ({ ...prev, [billId]: 1 }));
      await loadBills();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo agregar ítem');
    }
  };

  const removeItem = async (billId: string, menuItemId: string) => {
    try {
      await apiRequest(`/admin/table-bills/${billId}/items/${menuItemId}`, {
        method: 'DELETE',
        auth: true,
      });
      await loadBills();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar ítem');
    }
  };

  const applyDiscount = async (billId: string) => {
    const discount = Number(discountByBill[billId] || 0);
    if (!Number.isFinite(discount) || discount < 0) {
      setError('El descuento debe ser un valor válido mayor o igual a 0');
      return;
    }

    try {
      await apiRequest(`/admin/table-bills/${billId}/discount`, {
        method: 'PATCH',
        auth: true,
        body: JSON.stringify({ discount }),
      });
      await loadBills();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo aplicar descuento');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Cuentas de Mesa (POS)</h1>
        <p className="text-sm text-white/60">Control de apertura y cierre de cuentas en salón.</p>
      </div>

      {error && <Card className="p-4 text-red-400 bg-red-500/10 border-red-500/30">{error}</Card>}

      <Card className="p-4 bg-[#2d1f0f] border border-white/10">
        <div className="flex gap-3 items-end flex-wrap">
          <div>
            <label className="text-xs text-white/60 block mb-1">Mesa disponible</label>
            <select value={tableId} onChange={(event) => setTableId(event.target.value)} className="bg-black/20 border border-white/20 rounded px-3 py-2 text-white">
              <option value="">Seleccionar mesa...</option>
              {availableTables.map((table) => (
                <option key={table.id} value={table.id}>Mesa #{table.number} - {table.section}</option>
              ))}
            </select>
          </div>
          <Button onClick={openBill}>Abrir Cuenta</Button>
          <Button variant="outline" className="border-white/20 text-white" onClick={loadBills}>Refrescar</Button>
        </div>
      </Card>

      <Card className="p-4 bg-[#2d1f0f] border border-white/10">
        {loading ? (
          <p className="text-white/70">Cargando cuentas...</p>
        ) : bills.length === 0 ? (
          <p className="text-white/70">No hay cuentas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/60">
                  <th className="text-left p-3">Cuenta</th>
                  <th className="text-left p-3">Mesa</th>
                  <th className="text-left p-3">Items</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <React.Fragment key={bill._id}>
                  <tr className="border-b border-white/5 text-white/90">
                    <td className="p-3 font-mono text-xs">#{bill._id.slice(-6)}</td>
                    <td className="p-3">{bill.table?.number ? `Mesa #${bill.table.number}` : 'N/A'}</td>
                    <td className="p-3">{bill.items?.length || 0}</td>
                    <td className="p-3">RD${Number(bill.total || 0).toFixed(0)}</td>
                    <td className="p-3 capitalize">{bill.status}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {bill.status === 'open' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-white"
                              onClick={() => setExpandedBillId((prev) => (prev === bill._id ? null : bill._id))}
                            >
                              {expandedBillId === bill._id ? 'Ocultar POS' : 'Abrir POS'}
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20 text-white" onClick={() => closeBill(bill._id)}>
                              Cerrar Cuenta
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-white/40">Sin acción</span>
                        )}
                      </div>
                    </td>
                  </tr>
                {expandedBillId === bill._id && bill.status === 'open' && (
                  <tr key={`${bill._id}-editor`} className="border-b border-white/5 bg-black/10">
                    <td colSpan={6} className="p-3">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wide text-white/60">Agregar ítem</p>
                          <div className="flex gap-2 flex-wrap items-end">
                            <div>
                              <label className="text-xs text-white/50 block mb-1">Producto</label>
                              <select
                                value={selectedMenuItemByBill[bill._id] || ''}
                                onChange={(event) => setSelectedMenuItemByBill((prev) => ({ ...prev, [bill._id]: event.target.value }))}
                                className="bg-black/20 border border-white/20 rounded px-3 py-2 text-white"
                              >
                                <option value="">Seleccionar...</option>
                                {menuOptions.map((item) => (
                                  <option key={item._id} value={item._id}>{item.name} · RD${item.price.toFixed(0)}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-white/50 block mb-1">Cantidad</label>
                              <input
                                type="number"
                                min={1}
                                value={itemQuantityByBill[bill._id] || 1}
                                onChange={(event) => setItemQuantityByBill((prev) => ({ ...prev, [bill._id]: Number(event.target.value || 1) }))}
                                className="w-24 bg-black/20 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <Button size="sm" onClick={() => addItem(bill._id)}>Agregar</Button>
                          </div>

                          <div className="space-y-1 pt-2">
                            <p className="text-xs uppercase tracking-wide text-white/60">Items actuales</p>
                            {bill.items && bill.items.length > 0 ? (
                              bill.items.map((item, index) => (
                                <div key={`${bill._id}-${item.menuItem || index}`} className="flex justify-between items-center text-sm text-white/90 bg-black/20 rounded px-3 py-2">
                                  <span>
                                    {item.name || 'Ítem'} · {item.quantity || 0} × RD${Number(item.price || 0).toFixed(0)}
                                  </span>
                                  {item.menuItem && (
                                    <Button size="sm" variant="outline" className="border-white/20 text-white" onClick={() => removeItem(bill._id, String(item.menuItem))}>
                                      Eliminar
                                    </Button>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-white/50">Sin ítems en la cuenta.</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-wide text-white/60">Cobro y descuentos</p>
                          <div className="flex gap-2 items-end flex-wrap">
                            <div>
                              <label className="text-xs text-white/50 block mb-1">Descuento (RD$)</label>
                              <input
                                type="number"
                                min={0}
                                value={discountByBill[bill._id] ?? Number(bill.discount || 0)}
                                onChange={(event) => setDiscountByBill((prev) => ({ ...prev, [bill._id]: Number(event.target.value || 0) }))}
                                className="w-36 bg-black/20 border border-white/20 rounded px-3 py-2 text-white"
                              />
                            </div>
                            <Button size="sm" variant="outline" className="border-white/20 text-white" onClick={() => applyDiscount(bill._id)}>
                              Aplicar
                            </Button>
                          </div>

                          <div>
                            <label className="text-xs text-white/50 block mb-1">Método de pago al cerrar</label>
                            <select
                              value={paymentMethodByBill[bill._id] || 'cash'}
                              onChange={(event) => setPaymentMethodByBill((prev) => ({ ...prev, [bill._id]: event.target.value as PaymentMethod }))}
                              className="bg-black/20 border border-white/20 rounded px-3 py-2 text-white"
                            >
                              <option value="cash">Efectivo</option>
                              <option value="card">Tarjeta</option>
                              <option value="transfer">Transferencia</option>
                            </select>
                          </div>

                          <p className="text-xs text-white/60">
                            Total actual: <span className="text-white font-semibold">RD${Number(bill.total || 0).toFixed(0)}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminTableBills;
