import { Router } from 'express';
import authRoutes from './auth.routes';
import onboardingRoutes from './onboarding.routes';
import briefRoutes from './brief.routes';
import aiRoutes from './ai.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/briefs', briefRoutes);
router.use('/ai', aiRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'DonauApp API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
