import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const EmpDashboard = () => {
  const { user, logout } = useAuth();

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const performance = [60, 70, 65, 80, 75, 85, 88, 82, 90, 92, 95, 98];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const bottomPages = [
    'Home',
    'Create Order',
    'Orders',
    'Profile',
  ];

  const handleNavigation = (index) => {
    setSelectedIndex(index);
    // In a real app, you would navigate to different routes
    console.log(`Navigating to ${bottomPages[index]}`);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Mark Attendance - Full width card */}
      <div
        style={{
          padding: '20px',
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
          marginBottom: '24px',
          cursor: 'pointer',
        }}
        onClick={() => console.log('Mark attendance clicked')}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            padding: '10px',
            backgroundColor: theme.colors.primaryBlue,
            borderRadius: '12px',
            marginRight: '16px',
          }}>
            <span style={{ color: theme.colors.white, fontSize: '24px' }}>📅</span>
          </div>
          <div>
            <div style={{
              ...textStyles.headingSmall,
              fontWeight: 'bold',
              color: theme.colors.primaryText,
              fontSize: '18px',
            }}>
              Mark Attendance
            </div>
            <div style={{
              ...textStyles.bodySmall,
              color: theme.colors.textGrey,
            }}>
              Tap to mark now
            </div>
          </div>
        </div>
      </div>

      {/* Orders Overview - Desktop Grid Layout */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          ...textStyles.headingMedium,
          color: theme.colors.primaryText,
          marginBottom: '16px',
          fontSize: '20px',
        }}>
          Orders Overview
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Total Orders Card */}
          <div
            style={{
              padding: '20px',
              backgroundColor: theme.colors.white,
              borderRadius: '16px',
              boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onClick={() => console.log('Total orders clicked')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = `0 8px 20px ${theme.colors.shadowGrey}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 12px ${theme.colors.shadowGrey}`;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  ...textStyles.metric,
                  color: theme.colors.primaryText,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}>
                  124
                </div>
                <div style={{
                  ...textStyles.label,
                  color: theme.colors.textGrey,
                }}>
                  Total Orders
                </div>
              </div>
              <div style={{ fontSize: '32px', color: theme.colors.primaryBlue, opacity: 0.7 }}>
                🛒
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div
            style={{
              padding: '20px',
              backgroundColor: theme.colors.white,
              borderRadius: '16px',
              boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onClick={() => console.log('Pending orders clicked')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = `0 8px 20px ${theme.colors.shadowGrey}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 12px ${theme.colors.shadowGrey}`;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  ...textStyles.metric,
                  color: theme.colors.warning,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}>
                  8
                </div>
                <div style={{
                  ...textStyles.label,
                  color: theme.colors.textGrey,
                }}>
                  Pending
                </div>
              </div>
              <div style={{ fontSize: '32px', color: theme.colors.warning, opacity: 0.7 }}>
                ⏱️
              </div>
            </div>
          </div>

          {/* Completed Card */}
          <div
            style={{
              padding: '20px',
              backgroundColor: theme.colors.white,
              borderRadius: '16px',
              boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onClick={() => console.log('Completed orders clicked')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = `0 8px 20px ${theme.colors.shadowGrey}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 12px ${theme.colors.shadowGrey}`;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  ...textStyles.metric,
                  color: theme.colors.successGreen,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                }}>
                  116
                </div>
                <div style={{
                  ...textStyles.label,
                  color: theme.colors.textGrey,
                }}>
                  Completed
                </div>
              </div>
              <div style={{ fontSize: '32px', color: theme.colors.successGreen, opacity: 0.7 }}>
                ✅
              </div>
            </div>
          </div>
        </div>

        {/* Performance Graph and Monthly Target - Side by Side Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Performance Graph */}
          <div style={{
            padding: '20px',
            backgroundColor: theme.colors.white,
            borderRadius: '16px',
            boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
          }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{
                ...textStyles.headingSmall,
                color: theme.colors.primaryText,
                margin: 0,
                fontSize: '18px',
              }}>
                Employee Achievement
              </h3>
              <p style={{
                ...textStyles.bodySmall,
                color: theme.colors.textGrey,
                margin: 0,
              }}>
                Monthly performance (%)
              </p>
            </div>

            {/* Chart Placeholder */}
            <div style={{
              height: '220px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: '16px',
              padding: '0 10px',
            }}>
              {performance.map((value, index) => (
                <div key={index} style={{
                  width: '24px',
                  height: `${(value / 100) * 180}px`,
                  backgroundColor: theme.colors.primaryBlue,
                  borderRadius: '6px 6px 0 0',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '4px',
                }}>
                  <span style={{ fontSize: '10px', color: theme.colors.white }}>
                    {months[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Target */}
          <div style={{
            padding: '20px',
            backgroundColor: theme.colors.white,
            borderRadius: '16px',
            boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              {/* Circular Progress */}
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
                marginBottom: '16px',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.softGreyBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: theme.colors.primaryBlue,
                  }}>
                    75%
                  </div>
                </div>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '12px solid transparent',
                  borderTopColor: theme.colors.primaryBlue,
                  borderRightColor: theme.colors.primaryBlue,
                  transform: 'rotate(135deg)',
                }}>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  ...textStyles.headingSmall,
                  color: theme.colors.primaryText,
                  marginBottom: '4px',
                }}>
                  Monthly Target
                </div>
                <div style={{
                  ...textStyles.bodySmall,
                  color: theme.colors.textGrey,
                }}>
                  120 / 160 hours completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;