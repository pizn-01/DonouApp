import { Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AuthenticatedRequest, UserRole } from '../../types';
import { sendSuccess, sendCreated } from '../../utils';
import { Errors } from '../../middleware';
import {
    RegisterInput,
    LoginInput,
    UpdateBrandProfileInput,
    UpdateManufacturerProfileInput
} from './auth.schemas';

export class AuthController {
    /**
     * POST /auth/register
     */
    async register(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const input = req.body as RegisterInput;
            const result = await authService.register(input);
            sendCreated(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /auth/login
     */
    async login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const input = req.body as LoginInput;
            const result = await authService.login(input);

            // Set refresh token as httpOnly cookie
            res.cookie('refreshToken', result.session.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            sendSuccess(res, {
                user: {
                    ...result.user,
                    onboardingCompleted: result.onboardingCompleted,
                },
                profile: result.profile,
                accessToken: result.session.accessToken,
                expiresAt: result.session.expiresAt,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /auth/logout
     */
    async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                await authService.logout(token);
            }

            // Clear refresh token cookie
            res.clearCookie('refreshToken');

            sendSuccess(res, { message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /auth/refresh
     */
    async refresh(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

            if (!refreshToken) {
                throw Errors.unauthorized('Refresh token required');
            }

            const result = await authService.refreshToken(refreshToken);

            // Update refresh token cookie
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            sendSuccess(res, {
                accessToken: result.accessToken,
                expiresAt: result.expiresAt,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /auth/forgot-password
     */
    async forgotPassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const result = await authService.forgotPassword(email);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /auth/me
     */
    async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId) {
                throw Errors.unauthorized();
            }

            const result = await authService.getProfile(req.userId);
            sendSuccess(res, {
                ...result,
                user: {
                    ...result.user,
                    onboardingCompleted: result.onboardingCompleted,
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /auth/profile
     */
    async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId || !req.user) {
                throw Errors.unauthorized();
            }

            let result;
            if (req.user.role === UserRole.BRAND) {
                const input = req.body as UpdateBrandProfileInput;
                result = await authService.updateBrandProfile(req.userId, input);
            } else if (req.user.role === UserRole.MANUFACTURER) {
                const input = req.body as UpdateManufacturerProfileInput;
                result = await authService.updateManufacturerProfile(req.userId, input);
            } else {
                throw Errors.forbidden('Invalid user role');
            }

            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
