import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to user's dashboard based on their role
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
};

export default RoleRedirect;