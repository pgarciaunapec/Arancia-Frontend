import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  DollarSign,
  Package,
  Database,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Truck,
  Receipt,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  bg: "#1a0f06",
  muted: "rgba(255,255,255,0.5)",
  border: "rgba(245, 180, 0, 0.2)",
};

type AdminNavItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  roles: Array<"admin" | "staff">;
};

const navItems: AdminNavItem[] = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    exact: true,
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/orders",
    label: "Pedidos",
    icon: <ShoppingBag size={18} />,
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/clients",
    label: "Clientes",
    icon: <Users size={18} />,
    roles: ["admin"],
  },
  {
    path: "/admin/tables",
    label: "Mesas",
    icon: <UtensilsCrossed size={18} />,
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/cash",
    label: "Caja",
    icon: <DollarSign size={18} />,
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/inventory",
    label: "Inventario",
    icon: <Package size={18} />,
    roles: ["admin"],
  },
  {
    path: "/admin/delivery",
    label: "Delivery",
    icon: <Truck size={18} />,
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/table-bills",
    label: "Cuentas Mesa",
    icon: <Receipt size={18} />,
    roles: ["admin", "staff"],
  },
  {
    path: "/admin/collections",
    label: "Colecciones",
    icon: <Database size={18} />,
    roles: ["admin"],
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const visibleNavItems = navItems.filter(
    (item) => user?.role && item.roles.includes(user.role as "admin" | "staff"),
  );

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const Sidebar = () => (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: COLORS.primary }}
          >
            <UtensilsCrossed size={18} style={{ color: COLORS.secondary }} />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Panel Admin</p>
            <p className="text-xs" style={{ color: COLORS.muted }}>
              {user?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.path, item.exact) ? "text-secondary" : "hover:bg-white/5"}`}
            style={
              isActive(item.path, item.exact)
                ? { backgroundColor: COLORS.primary, color: COLORS.secondary }
                : { color: COLORS.muted }
            }
          >
            {item.icon}
            {item.label}
            {isActive(item.path, item.exact) && (
              <ChevronRight size={14} className="ml-auto" />
            )}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: COLORS.border }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-all hover:bg-red-500/10 hover:text-red-400"
          style={{ color: COLORS.muted }}
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.bg }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block w-64 shrink-0 border-r"
        style={{
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.border,
        }}
      >
        <div className="h-full sticky top-0">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden border-r"
              style={{
                backgroundColor: COLORS.secondary,
                borderColor: COLORS.border,
              }}
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 px-4 sm:px-6 py-4 border-b flex items-center gap-4"
          style={{
            backgroundColor: COLORS.secondary,
            borderColor: COLORS.border,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-white text-sm">
              {visibleNavItems.find((n) => isActive(n.path, n.exact))?.label ||
                "Admin"}
            </h2>
          </div>
          <Link
            to="/"
            className="text-xs hover:underline"
            style={{ color: COLORS.muted }}
          >
            Ver Sitio →
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
