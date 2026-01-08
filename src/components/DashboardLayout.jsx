import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Navigation items based on user role
  const navigationItems = getNavigationItems(user?.role);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          backgroundColor: theme.colors.white,
          width: sidebarOpen ? '240px' : '60px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          transition: 'width 0.3s ease',
          boxShadow: `2px 0 5px ${theme.colors.shadowGrey}`,
        }}
      >
        <div style={{ padding: '16px', borderBottom: `1px solid ${theme.colors.borderGrey}` }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'space-between' : 'center',
            cursor: 'pointer',
          }} onClick={() => navigate('/dashboard')}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: theme.colors.primaryBlue,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.white,
                fontWeight: 'bold',
                fontSize: '14px',
              }}>
                C
              </div>
              {sidebarOpen && (
                <span style={{
                  ...textStyles.headingSmall,
                  color: theme.colors.primaryText,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}>
                  Cattle Feed
                </span>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.textGrey,
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                ≡
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '16px 0' }}>
          {navigationItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                color: theme.colors.textGrey,
                transition: 'all 0.2s',
              }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.colors.softGreyBg;
                e.target.style.color = theme.colors.primaryBlue;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = theme.colors.textGrey;
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{
                  ...textStyles.bodyMedium,
                  color: theme.colors.textGrey,
                }}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '240px' : '60px',
        transition: 'margin-left 0.3s ease',
        backgroundColor: theme.colors.background,
        minHeight: '100vh',
      }}>
        {/* Top Bar */}
        <div style={{
          backgroundColor: theme.colors.white,
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 2px 4px ${theme.colors.shadowGrey}`,
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: theme.colors.textGrey,
              }}
            >
              ≡
            </button>
            <h1 style={{
              ...textStyles.headingMedium,
              color: theme.colors.primaryText,
              margin: 0,
            }}>
              {getDashboardTitle(user?.role)}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                ...textStyles.bodyMedium,
                color: theme.colors.primaryText,
                fontWeight: '500',
              }}>
                {user?.fullName || 'User'}
              </div>
              <div style={{
                ...textStyles.bodySmall,
                color: theme.colors.textGrey,
              }}>
                {user?.role || 'Role'}
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: theme.colors.lightBlue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: theme.colors.danger,
                color: theme.colors.white,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                ...textStyles.bodySmall,
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Outlet for child routes */}
        <div style={{ padding: '16px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Helper function to get navigation items based on role
const getNavigationItems = (role) => {
  switch (role) {
    case 'Owner':
      return [
        { label: 'Dashboard', path: '/owner', icon: '🏠' },
        { label: 'Quick Action', path: '/owner/quick-action', icon: '⚡' },
        { label: 'Sales', path: '/owner/sales', icon: '📊' },
        { label: 'Employees', path: '/owner/employee', icon: '👥' },
        { label: 'Inventory', path: '/owner/inventory', icon: '📦' },
        { label: 'Reports', path: '/owner/reports', icon: '📈' },
      ];
    case 'Marketing Manager':
      return [
        { label: 'Dashboard', path: '/marketing', icon: '🏠' },
        { label: 'Employees', path: '/marketing', icon: '👥' },
        { label: 'Orders', path: '/marketing', icon: '📋' },
        { label: 'Reports', path: '/marketing', icon: '📊' },
      ];
    case 'Production Manager':
      return [
        { label: 'Dashboard', path: '/production', icon: '🏠' },
        { label: 'Inventory', path: '/production/inventory', icon: '📦' },
        { label: 'Orders', path: '/production/orders', icon: '📋' },
        { label: 'Dispatch', path: '/production/dispatch', icon: '🚚' },
        { label: 'Quality Control', path: '/production/quality-control', icon: '✅' },
        { label: 'Maintenance', path: '/production/maintenance', icon: '🔧' },
      ];
    case 'Employee':
      return [
        { label: 'Dashboard', path: '/employee/dashboard', icon: '🏠' },
        { label: 'Create Order', path: '/employee/orders/new', icon: '➕' },
        { label: 'Orders', path: '/employee/orders', icon: '📋' },
        { label: 'Attendance', path: '/employee/attendance', icon: '📅' },
        { label: 'Profile', path: '/profile', icon: '👤' },
      ];
    default:
      return [
        { label: 'Dashboard', path: '/', icon: '🏠' },
      ];
  }
};

// Helper function to get dashboard title based on role
const getDashboardTitle = (role) => {
  switch (role) {
    case 'Owner':
      return 'Owner Dashboard';
    case 'Marketing Manager':
      return 'Marketing Manager Dashboard';
    case 'Production Manager':
      return 'Production Manager Dashboard';
    case 'Employee':
      return 'Employee Dashboard';
    default:
      return 'Dashboard';
  }
};

export default DashboardLayout;