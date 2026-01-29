// API Configuration
const getBaseUrl = () => {
    // 1. Check Environment Variable first
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        console.log('[API Config] Using VITE_API_URL:', envUrl);
        return envUrl;
    }

    // 2. Check if we're in production (Vercel or any deployed environment)
    const isProduction = import.meta.env.PROD;
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

    console.log('[API Config] Environment:', {
        PROD: isProduction,
        hostname: hostname,
        VITE_API_URL: envUrl
    });

    // If deployed (not localhost), use production backend
    if (hostname && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
        const prodUrl = 'https://donou-backend.vercel.app/api';
        console.log('[API Config] Detected production deployment, using:', prodUrl);
        return prodUrl;
    }

    // 3. Local Development Default
    const localUrl = 'http://localhost:3000/api';
    console.log('[API Config] Using local development:', localUrl);
    return localUrl;
};

export const API_BASE_URL = getBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        SIGNUP: `${API_BASE_URL}/auth/signup`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        ME: `${API_BASE_URL}/auth/me`,
        REFRESH: `${API_BASE_URL}/auth/refresh`,
    },

    // Onboarding
    ONBOARDING: {
        BRAND: `${API_BASE_URL}/onboarding/brand`,
        MANUFACTURER: `${API_BASE_URL}/onboarding/manufacturer`,
        STATUS: `${API_BASE_URL}/onboarding/status`,
    },

    // Briefs
    BRIEFS: {
        BASE: `${API_BASE_URL}/briefs`,
        BY_ID: (id: string) => `${API_BASE_URL}/briefs/${id}`,
    },

    // Proposals
    PROPOSALS: {
        BASE: `${API_BASE_URL}/proposals`,
        BY_ID: (id: string) => `${API_BASE_URL}/proposals/${id}`,
    },

    // Dashboard
    DASHBOARD: {
        STATS: `${API_BASE_URL}/dashboard/stats`,
        ACTIVITY: `${API_BASE_URL}/dashboard/activity`,
    },

    // Health check
    HEALTH: `${API_BASE_URL}/health`,
};
