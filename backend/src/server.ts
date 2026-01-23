import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { createApp } from './app';
import { env } from './config';
import { logger } from './utils';

const startServer = async (): Promise<void> => {
    try {
        const app = createApp();
        const httpServer = createServer(app);

        // Socket.io setup for real-time messaging
        const io = new SocketServer(httpServer, {
            cors: {
                origin: env.CORS_ORIGIN,
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });

        // Socket.io connection handling
        io.on('connection', (socket) => {
            logger.info(`Client connected: ${socket.id}`);

            socket.on('disconnect', () => {
                logger.info(`Client disconnected: ${socket.id}`);
            });

            // Message events will be implemented in messaging module
            // socket.on('message:send', handleMessageSend);
            // socket.on('typing:start', handleTypingStart);
            // socket.on('typing:stop', handleTypingStop);
        });

        // Make io available globally for use in routes
        app.set('io', io);

        // Start listening
        httpServer.listen(env.PORT, () => {
            logger.info(`🚀 Server running on port ${env.PORT}`);
            logger.info(`📍 Environment: ${env.NODE_ENV}`);
            logger.info(`🔗 Health check: http://localhost:${env.PORT}/health`);
            logger.info(`📚 API Base: http://localhost:${env.PORT}/api/v1`);
        });

        // Graceful shutdown
        const gracefulShutdown = (signal: string): void => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            httpServer.close(() => {
                logger.info('HTTP server closed');
                io.close(() => {
                    logger.info('Socket.io server closed');
                    process.exit(0);
                });
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();
