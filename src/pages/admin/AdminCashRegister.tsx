import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Wallet,
  Lock,
  Unlock,
  DollarSign,
  CreditCard,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { adminApi, type CashRegisterData } from "../../services/api";
import { toast } from "sonner";

const AdminCashRegister: React.FC = () => {
  const [register, setRegister] = useState<CashRegisterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openingBalance, setOpeningBalance] = useState("");
  const [closeNotes, setCloseNotes] = useState("");

  const fetchToday = async () => {
    try {
      const res = await adminApi.cashRegister.getToday();
      if (res.data) setRegister(res.data);
    } catch {
      setRegister(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const handleOpen = async () => {
    const balance = parseFloat(openingBalance);
    if (isNaN(balance) || balance < 0) {
      toast.error("Monto inválido");
      return;
    }
    try {
      const res = await adminApi.cashRegister.open(balance);
      if (res.data) setRegister(res.data);
      toast.success("Caja abierta");
      setOpeningBalance("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(message);
    }
  };

  const handleClose = async () => {
    if (!confirm("¿Cerrar la caja del día?")) return;
    try {
      const res = await adminApi.cashRegister.close(closeNotes || undefined);
      if (res.data) setRegister(res.data);
      toast.success("Caja cerrada");
      setCloseNotes("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(message);
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
      <h1 className="text-3xl font-bold text-white mb-2">Caja Registradora</h1>
      <p className="text-white/50 text-sm mb-8">
        Apertura y cierre de caja diaria
      </p>

      {!register || register.status === "closed" ? (
        /* Open cash register */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-8 text-center">
            <Lock size={48} className="mx-auto mb-4 text-white/20" />
            <h2 className="text-xl font-bold text-white mb-2">Caja Cerrada</h2>
            <p className="text-white/50 text-sm mb-6">
              Ingresa el monto de apertura para iniciar
            </p>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Monto de apertura ($)"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-lg mb-4 outline-none"
            />
            <Button onClick={handleOpen} className="w-full" size="lg">
              <Unlock size={18} className="mr-2" /> Abrir Caja
            </Button>

            {register?.status === "closed" && (
              <div className="mt-8 pt-6 border-t border-white/10 text-left">
                <h3 className="text-white/50 text-xs uppercase tracking-wider mb-3">
                  Resumen del cierre anterior
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Balance apertura</span>
                    <span className="text-white">
                      ${register.openingBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Balance cierre</span>
                    <span className="text-white">
                      ${register.closingBalance?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Ventas totales</span>
                    <span className="text-[#f5b400] font-bold">
                      ${register.totalSales.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Transacciones</span>
                    <span className="text-white">
                      {register.transactionCount}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        /* Open register display */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-[#0a0a0a] border-2 border-green-500/30 rounded-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Unlock size={24} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Caja Abierta</h2>
                  <p className="text-white/40 text-xs">
                    {new Date(register.date).toLocaleDateString("es-DO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs">Balance apertura</p>
                <p className="text-white text-lg font-bold">
                  ${register.openingBalance.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/30 rounded-xl p-4">
                <DollarSign size={18} className="text-[#f5b400] mb-2" />
                <p className="text-white/40 text-xs">Ventas Totales</p>
                <p className="text-[#f5b400] text-xl font-bold">
                  ${register.totalSales.toFixed(2)}
                </p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <Wallet size={18} className="text-green-400 mb-2" />
                <p className="text-white/40 text-xs">Efectivo</p>
                <p className="text-green-400 text-xl font-bold">
                  ${register.totalCash.toFixed(2)}
                </p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <CreditCard size={18} className="text-blue-400 mb-2" />
                <p className="text-white/40 text-xs">Tarjeta</p>
                <p className="text-blue-400 text-xl font-bold">
                  ${register.totalCard.toFixed(2)}
                </p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <ArrowRightLeft size={18} className="text-purple-400 mb-2" />
                <p className="text-white/40 text-xs">Transferencia</p>
                <p className="text-purple-400 text-xl font-bold">
                  ${register.totalTransfer.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="text-white/40 text-sm mb-2">
              Transacciones:{" "}
              <span className="text-white font-bold">
                {register.transactionCount}
              </span>
            </p>

            {/* Close */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <p className="text-white/50 text-sm mb-3">Cerrar caja del día</p>
              <div className="flex gap-3 items-end">
                <input
                  placeholder="Notas de cierre (opcional)"
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none"
                />
                <Button variant="destructive" onClick={handleClose}>
                  <Lock size={16} className="mr-2" /> Cerrar Caja
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminCashRegister;
