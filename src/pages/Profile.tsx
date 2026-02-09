import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)'
};

const Profile: React.FC = () => {
    const [formData, setFormData] = useState({
        name: 'Juan Pérez',
        email: 'juan@demo.com',
        phone: '+1 (809) 555-0123',
        address: 'Calle Demo 123, Santo Domingo'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate save
        alert('Perfil actualizado correctamente');
    };

    return (
        <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl text-primary font-bold">
                            JP
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1 text-white">Mi Perfil</h1>
                            <p style={{ color: COLORS.muted }}>Administra tu información personal</p>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="p-8 space-y-6" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                        <h3 className="text-xl font-bold mb-4 text-white pb-2 border-b border-white/10">Datos Personales</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-white/40" size={18} />
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 pl-10 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-white/40" size={18} />
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 pl-10 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 text-white/40" size={18} />
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 pl-10 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Dirección Principal</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-white/40" size={18} />
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-black/20 pl-10 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                                        style={{ borderColor: COLORS.border }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button size="lg" className="px-8 flex items-center gap-2">
                                <Save size={18} />
                                Guardar Cambios
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-8 space-y-6 opacity-75 grayscale hover:grayscale-0 transition-all hover:opacity-100" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                        <h3 className="text-xl font-bold mb-4 text-white pb-2 border-b border-white/10 flex items-center gap-2">
                            <Lock size={20} />
                            Cambiar Contraseña
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="password"
                                placeholder="Contraseña Actual"
                                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                                style={{ borderColor: COLORS.border }}
                            />
                            <input
                                type="password"
                                placeholder="Nueva Contraseña"
                                className="w-full bg-black/20 p-3 rounded-lg border text-white focus:ring-2 outline-none"
                                style={{ borderColor: COLORS.border }}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button variant="outline" className="border-white/20 text-white/60 hover:text-white">
                                Actualizar Seguridad
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    );
};

export default Profile;
