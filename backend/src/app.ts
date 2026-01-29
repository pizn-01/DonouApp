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
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Allow Vercel deployments and localhost
            if (
                origin.endsWith('.vercel.app') ||
                origin.includes('localhost') ||
                origin.includes('127.0.0.1')
            ) {
                return callback(null, true);
            }

            // Allow custom domains if needed (add them here)
            // if (origin === 'https://your-custom-domain.com') return callback(null, true);

            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        },
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
