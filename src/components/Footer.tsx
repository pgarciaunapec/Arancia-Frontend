import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Clock,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-primary/20">
      {/* CTA Banner */}
      <div className="bg-gradient-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
                ¿Listo para una experiencia inolvidable?
              </h3>
              <p className="text-secondary/80">
                Reserva tu mesa y disfruta de nuestra gastronomía excepcional
              </p>
            </div>
            <Link
              to="/contact"
              className="bg-secondary text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary/90 transition-all hover:scale-105 flex items-center gap-2 shadow-xl"
            >
              Reservar Ahora
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-warm flex items-center justify-center shadow-lg">
                <UtensilsCrossed size={28} className="text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">BOB</h3>
                <p className="text-xs text-primary/60 tracking-widest">TORONJA</p>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Más de 40 años de excelencia gastronómica.
              Tradición, sabor y hospitalidad en cada visita.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Inicio', path: '/' },
                { label: 'Menú', path: '/menu' },
                { label: 'Eventos', path: '/events' },
                { label: 'Galería', path: '/gallery' },
                { label: 'Contacto', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-primary text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Calle Principal #123, Santa Fe, Rep. Dominicana</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <a href="tel:+18095550123" className="hover:text-primary transition-colors">
                  (809) 555-0123
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <a href="mailto:info@bobtoronja.com" className="hover:text-primary transition-colors">
                  info@bobtoronja.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              Horarios
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/80 font-medium">Lun - Jue</p>
                  <p>12:00 PM - 10:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/80 font-medium">Vie - Sáb</p>
                  <p>12:00 PM - 11:30 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <Clock size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/80 font-medium">Domingo</p>
                  <p>11:00 AM - 9:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center sm:text-left">
              © {currentYear} Bob Toronja. Todos los derechos reservados.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-warm flex items-center justify-center text-white/60 hover:text-secondary transition-all"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-warm flex items-center justify-center text-white/60 hover:text-secondary transition-all"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
