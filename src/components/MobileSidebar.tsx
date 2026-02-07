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

interface MobileSidebarProps {
    onBooking: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ onBooking }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-40 lg:hidden bg-secondary/90 backdrop-blur-sm p-3 rounded-xl border border-primary/30 hover:bg-primary/20 transition-colors shadow-lg"
            >
                <Menu size={24} className="text-primary" />
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed lg:hidden top-0 left-0 h-screen w-80 bg-secondary/98 backdrop-blur-xl border-r border-primary/20 z-50 overflow-y-auto transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and Close Button */}
                    <div className="flex items-center justify-between p-6 border-b border-primary/20">
                        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                            <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center shadow-lg">
                                <UtensilsCrossed size={24} className="text-secondary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-primary">BOB</h2>
                                <p className="text-xs text-primary/60 tracking-widest">TORONJA</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/60 hover:text-primary transition-colors p-2 hover:bg-white/10 rounded-xl"
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
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${isActive
                                            ? 'bg-white text-secondary shadow-lg'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <span className={isActive ? 'text-primary' : ''}>{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                    <ChevronRight
                                        size={16}
                                        className={`ml-auto transition-transform ${isActive ? 'translate-x-1 text-primary' : 'group-hover:translate-x-1'
                                            }`}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA Button */}
                    <div className="p-4 border-t border-primary/20">
                        <button
                            onClick={() => {
                                onBooking();
                                setIsOpen(false);
                            }}
                            className="w-full bg-gradient-warm text-secondary py-4 px-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                        >
                            ✨ Reservar Mesa
                        </button>
                        <p className="text-xs text-center text-white/40 mt-4">
                            © 2026 Bob Toronja
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};
