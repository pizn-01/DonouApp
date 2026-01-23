import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config';
import { AuthenticatedRequest, UserRole, User } from '../types';
import { Errors } from './errorHandler';

/**
 * Authentication middleware - verifies JWT and attaches user to request
 */
export const authenticate = async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw Errors.unauthorized('Missing or invalid authorization header');
        }

        const token = authHeader.substring(7);

        // Verify the JWT with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            throw Errors.unauthorized('Invalid or expired token');
        }

        // Get user profile from our users table
        const { data: userData, error: userError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (userError || !userData) {
            throw Errors.unauthorized('User not found');
        }

        // Attach user to request
        req.user = userData as User;
        req.userId = user.id;

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Authorization middleware - checks if user has required role(s)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(Errors.unauthorized('Authentication required'));
            return;
        }

        if (!allowedRoles.includes(req.user.role as UserRole)) {
            next(Errors.forbidden('Insufficient permissions'));
            return;
        }

        next();
    };
};

/**
 * Optional authentication - attaches user if token present, but doesn't require it
 */
export const optionalAuth = async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }

        const token = authHeader.substring(7);
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);

        if (user) {
            const { data: userData } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (userData) {
                req.user = userData as User;
                req.userId = user.id;
            }
        }

        next();
    } catch {
        // Silently continue without auth for optional routes
        next();
    }
};
