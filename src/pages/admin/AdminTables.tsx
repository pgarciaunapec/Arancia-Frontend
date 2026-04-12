import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Edit2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAdmin } from "../../context/AdminContext";
import type { TableStatus, RestaurantTable } from "../../types";
import { getImageUrl } from "../../services/api";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.2)",
};

const statusConfig: Record<
  TableStatus,
  { label: string; color: string; dot: string }
> = {
  available: {
    label: "Disponible",
    color: "text-green-400",
    dot: "bg-green-400",
  },
  occupied: { label: "Ocupada", color: "text-red-400", dot: "bg-red-400" },
  reserved: {
    label: "Reservada",
    color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  maintenance: {
    label: "Mantenimiento",
    color: "text-blue-400",
    dot: "bg-blue-400",
  },
};

const STATUS_CYCLE: TableStatus[] = [
  "available",
  "reserved",
  "occupied",
  "maintenance",
];

type TableFormValues = {
  number: string;
  capacity: string;
  zone: string;
  status: TableStatus;
  image: string;
  description: string;
};

const blankForm: TableFormValues = {
  number: "",
  capacity: "4",
  zone: "Salón Principal",
  status: "available",
  image: "",
  description: "",
};

const AdminTables: React.FC = () => {
  const { tables, updateTableStatus, createTable, updateTable, deleteTable } =
    useAdmin();
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState<TableFormValues>(blankForm);

  const sections = useMemo(
    () => ["all", ...Array.from(new Set(tables.map((t) => t.section)))],
    [tables],
  );

  const filtered =
    selectedSection === "all"
      ? tables
      : tables.filter((t) => t.section === selectedSection);

  const counts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    maintenance: tables.filter((t) => t.status === "maintenance").length,
  };

  const cycleStatus = (table: RestaurantTable) => {
    const idx = STATUS_CYCLE.indexOf(table.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    void updateTableStatus(table.id, next);
  };

  const openCreate = () => {
    setEditingTable(null);
    setFormValues(blankForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (table: RestaurantTable) => {
    setEditingTable(table);
    setFormValues({
      number: String(table.number),
      capacity: String(table.capacity),
      zone: table.section,
      status: table.status,
      image: table.image || "",
      description: table.description || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const number = Number(formValues.number);
    const capacity = Number(formValues.capacity);

    if (!Number.isFinite(number) || number < 1) {
      setError("El número de mesa debe ser mayor o igual a 1.");
      return;
    }

    if (!Number.isFinite(capacity) || capacity < 1) {
      setError("La capacidad debe ser mayor o igual a 1.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingTable) {
        await updateTable(editingTable.id, {
          number,
          capacity,
          zone: formValues.zone,
          status: formValues.status,
          image: formValues.image || undefined,
          description: formValues.description || undefined,
        });
      } else {
        await createTable({
          number,
          capacity,
          zone: formValues.zone,
          image: formValues.image || undefined,
          description: formValues.description || undefined,
        });
      }

      setShowForm(false);
      setEditingTable(null);
      setFormValues(blankForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar la mesa.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (table: RestaurantTable) => {
    if (!window.confirm(`¿Eliminar mesa #${table.number}?`)) {
      return;
    }

    try {
      await deleteTable(table.id);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "No se pudo eliminar la mesa.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Mesas</h1>
          <p style={{ color: COLORS.muted }}>
            {tables.length} mesas · Disponibilidad sincronizada con reservas de
            usuarios
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={openCreate}>
          <Plus size={16} /> Nueva Mesa
        </Button>
      </div>

      {error && (
        <Card className="p-3 border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
          {error}
        </Card>
      )}

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.entries(counts) as [TableStatus, number][]).map(
          ([status, count]) => {
            const cfg = statusConfig[status];
            return (
              <Card
                key={status}
                className="p-4 text-center"
                style={{
                  backgroundColor: COLORS.secondary,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full mx-auto mb-2 ${cfg.dot}`}
                />
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs" style={{ color: COLORS.muted }}>
                  {cfg.label}
                </p>
              </Card>
            );
          },
        )}
      </div>

      {/* Section Filter */}
      <div className="flex gap-2 flex-wrap">
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className="text-xs px-4 py-2 rounded-full border transition-all capitalize"
            style={{
              borderColor:
                selectedSection === sec ? COLORS.primary : "transparent",
              backgroundColor:
                selectedSection === sec
                  ? "rgba(245,180,0,0.1)"
                  : "rgba(255,255,255,0.05)",
              color: selectedSection === sec ? COLORS.primary : COLORS.muted,
            }}
          >
            {sec === "all" ? "Todas" : sec}
          </button>
        ))}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filtered.map((table) => {
          const cfg = statusConfig[table.status];
          return (
            <motion.div
              layout
              key={table.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="p-3 cursor-pointer text-center transition-all hover:shadow-lg"
                style={{
                  backgroundColor:
                    table.status === "occupied"
                      ? "rgba(239,68,68,0.08)"
                      : table.status === "reserved"
                        ? "rgba(245,180,0,0.08)"
                        : table.status === "maintenance"
                          ? "rgba(59,130,246,0.08)"
                          : COLORS.secondary,
                  border: `2px solid ${
                    table.status === "occupied"
                      ? "rgba(239,68,68,0.4)"
                      : table.status === "reserved"
                        ? "rgba(245,180,0,0.4)"
                        : table.status === "maintenance"
                          ? "rgba(59,130,246,0.4)"
                          : COLORS.border
                  }`,
                }}
              >
                <div className="mb-2 rounded-lg overflow-hidden border border-white/10 bg-black/20 h-24 flex items-center justify-center">
                  {table.image ? (
                    <img
                      src={getImageUrl(table.image)}
                      alt={`Mesa ${table.number}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={18} className="text-white/30" />
                  )}
                </div>

                <p className="text-lg font-bold text-white">#{table.number}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Users size={10} style={{ color: COLORS.muted }} />
                  <p className="text-xs" style={{ color: COLORS.muted }}>
                    {table.capacity} pers.
                  </p>
                </div>
                <div
                  className={`flex items-center justify-center gap-1 mt-2 text-xs font-medium ${cfg.color}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </div>
                <p className="text-xs mt-1 opacity-50 text-white">
                  {table.section}
                </p>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="p-1.5 rounded hover:bg-white/10 text-white/70"
                    onClick={() => cycleStatus(table)}
                    title="Cambiar estado"
                  >
                    <UtensilsCrossed size={14} />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded hover:bg-white/10 text-white/70"
                    onClick={() => openEdit(table)}
                    title="Editar mesa"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded hover:bg-red-500/10 text-white/70 hover:text-red-300"
                    onClick={() => {
                      void handleDelete(table);
                    }}
                    title="Eliminar mesa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-center" style={{ color: COLORS.muted }}>
        Estado sincronizado con el flujo de reservas: una reserva asigna mesa en
        `Reservada` automáticamente.
      </p>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setShowForm(false)}
        >
          <Card
            className="w-full max-w-2xl p-6"
            style={{
              backgroundColor: COLORS.secondary,
              border: `1px solid ${COLORS.border}`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingTable
                  ? `Editar Mesa #${editingTable.number}`
                  : "Nueva Mesa"}
              </h2>
              <button
                type="button"
                className="text-white/50 hover:text-white"
                onClick={() => setShowForm(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/60 block mb-1">
                  Número
                </label>
                <input
                  type="number"
                  value={formValues.number}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      number: event.target.value,
                    }))
                  }
                  className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                  style={{ borderColor: COLORS.border }}
                />
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">
                  Capacidad
                </label>
                <input
                  type="number"
                  value={formValues.capacity}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      capacity: event.target.value,
                    }))
                  }
                  className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                  style={{ borderColor: COLORS.border }}
                />
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">Zona</label>
                <input
                  type="text"
                  value={formValues.zone}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      zone: event.target.value,
                    }))
                  }
                  className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                  style={{ borderColor: COLORS.border }}
                />
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">
                  Estado
                </label>
                <select
                  value={formValues.status}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      status: event.target.value as TableStatus,
                    }))
                  }
                  className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                  style={{ borderColor: COLORS.border }}
                >
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-white/60 block mb-1">
                  Imagen (URL)
                </label>
                <input
                  type="text"
                  value={formValues.image}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      image: event.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                  style={{ borderColor: COLORS.border }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-white/60 block mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formValues.description}
                  onChange={(event) =>
                    setFormValues((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                  style={{ borderColor: COLORS.border }}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-300 mt-3">{error}</p>}

            <div className="flex gap-3 mt-5">
              <Button
                onClick={() => void handleSubmit()}
                disabled={saving}
                className="flex-1"
              >
                {saving
                  ? "Guardando..."
                  : editingTable
                    ? "Actualizar mesa"
                    : "Crear mesa"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/20 text-white/70"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminTables;
