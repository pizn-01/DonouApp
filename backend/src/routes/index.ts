import { Router } from 'express';
import authRoutes from './auth.routes';
import onboardingRoutes from './onboarding.routes';
import briefRoutes from './brief.routes';
import aiRoutes from './ai.routes';
import proposalRoutes from './proposal.routes';
import matchingRoutes from './matching.routes';
import notificationRoutes from './notification.routes';
import messagingRoutes from './messaging.routes';
import projectRoutes from './project.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/briefs', briefRoutes);
router.use('/ai', aiRoutes);
router.use('/proposals', proposalRoutes);
router.use('/proposals', proposalRoutes);
router.use('/matches', matchingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/conversations', messagingRoutes);
router.use('/projects', projectRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'DonauApp API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
