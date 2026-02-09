import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDatabase } from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import menuRoutes from './routes/menu.routes';
import reservationRoutes from './routes/reservation.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import contactRoutes from './routes/contact.routes';
import imageRoutes from './routes/image.routes';

const app: Application = express();

// Middleware
app.use(cors({
    origin: env.frontendUrl,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/images', imageRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: env.nodeEnv === 'development' ? err.message : undefined
    });
});

// Start server
const startServer = async () => {
    await connectDatabase();

    app.listen(env.port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
        console.log(`📝 Ambiente: ${env.nodeEnv}`);
    });
};

startServer();

export default app;
