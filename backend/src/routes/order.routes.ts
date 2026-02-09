import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Order } from '../models/index';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types/index';

const router = Router();

// @route   POST /api/orders
// @desc    Create order from cart (checkout)
// @access  Private
router.post(
    '/',
    authMiddleware,
    [
        body('shippingAddress.name').notEmpty().withMessage('Nombre de envío requerido'),
        body('shippingAddress.address').notEmpty().withMessage('Dirección requerida'),
        body('shippingAddress.city').notEmpty().withMessage('Ciudad requerida'),
        body('shippingAddress.zip').notEmpty().withMessage('Código postal requerido'),
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { shippingAddress } = req.body;

            // Get cart
            const cart = await Order.findOne({ user: req.user!.id, status: 'cart' });
            if (!cart || cart.items.length === 0) {
                res.status(400).json({ error: 'El carrito está vacío' });
                return;
            }

            // Update cart to order
            cart.status = 'pending';
            cart.shippingAddress = shippingAddress;
            cart.paymentStatus = 'paid'; // Simulate payment success
            await cart.save();

            // Generate order number
            const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

            res.status(201).json({
                success: true,
                data: {
                    ...cart.toObject(),
                    orderNumber,
                },
                message: `Pedido ${orderNumber} creado exitosamente`,
            });
        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({ error: 'Error al crear el pedido' });
        }
    }
);

// @route   GET /api/orders
// @desc    Get user's order history
// @access  Private
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({
            user: req.user!.id,
            status: { $ne: 'cart' },
        })
            .sort({ createdAt: -1 })
            .populate('items.menuItem', 'name image');

        res.json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user!.id,
        }).populate('items.menuItem', 'name image');

        if (!order) {
            res.status(404).json({ error: 'Orden no encontrada' });
            return;
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Error al obtener orden' });
    }
});

export default router;
