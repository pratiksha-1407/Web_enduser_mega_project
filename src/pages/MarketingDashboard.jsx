import React, { useState } from 'react';
import { KPICard, BarChart } from '../components/DashboardCards';
import theme from '../global/theme';
import typography from '../global/textStyles';

const MarketingDashboard = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');

  const data = {
    "Pune": [
      { taluka: "Haveli", sales: 320 },
      { taluka: "Mulshi", sales: 260 },
      { taluka: "Junnar", sales: 290 },
      { taluka: "Khed", sales: 270 },
      { taluka: "Daund", sales: 280 },
    ],
    "Nashik": [
      { taluka: "Niphad", sales: 300 },
      { taluka: "Sinnar", sales: 260 },
      { taluka: "Dindori", sales: 280 },
      { taluka: "Malegaon", sales: 310 },
    ],
    "Ahmednagar": [
      { taluka: "Rahata", sales: 340 },
      { taluka: "Shrirampur", sales: 320 },
      { taluka: "Sangamner", sales: 300 },
      { taluka: "Akole", sales: 260 },
    ],
  };

  const totalSales = (district) => {
    return data[district] ? data[district].reduce((sum, e) => sum + e.sales, 0) : 0;
  };

  const appBarStyle = {
    backgroundColor: theme.colors.global.primaryBlue,
    color: 'white',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
  };

  const appBarTitle = {
    ...typography.headingMedium,
    color: 'white',
    margin: 0,
  };

  const pageContainer = {
    backgroundColor: theme.colors.background.scaffold,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardStyle = {
    backgroundColor: theme.colors.global.white,
    borderRadius: '14px',
    boxShadow: `0 6px 12px ${theme.colors.shadows.grey}`,
    padding: '16px',
    marginBottom: '16px',
  };

  const kpiCardStyle = {
    ...cardStyle,
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  };

  const chartCardStyle = {
    ...cardStyle,
    padding: '16px',
  };

  const sectionHeaderStyle = {
    ...typography.headingSmall,
    marginBottom: '4px',
  };

  const sectionSubHeaderStyle = {
    ...typography.bodyRegular,
    color: theme.colors.global.textGrey,
    marginBottom: '20px',
  };

  const actionButtonStyle = {
    height: '48px',
    backgroundColor: theme.colors.global.primaryBlue,
    color: theme.colors.global.white,
    border: 'none',
    borderRadius: '8px',
    padding: '0 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '12px',
    marginBottom: '12px',
  };

  const actionButtonHoverStyle = {
    ...actionButtonStyle,
    opacity: '0.9',
  };

  const chartContainerStyle = {
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.global.white,
    borderRadius: '16px',
    boxShadow: `0 6px 14px ${theme.colors.shadows.grey}`,
    padding: '16px',
    overflow: 'hidden',
  };



  return (
    <div style={pageContainer}>
      {/* App Bar */}
      <div style={appBarStyle}>
        <h1 style={appBarTitle}>Marketing Manager</h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h2 style={sectionHeaderStyle}>Sales Overview</h2>
        <p style={sectionSubHeaderStyle}>District-wise cattle feed performance</p>

        {/* KPI Card */}
        <KPICard
          icon="📊"
          title="Total Sales (Tons)"
          value={totalSales(selectedDistrict).toFixed(0)}
          growth="+12.5%"
        />

        {/* Taluka Chart */}
        <h2 style={sectionHeaderStyle}>Taluka-wise Sales Trend</h2>
        <p style={sectionSubHeaderStyle}>Reported sales volume</p>

        <BarChart
          data={data[selectedDistrict]?.map(item => item.sales)}
          labels={data[selectedDistrict]?.map(item => item.taluka)}
          title="Taluka-wise Sales Trend"
          subtitle="Reported sales volume"
          color={theme.colors.global.primaryBlue}
        />

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <button style={actionButtonStyle}>
            <span>👥</span> Employees
          </button>
          <button style={actionButtonStyle}>
            <span>🛒</span> Make Order
          </button>
          <button style={actionButtonStyle}>
            <span>📊</span> Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;