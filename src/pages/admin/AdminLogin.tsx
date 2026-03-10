import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, Mail, UtensilsCrossed, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)',
};

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAdmin } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAdmin) {
        navigate('/admin', { replace: true });
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(form.email, form.password);
        setLoading(false);
        if (!result.success) {
            setError(result.error || 'Error al iniciar sesión');
            return;
        }
        // Check after login
        const stored = localStorage.getItem('restaurant_current_user');
        const user = stored ? JSON.parse(stored) : null;
        if (user?.role !== 'admin') {
            setError('No tienes permisos de administrador');
            return;
        }
        navigate('/admin');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1a0f06' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: COLORS.primary }}>
                        <ShieldCheck size={36} style={{ color: COLORS.secondary }} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
                    <p style={{ color: COLORS.muted }}>Acceso restringido al personal autorizado</p>
                </div>

                <Card className="p-8" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Correo</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-white/40" size={18} />
                                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="admin@restaurante.com" autoComplete="username"
                                    className="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-white/40" size={18} />
                                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••" autoComplete="current-password"
                                    className="w-full bg-black/20 pl-10 pr-12 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-white/40 hover:text-white/70">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-3 text-xs text-white/50">
                            Demo: admin@restaurante.com / admin123
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>
                        )}

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Ingresar al Panel'}
                        </Button>
                    </form>
                </Card>

                <p className="text-center mt-6 text-xs" style={{ color: COLORS.muted }}>
                    <UtensilsCrossed className="inline mr-1" size={12} />
                    Restaurante El Sabor · Panel Administrativo
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
