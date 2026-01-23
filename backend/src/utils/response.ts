import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '../types';

/**
 * Send a successful response
 */
export const sendSuccess = <T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    meta?: PaginationMeta
): void => {
    const response: ApiResponse<T> = {
        success: true,
        data,
        meta,
    };
    res.status(statusCode).json(response);
};

/**
 * Send a created response (201)
 */
export const sendCreated = <T>(res: Response, data: T): void => {
    sendSuccess(res, data, 201);
};

/**
 * Send a no content response (204)
 */
export const sendNoContent = (res: Response): void => {
    res.status(204).send();
};

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (
    total: number,
    page: number,
    limit: number
): PaginationMeta => {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
};

/**
 * Parse pagination params from query
 */
export const parsePaginationParams = (query: {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}): {
    page: number;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
} => {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const offset = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = (query.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';

    return { page, limit, offset, sortBy, sortOrder };
};
