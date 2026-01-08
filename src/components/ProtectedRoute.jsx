import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx'; // Preparing for any class logic if needed

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        // Redirect to their appropriate dashboard if they try to access a wrong role path
        const role = profile.role.toLowerCase();
        if (role.includes('employee')) return <Navigate to="/employee/dashboard" replace />;
        if (role.includes('marketing')) return <Navigate to="/marketing/dashboard" replace />;
        if (role.includes('production')) return <Navigate to="/production/dashboard" replace />;
        if (role.includes('owner')) return <Navigate to="/owner/dashboard" replace />;

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
