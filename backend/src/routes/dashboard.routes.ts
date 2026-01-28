import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', authenticate, (req, res, next) =>
    dashboardController.getStats(req, res, next)
);

/**
 * @route   GET /api/dashboard/activity
 * @desc    Get recent dashboard activity
 * @access  Private
 */
router.get('/activity', authenticate, (req, res, next) =>
    dashboardController.getActivity(req, res, next)
);

export default router;
