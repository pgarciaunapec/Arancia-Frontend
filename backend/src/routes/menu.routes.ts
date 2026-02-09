import { Router, Request, Response } from 'express';
import { MenuItem } from '../models/index';

const router = Router();

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, search, available } = req.query;

        // Build filter
        const filter: Record<string, unknown> = {};

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (available !== undefined) {
            filter.available = available === 'true';
        }

        let query = MenuItem.find(filter);

        // Text search if provided
        if (search && typeof search === 'string') {
            query = MenuItem.find({
                ...filter,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { ingredients: { $in: [new RegExp(search, 'i')] } },
                ],
            });
        }

        const items = await query.sort({ category: 1, name: 1 });

        res.json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        console.error('Get menu error:', error);
        res.status(500).json({ error: 'Error al obtener el menú' });
    }
});

// @route   GET /api/menu/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await MenuItem.distinct('category');

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// @route   GET /api/menu/category/:category
// @desc    Get menu items by category
// @access  Public
router.get('/category/:category', async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.params;

        const items = await MenuItem.find({
            category,
            available: true
        }).sort({ name: 1 });

        res.json({
            success: true,
            count: items.length,
            data: items,
        });
    } catch (error) {
        console.error('Get by category error:', error);
        res.status(500).json({ error: 'Error al obtener items por categoría' });
    }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (!item) {
            res.status(404).json({ error: 'Plato no encontrado' });
            return;
        }

        res.json({
            success: true,
            data: item,
        });
    } catch (error) {
        console.error('Get item error:', error);
        res.status(500).json({ error: 'Error al obtener el plato' });
    }
});

export default router;
