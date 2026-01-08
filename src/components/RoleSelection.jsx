import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    { id: 'employee', title: 'Enterprise Employee', icon: '👥', color: theme.colors.primaryBlue, route: '/login' },
    { id: 'marketing', title: 'Marketing Manager', icon: '📊', color: theme.colors.success, route: '/login' },
    { id: 'production', title: 'Production Manager', icon: '🏭', color: theme.colors.warning, route: '/login' },
    { id: 'owner', title: 'Enterprise Owner', icon: '💼', color: theme.colors.danger, route: '/login' },
  ];

  const handleRoleSelect = (roleId) => {
    localStorage.setItem('selectedRole', roleId);
    navigate('/login');
  };

  return (
    <div style={{
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      padding: '40px 60px', // reduced padding for desktop
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1800px', // wider container for large screens
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{
            ...textStyles.headingLarge,
            color: theme.colors.primaryText,
            fontSize: '42px',
            marginBottom: '16px',
          }}>
            Cattle Feed Management System
          </h1>
          <p style={{
            ...textStyles.bodyMedium,
            color: theme.colors.textGrey,
            fontSize: '18px',
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            Streamline operations, track performance, and make data-driven decisions
          </p>
        </div>

        {/* Role Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // responsive columns
          gap: '32px',
          marginBottom: '40px',
        }}>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              style={{
                backgroundColor: theme.colors.white,
                borderRadius: '16px',
                border: `1px solid ${theme.colors.borderGrey}`,
                padding: '30px 24px',
                boxShadow: `0 8px 20px ${theme.colors.shadowGrey}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 16px 32px ${theme.colors.shadowGrey}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${theme.colors.shadowGrey}`;
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
              }}>
                <div style={{
                  padding: '18px',
                  backgroundColor: `${role.color}26`,
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '60px',
                  height: '60px',
                  marginRight: '16px',
                }}>
                  <span style={{ fontSize: '28px', color: role.color }}>{role.icon}</span>
                </div>
                <h3 style={{
                  ...textStyles.headingMedium,
                  color: theme.colors.primaryText,
                  fontSize: '22px',
                  fontWeight: '600',
                  margin: 0,
                }}>
                  {role.title}
                </h3>
              </div>

              <div style={{
                width: '100%',
                backgroundColor: theme.colors.softGreyBg,
                borderRadius: '12px',
                border: `1px solid ${role.color}4D`,
                padding: '14px 12px',
                textAlign: 'center',
              }}>
                <span style={{
                  color: role.color,
                  fontWeight: '600',
                  fontSize: '14px',
                }}>
                  Access Dashboard
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          textAlign: 'center',
          ...textStyles.bodyMedium,
          color: theme.colors.textGrey,
          fontSize: '16px',
        }}>
          Select your role to access your personalized dashboard
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
