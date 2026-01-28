import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.types';

// =============================================
// Role Guard Middleware
// =============================================

/**
 * Middleware to ensure user has Brand role
 */
export const requireBrand = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const user = req.user;

    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }

    if (user.role !== 'brand') {
        res.status(403).json({
            success: false,
            message: 'This action requires Brand role'
        });
        return;
    }

    next();
};

/**
 * Middleware to ensure user has Manufacturer role
 */
export const requireManufacturer = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const user = req.user;

    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }

    if (user.role !== 'manufacturer') {
        res.status(403).json({
            success: false,
            message: 'This action requires Manufacturer role'
        });
        return;
    }

    next();
};

/**
 * Middleware to ensure user has either Brand or Manufacturer role
 */
export const requireAuthenticated = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const user = req.user;

    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }

    next();
};
