import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const OwnDashboard = () => {
  const { user, logout } = useAuth();

  // Mock data for the charts and KPIs
  const kpiData = [
    { icon: '💰', title: 'Total Revenue', value: '₹45.2L', growth: '12.5%' },
    { icon: '🏭', title: 'Production', value: '3.8K tons', growth: '8.3%' },
    { icon: '🛒', title: 'Total Sales', value: '₹38.5L', growth: '15.2%' },
    { icon: '👥', title: 'Active Dealers', value: '156', growth: '-2.1%', down: true },
  ];

  const branchData = [
    { name: 'Mumbai Branch', revenue: '₹18.5L', production: '1.5K tons', sales: '₹15.2L' },
    { name: 'Delhi Branch', revenue: '₹15.2L', production: '1.2K tons', sales: '₹12.8L' },
    { name: 'Bangalore Branch', revenue: '₹13.8L', production: '1.1K tons', sales: '₹11.6L' },
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* KPI Grid - Desktop optimized */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '24px',
      }}>
        {kpiData.map((kpi, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: theme.colors.white,
              borderRadius: '16px',
              padding: '24px',
              boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = `0 8px 20px ${theme.colors.shadowGrey}`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 12px ${theme.colors.shadowGrey}`;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', opacity: 0.8 }}>{kpi.icon}</div>
              <div style={{
                color: kpi.down ? theme.colors.danger : theme.colors.successGreen,
                fontWeight: 'bold',
                fontSize: '14px',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: kpi.down ? theme.colors.danger + '1A' : theme.colors.successGreen + '1A',
              }}>
                {kpi.down ? '↓' : '↑'} {kpi.growth}
              </div>
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: theme.colors.primaryText,
            }}>
              {kpi.value}
            </div>
            <div style={{
              color: theme.colors.textGrey,
              fontSize: '14px',
            }}>
              {kpi.title}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
        }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: theme.colors.primaryText,
            }}>
              Revenue Trend
            </div>
            <div style={{ color: theme.colors.primaryBlue, fontSize: '14px' }}>
              Last 6 months
            </div>
          </div>

          {/* Revenue Chart Placeholder */}
          <div style={{
            height: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ color: theme.colors.textGrey, textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>Revenue Trend Chart</div>
              <div style={{ fontSize: '14px' }}>Line chart visualization would go here</div>
            </div>
          </div>
        </div>

        {/* Production Chart */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
        }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: theme.colors.primaryText,
            }}>
              Production by Product
            </div>
            <div style={{ color: theme.colors.primaryBlue, fontSize: '14px' }}>
              This month (tons)
            </div>
          </div>

          {/* Production Chart Placeholder */}
          <div style={{
            height: '220px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ color: theme.colors.textGrey, textAlign: 'center' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>Production Chart</div>
              <div style={{ fontSize: '14px' }}>Bar chart visualization would go here</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: theme.colors.primaryText,
          }}>
          Branch Performance
          </div>
          <div style={{ color: theme.colors.primaryBlue, fontSize: '14px' }}>
          View All
          </div>
        </div>

        {/* Branch Tiles */}
        {branchData.map((branch, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: theme.colors.white,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: `0 4px 12px ${theme.colors.shadowGrey}`,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{
              backgroundColor: theme.colors.primaryBlue + '1A', // 10% opacity
              borderRadius: '50%',
              padding: '12px',
              marginRight: '16px',
            }}>
              <span style={{ fontSize: '20px' }}>🏢</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                {branch.name}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.textGrey, marginBottom: '4px' }}>Revenue</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{branch.revenue}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.textGrey, marginBottom: '4px' }}>Production</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{branch.production}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.textGrey, marginBottom: '4px' }}>Sales</div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{branch.sales}</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '18px', color: theme.colors.primaryBlue }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnDashboard;