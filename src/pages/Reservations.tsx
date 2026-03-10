import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useReservations } from '../context/ReservationsContext';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)'
};

const Reservations: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createReservation } = useReservations();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: '2',
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        notes: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const reservation = createReservation({
            userId: user?.id || 'guest',
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            date: formData.date,
            time: formData.time,
            guests: parseInt(formData.guests),
            notes: formData.notes,
            location: 'Restaurante Principal',
        });
        navigate('/booking-confirmation', { state: { booking: { ...formData, reservationId: reservation.id } } });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl"
            >
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.white }}>
                        Reserva tu <span style={{ color: COLORS.primary }}>Experiencia</span>
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.muted }}>
                        Asegura tu lugar en nuestra mesa y déjanos deleitar tus sentidos.
                    </p>
                </div>

                <Card className="p-8 md:p-12 overflow-hidden relative" style={{ backgroundColor: COLORS.secondary, border: `2px solid ${COLORS.primary}` }}>
                    {/* Progress Steps */}
                    <div className="flex justify-between mb-12 relative z-10">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all duration-300 ${s <= step ? 'scale-110' : 'opacity-50'}`}
                                    style={{
                                        backgroundColor: s <= step ? COLORS.primary : 'transparent',
                                        color: s <= step ? COLORS.secondary : COLORS.white,
                                        border: `2px solid ${s <= step ? COLORS.primary : COLORS.muted}`
                                    }}
                                >
                                    {s < step ? <CheckCircle size={20} /> : s}
                                </div>
                                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: s <= step ? COLORS.primary : COLORS.muted }}>
                                    {s === 1 ? 'Detalles' : s === 2 ? 'Contacto' : 'Confirmar'}
                                </span>
                            </div>
                        ))}
                        {/* Progress Bar Background */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 -z-10 bg-white/10" />
                        {/* Active Progress Bar */}
                        <div
                            className="absolute top-5 left-0 h-0.5 -z-10 transition-all duration-500 ease-out"
                            style={{
                                width: `${((step - 1) / 2) * 100}%`,
                                backgroundColor: COLORS.primary
                            }}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Reservation Details */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" style={{ color: COLORS.primary }}>Fecha</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: COLORS.muted }} />
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                                                style={{
                                                    borderColor: COLORS.border,
                                                    color: COLORS.white,
                                                    outlineColor: COLORS.primary
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" style={{ color: COLORS.primary }}>Hora</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: COLORS.muted }} />
                                            <select
                                                name="time"
                                                required
                                                value={formData.time}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all appearance-none"
                                                style={{
                                                    borderColor: COLORS.border,
                                                    color: COLORS.white,
                                                    outlineColor: COLORS.primary
                                                }}
                                            >
                                                <option value="" disabled>Selecciona una hora</option>
                                                <option value="12:00">12:00 PM</option>
                                                <option value="13:00">01:00 PM</option>
                                                <option value="14:00">02:00 PM</option>
                                                <option value="19:00">07:00 PM</option>
                                                <option value="20:00">08:00 PM</option>
                                                <option value="21:00">09:00 PM</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium" style={{ color: COLORS.primary }}>Número de Personas</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: COLORS.muted }} />
                                            <select
                                                name="guests"
                                                required
                                                value={formData.guests}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all appearance-none"
                                                style={{
                                                    borderColor: COLORS.border,
                                                    color: COLORS.white,
                                                    outlineColor: COLORS.primary
                                                }}
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, '8+'].map(num => (
                                                    <option key={num} value={num}>{num} {num === 1 ? 'Persona' : 'Personas'}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6">
                                    <Button type="button" onClick={nextStep} size="lg">
                                        Siguiente
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Contact Info */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" style={{ color: COLORS.primary }}>Nombre Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: COLORS.muted }} />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Ej. Juan Pérez"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                                                style={{ borderColor: COLORS.border, color: COLORS.white }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" style={{ color: COLORS.primary }}>Teléfono</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: COLORS.muted }} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Ej. (809) 555-0123"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                                                style={{ borderColor: COLORS.border, color: COLORS.white }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium" style={{ color: COLORS.primary }}>Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: COLORS.muted }} />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Ej. juan@ejemplo.com"
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                                                style={{ borderColor: COLORS.border, color: COLORS.white }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium" style={{ color: COLORS.primary }}>Notas Especiales (Opcional)</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-4 w-5 h-5 pointer-events-none" style={{ color: COLORS.muted }} />
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                placeholder="Ej. Alergias, ocasión especial, preferencia de mesa..."
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/20 border focus:outline-none focus:ring-2 transition-all"
                                                style={{ borderColor: COLORS.border, color: COLORS.white }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <Button type="button" variant="outline" onClick={prevStep} size="lg">
                                        Atrás
                                    </Button>
                                    <Button type="button" onClick={nextStep} size="lg">
                                        Revisar Reserva
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Review & Confirm */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="bg-black/20 rounded-xl p-6 border border-white/10">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.primary }}>
                                        <CheckCircle className="w-5 h-5" />
                                        Resumen de la Reserva
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm md:text-base">
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span style={{ color: COLORS.muted }}>Fecha:</span>
                                            <span className="font-medium text-white">{formData.date}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span style={{ color: COLORS.muted }}>Hora:</span>
                                            <span className="font-medium text-white">{formData.time}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span style={{ color: COLORS.muted }}>Personas:</span>
                                            <span className="font-medium text-white">{formData.guests}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span style={{ color: COLORS.muted }}>Nombre:</span>
                                            <span className="font-medium text-white">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span style={{ color: COLORS.muted }}>Email:</span>
                                            <span className="font-medium text-white">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/10 pb-2">
                                            <span style={{ color: COLORS.muted }}>Teléfono:</span>
                                            <span className="font-medium text-white">{formData.phone}</span>
                                        </div>
                                        {formData.notes && (
                                            <div className="md:col-span-2 pt-2">
                                                <span className="block mb-1" style={{ color: COLORS.muted }}>Notas:</span>
                                                <p className="text-white italic bg-white/5 p-3 rounded-lg text-sm">{formData.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between pt-6">
                                    <Button type="button" variant="outline" onClick={prevStep} size="lg">
                                        Modificar
                                    </Button>
                                    <Button type="submit" size="lg" className="px-8">
                                        Confirmar Reserva
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default Reservations;
