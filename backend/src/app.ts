import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

// Initialize Express app
const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: env.NODE_ENV === 'production'
            ? ['https://yourdomain.com'] // Replace with your frontend URL
            : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Request logging in development
if (env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        message: 'DonauApp Backend API',
        version: '1.0.0',
        documentation: '/api/health',
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
