import { useState, useEffect } from 'react';
import { marketingService } from '../../services/marketingService';
import { supabase } from '../../services/supabaseClient';
import styles from '../../styles/marketing/dashboard.module.css';
import {
    TrendingUp,
    ShoppingCart,
    DollarSign,
    Calendar,
    MapPin,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const MarketingDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [managerProfile, setManagerProfile] = useState(null);
    const [target, setTarget] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState('Kolhapur');

    // Mock taluka data from Flutter app
    const talukaData = [
        { taluka: "Karvir", sales: 220, target: 250 },
        { taluka: "Panhala", sales: 160, target: 180 },
        { taluka: "Shirol", sales: 140, target: 150 },
        { taluka: "Hatkanangale", sales: 110, target: 120 },
        { taluka: "Kagal", sales: 180, target: 200 },
        { taluka: "Shahuwadi", sales: 95, target: 100 },
        { taluka: "Ajara", sales: 75, target: 90 },
        { taluka: "Gadhinglaj", sales: 205, target: 220 },
        { taluka: "Chandgad", sales: 130, target: 140 },
        { taluka: "Radhanagari", sales: 120, target: 130 },
        { taluka: "Jat", sales: 90, target: 100 },
        { taluka: "Bhudargad", sales: 150, target: 160 },
    ];

    useEffect(() => {
        initDashboard();
    }, []);

    const initDashboard = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Get Manager Profile
            const profile = await marketingService.getProfile(user.id);
            setManagerProfile(profile);

            // 2. Get Manager Target for Current Month
            const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7) + '-01';
            const targetData = await marketingService.getManagerTarget(profile.id, currentMonth);
            setTarget(targetData);

        } catch (error) {
            console.error('Error initializing dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalSales = talukaData.reduce((sum, item) => sum + item.sales, 0);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val);
    };

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Loading your dashboard...</p>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Top Overview Cards */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.blueGradient}`}>
                    <div className={styles.statContent}>
                        <span className={styles.statLabel}>Total Sales</span>
                        <h2 className={styles.statValue}>{totalSales} T</h2>
                        <span className={styles.statSubText}>Across {talukaData.length} Talukas</span>
                    </div>
                    <div className={styles.statIcon}>
                        <TrendingUp size={40} />
                    </div>
                </div>

                {target && (
                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Revenue Progress</span>
                            <h2 className={styles.statValue}>{formatCurrency(target.achieved_revenue || 0)}</h2>
                            <span className={styles.statSubText}>Target: {formatCurrency(target.revenue_target)}</span>
                        </div>
                        <div className={styles.progressRing}>
                            <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className={styles.circle} strokeDasharray={`${Math.min((target.achieved_revenue / target.revenue_target) * 100, 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className={styles.percentage}>{Math.round((target.achieved_revenue / target.revenue_target) * 100)}%</span>
                        </div>
                    </div>
                )}

                {target && (
                    <div className={styles.statCard}>
                        <div className={styles.statContent}>
                            <span className={styles.statLabel}>Order Progress</span>
                            <h2 className={styles.statValue}>{target.achieved_orders || 0} Orders</h2>
                            <span className={styles.statSubText}>Goal: {target.order_target}</span>
                        </div>
                        <div className={styles.progressRing}>
                            <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className={styles.circle} style={{ stroke: '#10b981' }} strokeDasharray={`${Math.min((target.achieved_orders / target.order_target) * 100, 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className={styles.percentage} style={{ color: '#059669' }}>{Math.round((target.achieved_orders / target.order_target) * 100)}%</span>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.mainGrid}>
                {/* Sales Trend Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerInfo}>
                            <h3 className={styles.cardTitle}>Sales Trend by Taluka</h3>
                            <div className={styles.locationBadge}>
                                <MapPin size={14} />
                                {selectedDistrict}
                            </div>
                        </div>
                        <span className={styles.chartSubtitle}>Swipe horizontally to view all talukas</span>
                    </div>

                    <div className={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height={300} minWidth={0} debounce={50}>
                            <AreaChart data={talukaData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="taluka"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Target Information Card */}
                <div className={styles.targetCard}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Current Month Target</h3>
                        <div className={styles.monthBadge}>
                            <Calendar size={14} />
                            {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
                        </div>
                    </div>

                    {!target ? (
                        <div className={styles.noTarget}>
                            <AlertCircle size={48} className={styles.warnIcon} />
                            <h4>No Target Assigned</h4>
                            <p>Contact your supervisor for target assignment.</p>
                        </div>
                    ) : (
                        <div className={styles.targetContent}>
                            <div className={styles.targetMetrics}>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>Revenue</span>
                                    <div className={styles.metricValues}>
                                        <span className={styles.current}>{formatCurrency(target.achieved_revenue)}</span>
                                        <span className={styles.goal}>/ {formatCurrency(target.revenue_target)}</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progress}
                                            style={{ width: `${Math.min((target.achieved_revenue / target.revenue_target) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>Orders</span>
                                    <div className={styles.metricValues}>
                                        <span className={styles.current}>{target.achieved_orders}</span>
                                        <span className={styles.goal}>/ {target.order_target}</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={`${styles.progress} ${styles.green}`}
                                            style={{ width: `${Math.min((target.achieved_orders / target.order_target) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {target.remarks && (
                                <div className={styles.remarksBox}>
                                    <h4 className={styles.remarksTitle}>Remarks</h4>
                                    <p>{target.remarks}</p>
                                </div>
                            )}

                            <div className={styles.lastUpdated}>
                                Updated: {new Date(target.assigned_at).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketingDashboard;
