import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* App Bar */}
      <div style={{
        backgroundColor: theme.colors.primaryBlue,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            color: theme.colors.white,
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            My Profile
          </span>
        </div>
        <button 
          onClick={logout}
          style={{
            backgroundColor: theme.colors.white,
            color: theme.colors.primaryBlue,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          Logout
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Profile Card */}
        <div style={{
          padding: '20px',
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          boxShadow: `0 12px 12px ${theme.colors.shadowGrey}`,
          marginBottom: '20px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: theme.colors.lightBlue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '40px',
            }}>
              👤
            </div>
            <h2 style={{
              ...textStyles.headingMedium,
              color: theme.colors.primaryText,
              margin: '0 0 8px 0',
            }}>
              {user?.fullName || 'Alex Johnson'}
            </h2>
            <p style={{
              ...textStyles.bodyMedium,
              color: theme.colors.textGrey,
              margin: 0,
            }}>
              Employee
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center' }}>
            <span style={{ color: theme.colors.textGrey, ...textStyles.bodyMedium }}>📧</span>
            <span style={{ color: theme.colors.primaryText, ...textStyles.bodyMedium }}>{user?.email || 'alex.johnson@example.com'}</span>
            
            <span style={{ color: theme.colors.textGrey, ...textStyles.bodyMedium }}>📞</span>
            <span style={{ color: theme.colors.primaryText, ...textStyles.bodyMedium }}>+1 (555) 123-4567</span>
            
            <span style={{ color: theme.colors.textGrey, ...textStyles.bodyMedium }}>🏢</span>
            <span style={{ color: theme.colors.primaryText, ...textStyles.bodyMedium }}>Production Department</span>
            
            <span style={{ color: theme.colors.textGrey, ...textStyles.bodyMedium }}>📅</span>
            <span style={{ color: theme.colors.primaryText, ...textStyles.bodyMedium }}>Joined: Jan 15, 2023</span>
          </div>
        </div>

        {/* Profile Actions */}
        <div style={{
          padding: '20px',
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          boxShadow: `0 12px 12px ${theme.colors.shadowGrey}`,
        }}>
          <h3 style={{
            ...textStyles.headingSmall,
            color: theme.colors.primaryText,
            marginBottom: '16px',
          }}>
            Account Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{
              padding: '12px',
              backgroundColor: theme.colors.white,
              border: `1px solid ${theme.colors.borderGrey}`,
              borderRadius: '8px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}>
              <span>🔒</span>
              <span style={{ color: theme.colors.primaryText, ...textStyles.bodyMedium }}>Change Password</span>
            </button>
            
            <button style={{
              padding: '12px',
              backgroundColor: theme.colors.white,
              border: `1px solid ${theme.colors.borderGrey}`,
              borderRadius: '8px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}>
              <span>⚙️</span>
              <span style={{ color: theme.colors.primaryText, ...textStyles.bodyMedium }}>Notification Settings</span>
            </button>
            
            <button style={{
              padding: '12px',
              backgroundColor: theme.colors.white,
              border: `1px solid ${theme.colors.borderGrey}`,
              borderRadius: '8px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
            }}>
              <span>📋</span>
              <span style={{ color: theme.colors.primaryText, ...textStyles.bodyMedium }}>My Performance Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;