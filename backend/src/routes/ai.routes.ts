import { Router } from 'express';
import aiController from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireBrand } from '../middleware/roleGuard';
import { upload } from '../services/upload.service';

const router = Router();

// =============================================
// AI & Upload Routes
// =============================================

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/ai/generate-brief
 * @desc    Generate a brief from AI prompt
 * @access  Brand only
 */
router.post('/generate-brief', requireBrand, aiController.generateBrief.bind(aiController));

/**
 * @route   POST /api/upload
 * @desc    Upload files for briefs
 * @access  Authenticated users
 */
router.post('/upload', upload.array('files', 5), aiController.uploadFiles.bind(aiController));

export default router;
