import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '@/features/auth/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    // Check if authenticated
    if (!token || !userJson) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    const user: User = JSON.parse(userJson);

    // Check onboarding status
    // If not completed and trying to access anything other than onboarding, redirect to onboarding
    if (!user.onboardingCompleted && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    // If completed and trying to access onboarding, redirect to dashboard
    if (user.onboardingCompleted && location.pathname === '/onboarding') {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
