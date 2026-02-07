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
    { label: 'Inicio', path: '/', icon: <Home size={18} /> },
    { label: 'Menú', path: '/menu', icon: <UtensilsCrossed size={18} /> },
    { label: 'Nosotros', path: '/about', icon: <Info size={18} /> },
    { label: 'Eventos', path: '/events', icon: <Calendar size={18} /> },
    { label: 'Servicios', path: '/services', icon: <Briefcase size={18} /> },
    { label: 'Galería', path: '/gallery', icon: <Image size={18} /> },
    { label: 'Contacto', path: '/contact', icon: <Phone size={18} /> },
];

interface TopNavProps {
    onBooking: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onBooking }) => {
    const location = useLocation();

    return (
        <div className="hidden lg:block fixed top-0 left-0 right-0 z-50 px-4 xl:px-8 pt-4">
            <nav className="max-w-6xl mx-auto bg-secondary/95 backdrop-blur-xl rounded-full border border-primary/20 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between px-3 py-2">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group pl-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-warm flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <UtensilsCrossed size={16} className="text-secondary" />
                        </div>
                        <span className="font-bold text-primary text-sm tracking-wider hidden xl:block">
                            BOB TORONJA
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
                                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full transition-all text-sm font-medium ${isActive
                                            ? 'bg-white text-secondary shadow-lg'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    <span className={isActive ? 'text-primary' : ''}>{item.icon}</span>
                                    <span className="hidden xl:inline">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onBooking}
                        className="bg-gradient-warm text-secondary px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                    >
                        Reservar
                    </button>
                </div>
            </nav>
        </div>
    );
};
