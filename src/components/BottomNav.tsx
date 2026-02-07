import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    UtensilsCrossed,
    Info,
    Calendar,
    Briefcase,
    Image,
    Phone
} from 'lucide-react';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Inicio', path: '/', icon: <Home size={20} /> },
    { label: 'Menú', path: '/menu', icon: <UtensilsCrossed size={20} /> },
    { label: 'Nosotros', path: '/about', icon: <Info size={20} /> },
    { label: 'Eventos', path: '/events', icon: <Calendar size={20} /> },
    { label: 'Servicios', path: '/services', icon: <Briefcase size={20} /> },
    { label: 'Galería', path: '/gallery', icon: <Image size={20} /> },
    { label: 'Contacto', path: '/contact', icon: <Phone size={20} /> },
];

interface BottomNavProps {
    onBooking: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onBooking }) => {
    const location = useLocation();

    return (
        <nav className="hidden lg:flex fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10">
            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UtensilsCrossed size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-white text-sm tracking-wider">BOB TORONJA</span>
                    </Link>

                    {/* Navigation Items */}
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${isActive
                                            ? 'bg-primary text-white'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="hidden xl:inline">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onBooking}
                        className="bg-gradient-warm text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all hover:scale-105"
                    >
                        Reservar
                    </button>
                </div>
            </div>
        </nav>
    );
};
