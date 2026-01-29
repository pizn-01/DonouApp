// API Configuration
// Note: We use relative paths for Endpoints so apiClient can dynamically prepend the correct Base URL
// based on the environment (Vercel vs Localhost) at request time.
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// API Endpoints - All relative paths
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        SIGNUP: '/auth/signup',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        REFRESH: '/auth/refresh',
    },

    // Onboarding
    ONBOARDING: {
        BRAND: '/onboarding/brand',
        MANUFACTURER: '/onboarding/manufacturer',
        STATUS: '/onboarding/status',
    },

    // Briefs
    BRIEFS: {
        BASE: '/briefs',
        BY_ID: (id: string) => `/briefs/${id}`,
    },

    // Proposals
    PROPOSALS: {
        BASE: '/proposals',
        BY_ID: (id: string) => `/proposals/${id}`,
    },

    // Dashboard
    DASHBOARD: {
        STATS: '/dashboard/stats',
        ACTIVITY: '/dashboard/activity',
    },

    // Health check
    HEALTH: '/health',
};
