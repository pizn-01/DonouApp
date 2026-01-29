import axios, { AxiosError } from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Don't set baseURL at module load time - compute it dynamically
export const apiClient = axios.create({
    withCredentials: false, // Not using cookies, using JWT in headers
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to:
// 1. Add base URL dynamically
// 2. Add access token from localStorage
apiClient.interceptors.request.use(
    (config) => {
        // Dynamically compute the base URL (handles cases where it needs window)
        const baseURL = (() => {
            const envUrl = import.meta.env.VITE_API_URL;
            if (envUrl) return envUrl;

            const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
            if (hostname && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
                return 'https://donou-backend.vercel.app/api';
            }

            return 'http://localhost:3000/api';
        })();

        // If the URL is relative, prepend the base URL
        if (config.url && !config.url.startsWith('http')) {
            config.url = `${baseURL}${config.url}`;
        }

        // Add auth token
        const token = localStorage.getItem('accessToken');
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('[apiClient] Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get the refresh token
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to refresh the token
                const response = await apiClient.post(
                    API_ENDPOINTS.AUTH.REFRESH,
                    { refreshToken }, // Send refresh token in body
                    {
                        // No Authorization header needed for this endpoint
                    }
                );

                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);

                // Update the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry the original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear everything and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
