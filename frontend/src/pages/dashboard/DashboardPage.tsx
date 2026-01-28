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

    // Role-based redirection - ensure role value is normalized to lowercase
    const userRole = user.role?.toLowerCase() || '';
    
    if (userRole === 'manufacturer') {
        return <Navigate to="/manufacturer/dashboard" replace />;
    }

    if (userRole === 'brand') {
        return <Navigate to="/brand/dashboard" replace />;
    }

    // Fallback - unknown role
    return <div className="flex h-screen items-center justify-center">Invalid user role</div>;
};

export default DashboardPage;
