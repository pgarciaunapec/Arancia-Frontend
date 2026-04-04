import React, { useState } from "react";
import { motion } from "motion/react";
import { UtensilsCrossed, Users } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAdmin } from "../../context/AdminContext";
import type { TableStatus, RestaurantTable } from "../../types";

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
  cleaning: { label: "Limpieza", color: "text-blue-400", dot: "bg-blue-400" },
};

const STATUS_CYCLE: TableStatus[] = [
  "available",
  "occupied",
  "reserved",
  "cleaning",
];

const AdminTables: React.FC = () => {
  const { tables, updateTableStatus } = useAdmin();
  const [selectedSection, setSelectedSection] = useState<string>("all");

  const sections = [
    "all",
    ...Array.from(new Set(tables.map((t) => t.section))),
  ];
  const filtered =
    selectedSection === "all"
      ? tables
      : tables.filter((t) => t.section === selectedSection);

  const counts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied: tables.filter((t) => t.status === "occupied").length,
    reserved: tables.filter((t) => t.status === "reserved").length,
    cleaning: tables.filter((t) => t.status === "cleaning").length,
  };

  const cycleStatus = (table: RestaurantTable) => {
    const idx = STATUS_CYCLE.indexOf(table.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    updateTableStatus(table.id, next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión de Mesas</h1>
        <p style={{ color: COLORS.muted }}>
          {tables.length} mesas · Haz clic en una mesa para cambiar su estado
        </p>
      </div>

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
                className="p-4 cursor-pointer text-center transition-all hover:shadow-lg"
                style={{
                  backgroundColor:
                    table.status === "occupied"
                      ? "rgba(239,68,68,0.08)"
                      : table.status === "reserved"
                        ? "rgba(245,180,0,0.08)"
                        : table.status === "cleaning"
                          ? "rgba(59,130,246,0.08)"
                          : COLORS.secondary,
                  border: `2px solid ${
                    table.status === "occupied"
                      ? "rgba(239,68,68,0.4)"
                      : table.status === "reserved"
                        ? "rgba(245,180,0,0.4)"
                        : table.status === "cleaning"
                          ? "rgba(59,130,246,0.4)"
                          : COLORS.border
                  }`,
                }}
                onClick={() => cycleStatus(table)}
              >
                <div className="mb-2">
                  <UtensilsCrossed
                    size={24}
                    className="mx-auto"
                    style={{
                      color:
                        table.status === "available"
                          ? COLORS.primary
                          : COLORS.muted,
                    }}
                  />
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
              </Card>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-center" style={{ color: COLORS.muted }}>
        Haz clic en cualquier mesa para ciclar su estado: Disponible → Ocupada →
        Reservada → Limpieza
      </p>
    </div>
  );
};

export default AdminTables;
