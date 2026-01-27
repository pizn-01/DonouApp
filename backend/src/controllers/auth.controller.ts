import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import authService from '../services/auth.service';
import { success, created, error as errorResponse } from '../utils/response.utils';

export class AuthController {
    /**
     * POST /api/auth/signup
     * Register a new user
     */
    async signup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('Signup request body:', req.body);
            const result = await authService.signup(req.body);

            created(res, result, 'User registered successfully');
        } catch (err) {
            console.error('Signup error:', err);
            if (err instanceof Error) {
                console.error('Error message:', err.message);
                errorResponse(res, err.message, 400);
            } else {
                next(err);
            }
        }
    }

    /**
     * POST /api/auth/login
     * Login an existing user
     */
    async login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await authService.login(req.body);

            success(res, result, 'Login successful');
        } catch (err) {
            if (err instanceof Error) {
                errorResponse(res, err.message, 401);
            } else {
                next(err);
            }
        }
    }

    /**
     * GET /api/auth/me
     * Get current authenticated user
     */
    async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                errorResponse(res, 'User not authenticated', 401);
                return;
            }

            const userWithDetails = await authService.getCurrentUser(req.user.userId);

            success(res, userWithDetails, 'User retrieved successfully');
        } catch (err) {
            if (err instanceof Error) {
                errorResponse(res, err.message, 404);
            } else {
                next(err);
            }
        }
    }

    /**
     * POST /api/auth/refresh
     * Refresh access token
     */
    async refresh(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                errorResponse(res, 'User not authenticated', 401);
                return;
            }

            const newAccessToken = await authService.refreshAccessToken(req.user.userId);

            success(res, { accessToken: newAccessToken }, 'Token refreshed successfully');
        } catch (err) {
            if (err instanceof Error) {
                errorResponse(res, err.message, 401);
            } else {
                next(err);
            }
        }
    }

    /**
     * POST /api/auth/logout
     * Logout current user
     */
    async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                errorResponse(res, 'User not authenticated', 401);
                return;
            }

            await authService.logout(req.user.userId);

            success(res, null, 'Logout successful');
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
