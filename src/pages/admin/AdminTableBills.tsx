import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Receipt, Plus, Trash2, DollarSign } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  adminApi,
  type TableData,
  type TableBillData,
} from "../../services/api";
import { toast } from "sonner";

const AdminTableBills: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedBill, setSelectedBill] = useState<TableBillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOpen, setShowOpen] = useState(false);
  const [openForm, setOpenForm] = useState({ tableId: "", customerId: "" });

  const fetchTables = async () => {
    try {
      const res = await adminApi.tables.getAll();
      if (res.data) setTables(res.data);
    } catch {
      toast.error("Error al cargar mesas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const occupiedTables = tables.filter(
    (t) => t.status === "occupied" && t.activeBill,
  );
  const availableTables = tables.filter((t) => t.status === "available");

  const handleOpenBill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminApi.tableBills.open({
        tableId: openForm.tableId,
        customerId: openForm.customerId || undefined,
      });
      toast.success("Cuenta abierta");
      setShowOpen(false);
      setOpenForm({ tableId: "", customerId: "" });
      if (res.data) setSelectedBill(res.data);
      fetchTables();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(message);
    }
  };

  const handleViewBill = async (billId: string) => {
    try {
      const res = await adminApi.tableBills.getById(billId);
      if (res.data) setSelectedBill(res.data);
    } catch {
      toast.error("Error al cargar cuenta");
    }
  };

  const handleCloseBill = async (paymentMethod: string) => {
    if (!selectedBill) return;
    try {
      await adminApi.tableBills.close(selectedBill._id, paymentMethod);
      toast.success("Cuenta cerrada");
      setSelectedBill(null);
      fetchTables();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(message);
    }
  };

  const handleRemoveItem = async (index: number) => {
    if (!selectedBill) return;
    try {
      const res = await adminApi.tableBills.removeItem(selectedBill._id, index);
      if (res.data) setSelectedBill(res.data);
      toast.success("Item eliminado");
    } catch {
      toast.error("Error al eliminar item");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b400]" />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cuentas de Mesa</h1>
          <p className="text-white/50 text-sm">Gestión de cuentas activas</p>
        </div>
        <Button onClick={() => setShowOpen(true)}>
          <Plus size={16} className="mr-2" /> Abrir Cuenta
        </Button>
      </div>

      {/* Open form */}
      {showOpen && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleOpenBill}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
        >
          <div>
            <label className="text-white/50 text-xs block mb-1">Mesa</label>
            <select
              required
              value={openForm.tableId}
              onChange={(e) =>
                setOpenForm((p) => ({ ...p, tableId: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            >
              <option value="">Seleccionar mesa...</option>
              {availableTables.map((t) => (
                <option key={t._id} value={t._id}>
                  Mesa #{t.number} ({t.zone})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">
              ID Cliente (opcional)
            </label>
            <input
              value={openForm.customerId}
              onChange={(e) =>
                setOpenForm((p) => ({ ...p, customerId: e.target.value }))
              }
              placeholder="Dejar vacío si no aplica"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <Button type="submit">Abrir Cuenta</Button>
        </motion.form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active bills */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">
            Mesas con Cuenta Activa ({occupiedTables.length})
          </h3>
          <div className="space-y-3">
            {occupiedTables.map((table) => {
              const bill = table.activeBill;
              return (
                <div
                  key={table._id}
                  onClick={() =>
                    bill &&
                    handleViewBill(typeof bill === "string" ? bill : bill._id)
                  }
                  className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 cursor-pointer hover:border-[#f5b400]/30 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold">
                        Mesa #{table.number}
                      </p>
                      <p className="text-white/40 text-xs">
                        {table.zone} • {table.capacity} personas
                      </p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                  </div>
                </div>
              );
            })}
            {occupiedTables.length === 0 && (
              <p className="text-white/30 text-center py-8">
                No hay cuentas activas
              </p>
            )}
          </div>
        </div>

        {/* Bill Detail */}
        <div>
          {selectedBill ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0a0a0a] border border-[#f5b400]/30 rounded-xl p-6"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Receipt size={18} className="text-[#f5b400]" />
                    Cuenta #{selectedBill._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-white/40 text-xs">
                    Estado: {selectedBill.status}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="text-white/30 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-6">
                {selectedBill.items.length === 0 ? (
                  <p className="text-white/30 text-center py-4">Sin items</p>
                ) : (
                  selectedBill.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm border-b border-white/5 pb-2"
                    >
                      <div className="text-white">
                        <span className="text-white/50 mr-2">
                          {item.quantity}x
                        </span>
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        {selectedBill.status === "open" && (
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-400/50 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-sm border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span>
                  <span>${selectedBill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>IVA (18%)</span>
                  <span>${selectedBill.tax.toFixed(2)}</span>
                </div>
                {selectedBill.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Descuento</span>
                    <span>-${selectedBill.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-[#f5b400]">
                    ${selectedBill.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Close actions */}
              {selectedBill.status === "open" && (
                <div className="space-y-2">
                  <p className="text-white/50 text-xs mb-2">
                    Cerrar con método de pago:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleCloseBill("cash")}
                      className="text-xs"
                    >
                      <DollarSign size={14} className="mr-1" /> Efectivo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCloseBill("card")}
                      className="text-xs border-white/20 text-white"
                    >
                      Tarjeta
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCloseBill("transfer")}
                      className="text-xs border-white/20 text-white"
                    >
                      Transferencia
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-12 text-center text-white/30">
              <Receipt size={32} className="mx-auto mb-2" />
              Selecciona una mesa para ver su cuenta
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTableBills;
