import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { UserRole } from '../types/auth.types';
import { forbidden } from '../utils/response.utils';

/**
 * Role-based authorization middleware
 * Ensures user has one of the required roles
 */
export function requireRole(...allowedRoles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            forbidden(res, 'User not authenticated');
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            forbidden(
                res,
                `Access denied. This endpoint is only accessible to ${allowedRoles.join(' or ')} users.`
            );
            return;
        }

        next();
    };
}
