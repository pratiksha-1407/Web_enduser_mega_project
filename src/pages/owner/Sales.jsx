import { useState, useEffect } from 'react';
import { ownerService } from '../../services/ownerService';
import StatCard from '../../components/owner/StatCard';
import styles from '../../styles/owner/dashboard.module.css';
import {
    IndianRupee,
    Target,
    ShoppingCart,
    TrendingUp,
    User,
    ShoppingBag,
    Package,
    ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const SalesPage = () => {
    const [analytics, setAnalytics] = useState({ topCustomers: [], salesData: [] });
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [analyticsData, dashData] = await Promise.all([
                ownerService.getSalesAnalytics(),
                ownerService.getDashboardData()
            ]);
            setAnalytics(analyticsData);
            setDashboardData(dashData);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const totalSales = analytics.salesData.reduce((sum, item) => sum + item.sales, 0);
    const totalTarget = 1000000; // Mock total target
    const achievementRatio = totalSales / totalTarget;

    return (
        <div className={styles.container}>
            <header className={styles.dashboardHeader}>
                <div className={styles.welcomeText}>
                    <h2>Sales Analytics</h2>
                    <p>Performance tracking and growth forecasting</p>
                </div>
            </header>

            {/* Key Metrics */}
            <div className={styles.grid}>
                <StatCard
                    title="Total Revenue"
                    value={`₹${(dashboardData?.totalRevenue / 1000).toFixed(0)}K`}
                    icon={IndianRupee}
                    color="green"
                    growth={12.5}
                />
                <StatCard
                    title="Target Achievement"
                    value={`${(achievementRatio * 100).toFixed(1)}%`}
                    icon={Target}
                    color="blue"
                    subtitle="On Track"
                />
                <StatCard
                    title="Total Orders"
                    value={dashboardData?.totalOrders || 0}
                    icon={ShoppingCart}
                    color="orange"
                    growth={8.2}
                />
                <StatCard
                    title="Avg Order Value"
                    value={`₹${dashboardData?.totalOrders > 0 ? (dashboardData.totalRevenue / dashboardData.totalOrders).toFixed(0) : 0}`}
                    icon={TrendingUp}
                    color="purple"
                    growth={4.3}
                />
            </div>

            <div className={styles.chartSection}>
                {/* Sales Performance */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Sales Performance</h3>
                    </div>
                    <div className="space-y-6">
                        {analytics.salesData.map((item, index) => {
                            const productTarget = 300000; // Mock target per product
                            const progress = Math.min((item.sales / productTarget) * 100, 100);
                            return (
                                <div key={index} style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600, color: '#374151' }}>{item.product}</span>
                                        <span style={{ fontWeight: 700, color: '#111827' }}>₹{(item.sales / 1000).toFixed(0)}K</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ flex: 1, height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div
                                                style={{
                                                    height: '100%',
                                                    backgroundColor: index % 2 === 0 ? '#3b82f6' : '#10b981',
                                                    width: `${progress}%`,
                                                    borderRadius: '4px'
                                                }}
                                            ></div>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: progress >= 100 ? '#10b981' : '#f59e0b', width: '35px' }}>
                                            {progress.toFixed(0)}%
                                        </span>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', width: '35px' }}>+12%</span>
                                    </div>
                                    <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                                        {item.units} Units • {item.region} Region
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Top Products</h3>
                        <span className={styles.viewAll}>View All</span>
                    </div>
                    <div className={styles.productList}>
                        {analytics.salesData.slice(0, 3).map((product, index) => (
                            <div key={index} className={styles.productItem}>
                                <div className={clsx(styles.rankBadge, styles.bgBlue)}>
                                    <Package size={20} />
                                </div>
                                <div className={styles.productInfo}>
                                    <h4>{product.product}</h4>
                                    <p>{product.units} Units • {product.region}</p>
                                </div>
                                <div className={styles.productValue}>
                                    <p className={styles.productPrice}>₹{(product.sales / 1000).toFixed(0)}K</p>
                                    <p className={clsx(styles.productGrowth, styles.textGreen)}>+8.2%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Customers Section */}
            <div className={styles.card} style={{ marginTop: '24px' }}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Top Customers</h3>
                    <span className={styles.viewAll}>View Details</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {analytics.topCustomers.map((customer, index) => (
                        <div key={index} className={styles.productItem} style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', borderBottom: 'none' }}>
                            <div className={styles.activityIcon} style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                                <User size={20} />
                            </div>
                            <div className={styles.productInfo}>
                                <h4>{customer.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '11px', color: '#6b7280' }}>{customer.orders} Orders</span>
                                    <span style={{
                                        fontSize: '10px',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        backgroundColor: customer.status === 'Premium' ? '#fef3c7' : '#dcfce7',
                                        color: customer.status === 'Premium' ? '#92400e' : '#166534',
                                        fontWeight: 700
                                    }}>
                                        {customer.status}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.productValue}>
                                <p className={styles.productPrice}>₹{(customer.value / 1000).toFixed(0)}K</p>
                                <p className={clsx(styles.productGrowth, styles.textGreen)}>+{customer.growth}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesPage;
