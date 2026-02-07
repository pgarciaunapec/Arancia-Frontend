import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)'
};

const BookingConfirmation: React.FC = () => {
    const location = useLocation();
    const booking = location.state?.booking || {
        date: 'Fecha pendiente',
        time: 'Hora pendiente',
        guests: '2',
        name: 'Cliente'
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-background px-4 pt-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg text-center"
            >
                <div className="mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                        className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-2xl"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                        ¡Reserva Confirmada!
                    </h1>
                    <p className="text-lg" style={{ color: COLORS.muted }}>
                        Gracias, <span className="font-semibold text-white">{booking.name}</span>. Te esperamos.
                    </p>
                </div>

                <Card className="p-8 mb-8 relative overflow-hidden text-left" style={{ backgroundColor: COLORS.secondary, border: `2px solid ${COLORS.primary}` }}>
                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: COLORS.primary }} />

                    <h3 className="text-sm uppercase tracking-widest font-semibold mb-6 text-center" style={{ color: COLORS.primary }}>
                        Detalles de tu Mesa
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                            <Calendar className="w-5 h-5" style={{ color: COLORS.primary }} />
                            <div>
                                <span className="block text-xs uppercase" style={{ color: COLORS.muted }}>Fecha</span>
                                <span className="font-medium text-white">{booking.date}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                            <Clock className="w-5 h-5" style={{ color: COLORS.primary }} />
                            <div>
                                <span className="block text-xs uppercase" style={{ color: COLORS.muted }}>Hora</span>
                                <span className="font-medium text-white">{booking.time}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                            <Users className="w-5 h-5" style={{ color: COLORS.primary }} />
                            <div>
                                <span className="block text-xs uppercase" style={{ color: COLORS.muted }}>Personas</span>
                                <span className="font-medium text-white">{booking.guests} Comensales</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs italic" style={{ color: COLORS.muted }}>
                            Hemos enviado un correo de confirmación a {booking.email}
                        </p>
                    </div>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                        <Link to="/">Volver al Inicio</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link to="/menu">Ver Menú</Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingConfirmation;
