import { useState, useEffect } from 'react';
import { authService, type User } from '@/services/auth.service';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userJson = localStorage.getItem('user');
                const token = localStorage.getItem('accessToken');

                if (userJson && token) {
                    // Parse user from localStorage
                    const storedUser = JSON.parse(userJson);
                    setUser(storedUser);

                    // Optionally: Fetch fresh user data from backend
                    try {
                        const freshUser = await authService.me();
                        setUser(freshUser);
                    } catch (err) {
                        // If /me fails, use cached user
                        console.warn('Failed to fetch fresh user data, using cached', err);
                    }
                }
            } catch (e) {
                console.error('Failed to load user', e);
                setError('Failed to load user');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await authService.login({ email, password });
            setUser(result.user);
            return result;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (data: {
        email: string;
        password: string;
        full_name: string;
        role: 'brand' | 'manufacturer';
        phone?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const result = await authService.signup(data);
            setUser(result.user);
            return result;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Signup failed';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout API call failed, but continuing with local cleanup", error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // Redirect to login page
            window.location.href = '/auth/login';
        }
    };

    return {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
    };
}
