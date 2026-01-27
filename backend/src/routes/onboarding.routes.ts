import { Router } from 'express';
import onboardingController from '../controllers/onboarding.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import {
    brandOnboardingSchema,
    manufacturerOnboardingSchema,
} from '../validators/onboarding.validators';

const router = Router();

// All onboarding routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/onboarding/brand
 * @desc    Complete brand profile onboarding
 * @access  Private (Brand only)
 */
router.post(
    '/brand',
    requireRole('brand'),
    validate(brandOnboardingSchema),
    (req, res, next) => onboardingController.brandOnboarding(req, res, next)
);

/**
 * @route   POST /api/onboarding/manufacturer
 * @desc    Complete manufacturer profile onboarding
 * @access  Private (Manufacturer only)
 */
router.post(
    '/manufacturer',
    requireRole('manufacturer'),
    validate(manufacturerOnboardingSchema),
    (req, res, next) => onboardingController.manufacturerOnboarding(req, res, next)
);

/**
 * @route   GET /api/onboarding/status
 * @desc    Get onboarding status for current user
 * @access  Private
 */
router.get('/status', (req, res, next) =>
    onboardingController.getOnboardingStatus(req, res, next)
);

export default router;
