import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { Button } from "../../components/ui/button";
import { adminApi, type TableData } from "../../services/api";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: "Disponible", color: "bg-green-500" },
  occupied: { label: "Ocupada", color: "bg-red-500" },
  reserved: { label: "Reservada", color: "bg-yellow-500" },
  maintenance: { label: "Mantenimiento", color: "bg-gray-500" },
};

const AdminTables: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    number: "",
    capacity: "4",
    zone: "principal",
  });

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.tables.create({
        number: parseInt(form.number),
        capacity: parseInt(form.capacity),
        zone: form.zone,
      });
      toast.success("Mesa creada");
      setShowForm(false);
      setForm({ number: "", capacity: "4", zone: "principal" });
      fetchTables();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(message);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminApi.tables.update(id, { status } as Partial<TableData>);
      fetchTables();
    } catch {
      toast.error("Error al actualizar mesa");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta mesa?")) return;
    try {
      await adminApi.tables.delete(id);
      toast.success("Mesa eliminada");
      fetchTables();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Solo puedes eliminar mesas disponibles";
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Mesas</h1>
          <p className="text-white/50 text-sm">
            Gestión de mesas del restaurante
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" /> Nueva Mesa
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleCreate}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="text-white/50 text-xs block mb-1">Número</label>
            <input
              type="number"
              required
              value={form.number}
              onChange={(e) =>
                setForm((p) => ({ ...p, number: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">
              Capacidad
            </label>
            <input
              type="number"
              required
              value={form.capacity}
              onChange={(e) =>
                setForm((p) => ({ ...p, capacity: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">Zona</label>
            <select
              value={form.zone}
              onChange={(e) => setForm((p) => ({ ...p, zone: e.target.value }))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            >
              <option value="principal">Principal</option>
              <option value="terraza">Terraza</option>
              <option value="privado">Privado</option>
              <option value="bar">Bar</option>
            </select>
          </div>
          <Button type="submit">Crear</Button>
        </motion.form>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tables.map((table, i) => {
          const statusInfo =
            STATUS_LABELS[table.status] || STATUS_LABELS.available;
          return (
            <motion.div
              key={table._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 relative group"
            >
              <div
                className={`absolute top-3 right-3 w-3 h-3 rounded-full ${statusInfo.color}`}
              />
              <div className="text-center mb-4">
                <UtensilsCrossed
                  size={24}
                  className="mx-auto text-[#f5b400] mb-2"
                />
                <p className="text-white text-2xl font-bold">#{table.number}</p>
                <p className="text-white/40 text-xs">
                  {table.capacity} personas • {table.zone}
                </p>
              </div>
              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table._id, e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-white text-xs mb-2 outline-none"
              >
                <option value="available">Disponible</option>
                <option value="occupied">Ocupada</option>
                <option value="reserved">Reservada</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
              <button
                onClick={() => handleDelete(table._id)}
                className="w-full text-center text-red-400/50 hover:text-red-400 text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} className="inline mr-1" /> Eliminar
              </button>
            </motion.div>
          );
        })}
        {tables.length === 0 && (
          <div className="col-span-full text-center py-12 text-white/30">
            <UtensilsCrossed size={32} className="mx-auto mb-2" />
            No hay mesas registradas
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTables;
