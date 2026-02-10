import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`hidden lg:block fixed top-0 left-0 right-0 z-50 px-8 xl:px-16 2xl:px-24 pt-5 transition-all duration-500 ease-out ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
    >
      <nav
        className="w-fit mx-auto rounded-full border-2 shadow-lg"
        style={{
          backgroundColor: COLORS.secondary,
          borderColor: COLORS.primary,
        }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 pl-2 pr-8 group">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md"
              style={{ backgroundColor: COLORS.primary }}
            >
              <UtensilsCrossed size={20} style={{ color: COLORS.secondary }} />
            </div>
            <span
              className="font-bold text-lg tracking-wider hidden xl:block"
              style={{ color: COLORS.primary }}
            >
              Arancia
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium hover:bg-white/5"
                  style={{
                    backgroundColor: isActive ? COLORS.white : "transparent",
                    color: isActive
                      ? COLORS.secondary
                      : "rgba(255,255,255,0.9)",
                    fontWeight: isActive ? 700 : 500,
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
          <div className="flex items-center gap-5">
            {/* My Reservations Icon */}
            <Link
              to="/my-reservations"
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors group"
              title="Mis Reservas"
            >
              <CalendarCheck
                size={22}
                className="text-white group-hover:text-[#f5b400] transition-colors"
              />
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors relative group"
              title="Carrito"
            >
              <ShoppingBag
                size={22}
                className="text-white group-hover:text-[#f5b400] transition-colors"
              />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#f5b400] border-2 border-[#2d1f0f]" />
            </Link>

            {/* Profile Icon */}
            <Link
              to="/profile"
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors group mr-2"
              title="Perfil"
            >
              <User
                size={22}
                className="text-white group-hover:text-[#f5b400] transition-colors"
              />
            </Link>

            {/* CTA Button - Primary Style */}
            <Link
              to="/reservations"
              className="px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: COLORS.primary,
                color: COLORS.secondary,
                display: "inline-block",
              }}
            >
              Reservar Mesa
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
