import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Navigation items based on user role
  const navigationItems = getNavigationItems(user?.role);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: theme.colors.background
    }}>
      {/* Fixed Sidebar */}
      <div
        style={{
          backgroundColor: theme.colors.white,
          width: sidebarCollapsed ? '80px' : '280px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          transition: 'width 0.3s ease',
          boxShadow: `2px 0 10px ${theme.colors.shadowGrey}`,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Logo Section */}
        <div style={{
          padding: '24px 16px',
          borderBottom: `1px solid ${theme.colors.borderGrey}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: sidebarCollapsed ? '0' : '12px',
            cursor: 'pointer',
          }} onClick={() => navigate('/dashboard')}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: theme.colors.primaryBlue,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.white,
              fontWeight: 'bold',
              fontSize: '16px',
            }}>
              CF
            </div>
            {!sidebarCollapsed && (
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
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.textGrey,
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.colors.softGreyBg;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ≡
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 0'
        }}>
          {navigationItems.map((item, index) => (
            <div
              key={index}
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                color: theme.colors.textGrey,
                transition: 'all 0.2s',
                margin: '0 12px',
                borderRadius: '8px',
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
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!sidebarCollapsed && (
                <span style={{
                  ...textStyles.bodyMedium,
                  color: theme.colors.textGrey,
                  fontWeight: '500',
                }}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Toggle Button (when collapsed) */}
        {sidebarCollapsed && (
          <div style={{
            padding: '16px',
            borderTop: `1px solid ${theme.colors.borderGrey}`,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={toggleSidebar}
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.textGrey,
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.colors.softGreyBg;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ≡
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        {/* Top Navigation Bar */}
        <div style={{
          backgroundColor: theme.colors.white,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: `0 2px 8px ${theme.colors.shadowGrey}`,
          position: 'sticky',
          top: 0,
          zIndex: 999,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {!sidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '22px',
                  cursor: 'pointer',
                  color: theme.colors.textGrey,
                  padding: '6px',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.colors.softGreyBg;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                ≡
              </button>
            )}
            <h1 style={{
              ...textStyles.headingMedium,
              color: theme.colors.primaryText,
              margin: 0,
              fontSize: '22px',
            }}>
              {getDashboardTitle(user?.role)}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                ...textStyles.bodyMedium,
                color: theme.colors.primaryText,
                fontWeight: '600',
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
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: theme.colors.lightBlue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: theme.colors.primaryBlue,
            }}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: theme.colors.danger,
                color: theme.colors.white,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                ...textStyles.bodyMedium,
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d32f2f';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme.colors.danger;
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div style={{
          flex: 1,
          padding: '24px',
          backgroundColor: theme.colors.background,
          minHeight: 'calc(100vh - 72px)',
        }}>
          <div style={{
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
          }}>
            <Outlet />
          </div>
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
        { label: 'Dashboard', path: '/employee', icon: '🏠' },
        { label: 'Attendance', path: '/employee/attendance', icon: '📅' },
        { label: 'Create Order', path: '/employee/create-order', icon: '➕' },
        { label: 'Orders', path: '/employee/recent-orders', icon: '📋' },
        { label: 'Profile', path: '/employee/profile', icon: '👤' },
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

export default MainLayout;