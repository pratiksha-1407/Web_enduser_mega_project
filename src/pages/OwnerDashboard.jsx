import React from 'react';
import { KPICard, BarChart, LineChart } from '../components/DashboardCards';
import theme from '../global/theme';
import typography from '../global/textStyles';

const OwnerDashboard = () => {
  const kpiData = [
    { icon: "💰", title: "Total Revenue", value: "₹45.2L", growth: "12.5%" },
    { icon: "🏭", title: "Production", value: "3.8K tons", growth: "8.3%" },
    { icon: "🛒", title: "Total Sales", value: "₹38.5L", growth: "15.2%" },
    { icon: "👥", title: "Active Dealers", value: "156", growth: "-2.1%", down: true },
  ];

  const revenueData = [
    { month: "Jan", value: 45 },
    { month: "Feb", value: 52 },
    { month: "Mar", value: 47 },
    { month: "Apr", value: 63 },
    { month: "May", value: 70 },
    { month: "Jun", value: 78 },
  ];

  const productionData = [
    { product: "Feed A", value: 850 },
    { product: "Feed B", value: 1200 },
    { product: "Feed C", value: 950 },
    { product: "Feed D", value: 780 },
  ];

  const branches = [
    { name: "Mumbai Branch", revenue: "₹18.5L", production: "1.5K tons", sales: "₹15.2L" },
    { name: "Delhi Branch", revenue: "₹15.2L", production: "1.2K tons", sales: "₹12.8L" },
    { name: "Bangalore Branch", revenue: "₹13.8L", production: "1.1K tons", sales: "₹11.6L" },
  ];

  const appBarStyle = {
    backgroundColor: theme.colors.primaryBlue,
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
    backgroundColor: theme.colors.background,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const cardStyle = {
    backgroundColor: theme.colors.white,
    borderRadius: '16px',
    boxShadow: `0 4px 10px ${theme.colors.shadowGrey}`,
    padding: '16px',
    marginBottom: '16px',
  };

  const kpiCardStyle = {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '16px',
  };

  const chartCardStyle = {
    ...cardStyle,
    padding: '16px',
  };

  const branchCardStyle = {
    ...cardStyle,
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const sectionHeaderStyle = {
    ...typography.headingSmall,
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const sectionTitleStyle = {
    ...typography.headingSmall,
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
  };

  const viewAllStyle = {
    color: theme.colors.primaryBlue,
    cursor: 'pointer',
  };

  const kpiGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  };



  return (
    <div style={pageContainer}>
      {/* App Bar */}
      <div style={appBarStyle}>
        <h1 style={appBarTitle}>Owner Dashboard</h1>
      </div>

      {/* Main Content */}
      <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* KPI Grid */}
        <div style={kpiGridStyle}>
          {kpiData.map((kpi, index) => (
            <KPICard
              key={index}
              icon={kpi.icon}
              title={kpi.title}
              value={kpi.value}
              growth={kpi.growth}
              down={kpi.down}
            />
          ))}
        </div>

        {/* Revenue Trend Chart */}
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Revenue Trend</h2>
          <span style={viewAllStyle}>Last 6 months</span>
        </div>
        <LineChart
          data={revenueData.map(item => item.value)}
          labels={revenueData.map(item => item.month)}
          title="Revenue Trend"
          subtitle="Last 6 months"
          color={theme.colors.primaryBlue}
        />

        {/* Production by Product Chart */}
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Production by Product</h2>
          <span style={viewAllStyle}>This month (tons)</span>
        </div>
        <BarChart
          data={productionData.map(item => item.value)}
          labels={productionData.map(item => item.product)}
          title="Production by Product"
          subtitle="This month (tons)"
          color={theme.colors.primaryBlue}
        />

        {/* Branch Performance */}
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Branch Performance</h2>
          <span style={viewAllStyle}>View All</span>
        </div>
        {branches.map((branch, index) => (
          <div key={index} style={branchCardStyle}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: `${theme.colors.primaryBlue}1A`, // 10% opacity
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <span style={{ fontSize: '20px' }}>🏢</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...typography.bodyMedium, fontWeight: 'bold', marginBottom: '8px' }}>
                {branch.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ ...typography.bodySmall, color: theme.colors.textGrey }}>
                    Revenue
                  </div>
                  <div style={{ ...typography.bodyRegular, fontWeight: 'bold' }}>
                    {branch.revenue}
                  </div>
                </div>
                <div>
                  <div style={{ ...typography.bodySmall, color: theme.colors.textGrey }}>
                    Production
                  </div>
                  <div style={{ ...typography.bodyRegular, fontWeight: 'bold' }}>
                    {branch.production}
                  </div>
                </div>
                <div>
                  <div style={{ ...typography.bodySmall, color: theme.colors.textGrey }}>
                    Sales
                  </div>
                  <div style={{ ...typography.bodyRegular, fontWeight: 'bold' }}>
                    {branch.sales}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginLeft: '16px' }}>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;