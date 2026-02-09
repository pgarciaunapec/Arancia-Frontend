import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const COLORS = {
    primary: '#f5b400',
    secondary: '#2d1f0f',
    white: '#ffffff',
    muted: 'rgba(255,255,255,0.6)',
    border: 'rgba(245, 180, 0, 0.3)'
};

const MyReservations: React.FC = () => {
    const [reservations, setReservations] = React.useState([
        { id: 1, date: '2026-03-15', time: '19:00', guests: 2, status: 'confirmed', location: 'Restaurante Principal' },
        { id: 2, date: '2026-02-14', time: '20:30', guests: 4, status: 'past', location: 'Terraza' },
    ]);

    const cancelReservation = (id: number) => {
        setReservations(reservations.map(res =>
            res.id === id ? { ...res, status: 'cancelled' } : res
        ));
    };

    return (
        <div className="w-full pt-20 sm:pt-28 pb-20 px-4 min-h-screen bg-background">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2 text-white">Mis Reservas</h1>
                    <p style={{ color: COLORS.muted }}>Gestiona tus visitas y experiencias</p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6">
                    {reservations.map((res) => (
                        <motion.div layout key={res.id}>
                            <Card className="p-6 relative overflow-hidden flex flex-col sm:flex-row gap-6 items-start sm:items-center" style={{ backgroundColor: COLORS.secondary, border: `1px solid ${COLORS.border}` }}>
                                {/* Status Indicator */}
                                <div
                                    className={`absolute top-0 left-0 bottom-0 w-2 ${res.status === 'confirmed' ? 'bg-green-500' :
                                            res.status === 'past' ? 'bg-gray-500' : 'bg-red-500'
                                        }`}
                                />

                                <div className="flex-1 pl-4 space-y-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        {res.status === 'confirmed' && <CheckCircle className="text-green-500" size={16} />}
                                        {res.status === 'past' && <Clock className="text-gray-500" size={16} />}
                                        {res.status === 'cancelled' && <XCircle className="text-red-500" size={16} />}
                                        <span className="font-bold uppercase tracking-wider text-xs text-white/50">
                                            {res.status === 'confirmed' ? 'Confirmada' :
                                                res.status === 'past' ? 'Completada' : 'Cancelada'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <Calendar size={20} style={{ color: COLORS.primary }} />
                                        {new Date(res.date).toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </h3>

                                    <div className="flex flex-wrap gap-4 text-sm text-white/80">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} style={{ color: COLORS.primary }} />
                                            {res.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} style={{ color: COLORS.primary }} />
                                            {res.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-white">{res.guests}</span> Personas
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 w-full sm:w-auto pl-4 sm:pl-0">
                                    {res.status === 'confirmed' && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => cancelReservation(res.id)}
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
                                        Ver Detalles
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyReservations;
