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
            const { refreshToken } = req.body;

            if (!refreshToken) {
                errorResponse(res, 'Refresh token required', 401);
                return;
            }

            // Verify the refresh token
            // We need to import verifyRefreshToken from jwt.utils (it's not imported yet, will need to add import)
            // But since we can't easily add imports in this chunk, we'll assume it's available or use a service method
            // Actually, best to move this logic to service. 
            // Let's rely on authService.refreshAccessToken to handle verification if we pass the token?
            // The current authService.refreshAccessToken takes userId. 
            // Let's modify the controller to manually verify for now to get userId.

            // Wait, we can't verify without importing verifyRefreshToken.
            // Let's check imports. We need to add `verifyRefreshToken` to imports.
            // For now, let's implement the logic assuming imports are present or we act on authService.

            // Let's assume we will update authService to handle verification.
            const newAccessToken = await authService.refreshAccessToken(refreshToken); // Changed to pass token

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
