import React, { useState, useEffect } from 'react';
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
    { label: 'Inicio', path: '/', icon: <Home size={16} /> },
    { label: 'Menú', path: '/menu', icon: <UtensilsCrossed size={16} /> },
    { label: 'Nosotros', path: '/about', icon: <Info size={16} /> },
    { label: 'Eventos', path: '/events', icon: <Calendar size={16} /> },
    { label: 'Servicios', path: '/services', icon: <Briefcase size={16} /> },
    { label: 'Galería', path: '/gallery', icon: <Image size={16} /> },
    { label: 'Contacto', path: '/contact', icon: <Phone size={16} /> },
];

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
};

interface TopNavProps {
    onBooking: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onBooking }) => {
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

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={`hidden lg:block fixed top-0 left-0 right-0 z-50 px-8 xl:px-16 2xl:px-24 pt-5 transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                }`}
        >
            <nav
                className="max-w-4xl mx-auto rounded-full border-2 shadow-lg"
                style={{ backgroundColor: COLORS.secondary, borderColor: COLORS.primary }}
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
                        <span className="font-bold text-xs tracking-wider hidden xl:block" style={{ color: COLORS.primary }}>
                            BOB TORONJA
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
                                        backgroundColor: isActive ? COLORS.white : 'transparent',
                                        color: isActive ? COLORS.secondary : 'rgba(255,255,255,0.8)',
                                    }}
                                >
                                    <span style={{ color: isActive ? COLORS.primary : 'inherit' }}>{item.icon}</span>
                                    <span className="hidden xl:inline">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA Button - Primary Style */}
                    <button
                        onClick={onBooking}
                        className="px-4 py-1.5 rounded-full font-bold text-xs transition-all hover:scale-105 active:scale-95"
                        style={{ backgroundColor: COLORS.primary, color: COLORS.secondary }}
                    >
                        Reservar
                    </button>
                </div>
            </nav>
        </div>
    );
};
