import { Router } from 'express';
import proposalController from '../controllers/proposal.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireBrand, requireManufacturer } from '../middleware/roleGuard';

const router = Router();

router.use(authenticate);

// Manufacturer Routes
router.post('/', requireManufacturer, proposalController.create.bind(proposalController));
router.get('/my-proposals', requireManufacturer, proposalController.getMyProposals.bind(proposalController));

// Brand Routes
// Note: /api/proposals/:id/status is the route. 
// However, fetching proposals for a brief is handled here or brief routes?
// Plan said: GET /api/briefs/:id/proposals. 
// I'll put that in Brief routes probably, OR here as /api/proposals/brief/:id?
// Let's stick to endpoint plan: `GET /api/briefs/:id/proposals` handles in BRIEF routes calling this controller?
// OR better: `/api/proposals/brief/:id` here.
router.get('/brief/:id', requireBrand, proposalController.getForBrief.bind(proposalController));

router.patch('/:id/status', requireBrand, proposalController.updateStatus.bind(proposalController));

export default router;
