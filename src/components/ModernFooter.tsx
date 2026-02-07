import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChefHat, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  Clock,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';

const ModernFooter: React.FC = () => {
  const footerLinks = [
    {
      title: 'Navegación',
      links: [
        { label: 'Inicio', path: '/' },
        { label: 'Menú', path: '/menu' },
        { label: 'Sobre Nosotros', path: '/about' },
        { label: 'Eventos', path: '/events' },
        { label: 'Servicios', path: '/services' },
      ]
    },
    {
      title: 'Horarios',
      links: [
        { label: 'Lun - Vie: 11:00 AM - 10:00 PM', path: '#' },
        { label: 'Sábado: 12:00 PM - 11:00 PM', path: '#' },
        { label: 'Domingo: 12:00 PM - 9:00 PM', path: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-secondary via-[#252525] to-secondary text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-primary to-[#ff8c6b] rounded-2xl flex items-center justify-center shadow-lg"
              >
                <ChefHat className="w-7 h-7 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">BOB TORONJA</span>
                <span className="text-xs text-white/60">Desde 1984</span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Más de 40 años sirviendo la mejor gastronomía dominicana con pasión, 
              calidad y dedicación. Una experiencia culinaria inolvidable.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-primary transition-all"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-primary transition-all"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-primary transition-all"
              >
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {section.title === 'Horarios' && <Clock className="w-5 h-5 text-primary" />}
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    {link.path === '#' ? (
                      <span className="text-white/70 text-sm">{link.label}</span>
                    ) : (
                      <Link 
                        to={link.path} 
                        className="text-white/70 hover:text-primary transition-colors text-sm block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>Calle Principal #123<br />Santa Fe, República Dominicana</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>(809) 555-1234</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>info@bobtoronja.com</span>
              </li>
            </ul>
            <div className="pt-4">
              <Link to="/menu">
                <Button className="w-full bg-gradient-to-r from-primary to-[#ff8c6b] hover:shadow-lg transition-all">
                  Ordenar Ahora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © 2026 BOB TORONJA. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span>en República Dominicana</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
