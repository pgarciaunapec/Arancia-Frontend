import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChefHat, Phone, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

interface ModernHeaderProps {
  onShowModal: () => void;
  onToggleSidebar: () => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ onShowModal, onToggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-border' 
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-primary to-[#ff8c6b] rounded-2xl flex items-center justify-center shadow-lg"
            >
              <ChefHat className="w-7 h-7 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-[#ff8c6b] bg-clip-text text-transparent">
                BOB TORONJA
              </span>
              <span className="text-xs text-muted-foreground -mt-1">Gastronomía Excepcional</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" active={location.pathname === '/'}>Inicio</NavLink>
            <NavLink to="/menu" active={location.pathname === '/menu'}>Menú</NavLink>
            <NavLink to="/about" active={location.pathname === '/about'}>Nosotros</NavLink>
            <NavLink to="/events" active={location.pathname === '/events'}>Eventos</NavLink>
            <NavLink to="/services" active={location.pathname === '/services'}>Servicios</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={onShowModal}
            >
              <Phone className="w-5 h-5" />
            </Button>
            
            <Link to="/menu">
              <Button className="hidden md:flex gap-2 bg-gradient-to-r from-primary to-[#ff8c6b] hover:shadow-lg transition-all">
                <ShoppingBag className="w-4 h-4" />
                Ordenar
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

const NavLink: React.FC<{ to: string; active: boolean; children: React.ReactNode }> = ({ 
  to, 
  active, 
  children 
}) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-lg transition-all ${
        active 
          ? 'bg-accent text-primary font-medium' 
          : 'text-foreground hover:bg-muted'
      }`}
    >
      {children}
    </motion.div>
  </Link>
);

export default ModernHeader;
