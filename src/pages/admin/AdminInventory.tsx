import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { adminApi, type InventoryItemData } from "../../services/api";
import { toast } from "sonner";

const AdminInventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showLow, setShowLow] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState("");
  const [lowCount, setLowCount] = useState(0);
  const [form, setForm] = useState({
    name: "",
    category: "ingredientes",
    currentStock: "",
    minimumStock: "5",
    unit: "unidades",
    costPerUnit: "",
    supplier: "",
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await adminApi.inventory.getAll({
        category: category || undefined,
        search: search || undefined,
        lowStock: showLow || undefined,
      });
      if (res.data) setItems(res.data);
      if (res.lowStockCount !== undefined) setLowCount(res.lowStockCount);
    } catch {
      toast.error("Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, showLow]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.inventory.create({
        name: form.name,
        category: form.category,
        currentStock: Number(form.currentStock),
        minimumStock: Number(form.minimumStock),
        unit: form.unit,
        costPerUnit: Number(form.costPerUnit),
        supplier: form.supplier || undefined,
      });
      toast.success("Item creado");
      setShowForm(false);
      setForm({
        name: "",
        category: "ingredientes",
        currentStock: "",
        minimumStock: "5",
        unit: "unidades",
        costPerUnit: "",
        supplier: "",
      });
      fetchItems();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error";
      toast.error(message);
    }
  };

  const handleRestock = async () => {
    if (!restockId || !restockQty) return;
    try {
      await adminApi.inventory.restock(restockId, Number(restockQty));
      toast.success("Reabastecido");
      setRestockId(null);
      setRestockQty("");
      fetchItems();
    } catch {
      toast.error("Error al reabastecer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desactivar este item?")) return;
    try {
      await adminApi.inventory.delete(id);
      toast.success("Item desactivado");
      fetchItems();
    } catch {
      toast.error("Error");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventario</h1>
          <p className="text-white/50 text-sm">
            Control de stock y alertas
            {lowCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-orange-400">
                <AlertTriangle size={12} /> {lowCount} bajo stock
              </span>
            )}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={16} className="mr-2" /> Nuevo Item
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleCreate}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="text-white/50 text-xs block mb-1">Nombre</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">
              Categoría
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            >
              <option value="ingredientes">Ingredientes</option>
              <option value="bebidas">Bebidas</option>
              <option value="limpieza">Limpieza</option>
              <option value="utensilios">Utensilios</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">
              Stock Actual
            </label>
            <input
              type="number"
              required
              value={form.currentStock}
              onChange={(e) =>
                setForm((p) => ({ ...p, currentStock: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">
              Stock Mínimo
            </label>
            <input
              type="number"
              required
              value={form.minimumStock}
              onChange={(e) =>
                setForm((p) => ({ ...p, minimumStock: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">Unidad</label>
            <input
              required
              value={form.unit}
              onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">
              Costo por Unidad
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={form.costPerUnit}
              onChange={(e) =>
                setForm((p) => ({ ...p, costPerUnit: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1">
              Proveedor
            </label>
            <input
              value={form.supplier}
              onChange={(e) =>
                setForm((p) => ({ ...p, supplier: e.target.value }))
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
            />
          </div>
          <Button type="submit">Crear</Button>
        </motion.form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            size={16}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm outline-none"
          />
        </form>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none"
        >
          <option value="">Todas las categorías</option>
          <option value="ingredientes">Ingredientes</option>
          <option value="bebidas">Bebidas</option>
          <option value="limpieza">Limpieza</option>
          <option value="utensilios">Utensilios</option>
          <option value="otros">Otros</option>
        </select>
        <button
          onClick={() => setShowLow(!showLow)}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${showLow ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-[#0a0a0a] border border-white/10 text-white/50"}`}
        >
          <AlertTriangle size={14} /> Bajo Stock
        </button>
      </div>

      {/* Items */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b400]" />
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    Item
                  </th>
                  <th className="text-left text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    Categoría
                  </th>
                  <th className="text-center text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    Stock
                  </th>
                  <th className="text-right text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    Costo
                  </th>
                  <th className="text-right text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-medium">
                        {item.name}
                      </p>
                      {item.supplier && (
                        <p className="text-white/30 text-xs">{item.supplier}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/60 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`font-bold ${item.isLowStock ? "text-orange-400" : "text-white"}`}
                        >
                          {item.currentStock}
                        </span>
                        <span className="text-white/30 text-xs">
                          / {item.minimumStock} {item.unit}
                        </span>
                        {item.isLowStock && (
                          <AlertTriangle
                            size={14}
                            className="text-orange-400"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-white/60 text-sm">
                      ${item.costPerUnit.toFixed(2)}/{item.unit}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {restockId === item._id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={restockQty}
                              onChange={(e) => setRestockQty(e.target.value)}
                              placeholder="Cant."
                              className="w-16 bg-black/30 border border-white/10 rounded px-2 py-1 text-white text-xs outline-none"
                            />
                            <Button
                              size="sm"
                              onClick={handleRestock}
                              className="text-xs h-7 px-2"
                            >
                              OK
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setRestockId(null)}
                              className="text-xs h-7 px-2 text-white/40"
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setRestockId(item._id);
                                setRestockQty("");
                              }}
                              className="text-green-400/60 hover:text-green-400"
                              title="Reabastecer"
                            >
                              <RotateCcw size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(item._id)}
                              className="text-red-400/60 hover:text-red-400"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-white/30">
                      <Package size={32} className="mx-auto mb-2" />
                      No hay items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
