import axios, { AxiosError } from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Create axios instance with default config
export const apiClient = axios.create({
    withCredentials: false, // Not using cookies, using JWT in headers
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token from localStorage
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
                // Get the current access token (which might be expired)
                const currentToken = localStorage.getItem('accessToken');

                if (!currentToken) {
                    throw new Error('No token available');
                }

                // Try to refresh the token
                const response = await apiClient.post(
                    API_ENDPOINTS.AUTH.REFRESH,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${currentToken}`,
                        },
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
