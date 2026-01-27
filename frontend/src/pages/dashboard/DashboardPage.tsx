import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const DashboardPage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null; // ProtectedRoute handles this
    }

    // Role-based redirection
    if (user.role === 'manufacturer') {
        return <Navigate to="/manufacturer/dashboard" replace />;
    }

    // Default to Brand Dashboard
    return <Navigate to="/brand/dashboard" replace />;
};

export default DashboardPage;
