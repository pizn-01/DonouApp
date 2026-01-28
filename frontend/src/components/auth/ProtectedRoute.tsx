import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '@/features/auth/types';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
    // Optional allowed roles for this route (e.g. ['brand'] or ['manufacturer'])
    allowedRoles?: Array<'brand' | 'manufacturer'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const location = useLocation();
    const accessToken = localStorage.getItem('accessToken');
    const userJson = localStorage.getItem('user');
    const [isVerifying, setIsVerifying] = useState(false);
    // Use state for user to allow updates if we re-fetch
    const [currentUser, setCurrentUser] = useState<User | null>(
        userJson ? JSON.parse(userJson) : null
    );

    // Re-verify user state if they seem to be incomplete but have a token
    // This fixes the "Loop" where backend is true but local storage is false
    useEffect(() => {
        const verifyStatus = async () => {
            if (accessToken && currentUser && !currentUser.onboarding_completed && !isVerifying) {
                setIsVerifying(true);
                try {
                    const freshUser = await authService.me();
                    // Update local storage and state if changed
                    if (freshUser.onboarding_completed !== currentUser.onboarding_completed) {
                        localStorage.setItem('user', JSON.stringify(freshUser));
                        setCurrentUser(freshUser);
                    }
                } catch (error) {
                    console.error("Failed to re-verify user status", error);
                } finally {
                    setIsVerifying(false);
                }
            }
        };

        verifyStatus();
    }, [currentUser, accessToken]); // Dependency on currentUser.onboarding_completed implicitly

    // Check if authenticated
    if (!accessToken || !currentUser) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // While verifying, we can show a loader or just wait. 
    // To prevent flashing, if we are verifying and strictly on a protected route, 
    // we might want to wait. But for better UX, let's fall through default behavior 
    // and let the Effect update it.

    // Check onboarding status
    if (!currentUser.onboarding_completed && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    if (currentUser.onboarding_completed && location.pathname === '/onboarding') {
        const dashboardPath = currentUser.role === 'brand' ? '/brand/dashboard' : '/manufacturer/dashboard';
        return <Navigate to={dashboardPath} replace />;
    }

    // Role-based UI access (frontend guard)
    if (allowedRoles && allowedRoles.length > 0) {
        const role = (currentUser.role || '').toLowerCase();
        if (!allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
            // Redirect to generic dashboard if role mismatch
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
}
