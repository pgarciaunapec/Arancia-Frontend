import { Router, Request, Response } from "express";
import { MenuItem } from "../models/index";

const router = Router();

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Obtener menú completo
 *     description: Retorna todos los artículos del menú con opciones de filtrado por categoría y búsqueda
 *     tags:
 *       - Menú
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría (e.g., Appetizers, Main Courses)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre e ingredientes
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrar solo artículos disponibles
 *     responses:
 *       200:
 *         description: Menú obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 *       500:
 *         description: Error del servidor
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, available } = req.query;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (available !== undefined) {
      filter.available = available === "true";
    }

    let query = MenuItem.find(filter);

    // Text search if provided
    if (search && typeof search === "string") {
      query = MenuItem.find({
        ...filter,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { ingredients: { $in: [new RegExp(search, "i")] } },
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
    console.error("Get menu error:", error);
    res.status(500).json({ error: "Error al obtener el menú" });
  }
});

/**
 * @swagger
 * /menu/categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     description: Retorna una lista de todas las categorías disponibles en el menú
 *     tags:
 *       - Menú
 *     responses:
 *       200:
 *         description: Categorías obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/categories",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const categories = await MenuItem.distinct("category");

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Error al obtener categorías" });
    }
  },
);

/**
 * @swagger
 * /menu/category/{category}:
 *   get:
 *     summary: Obtener menú por categoría
 *     description: Retorna todos los artículos disponibles de una categoría específica
 *     tags:
 *       - Menú
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la categoría (e.g., Appetizers, Main Courses)
 *     responses:
 *       200:
 *         description: Artículos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/category/:category",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.params;

      const items = await MenuItem.find({
        category,
        available: true,
      }).sort({ name: 1 });

      res.json({
        success: true,
        count: items.length,
        data: items,
      });
    } catch (error) {
      console.error("Get by category error:", error);
      res.status(500).json({ error: "Error al obtener items por categoría" });
    }
  },
);

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      res.status(404).json({ error: "Plato no encontrado" });
      return;
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({ error: "Error al obtener el plato" });
  }
});

export default router;
