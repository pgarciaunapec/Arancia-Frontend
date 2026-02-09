import { Router } from 'express';
import { getImage } from '../controllers/image.controller';

const router = Router();

// @route   GET /api/images/:id
// @desc    Get image by ID
// @access  Public
router.get('/:id', getImage);

export default router;
