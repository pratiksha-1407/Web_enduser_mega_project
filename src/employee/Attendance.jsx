import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Attendance = () => {
  const { user, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const markAttendance = (type) => {
    console.log(`Marked ${type} at ${currentTime.toLocaleTimeString()}`);
    // In a real app, this would make an API call
  };

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
            Mark Attendance
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
        {/* Time Card */}
        <div style={{
          padding: '20px',
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          boxShadow: `0 12px 12px ${theme.colors.shadowGrey}`,
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <div style={{
            ...textStyles.metric,
            color: theme.colors.primaryText,
            fontSize: '32px',
            marginBottom: '8px',
          }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{
            ...textStyles.bodyMedium,
            color: theme.colors.textGrey,
          }}>
            {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Attendance Actions */}
        <div style={{
          padding: '20px',
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          boxShadow: `0 12px 12px ${theme.colors.shadowGrey}`,
        }}>
          <h2 style={{
            ...textStyles.headingMedium,
            color: theme.colors.primaryText,
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            Mark Your Attendance
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={() => markAttendance('in')}
              style={{
                padding: '16px',
                backgroundColor: theme.colors.success,
                color: theme.colors.white,
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span>✅</span>
              Mark In
            </button>

            <button
              onClick={() => markAttendance('out')}
              style={{
                padding: '16px',
                backgroundColor: theme.colors.warning,
                color: theme.colors.white,
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <span>❌</span>
              Mark Out
            </button>
          </div>
        </div>

        {/* Recent Attendance */}
        <div style={{
          marginTop: '20px',
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
            Recent Attendance
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { date: 'Today', in: '09:00 AM', out: 'N/A', status: 'In Progress' },
              { date: 'Yesterday', in: '09:15 AM', out: '05:30 PM', status: 'Complete' },
              { date: 'Oct 15, 2023', in: '08:55 AM', out: '05:25 PM', status: 'Complete' },
            ].map((record, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  border: `1px solid ${theme.colors.borderGrey}`,
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div style={{ ...textStyles.bodyMedium, color: theme.colors.primaryText }}>
                    {record.date}
                  </div>
                  <div style={{ ...textStyles.bodySmall, color: theme.colors.textGrey }}>
                    In: {record.in} | Out: {record.out}
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: record.status === 'Complete' ? theme.colors.successLight : theme.colors.warningLight,
                  color: record.status === 'Complete' ? theme.colors.success : theme.colors.warning,
                  ...textStyles.label,
                }}>
                  {record.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;