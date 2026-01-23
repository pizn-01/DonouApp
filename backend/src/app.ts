import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config';
import { errorHandler, notFoundHandler, generalLimiter } from './middleware';
import { logger } from './utils';

// Import route modules
import { authRoutes } from './modules/auth';
import { briefsRoutes } from './modules/briefs';

export const createApp = (): Application => {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Cookie parser
    app.use(cookieParser());

    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    app.use(generalLimiter);

    // Request logging (development)
    if (env.NODE_ENV === 'development') {
        app.use((req, _res, next) => {
            logger.debug(`${req.method} ${req.path}`, {
                query: req.query,
                body: req.body,
            });
            next();
        });
    }

    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: env.NODE_ENV,
        });
    });

    // API routes (v1)
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/briefs', briefsRoutes);
    // app.use('/api/v1/manufacturers', manufacturerRoutes);
    // app.use('/api/v1/proposals', proposalRoutes);
    // app.use('/api/v1/messages', messageRoutes);
    // app.use('/api/v1/notifications', notificationRoutes);
    // app.use('/api/v1/ai', aiRoutes);

    // API info route
    app.get('/api/v1', (_req, res) => {
        res.json({
            success: true,
            message: 'DonauApp API v1',
            version: '1.0.0',
            endpoints: {
                auth: '/api/v1/auth',
                briefs: '/api/v1/briefs',
                manufacturers: '/api/v1/manufacturers',
                proposals: '/api/v1/proposals',
                messages: '/api/v1/messages',
                notifications: '/api/v1/notifications',
                ai: '/api/v1/ai',
            },
        });
    });

    // 404 handler
    app.use(notFoundHandler);

    // Global error handler (must be last)
    app.use(errorHandler);

    return app;
};
