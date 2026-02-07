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
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-40 lg:hidden bg-secondary p-3 rounded-xl border-2 border-primary hover:bg-secondary-light transition-colors"
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
                        className="fixed inset-0 bg-black z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed lg:hidden top-0 left-0 h-screen w-80 bg-secondary border-r-2 border-primary z-50 overflow-y-auto transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and Close Button */}
                    <div className="flex items-center justify-between p-6 border-b-2 border-primary">
                        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-2 border-primary-dark">
                                <UtensilsCrossed size={24} className="text-secondary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-primary">BOB</h2>
                                <p className="text-xs text-primary-light tracking-widest">TORONJA</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-primary transition-colors p-2 hover:bg-secondary-light rounded-xl border-2 border-transparent hover:border-primary"
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
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group border-2 ${isActive
                                            ? 'bg-white text-secondary border-primary'
                                            : 'text-white border-transparent hover:bg-secondary-light hover:text-white hover:border-primary'
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
                    <div className="p-4 border-t-2 border-primary">
                        <button
                            onClick={() => {
                                onBooking();
                                setIsOpen(false);
                            }}
                            className="w-full bg-primary text-secondary py-4 px-4 rounded-xl font-bold text-lg hover:bg-primary-light transition-all border-2 border-primary-dark"
                        >
                            ✨ Reservar Mesa
                        </button>
                        <p className="text-xs text-center text-white mt-4">
                            © 2026 Bob Toronja
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};
