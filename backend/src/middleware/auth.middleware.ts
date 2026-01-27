import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { verifyAccessToken } from '../utils/jwt.utils';
import { unauthorized } from '../utils/response.utils';
import authService from '../services/auth.service';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
export async function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            unauthorized(res, 'No token provided');
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyAccessToken(token);

        // Get full user profile
        const userWithDetails = await authService.getCurrentUser(decoded.userId);

        // Attach user to request
        req.user = {
            id: userWithDetails.id,
            userId: userWithDetails.user_id,
            email: userWithDetails.email,
            role: userWithDetails.role,
            profile: {
                id: userWithDetails.id,
                user_id: userWithDetails.user_id,
                role: userWithDetails.role,
                full_name: userWithDetails.full_name,
                phone: userWithDetails.phone,
                avatar_url: userWithDetails.avatar_url,
                created_at: userWithDetails.created_at,
                updated_at: userWithDetails.updated_at,
                deleted_at: userWithDetails.deleted_at,
            },
        };

        next();
    } catch (error) {
        if (error instanceof Error) {
            unauthorized(res, error.message);
        } else {
            unauthorized(res, 'Authentication failed');
        }
    }
}
