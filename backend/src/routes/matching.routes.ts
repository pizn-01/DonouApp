import { Router } from 'express';
import matchingController from '../controllers/matching.controller'; // .ts extension for import in node can be tricky if not handled by standard resolution, but usually ok in this project setup derived from context
import { authenticate } from '../middleware/auth.middleware';

// Fix import if needed (ts-node usually likes no extension or .js, but sticking to project pattern)
// Actually standard import in this project seems to not use extension in imports.
// Checked previous files, they use `../controllers/proposal.controller`.
// I will fix the import in the file content.

const router = Router();

router.use(authenticate);

/**
 * @route   GET /api/matches/recommendations
 * @desc    Get matching recommendations (Context aware: Brand -> Manufacturers, Manu -> Briefs)
 * @access  Authenticated
 */
router.get('/recommendations', matchingController.getRecommendations.bind(matchingController));

export default router;
