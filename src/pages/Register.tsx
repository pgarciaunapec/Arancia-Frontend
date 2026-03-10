import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, Phone, UserPlus, UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)',
};

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            setError('Por favor completa los campos obligatorios');
            return;
        }
        if (form.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        const result = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
        setLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Error al registrarse');
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center px-4 bg-background pt-20 pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        <UtensilsCrossed size={28} style={{ color: COLORS.secondary }} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
                    <p style={{ color: COLORS.muted }}>Únete y disfruta de todos los beneficios</p>
                </div>

                <Card className="p-8" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Nombre Completo *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-white/40" size={18} />
                                <input
                                    name="name" type="text" value={form.name} onChange={handleChange}
                                    placeholder="Tu nombre"
                                    className="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Correo Electrónico *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-white/40" size={18} />
                                <input
                                    name="email" type="email" value={form.email} onChange={handleChange}
                                    placeholder="tu@correo.com" autoComplete="email"
                                    className="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-white/40" size={18} />
                                <input
                                    name="phone" type="tel" value={form.phone} onChange={handleChange}
                                    placeholder="+1 (809) 000-0000"
                                    className="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Contraseña *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-white/40" size={18} />
                                <input
                                    name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                                    placeholder="Mínimo 6 caracteres" autoComplete="new-password"
                                    className="w-full bg-black/20 pl-10 pr-12 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }}
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Confirmar Contraseña *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-white/40" size={18} />
                                <input
                                    name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange}
                                    placeholder="Repite tu contraseña" autoComplete="new-password"
                                    className="w-full bg-black/20 pl-10 pr-4 py-3 rounded-lg border text-white placeholder-white/30 focus:ring-2 outline-none"
                                    style={{ borderColor: COLORS.border }}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button type="submit" className="w-full flex items-center justify-center gap-2" size="lg" disabled={loading}>
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Crear Cuenta
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p style={{ color: COLORS.muted }} className="text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="font-medium hover:underline" style={{ color: COLORS.primary }}>
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
