import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';
import StockStatusGrid from '../widgets/StockStatusGrid';

const ProDashboard = () => {
  const { user, logout } = useAuth();

  // Simulated metrics for CATTLE FEED
  const dailyOutput = 125.0; // Metric Tons / Day
  
  const stockData = {
    "Maize/Corn": 450.0,
    "Soybean Meal": 210.0,
    "Cotton Seed Cake": 95.0,
  };

  return (
    <div style={{ backgroundColor: theme.colors.white, minHeight: '100vh' }}>
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
            Production Dashboard
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
        {/* Daily Performance */}
        <h1 style={{
          ...textStyles.headingMedium,
          color: theme.colors.primaryText,
          marginBottom: '12px',
        }}>
          Daily Performance
        </h1>

        <div style={{
          width: '100%',
          padding: '16px',
          backgroundColor: theme.colors.white,
          borderRadius: '12px',
          boxShadow: `0 8px 16px ${theme.colors.shadowGrey}`,
          marginBottom: '24px',
        }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{
              ...textStyles.bodySmall,
              color: theme.colors.textGrey,
            }}>
              Today's Output (Target: 120 MT)
            </span>
          </div>
          <div style={{
            ...textStyles.metric,
            color: theme.colors.primaryBlue,
          }}>
            {dailyOutput.toFixed(1)} MT
          </div>
        </div>

        {/* Raw Material Stock Status */}
        <StockStatusGrid 
          stockData={stockData}
          themePrimary={theme.colors.primaryBlue}
          themeSecondary={theme.colors.primaryBlue}
        />

        {/* Core Management Actions */}
        <div>
          <h2 style={{
            ...textStyles.headingMedium,
            color: theme.colors.primaryText,
            marginBottom: '16px',
          }}>
            Core Management Actions
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            justifyContent: 'center',
          }}>
            <button
              style={{
                width: '150px',
                height: '120px',
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.primaryBlue}4D`,
                borderRadius: '12px',
                boxShadow: `0 4px 8px ${theme.colors.shadowGrey}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '36px' }}>📦</span>
              <span style={{
                ...textStyles.bodyMedium,
                color: theme.colors.primaryText,
                textAlign: 'center',
              }}>
                Track Inventory
              </span>
            </button>
            
            <button
              style={{
                width: '150px',
                height: '120px',
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.primaryBlue}4D`,
                borderRadius: '12px',
                boxShadow: `0 4px 8px ${theme.colors.shadowGrey}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '36px' }}>📋</span>
              <span style={{
                ...textStyles.bodyMedium,
                color: theme.colors.primaryText,
                textAlign: 'center',
              }}>
                Manage Orders
              </span>
            </button>
            
            <button
              style={{
                width: '150px',
                height: '120px',
                backgroundColor: theme.colors.white,
                border: `1px solid ${theme.colors.primaryBlue}4D`,
                borderRadius: '12px',
                boxShadow: `0 4px 8px ${theme.colors.shadowGrey}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '36px' }}>🚚</span>
              <span style={{
                ...textStyles.bodyMedium,
                color: theme.colors.primaryText,
                textAlign: 'center',
              }}>
                Dispatch Goods
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProDashboard;