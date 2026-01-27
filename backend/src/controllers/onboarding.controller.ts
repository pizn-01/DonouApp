import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import onboardingService from '../services/onboarding.service';
import { success, error as errorResponse } from '../utils/response.utils';

export class OnboardingController {
    /**
     * POST /api/onboarding/brand
     * Complete brand onboarding
     */
    async brandOnboarding(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                errorResponse(res, 'User not authenticated', 401);
                return;
            }

            const brandProfile = await onboardingService.completeBrandOnboarding(
                req.user.userId,
                req.body
            );

            success(res, brandProfile, 'Brand onboarding completed successfully');
        } catch (err) {
            if (err instanceof Error) {
                errorResponse(res, err.message, 400);
            } else {
                next(err);
            }
        }
    }

    /**
     * POST /api/onboarding/manufacturer
     * Complete manufacturer onboarding
     */
    async manufacturerOnboarding(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                errorResponse(res, 'User not authenticated', 401);
                return;
            }

            const manufacturerProfile = await onboardingService.completeManufacturerOnboarding(
                req.user.userId,
                req.body
            );

            success(res, manufacturerProfile, 'Manufacturer onboarding completed successfully');
        } catch (err) {
            if (err instanceof Error) {
                errorResponse(res, err.message, 400);
            } else {
                next(err);
            }
        }
    }

    /**
     * GET /api/onboarding/status
     * Get onboarding status for current user
     */
    async getOnboardingStatus(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                errorResponse(res, 'User not authenticated', 401);
                return;
            }

            const status = await onboardingService.getOnboardingStatus(
                req.user.userId,
                req.user.role
            );

            success(res, status, 'Onboarding status retrieved successfully');
        } catch (err) {
            if (err instanceof Error) {
                errorResponse(res, err.message, 400);
            } else {
                next(err);
            }
        }
    }
}

export default new OnboardingController();
