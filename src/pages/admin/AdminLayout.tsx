import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Receipt,
  Wallet,
  Package,
  Truck,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChefHat,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Pedidos", icon: Package },
  { to: "/admin/customers", label: "Clientes", icon: Users },
  { to: "/admin/tables", label: "Mesas", icon: UtensilsCrossed },
  { to: "/admin/table-bills", label: "Cuentas", icon: Receipt },
  { to: "/admin/cash-register", label: "Caja", icon: Wallet },
  { to: "/admin/inventory", label: "Inventario", icon: BarChart3 },
  { to: "/admin/delivery", label: "Delivery", icon: Truck },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#f5b400] flex items-center justify-center">
            <ChefHat size={20} className="text-[#2d1f0f]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Arancia</h2>
            <p className="text-white/40 text-xs">Panel de Administración</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? "bg-[#f5b400]/15 text-[#f5b400]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-[#f5b400]/20 flex items-center justify-center text-[#f5b400] text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name}
            </p>
            <p className="text-white/40 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-black">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0a0a0a] border-r border-white/10 fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1" />
          <NavLink to="/" className="text-white/40 hover:text-white text-sm">
            ← Volver al sitio
          </NavLink>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
