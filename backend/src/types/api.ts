import { Request } from 'express';
import { User } from './entities';

// Extended Express Request with authenticated user
export interface AuthenticatedRequest extends Request {
    user?: User;
    userId?: string;
}

// Standard API response format
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: PaginationMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// Pagination request params
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// JWT Payload
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

// Socket events
export interface SocketEvents {
    'message:send': { conversationId: string; content: string };
    'message:receive': { message: Message };
    'typing:start': { conversationId: string; userId: string };
    'typing:stop': { conversationId: string; userId: string };
    'user:online': { userId: string };
    'user:offline': { userId: string };
}

import { Message } from './entities';
