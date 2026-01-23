import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiError } from '../types';

// Custom error class for API errors
export class AppError extends Error {
    public statusCode: number;
    public code: string;
    public details?: { field: string; message: string }[];

    constructor(
        message: string,
        statusCode: number = 500,
        code: string = 'INTERNAL_ERROR',
        details?: { field: string; message: string }[]
    ) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Common error factory functions
export const Errors = {
    badRequest: (message: string, details?: { field: string; message: string }[]) =>
        new AppError(message, 400, 'BAD_REQUEST', details),

    unauthorized: (message: string = 'Unauthorized') =>
        new AppError(message, 401, 'UNAUTHORIZED'),

    forbidden: (message: string = 'Forbidden') =>
        new AppError(message, 403, 'FORBIDDEN'),

    notFound: (resource: string = 'Resource') =>
        new AppError(`${resource} not found`, 404, 'NOT_FOUND'),

    conflict: (message: string) =>
        new AppError(message, 409, 'CONFLICT'),

    validation: (details: { field: string; message: string }[]) =>
        new AppError('Validation failed', 422, 'VALIDATION_ERROR', details),

    tooManyRequests: (message: string = 'Too many requests') =>
        new AppError(message, 429, 'TOO_MANY_REQUESTS'),

    internal: (message: string = 'Internal server error') =>
        new AppError(message, 500, 'INTERNAL_ERROR'),
};

// Global error handler middleware
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });

    // Default to 500 if not AppError
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const code = err instanceof AppError ? err.code : 'INTERNAL_ERROR';
    const details = err instanceof AppError ? err.details : undefined;

    const response: ApiResponse = {
        success: false,
        error: {
            code,
            message: err.message || 'An unexpected error occurred',
            details,
        } as ApiError,
    };

    res.status(statusCode).json(response);
};

// 404 handler for unknown routes
export const notFoundHandler = (req: Request, res: Response): void => {
    const response: ApiResponse = {
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
        },
    };
    res.status(404).json(response);
};
