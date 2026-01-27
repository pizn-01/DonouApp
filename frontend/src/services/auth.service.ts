import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';

// Types matching backend responses
export interface User {
    id: string;
    user_id: string;
    role: 'brand' | 'manufacturer';
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
    email?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface SignupData {
    email: string;
    password: string;
    full_name: string;
    role: 'brand' | 'manufacturer';
    phone?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

// Auth Service
export const authService = {
    /**
     * Register a new user
     */
    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, data);
        const { user, accessToken, refreshToken } = response.data.data;

        // Store tokens and user in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data.data;
    },

    /**
     * Login existing user
     */
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
        const { user, accessToken, refreshToken } = response.data.data;

        // Store tokens and user in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data.data;
    },

    /**
     * Get current user
     */
    async me(): Promise<User> {
        const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
        const user = response.data.data;

        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        } finally {
            // Clear tokens and user even if API call fails
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<string> {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH);
        const { accessToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);

        return accessToken;
    },
};

// Onboarding Service
export interface BrandOnboardingData {
    company_name: string;
    industry?: string;
    company_size?: string;
    website?: string;
    description?: string;
    logo_url?: string;
}

export interface ManufacturerOnboardingData {
    company_name: string;
    capabilities: Array<{
        category: string;
        subcategories: string[];
    }>;
    production_capacity?: string;
    factory_location?: string;
    certifications?: Array<{
        name: string;
        issued_by?: string;
        expires_at?: string;
    }>;
    year_established?: number;
    employee_count?: string;
    website?: string;
    description?: string;
    logo_url?: string;
}

export const onboardingService = {
    /**
     * Complete brand onboarding
     */
    async completeBrandOnboarding(data: BrandOnboardingData) {
        const response = await apiClient.post(API_ENDPOINTS.ONBOARDING.BRAND, data);
        return response.data.data;
    },

    /**
     * Complete manufacturer onboarding
     */
    async completeManufacturerOnboarding(data: ManufacturerOnboardingData) {
        const response = await apiClient.post(API_ENDPOINTS.ONBOARDING.MANUFACTURER, data);
        return response.data.data;
    },

    /**
     * Get onboarding status
     */
    async getOnboardingStatus() {
        const response = await apiClient.get(API_ENDPOINTS.ONBOARDING.STATUS);
        return response.data.data;
    },
};
