import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import dashboardService from '../services/dashboard.service';
import { success, error as errorResponse } from '../utils/response.utils';

export class DashboardController {
    /**
     * GET /api/dashboard/stats
     * Get dashboard statistics for current user
     */
    async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                errorResponse(res, 'User not authenticated', 401);
                return;
            }

            const stats = await dashboardService.getStats(req.user.userId, req.user.role);

            success(res, stats, 'Dashboard stats retrieved successfully');
        } catch (err) {
            if (err instanceof Error) {
                errorResponse(res, err.message, 500);
            } else {
                next(err);
            }
        }
    }

    /**
     * GET /api/dashboard/activity
     * Get recent activity for current user's dashboard
     */
    async getActivity(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                errorResponse(res, 'User not authenticated', 401);
                return;
            }

            const limit = parseInt(req.query.limit as string) || 10;
            const activity = await dashboardService.getActivity(req.user.userId, req.user.role, limit);

            success(res, activity, 'Dashboard activity retrieved successfully');
        } catch (err) {
            if (err instanceof Error) {
                errorResponse(res, err.message, 500);
            } else {
                next(err);
            }
        }
    }
}

export default new DashboardController();
