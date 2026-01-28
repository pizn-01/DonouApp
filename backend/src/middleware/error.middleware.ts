import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * Global error handling middleware
 * Catches all errors and sends standardized error responses
 */
export function errorHandler(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    console.error('Error:', error);

    const isDevelopment = env.NODE_ENV === 'development';

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: isDevelopment ? error.message : undefined,
        stack: isDevelopment ? error.stack : undefined,
    });
}
