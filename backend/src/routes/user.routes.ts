import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/index';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types/index';

const router = Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
    '/profile',
    authMiddleware,
    [
        body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
        body('phone').optional().trim(),
        body('address').optional().trim(),
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { name, phone, address } = req.body;

            const user = await User.findByIdAndUpdate(
                req.user?.id,
                { name, phone, address },
                { new: true, runValidators: true }
            );

            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            res.json({
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                },
                message: 'Perfil actualizado correctamente',
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'Error al actualizar perfil' });
        }
    }
);

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put(
    '/password',
    authMiddleware,
    [
        body('currentPassword').notEmpty().withMessage('Contraseña actual requerida'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
    ],
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { currentPassword, newPassword } = req.body;

            const user = await User.findById(req.user?.id).select('+password');
            if (!user) {
                res.status(404).json({ error: 'Usuario no encontrado' });
                return;
            }

            // Verify current password
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                res.status(400).json({ error: 'Contraseña actual incorrecta' });
                return;
            }

            // Update password
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Contraseña actualizada correctamente',
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ error: 'Error al cambiar contraseña' });
        }
    }
);

export default router;
