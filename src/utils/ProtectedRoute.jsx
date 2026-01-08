import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute component to guard routes that require authentication
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If still loading authentication state, show loading indicator
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to their own dashboard
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to user's actual dashboard based on their role
    let redirectPath = '/';
    switch (user?.role) {
      case 'Marketing Manager':
        redirectPath = '/marketing';
        break;
      case 'Production Manager':
        redirectPath = '/production';
        break;
      case 'Owner':
        redirectPath = '/owner';
        break;
      case 'Employee':
        redirectPath = '/employee';
        break;
      default:
        redirectPath = '/employee'; // Default for unknown roles
    }
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has required role (if any)
  return children;
};

export default ProtectedRoute;