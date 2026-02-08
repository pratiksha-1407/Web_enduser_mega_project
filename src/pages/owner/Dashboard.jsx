import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerService } from '../../services/ownerService';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/owner/dashboard.module.css';
import {
    IndianRupee,
    ShoppingCart,
    Users,
    ClipboardList,
    ArrowUp,
    ArrowDown,
    Package,
    AlertCircle,
    CheckCircle,
    Bell,
    CreditCard,
    UserPlus,
    Truck,
    Clock,
    Plus
} from 'lucide-react';
import fabStyles from '../../styles/components/fab.module.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refreshDashboard = async () => {
        setLoading(true);
        try {
            const dashboardData = await ownerService.getDashboardData();
            setData(dashboardData);
            setError(null);
        } catch (err) {
            console.error("Dashboard load error", err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshDashboard();
    }, []);

    if (loading) return (
        <div className={styles.loading}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            Loading Dashboard...
        </div>
    );

    if (error) return (
        <div className={styles.loading}>
            <p className="text-red-500 mb-4">{error}</p>
            <button
                onClick={refreshDashboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                Retry
            </button>
        </div>
    );

    if (!data) return null;

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className={styles.dashboardContainer}>
            {/* Date Header */}
            <div className={styles.dateRow}>
                <div className={styles.dateText}>
                    {currentDate}
                    <span className={styles.dateSubText}>Business Overview</span>
                </div>
            </div>

            {/* Profit Card */}
            <ProfitCard data={data} />

            {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
                <MetricCard
                    title="Total Revenue"
                    value={`₹${data.totalRevenue?.toLocaleString()}`}
                    subtitle="This Month"
                    icon={IndianRupee}
                    color="#16a34a"
                    growth={data.revenueGrowth}
                    onClick={() => navigate('/owner/revenue')}
                />
                <MetricCard
                    title="Total Orders"
                    value={data.totalOrders?.toString()}
                    subtitle="All orders"
                    icon={ShoppingCart}
                    color="#2563eb"
                    growth={data.orderGrowth}
                    onClick={() => navigate('/owner/orders')}
                />
                <MetricCard
                    title="Active Employees"
                    value={data.activeEmployees?.toString()}
                    subtitle="Current staff"
                    icon={Users}
                    color="#9333ea"
                    growth={data.employeeGrowth}
                    onClick={() => navigate('/owner/employees')}
                />
                <MetricCard
                    title="Pending Orders"
                    value={data.pendingOrders?.toString()}
                    subtitle="Needs attention"
                    icon={ClipboardList}
                    color="#f97316"
                    isWarning={true}
                    onClick={() => navigate('/owner/pending-orders')}
                />
            </div>

            {/* Revenue Chart Section */}
            <RevenueChart data={data.revenueChartData} totalRevenue={data.totalRevenue} growth={data.revenueGrowth} />

            {/* Production Card */}
            <ProductionCard data={data} />

            {/* Material Cost Breakdown */}
            <MaterialCostCard data={data} />

            {/* Top Products */}
            <TopProductsCard data={data} />

            {/* Recent Activity */}
            <h3 className={styles.sectionHeader}>Recent Activity</h3>
            <div className={styles.activityList}>
                {data.recentActivities?.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                ))}
            </div>

            {/* FAB */}
            <button
                className={fabStyles.fab}
                onClick={() => navigate('/owner/assign-target')}
                title="Assign Target"
            >
                <Plus size={24} />
            </button>
        </div>
    );
};

