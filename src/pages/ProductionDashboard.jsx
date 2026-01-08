import React from 'react';
import { KPICard, BarChart } from '../components/DashboardCards';
import theme from '../global/theme';
import typography from '../global/textStyles';

const ProductionDashboard = () => {
    const kpiData = [
        { icon: "🏭", title: "Daily Production", value: "145 Tons", growth: "5.2%" },
        { icon: "📦", title: "Stock Level", value: "850 Tons", growth: "-2.1%" },
        { icon: "🚛", title: "Dispatched", value: "120 Tons", growth: "8.4%" },
        { icon: "⚡", title: "Efficiency", value: "94%", growth: "1.2%" },
    ];

    const productionData = [
        { product: "Feed A", value: 120 },
        { product: "Feed B", value: 145 },
        { product: "Feed C", value: 90 },
        { product: "Feed D", value: 65 },
    ];

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
        backgroundColor: theme.colors.global.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    };

    const kpiGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
    };

    const sectionHeaderStyle = {
        ...typography.headingSmall,
        marginBottom: '12px',
    };

    return (
        <div style={pageContainer}>
            {/* App Bar */}
            <div style={appBarStyle}>
                <h1 style={appBarTitle}>Production Manager</h1>
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
                        />
                    ))}
                </div>

                {/* Production Chart */}
                <h2 style={sectionHeaderStyle}>Production Overview</h2>
                <BarChart
                    data={productionData.map(item => item.value)}
                    labels={productionData.map(item => item.product)}
                    title="Daily Output by Product"
                    subtitle="Tons produced today"
                    color={theme.colors.global.primaryBlue}
                />
            </div>
        </div>
    );
};

export default ProductionDashboard;
