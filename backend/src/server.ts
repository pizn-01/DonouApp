import app from './app';
import { env } from './config/env';

const PORT = parseInt(env.PORT, 10);

// Start server
app.listen(PORT, () => {
    console.log('🚀 DonauApp Backend API');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`🔐 Supabase URL: ${env.SUPABASE_URL}`);
    console.log(`\n✨ Ready to accept connections!`);
    console.log(`\nAPI Endpoints:`);
    console.log(`  - POST   /api/auth/signup`);
    console.log(`  - POST   /api/auth/login`);
    console.log(`  - GET    /api/auth/me`);
    console.log(`  - POST   /api/auth/refresh`);
    console.log(`  - POST   /api/auth/logout`);
    console.log(`  - POST   /api/onboarding/brand`);
    console.log(`  - POST   /api/onboarding/manufacturer`);
    console.log(`  - GET    /api/onboarding/status`);
    console.log(`  - GET    /api/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received, shutting down gracefully');
    process.exit(0);
});
