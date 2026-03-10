import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  Package,
  DollarSign,
  Truck,
  Calendar,
  UtensilsCrossed,
  AlertTriangle,
} from "lucide-react";
import { adminApi, type DashboardStats } from "../../services/api";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard
      .getStats()
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b400]" />
      </div>
    );
  }

  const cards = [
    {
      label: "Usuarios Totales",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Pedidos Hoy",
      value: stats?.todayOrders ?? 0,
      icon: Package,
      color: "text-[#f5b400]",
      bg: "bg-[#f5b400]/10",
    },
    {
      label: "Pedidos Pendientes",
      value: stats?.pendingOrders ?? 0,
      icon: AlertTriangle,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      label: "Ingresos Hoy",
      value: `$${(stats?.todayRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Reservas Hoy",
      value: stats?.todayReservations ?? 0,
      icon: Calendar,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Delivery Activo",
      value: stats?.activeDeliveries ?? 0,
      icon: Truck,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: "Mesas Ocupadas",
      value: `${stats?.occupiedTables ?? 0}/${stats?.totalTables ?? 0}`,
      icon: UtensilsCrossed,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
    {
      label: "Pedidos Totales",
      value: stats?.totalOrders ?? 0,
      icon: Package,
      color: "text-white/60",
      bg: "bg-white/5",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm">{card.label}</span>
              <div
                className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}
              >
                <card.icon size={18} className={card.color} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
