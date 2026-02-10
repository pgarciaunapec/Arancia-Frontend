import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  UtensilsCrossed,
  Info,
  Calendar,
  Briefcase,
  Image,
  Phone,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Inicio", path: "/", icon: <Home size={20} /> },
  { label: "Menú", path: "/menu", icon: <UtensilsCrossed size={20} /> },
  { label: "Sobre Nosotros", path: "/about", icon: <Info size={20} /> },
  { label: "Eventos", path: "/events", icon: <Calendar size={20} /> },
  { label: "Servicios", path: "/services", icon: <Briefcase size={20} /> },
  { label: "Galería", path: "/gallery", icon: <Image size={20} /> },
  { label: "Contacto", path: "/contact", icon: <Phone size={20} /> },
];

interface SidebarProps {
  onBooking: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 left-6 z-40 lg:hidden bg-card p-3 rounded-xl shadow-lg border border-border hover:bg-muted transition-colors"
      >
        <Menu size={24} className="text-foreground" />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen w-72 bg-sidebar border-r border-sidebar-border z-50 overflow-y-auto flex-shrink-0 shadow-xl lg:shadow-none transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-warm flex items-center justify-center">
                <UtensilsCrossed size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-sidebar-foreground">
                  BOB
                </h2>
                <p className="text-xs text-sidebar-foreground/60">TORONJA</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-sidebar-primary rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 font-medium">
                    {item.label}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`ml-auto relative z-10 transition-transform ${
                      isActive ? "translate-x-1" : "group-hover:translate-x-1"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={() => {
                onBooking();
                setIsOpen(false);
              }}
              className="w-full bg-gradient-warm text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Reservar Mesa
            </button>
            <p className="text-xs text-center text-sidebar-foreground/50 mt-3">
              © 2026 Arancia. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