// Sub-components
const ProfitCard = ({ data }) => {
    const isProfit = data.totalProfit >= 0;
    const gradient = isProfit
        ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
        : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';

    return (
        <div className={styles.profitCard} style={{ background: gradient }}>
            <div className={styles.profitHeader}>
                <div>
                    <div className={styles.profitTitle}>Monthly Net Profit</div>
                    <div className={styles.profitAmount}>₹{data.totalProfit?.toLocaleString()}</div>
                    <div className={styles.profitMargin}>{data.profitMargin?.toFixed(1)}% Margin</div>
                </div>
                <div className={styles.profitProgress}>
                    <div className={styles.marginValue}>{data.profitMargin?.toFixed(0)}%</div>
                    {/* Simplified Circular Progress Visual */}
                    <div style={{
                        position: 'absolute',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '4px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        transform: 'rotate(45deg)'
                    }} />
                </div>
            </div>
            <div className={styles.profitStatsRow}>
                <div className={styles.profitStatPill}>
                    <IndianRupee size={14} />
                    Revenue: ₹{data.totalRevenue?.toLocaleString()}
                </div>
                <div className={styles.profitStatPill}>
                    <Package size={14} />
                    Cost: ₹{data.totalRawMaterialCost?.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, subtitle, icon: Icon, color, growth, isWarning, onClick }) => (
    <div className={styles.metricCard} onClick={onClick}>
        <div className={styles.metricHeader}>
            <div className={styles.iconBox} style={{ backgroundColor: `${color}15` }}>
                <Icon size={22} color={color} />
            </div>
            {(growth !== undefined || isWarning) && (
                <div
                    className={styles.growthBadge}
                    style={{
                        backgroundColor: isWarning ? '#fff7ed' : (growth >= 0 ? '#f0fdf4' : '#fef2f2'),
                        color: isWarning ? '#c2410c' : (growth >= 0 ? '#15803d' : '#b91c1c')
                    }}
                >
                    {isWarning ? <AlertCircle size={12} /> : (growth >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    {isWarning ? '!' : `${Math.abs(growth)}%`}
                </div>
            )}
        </div>
        <div>
            <div className={styles.metricValue}>{value}</div>
            <div className={styles.metricTitle}>{title}</div>
            <div className={styles.metricSubtitle}>{subtitle}</div>
        </div>
    </div>
);

const RevenueChart = ({ data, totalRevenue, growth }) => {
    // Calculate scaling
    let maxRevenue = Math.max(...(data?.map(d => d.revenue) || [0]));
    if (maxRevenue === 0) maxRevenue = 100000; // Default fallback

    const formatYAxis = (val) => {
        if (val >= 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
        return `₹${val}`;
    };

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Revenue Overview</h3>
            </div>
            <div className={styles.chartSubtitle}>Last 7 days</div>

            <div className={styles.chartContainer}>
                {/* Y-axis */}
                <div className={styles.yAxis}>
                    <div>{formatYAxis(maxRevenue)}</div>
                    <div>{formatYAxis(maxRevenue * 0.75)}</div>
                    <div>{formatYAxis(maxRevenue * 0.5)}</div>
                    <div>{formatYAxis(maxRevenue * 0.25)}</div>
                    <div style={{ marginBottom: 20 }}>₹0</div>
                </div>

                {/* Bars */}
                <div className={styles.barContainer}>
                    {data?.map((item, idx) => {
                        const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                        const isActive = item.revenue > 0;
                        return (
                            <div key={idx} className={styles.barGroup}>
                                <div
                                    className={styles.bar}
                                    style={{
                                        height: `${heightPercent}%`,
                                        backgroundColor: isActive ? '#2563eb' : 'rgba(156, 163, 175, 0.2)'
                                    }}
                                    title={`₹${item.revenue?.toLocaleString()}`}
                                >
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            top: -20,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: 10,
                                            fontWeight: 600,
                                            color: '#4b5563',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {formatYAxis(item.revenue)}
                                        </div>
                                    )}
                                </div>
                                <span className={styles.barLabel}>{item.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.chartFooter}>
                <div className={styles.footerLabel}>
                    <span className={styles.footerTitle}>Monthly Revenue</span>
                    <span className={styles.footerValue}>₹{totalRevenue?.toLocaleString()}</span>
                </div>
                <div
                    className={styles.growthBadge}
                    style={{
                        backgroundColor: growth >= 0 ? '#f0fdf4' : '#fef2f2',
                        color: growth >= 0 ? '#15803d' : '#b91c1c'
                    }}
                >
                    {growth >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {Math.abs(growth)}%
                </div>
            </div>
        </div>
    );
};

const ProductionCard = ({ data }) => {
    const progress = data.productionTarget > 0 ? (data.productionToday / data.productionTarget) * 100 : 0;
    const isAchieved = data.productionToday >= data.productionTarget;

    return (
        <div className={styles.chartCard}> {/* reusing card style */}
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Today's Production</h3>
                <span
                    className={styles.growthBadge}
                    style={{
                        backgroundColor: isAchieved ? '#f0fdf4' : '#fff7ed',
                        color: isAchieved ? '#15803d' : '#c2410c'
                    }}
                >
                    {isAchieved ? 'Target Achieved' : 'In Progress'}
                </span>
            </div>

            <div className={styles.productionSection}>
                <div className={styles.progressContainer}>
                    <div className={styles.progressInfo}>
                        <h4 style={{ fontSize: 13, color: '#4b5563', marginBottom: 8 }}>Progress</h4>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#1f2937' }}>
                            {data.productionToday.toFixed(0)} / {data.productionTarget.toFixed(0)}
                        </div>
                        <div style={{ fontSize: 14, color: '#6b7280' }}>Bags Produced</div>
                    </div>

                    {/* Ring Chart */}
                    <div className={styles.progressCircle}>
                        <svg viewBox="0 0 36 36" style={{ width: 100, height: 100, transform: 'rotate(-90deg)' }}>
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="4"
                            />
                            <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={isAchieved ? "#16a34a" : "#2563eb"}
                                strokeWidth="4"
                                strokeDasharray={`${progress}, 100`}
                            />
                        </svg>
                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                            <div className={styles.progressText}>{progress.toFixed(0)}%</div>
                            <div className={styles.progressSub}>Complete</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 16, height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: '100%',
                        background: isAchieved ? '#16a34a' : '#2563eb'
                    }} />
                </div>
            </div>
        </div>
    );
};

const MaterialCostCard = ({ data }) => {
    // Sort materials by cost descending
    const sortedMaterials = Object.entries(data.materialCostBreakdown || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const totalCost = data.totalRawMaterialCost || 1; // avoid div by zero

    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Material Cost Breakdown</h3>
            </div>
            <div className={styles.chartSubtitle}>This month</div>

            <div style={{ marginTop: 16 }}>
                {/* Total Cost Box */}
                <div className={styles.materialCostTotal}>
                    <div className={styles.materialTotalLabelGroup}>
                        <div className={styles.materialIconBox}>
                            <Package size={20} />
                        </div>
                        <span className={styles.materialTotalLabel}>Total Material Cost</span>
                    </div>
                    <span className={styles.materialTotalValue}>₹{totalCost.toLocaleString()}</span>
                </div>

                {/* Material List */}
                {sortedMaterials.map(([name, cost], index) => {
                    const percentage = (cost / totalCost) * 100;
                    return (
                        <div key={index} className={styles.materialItem}>
                            <div className={styles.materialItemRow}>
                                <span className={styles.materialName}>{name}</span>
                                <span className={styles.materialCost}>₹{cost.toLocaleString()}</span>
                            </div>
                            <div className={styles.materialProgressRow}>
                                <div className={styles.materialProgressBar}>
                                    <div
                                        className={styles.materialProgressFill}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className={styles.materialPercentage}>{percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TopProductsCard = ({ data }) => {
    const products = data.topProducts || [];
    const colors = ['#f59e0b', '#4b5563', '#ea580c']; // Gold, Grey, Orange

    // Helper to compact number
    const compactNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    return (
        <div className={styles.chartCard} style={{ marginBottom: 20 }}>
            <div className={styles.chartHeader}>
                <h3 className={styles.chartTitle}>Top Selling Products</h3>
            </div>
            <div className={styles.chartSubtitle}>By revenue</div>

            <div style={{ marginTop: 16 }}>
                {products.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">No product data</div>
                ) : (
                    products.map((product, index) => {
                        const rankColor = colors[index] || '#6b7280';
                        return (
                            <div key={index} className={styles.productItem}>
                                <div
                                    className={styles.rankBadge}
                                    style={{
                                        backgroundColor: `${rankColor}15`,
                                        color: rankColor,
                                        borderColor: `${rankColor}40`,
                                        borderWidth: 1,
                                        borderStyle: 'solid'
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <div className={styles.productInfo}>
                                    <div className={styles.productName}>{product.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className={styles.salesPill}>
                                            {product.sales} sales
                                        </span>
                                        <span className={styles.revenueText}>
                                            ₹{product.revenue.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.revenuePill}>
                                    ₹{compactNumber(product.revenue)}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const ActivityItem = ({ activity }) => {
    // Map icon string to component if needed, or use defaults
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'ShoppingCart': return ShoppingCart;
            case 'CreditCard': return CreditCard;
            case 'Package': return Package;
            case 'UserPlus': return UserPlus;
            case 'CheckCircle': return CheckCircle;
            case 'Truck': return Truck;
            default: return Bell;
        }
    };

    const Icon = getIcon(activity.icon);

    // Map color name to hex
    const getColor = (colorName) => {
        switch (colorName) {
            case 'green': return '#16a34a';
            case 'blue': return '#2563eb';
            case 'orange': return '#f97316';
            case 'purple': return '#9333ea';
            default: return '#6b7280';
        }
    };

    const color = getColor(activity.color);

    return (
        <div className={styles.activityCard}>
            <div className={styles.activityIcon} style={{ backgroundColor: `${color}15` }}>
                <Icon size={20} color={color} />
            </div>
            <div className={styles.activityContent}>
                <div className={styles.activityTitle}>{activity.title}</div>
                <div className={styles.activityDesc}>{activity.description}</div>
                <div className={styles.activityTime}>
                    <Clock size={10} style={{ marginRight: 4, display: 'inline' }} />
                    {activity.time}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
