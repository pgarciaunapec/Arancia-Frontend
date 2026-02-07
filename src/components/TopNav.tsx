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
                // Always show when near top
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down - hide
                setIsVisible(false);
            } else {
                // Scrolling up - show
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
            <nav className="max-w-4xl mx-auto bg-secondary rounded-full border-2 border-primary">
                <div className="flex items-center justify-between px-2 py-1.5">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-1.5 pl-1 group">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UtensilsCrossed size={14} className="text-secondary" />
                        </div>
                        <span className="font-bold text-primary text-xs tracking-wider hidden xl:block">
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
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all text-xs font-medium ${isActive
                                            ? 'bg-white text-secondary'
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
                        className="bg-primary text-secondary px-4 py-1.5 rounded-full font-bold text-xs hover:bg-primary-light transition-all border-2 border-primary-dark"
                    >
                        Reservar
                    </button>
                </div>
            </nav>
        </div>
    );
};
