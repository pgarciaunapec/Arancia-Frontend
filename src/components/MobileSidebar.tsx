import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
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
    X
} from 'lucide-react';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Inicio', path: '/', icon: <Home size={20} /> },
    { label: 'Menú', path: '/menu', icon: <UtensilsCrossed size={20} /> },
    { label: 'Sobre Nosotros', path: '/about', icon: <Info size={20} /> },
    { label: 'Eventos', path: '/events', icon: <Calendar size={20} /> },
    { label: 'Servicios', path: '/services', icon: <Briefcase size={20} /> },
    { label: 'Galería', path: '/gallery', icon: <Image size={20} /> },
    { label: 'Contacto', path: '/contact', icon: <Phone size={20} /> },
];

// Color constants
const COLORS = {
    primary: '#f5b400',
    primaryLight: '#ffc933',
    primaryDark: '#cc9600',
    secondary: '#2d1f0f',
    secondaryLight: '#4a3520',
    white: '#ffffff',
};

interface MobileSidebarProps {
    onBooking: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ onBooking }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-40 lg:hidden p-3 rounded-xl transition-colors"
                style={{
                    backgroundColor: COLORS.secondary,
                    border: `2px solid ${COLORS.primary}`
                }}
            >
                <Menu size={24} style={{ color: COLORS.primary }} />
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 lg:hidden"
                        style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed lg:hidden top-0 left-0 h-screen w-80 z-50 overflow-y-auto transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{
                    backgroundColor: COLORS.secondary,
                    borderRight: `2px solid ${COLORS.primary}`
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and Close Button */}
                    <div
                        className="flex items-center justify-between p-6"
                        style={{ borderBottom: `2px solid ${COLORS.primary}` }}
                    >
                        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: COLORS.primary }}
                            >
                                <UtensilsCrossed size={24} style={{ color: COLORS.secondary }} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>BOB</h2>
                                <p className="text-xs tracking-widest" style={{ color: COLORS.primaryLight }}>TORONJA</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-xl transition-colors"
                            style={{ color: COLORS.white }}
                        >
                            <X size={24} />
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
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group"
                                    style={{
                                        backgroundColor: isActive ? COLORS.white : 'transparent',
                                        color: isActive ? COLORS.secondary : COLORS.white,
                                        border: isActive ? `2px solid ${COLORS.primary}` : '2px solid transparent',
                                    }}
                                >
                                    <span style={{ color: isActive ? COLORS.primary : 'inherit' }}>{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                    <ChevronRight
                                        size={16}
                                        className="ml-auto transition-transform group-hover:translate-x-1"
                                        style={{ color: isActive ? COLORS.primary : 'inherit' }}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA Button - Primary Style */}
                    <div className="p-4" style={{ borderTop: `2px solid ${COLORS.primary}` }}>
                        <button
                            onClick={() => {
                                onBooking();
                                setIsOpen(false);
                            }}
                            className="w-full py-4 px-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95"
                            style={{
                                backgroundColor: COLORS.primary,
                                color: COLORS.secondary
                            }}
                        >
                            ✨ Reservar Mesa
                        </button>
                        <p className="text-xs text-center mt-4" style={{ color: COLORS.white }}>
                            © 2026 Bob Toronja
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};
