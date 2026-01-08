import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Maintenance = () => {
  const { user, logout } = useAuth();

  const equipment = [
    {
      id: 1,
      name: 'Feed Mixer Machine',
      status: 'Operational',
      lastMaintenance: '2023-10-01',
      nextMaintenance: '2023-11-01',
      hoursUsed: 1250,
    },
    {
      id: 2,
      name: 'Pellet Mill',
      status: 'Under Maintenance',
      lastMaintenance: '2023-09-15',
      nextMaintenance: '2023-10-15',
      hoursUsed: 850,
    },
    {
      id: 3,
      name: 'Conveyor Belt',
      status: 'Operational',
      lastMaintenance: '2023-09-30',
      nextMaintenance: '2023-10-30',
      hoursUsed: 1100,
    },
    {
      id: 4,
      name: 'Packaging Machine',
      status: 'Operational',
      lastMaintenance: '2023-10-05',
      nextMaintenance: '2023-11-05',
      hoursUsed: 980,
    },
    {
      id: 5,
      name: 'Grinding Mill',
      status: 'Scheduled for Maintenance',
      lastMaintenance: '2023-08-20',
      nextMaintenance: '2023-10-20',
      hoursUsed: 1450,
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Operational': return theme.colors.success;
      case 'Under Maintenance': return theme.colors.danger;
      case 'Scheduled for Maintenance': return theme.colors.warning;
      default: return theme.colors.textGrey;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Operational': return theme.colors.successLight;
      case 'Under Maintenance': return theme.colors.dangerLight;
      case 'Scheduled for Maintenance': return theme.colors.warningLight;
      default: return theme.colors.softGreyBg;
    }
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
            Equipment Maintenance
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
          }}>
            Production Equipment Status
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {equipment.map((item) => (
              <div 
                key={item.id}
                style={{
                  padding: '16px',
                  border: `1px solid ${theme.colors.borderGrey}`,
                  borderRadius: '8px',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    ...textStyles.bodyMedium,
                    fontWeight: 'bold',
                    color: theme.colors.primaryText,
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusBg(item.status),
                    color: getStatusColor(item.status),
                    ...textStyles.label,
                  }}>
                    {item.status}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                      marginBottom: '4px',
                    }}>
                      Last Maintenance
                    </div>
                    <div style={{
                      ...textStyles.bodySmall,
                      color: theme.colors.primaryText,
                    }}>
                      {new Date(item.lastMaintenance).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                      marginBottom: '4px',
                    }}>
                      Next Maintenance
                    </div>
                    <div style={{
                      ...textStyles.bodySmall,
                      color: theme.colors.primaryText,
                    }}>
                      {new Date(item.nextMaintenance).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                      marginBottom: '4px',
                    }}>
                      Hours Used
                    </div>
                    <div style={{
                      ...textStyles.bodySmall,
                      color: theme.colors.primaryText,
                    }}>
                      {item.hoursUsed} hours
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;