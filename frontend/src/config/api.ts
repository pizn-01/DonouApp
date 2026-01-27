// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
