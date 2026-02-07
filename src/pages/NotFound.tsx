import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'motion/react';
import { MapPin, ChefHat } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function NotFound() {
    const constraintsRef = useRef(null);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
            <div
                ref={constraintsRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            <motion.div
                drag
                dragConstraints={constraintsRef}
                className="absolute top-1/4 left-1/4 cursor-grab active:cursor-grabbing text-[#2d1f0f] opacity-20 hover:opacity-40 transition-opacity"
            >
                <ChefHat size={120} />
            </motion.div>

            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="z-10 text-center px-4"
            >
                <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f5b400] to-[#ffd700] mb-4">
                    404
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                    Página no encontrada
                </h2>
                <p className="text-[#a0a0a0] max-w-md mx-auto mb-8">
                    Parece que te has desviado del camino. El plato que buscas no está en nuestro menú.
                </p>

                <div className="flex gap-4 justify-center">
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
}
