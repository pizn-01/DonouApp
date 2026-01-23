import { useState, useEffect } from 'react';
import type { User } from '@/features/auth/types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                setUser(JSON.parse(userJson)); // eslint-disable-line
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
    }, []);

    return { user };
}
