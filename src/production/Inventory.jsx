import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Inventory = () => {
  const { user, logout } = useAuth();

  const rawMaterials = [
    { id: 1, name: 'Maize/Corn', current: 450, required: 500, unit: 'kg', status: 'Low' },
    { id: 2, name: 'Soybean Meal', current: 210, required: 250, unit: 'kg', status: 'Low' },
    { id: 3, name: 'Cotton Seed Cake', current: 95, required: 100, unit: 'kg', status: 'Low' },
    { id: 4, name: 'Wheat Bran', current: 300, required: 250, unit: 'kg', status: 'Good' },
    { id: 5, name: 'Groundnut Cake', current: 150, required: 200, unit: 'kg', status: 'Low' },
    { id: 6, name: 'Rice Bran', current: 220, required: 180, unit: 'kg', status: 'Good' },
  ];

  const finishedProducts = [
    { id: 1, name: 'Calf Starter Feed', current: 120, required: 150, unit: 'kg', status: 'Low' },
    { id: 2, name: 'Grower Feed', current: 200, required: 180, unit: 'kg', status: 'Good' },
    { id: 3, name: 'Finisher Feed', current: 180, required: 200, unit: 'kg', status: 'Low' },
    { id: 4, name: 'Lactating Cow Feed', current: 150, required: 140, unit: 'kg', status: 'Good' },
  ];

  const getStatusColor = (status) => {
    return status === 'Low' ? theme.colors.danger : theme.colors.success;
  };

  const getStatusBg = (status) => {
    return status === 'Low' ? theme.colors.dangerLight : theme.colors.successLight;
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
            Inventory Management
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
        {/* Raw Materials */}
        <div style={{
          padding: '20px',
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          boxShadow: `0 12px 12px ${theme.colors.shadowGrey}`,
          marginBottom: '20px',
        }}>
          <h2 style={{
            ...textStyles.headingMedium,
            color: theme.colors.primaryText,
            marginBottom: '20px',
          }}>
            Raw Materials Inventory
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rawMaterials.map((item) => (
              <div 
                key={item.id}
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
                  <div style={{
                    ...textStyles.bodyMedium,
                    color: theme.colors.primaryText,
                    marginBottom: '4px',
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    ...textStyles.bodySmall,
                    color: theme.colors.textGrey,
                  }}>
                    Required: {item.required} {item.unit}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    ...textStyles.metric,
                    color: theme.colors.primaryText,
                    marginBottom: '4px',
                  }}>
                    {item.current} {item.unit}
                  </div>
                  <div style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: getStatusBg(item.status),
                    color: getStatusColor(item.status),
                    display: 'inline-block',
                    ...textStyles.label,
                  }}>
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finished Products */}
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
            Finished Products Inventory
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {finishedProducts.map((item) => (
              <div 
                key={item.id}
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
                  <div style={{
                    ...textStyles.bodyMedium,
                    color: theme.colors.primaryText,
                    marginBottom: '4px',
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    ...textStyles.bodySmall,
                    color: theme.colors.textGrey,
                  }}>
                    Required: {item.required} {item.unit}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    ...textStyles.metric,
                    color: theme.colors.primaryText,
                    marginBottom: '4px',
                  }}>
                    {item.current} {item.unit}
                  </div>
                  <div style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: getStatusBg(item.status),
                    color: getStatusColor(item.status),
                    display: 'inline-block',
                    ...textStyles.label,
                  }}>
                    {item.status}
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

export default Inventory;