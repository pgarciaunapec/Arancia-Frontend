import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Menu as MenuIcon,
  Info,
  Calendar,
  Briefcase,
  X,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "./ui/button";

interface ModernSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onShowModal: () => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isOpen,
  onClose,
  onShowModal,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const navItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: MenuIcon, label: "Menú", path: "/menu" },
    { icon: Info, label: "Sobre Nosotros", path: "/about" },
    { icon: Calendar, label: "Eventos", path: "/events" },
    { icon: Briefcase, label: "Servicios", path: "/services" },
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-sidebar shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-sidebar-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-sidebar-foreground">
                    Arancia
                  </h2>
                  <p className="text-sm text-sidebar-foreground/60">
                    Menú de navegación
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.button
                      key={item.path}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Contact Section */}
              <div className="mt-8 p-4 bg-sidebar-accent rounded-xl">
                <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">
                  Contáctanos
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onShowModal();
                      onClose();
                    }}
                    className="flex items-center gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors w-full"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">(809) 555-1234</span>
                  </button>
                  <div className="flex items-center gap-3 text-sidebar-foreground/80">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">info@bobtoronja.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sidebar-foreground/80">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Santa Fe, RD</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-sidebar-foreground mb-3 px-4">
                  Síguenos
                </h3>
                <div className="flex items-center gap-2 px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
                  >
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary"
                  >
                    <Twitter className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-sidebar-border">
              <Button
                onClick={() => {
                  handleNavigation("/menu");
                }}
                className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground shadow-lg"
              >
                Ver Menú Completo
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernSidebar;
