import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const MarDashboard = () => {
  const { user, logout } = useAuth();
  
  // Sample district → taluka data
  const data = {
    "Pune": [
      {"taluka": "Haveli", "sales": 320},
      {"taluka": "Mulshi", "sales": 260},
      {"taluka": "Junnar", "sales": 290},
      {"taluka": "Khed", "sales": 270},
      {"taluka": "Daund", "sales": 280},
    ],
    "Nashik": [
      {"taluka": "Niphad", "sales": 300},
      {"taluka": "Sinnar", "sales": 260},
      {"taluka": "Dindori", "sales": 280},
      {"taluka": "Malegaon", "sales": 310},
    ],
    "Ahmednagar": [
      {"taluka": "Rahata", "sales": 340},
      {"taluka": "Shrirampur", "sales": 320},
      {"taluka": "Sangamner", "sales": 300},
      {"taluka": "Akole", "sales": 260},
    ],
  };

  const [selectedDistrict, setSelectedDistrict] = useState(Object.keys(data)[0]);

  const totalSales = (district) => {
    return data[district] ? data[district].reduce((sum, e) => sum + e.sales, 0) : 0;
  };

  const districtData = data[selectedDistrict] || [];

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
            Marketing Manager
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
        <h1 style={{
          ...textStyles.headingMedium,
          color: theme.colors.primaryText,
          marginBottom: '4px',
        }}>
          Sales Overview
        </h1>
        <p style={{
          ...textStyles.bodySmall,
          color: theme.colors.textGrey,
          marginBottom: '20px',
        }}>
          District-wise cattle feed performance
        </p>

        {/* KPI Card */}
        <div style={{
          padding: '16px',
          backgroundColor: theme.colors.white,
          borderRadius: '14px',
          boxShadow: `0 6px 12px ${theme.colors.shadowGrey}`,
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              padding: '12px',
              backgroundColor: theme.colors.lightBlue,
              borderRadius: '12px',
              marginRight: '14px',
            }}>
              <span style={{ fontSize: '24px' }}>📊</span>
            </div>
            <div>
              <div style={{
                ...textStyles.label,
                color: theme.colors.textGrey,
              }}>
                Total Sales (Tons)
              </div>
              <div style={{
                ...textStyles.metric,
                color: theme.colors.primaryBlue,
                marginTop: '4px',
              }}>
                {totalSales(selectedDistrict).toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Taluka Chart */}
        <div style={{
          padding: '16px',
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          boxShadow: `0 6px 14px ${theme.colors.shadowGrey}`,
          marginBottom: '28px',
        }}>
          <div style={{ marginBottom: '6px' }}>
            <h2 style={{
              ...textStyles.headingSmall,
              color: theme.colors.primaryText,
              margin: 0,
            }}>
              Taluka-wise Sales Trend
            </h2>
            <p style={{
              ...textStyles.bodySmall,
              color: theme.colors.textGrey,
              margin: 0,
            }}>
              Reported sales volume
            </p>
          </div>
          
          {/* Chart Placeholder */}
          <div style={{
            height: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.softGreyBg,
            borderRadius: '8px',
            marginTop: '12px',
          }}>
            <div style={{ textAlign: 'center', color: theme.colors.textGrey }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>Sales Trend Chart</div>
              <div>Line chart visualization would go here</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <button
            style={{
              height: '48px',
              backgroundColor: theme.colors.primaryBlue,
              color: theme.colors.white,
              border: 'none',
              borderRadius: '8px',
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <span>👥</span>
            <span>Employees</span>
          </button>
          
          <button
            style={{
              height: '48px',
              backgroundColor: theme.colors.success,
              color: theme.colors.white,
              border: 'none',
              borderRadius: '8px',
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <span>🛒</span>
            <span>Make Order</span>
          </button>
          
          <button
            style={{
              height: '48px',
              backgroundColor: theme.colors.warning,
              color: theme.colors.white,
              border: 'none',
              borderRadius: '8px',
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <span>📊</span>
            <span>Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarDashboard;