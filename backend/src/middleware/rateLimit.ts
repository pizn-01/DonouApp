import rateLimit from 'express-rate-limit';
import { env } from '../config';
import { ApiResponse } from '../types';

// General rate limiter
export const generalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        const response: ApiResponse = {
            success: false,
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many requests, please try again later',
            },
        };
        res.status(429).json(response);
    },
});

// Stricter limiter for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        const response: ApiResponse = {
            success: false,
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many authentication attempts, please try again later',
            },
        };
        res.status(429).json(response);
    },
});

// AI endpoint limiter (due to API costs)
export const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 AI requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        const response: ApiResponse = {
            success: false,
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: 'AI rate limit exceeded, please wait before making more AI requests',
            },
        };
        res.status(429).json(response);
    },
});
