import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    X,
    ShoppingBag,
    User,
    Package,
    LogOut,
    LogIn,
    ShieldCheck,
    CalendarCheck,
    UserPlus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Inicio', path: '/', icon: <Home size={20} /> },
    { label: 'Menú', path: '/menu', icon: <UtensilsCrossed size={20} /> },
    { label: 'Carrito', path: '/cart', icon: <ShoppingBag size={20} /> },
    { label: 'Mis Reservas', path: '/my-reservations', icon: <CalendarCheck size={20} /> },
    { label: 'Sobre Nosotros', path: '/about', icon: <Info size={20} /> },
    { label: 'Eventos', path: '/events', icon: <Calendar size={20} /> },
    { label: 'Servicios', path: '/services', icon: <Briefcase size={20} /> },
    { label: 'Galería', path: '/gallery', icon: <Image size={20} /> },
    { label: 'Contacto', path: '/contact', icon: <Phone size={20} /> },
];

const COLORS = {
    primary: '#f5b400',
    primaryLight: '#ffc933',
    secondary: '#2d1f0f',
    secondaryLight: '#4a3520',
    white: '#ffffff',
};

export const MobileSidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { count } = useCart();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    // Hide on admin pages
    if (location.pathname.startsWith('/admin')) return null;

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const initials = user?.name
        .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-40 lg:hidden p-3 rounded-xl transition-colors"
                style={{ backgroundColor: COLORS.secondary, border: `2px solid ${COLORS.primary}` }}
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
                style={{ backgroundColor: COLORS.secondary, borderRight: `2px solid ${COLORS.primary}` }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and Close Button */}
                    <div className="flex items-center justify-between p-6" style={{ borderBottom: `2px solid ${COLORS.primary}` }}>
                        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
                                <UtensilsCrossed size={24} style={{ color: COLORS.secondary }} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold" style={{ color: COLORS.primary }}>BOB</h2>
                                <p className="text-xs tracking-widest" style={{ color: COLORS.primaryLight }}>TORONJA</p>
                            </div>
                        </Link>
                        <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl" style={{ color: COLORS.white }}>
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {/* User section when logged in */}
                        {isAuthenticated && (
                            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl"
                                style={{ backgroundColor: 'rgba(245,180,0,0.1)', border: '1px solid rgba(245,180,0,0.2)' }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                                    style={{ backgroundColor: COLORS.primary, color: COLORS.secondary }}>
                                    {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                                    <p className="text-xs truncate" style={{ color: 'rgba(245,180,0,0.7)' }}>{user?.email}</p>
                                </div>
                            </div>
                        )}

                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const isCart = item.path === '/cart';
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
                                    <span style={{ color: isActive ? COLORS.primary : 'inherit' }} className="relative">
                                        {item.icon}
                                        {isCart && count > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                                                style={{ backgroundColor: COLORS.primary, color: COLORS.secondary }}>
                                                {count > 9 ? '9+' : count}
                                            </span>
                                        )}
                                    </span>
                                    <span className="font-medium">{item.label}</span>
                                    <ChevronRight size={16} className="ml-auto transition-transform group-hover:translate-x-1" style={{ color: isActive ? COLORS.primary : 'inherit' }} />
                                </Link>
                            );
                        })}

                        {/* Auth-specific links */}
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group"
                                    style={{ color: COLORS.white, border: '2px solid transparent' }}>
                                    <User size={20} />
                                    <span className="font-medium">Mi Perfil</span>
                                    <ChevronRight size={16} className="ml-auto" />
                                </Link>
                                <Link to="/my-orders" onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group"
                                    style={{ color: COLORS.white, border: '2px solid transparent' }}>
                                    <Package size={20} />
                                    <span className="font-medium">Mis Pedidos</span>
                                    <ChevronRight size={16} className="ml-auto" />
                                </Link>
                                {isAdmin && (
                                    <Link to="/admin" onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all"
                                        style={{ backgroundColor: 'rgba(245,180,0,0.1)', color: COLORS.primary, border: '2px solid transparent' }}>
                                        <ShieldCheck size={20} />
                                        <span className="font-medium">Panel Admin</span>
                                        <ChevronRight size={16} className="ml-auto" />
                                    </Link>
                                )}
                                <button onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all w-full text-left"
                                    style={{ color: 'rgba(239,68,68,0.8)', border: '2px solid transparent' }}>
                                    <LogOut size={20} />
                                    <span className="font-medium">Cerrar Sesión</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group"
                                    style={{ color: COLORS.white, border: '2px solid transparent' }}>
                                    <LogIn size={20} />
                                    <span className="font-medium">Iniciar Sesión</span>
                                    <ChevronRight size={16} className="ml-auto" />
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group"
                                    style={{ color: COLORS.white, border: '2px solid transparent' }}>
                                    <UserPlus size={20} />
                                    <span className="font-medium">Registrarse</span>
                                    <ChevronRight size={16} className="ml-auto" />
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* CTA Button */}
                    <div className="p-4" style={{ borderTop: `2px solid ${COLORS.primary}` }}>
                        <Link
                            to="/reservations"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-4 px-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 block text-center"
                            style={{ backgroundColor: COLORS.primary, color: COLORS.secondary }}
                        >
                            ✨ Reservar Mesa
                        </Link>
                        <p className="text-xs text-center mt-4" style={{ color: COLORS.white }}>© 2026 Bob Toronja</p>
                    </div>
                </div>
            </aside>
        </>
    );
};
