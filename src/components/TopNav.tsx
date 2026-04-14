import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  UtensilsCrossed,
  Info,
  Calendar,
  Briefcase,
  Image,
  Phone,
  ShoppingBag,
  User,
  CalendarCheck,
  LogOut,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Inicio", path: "/", icon: <Home size={16} /> },
  { label: "Menú", path: "/menu", icon: <UtensilsCrossed size={16} /> },
  { label: "Nosotros", path: "/about", icon: <Info size={16} /> },
  { label: "Eventos", path: "/events", icon: <Calendar size={16} /> },
  { label: "Servicios", path: "/services", icon: <Briefcase size={16} /> },
  { label: "Galería", path: "/gallery", icon: <Image size={16} /> },
  { label: "Contacto", path: "/contact", icon: <Phone size={16} /> },
];

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  white: "#ffffff",
};

export const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { count } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Hide nav on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 100) setIsVisible(true);
      else if (currentScrollY > lastScrollY) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div
      className={`hidden lg:block fixed top-0 left-0 right-0 z-50 px-8 xl:px-16 2xl:px-24 pt-5 transition-all duration-500 ease-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <nav
        className="max-w-4xl mx-auto rounded-full border-2 shadow-lg"
        style={{
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.primary,
        }}
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 pl-1 group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ backgroundColor: COLORS.primary }}
            >
              <UtensilsCrossed size={14} style={{ color: COLORS.secondary }} />
            </div>
            <span
              className="font-bold text-xs tracking-wider hidden xl:block"
              style={{ color: COLORS.primary }}
            >
              Arancia
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all text-xs font-medium"
                  style={{
                    backgroundColor: isActive ? COLORS.white : "transparent",
                    color: isActive
                      ? COLORS.secondary
                      : "rgba(255,255,255,0.8)",
                  }}
                >
                  <span
                    style={{ color: isActive ? COLORS.primary : "inherit" }}
                  >
                    {item.icon}
                  </span>
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 mr-1">
            {/* Reservations */}
            <Link
              to="/my-reservations"
              className="p-2 rounded-full hover:bg-white/10 transition-colors group"
              title="Mis Reservas"
            >
              <CalendarCheck
                size={18}
                className="text-white group-hover:text-[#f5b400] transition-colors"
              />
            </Link>

            {/* My Orders */}
            {isAuthenticated && (
              <Link
                to="/my-orders"
                className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                title="Mis Pedidos"
              >
                <Package
                  size={18}
                  className="text-white group-hover:text-[#f5b400] transition-colors"
                />
              </Link>
            )}

            {/* Cart with count */}
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-white/10 transition-colors relative group"
              title="Carrito"
            >
              <ShoppingBag
                size={18}
                className="text-white group-hover:text-[#f5b400] transition-colors"
              />
              {count > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: COLORS.secondary,
                  }}
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-full hover:bg-white/10 transition-colors group"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: COLORS.secondary,
                    }}
                  >
                    {initials}
                  </div>
                  <span className="text-xs text-white/80 hidden xl:block max-w-[80px] truncate">
                    {user?.name.split(" ")[0]}
                  </span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors group"
                  title="Iniciar Sesión"
                >
                  <User
                    size={18}
                    className="text-white group-hover:text-[#f5b400] transition-colors"
                  />
                </Link>
              )}

              {/* Dropdown */}
              {showUserMenu && isAuthenticated && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl shadow-xl overflow-hidden border"
                  style={{
                    backgroundColor: COLORS.secondary,
                    borderColor: "rgba(245,180,0,0.3)",
                  }}
                >
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                      {user?.email}
                    </p>
                  </div>
                  {[
                    {
                      to: "/profile",
                      icon: <User size={14} />,
                      label: "Mi Perfil",
                    },
                    {
                      to: "/my-orders",
                      icon: <Package size={14} />,
                      label: "Mis Pedidos",
                    },
                    {
                      to: "/my-reservations",
                      icon: <CalendarCheck size={14} />,
                      label: "Mis Reservas",
                    },
                    ...(isAdmin
                      ? [
                          {
                            to: "/admin",
                            icon: <ShieldCheck size={14} />,
                            label: "Panel Admin",
                          },
                        ]
                      : []),
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <span style={{ color: COLORS.primary }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs w-full text-left text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/10"
                  >
                    <LogOut size={14} /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              to="/reservations"
              className="px-4 py-1.5 rounded-full font-bold text-xs transition-all hover:scale-105 active:scale-95 ml-1"
              style={{
                backgroundColor: COLORS.primary,
                color: COLORS.secondary,
              }}
            >
              Reservar
            </Link>
          </div>
        </div>
      </nav>

      {/* Backdrop to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};
