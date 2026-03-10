import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)',
};

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Por favor completa todos los campos');
            return;
        }
        setLoading(true);
        const result = await login(form.email, form.password);
        setLoading(false);
        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setError(result.error || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4 bg-background pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        <UtensilsCrossed size={28} style={{ color: COLORS.secondary }} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
                    <p style={{ color: COLORS.muted }}>Ingresa a tu cuenta para continuar</p>
                </div>

                <Card className="p-8" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-white/40" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="tu@correo.com"
                                    autoComplete="email"
                                    className="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none transition-all"
                                    style={{ borderColor: COLORS.border }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-white/40" size={18} />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full bg-black/20 pl-10 pr-12 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none transition-all"
                                    style={{ borderColor: COLORS.border }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Demo credentials hint */}
                        <div className="bg-white/5 rounded-lg p-3 text-xs text-white/50 space-y-1">
                            <p className="font-medium text-white/70">Credenciales demo:</p>
                            <p>Cliente: juan@demo.com / demo123</p>
                            <p>Admin: admin@restaurante.com / admin123</p>
                        </div>

                        <Button type="submit" className="w-full flex items-center justify-center gap-2" size="lg" disabled={loading}>
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Iniciar Sesión
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p style={{ color: COLORS.muted }} className="text-sm">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="font-medium hover:underline" style={{ color: COLORS.primary }}>
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
