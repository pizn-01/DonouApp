import { Response } from 'express';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

/**
 * Send success response
 */
export function success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200
): Response {
    const response: ApiResponse<T> = {
        success: true,
        data,
        message,
    };
    return res.status(statusCode).json(response);
}

/**
 * Send created response (201)
 */
export function created<T>(res: Response, data: T, message?: string): Response {
    return success(res, data, message, 201);
}

/**
 * Send error response
 */
export function error(
    res: Response,
    message: string,
    statusCode: number = 500,
    error?: string
): Response {
    const response: ApiResponse = {
        success: false,
        message,
        error,
    };
    return res.status(statusCode).json(response);
}

/**
 * Send bad request response (400)
 */
export function badRequest(res: Response, message: string, errorDetail?: string): Response {
    return error(res, message, 400, errorDetail);
}

/**
 * Send unauthorized response (401)
 */
export function unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return error(res, message, 401);
}

/**
 * Send forbidden response (403)
 */
export function forbidden(res: Response, message: string = 'Forbidden'): Response {
    return error(res, message, 403);
}

/**
 * Send not found response (404)
 */
export function notFound(res: Response, message: string = 'Resource not found'): Response {
    return error(res, message, 404);
}
