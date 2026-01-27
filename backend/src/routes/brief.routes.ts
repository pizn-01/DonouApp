import { Router } from 'express';
import briefController from '../controllers/brief.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireBrand } from '../middleware/roleGuard';

const router = Router();

// =============================================
// Brief Routes
// =============================================

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/briefs
 * @desc    Create a new brief
 * @access  Brand only
 */
router.post('/', requireBrand, briefController.create.bind(briefController));

/**
 * @route   GET /api/briefs
 * @desc    Get all briefs (role-based filtering)
 * @access  Authenticated users
 */
router.get('/', briefController.getAll.bind(briefController));

/**
 * @route   GET /api/briefs/:id
 * @desc    Get a single brief by ID
 * @access  Authenticated users (with access control)
 */
router.get('/:id', briefController.getById.bind(briefController));

/**
 * @route   PATCH /api/briefs/:id
 * @desc    Update a brief
 * @access  Brand only (ownership required)
 */
router.patch('/:id', requireBrand, briefController.update.bind(briefController));

/**
 * @route   DELETE /api/briefs/:id
 * @desc    Delete a brief
 * @access  Brand only (ownership required, draft only)
 */
router.delete('/:id', requireBrand, briefController.delete.bind(briefController));

export default router;
