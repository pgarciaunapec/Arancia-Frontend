import React from "react";
import { Link } from "react-router-dom";
import {
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Clock,
  ArrowRight,
} from "lucide-react";

const COLORS = {
  primary: "#f5b400",
  primaryLight: "#ffc933",
  primaryDark: "#cc9600",
  secondary: "#2d1f0f",
  secondaryLight: "#4a3520",
  white: "#ffffff",
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: COLORS.secondary,
        borderTop: `2px solid ${COLORS.primary}`,
      }}
    >
      {/* CTA Banner */}
      <div style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: COLORS.secondary }}
              >
                ¿Listo para una experiencia inolvidable?
              </h3>
              <p style={{ color: COLORS.secondaryLight }}>
                Reserva tu mesa y disfruta de nuestra gastronomía excepcional
              </p>
            </div>
            {/* Secondary Button */}
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center gap-2"
              style={{
                backgroundColor: COLORS.secondary,
                color: COLORS.primary,
                border: `2px solid ${COLORS.primaryDark}`,
              }}
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
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary }}
              >
                <UtensilsCrossed
                  size={28}
                  style={{ color: COLORS.secondary }}
                />
              </div>
              <div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  BOB
                </h3>
                <p
                  className="text-xs tracking-widest"
                  style={{ color: COLORS.primaryLight }}
                >
                  TORONJA
                </p>
              </div>
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ color: COLORS.white }}
            >
              Más de 40 años de excelencia gastronómica. Tradición, sabor y
              hospitalidad en cada visita.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ color: COLORS.primary }}
            >
              Navegación
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Inicio", path: "/" },
                { label: "Menú", path: "/menu" },
                { label: "Eventos", path: "/events" },
                { label: "Galería", path: "/gallery" },
                { label: "Contacto", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm transition-colors flex items-center gap-2 group hover:text-[#f5b400]"
                    style={{ color: COLORS.white }}
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all"
                      style={{ color: COLORS.primary }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ color: COLORS.primary }}
            >
              Contacto
            </h4>
            <ul className="space-y-3">
              <li
                className="flex items-start gap-3 text-sm"
                style={{ color: COLORS.white }}
              >
                <MapPin
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: COLORS.primary }}
                />
                <span>Calle Principal #123, Santa Fe, Rep. Dominicana</span>
              </li>
              <li
                className="flex items-center gap-3 text-sm"
                style={{ color: COLORS.white }}
              >
                <Phone
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: COLORS.primary }}
                />
                <a
                  href="tel:+18095550123"
                  className="hover:text-[#f5b400] transition-colors"
                >
                  (809) 555-0123
                </a>
              </li>
              <li
                className="flex items-center gap-3 text-sm"
                style={{ color: COLORS.white }}
              >
                <Mail
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: COLORS.primary }}
                />
                <a
                  href="mailto:info@bobtoronja.com"
                  className="hover:text-[#f5b400] transition-colors"
                >
                  info@bobtoronja.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4
              className="font-semibold mb-4 text-sm uppercase tracking-wider"
              style={{ color: COLORS.primary }}
            >
              Horarios
            </h4>
            <ul className="space-y-2">
              <li
                className="flex items-start gap-3 text-sm"
                style={{ color: COLORS.white }}
              >
                <Clock
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: COLORS.primary }}
                />
                <div>
                  <p className="font-medium" style={{ color: COLORS.primary }}>
                    Lun - Jue
                  </p>
                  <p>12:00 PM - 10:00 PM</p>
                </div>
              </li>
              <li
                className="flex items-start gap-3 text-sm"
                style={{ color: COLORS.white }}
              >
                <Clock
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: COLORS.primary }}
                />
                <div>
                  <p className="font-medium" style={{ color: COLORS.primary }}>
                    Vie - Sáb
                  </p>
                  <p>12:00 PM - 11:30 PM</p>
                </div>
              </li>
              <li
                className="flex items-start gap-3 text-sm"
                style={{ color: COLORS.white }}
              >
                <Clock
                  size={16}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: COLORS.primary }}
                />
                <div>
                  <p className="font-medium" style={{ color: COLORS.primary }}>
                    Domingo
                  </p>
                  <p>11:00 AM - 9:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: `2px solid ${COLORS.primary}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="text-sm text-center sm:text-left"
              style={{ color: COLORS.white }}
            >
              © {currentYear} Arancia. Todos los derechos reservados.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: COLORS.secondaryLight,
                  color: COLORS.white,
                  border: `2px solid ${COLORS.primary}`,
                }}
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: COLORS.secondaryLight,
                  color: COLORS.white,
                  border: `2px solid ${COLORS.primary}`,
                }}
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
