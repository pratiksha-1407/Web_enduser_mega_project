import React, { useState, useEffect } from 'react';
import { marketingService } from '../../services/marketingService';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/marketing/dashboard.module.css';
import {
    TrendingUp,
    Users,
    ShoppingCart,
    Target,
    MapPin,
    RefreshCw,
    UserPlus,
    Activity,
    AlertCircle,
    Info
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import clsx from 'clsx';

const MarketingDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        managerName: '',
        district: '',
        salesData: { totalSales: 0, chartData: [] },
        targets: null,
        teamPerformance: null
    });

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // 1. Get Profile
            const profile = await marketingService.getProfile(user.id);
            if (!profile) throw new Error('Profile not found');

            const managerId = profile.id; // Corrected: Using 'id' from emp_profile, not user.id from auth
            const district = profile.district;
            const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;

            // 2. Parallel Fetching
            const [salesRes, targetRes, teamRes] = await Promise.all([
                marketingService.getTalukaSales(district),
                marketingService.getManagerTarget(managerId, currentMonth),
                marketingService.getTeamPerformance(managerId)
            ]);

            setDashboardData({
                managerName: profile.full_name,
                district: district,
                salesData: salesRes,
                targets: targetRes,
                teamPerformance: teamRes
            });

        } catch (error) {
            console.error('Dashboard Error:', error);
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

    const { managerName, district, salesData, targets, teamPerformance } = dashboardData;

    return (
        <div className={styles.container}>
            {/* 1. Welcome Section */}
            <div className={styles.welcomeCard}>
                <div className={styles.welcomeText}>
                    <h2>Welcome, {managerName.split(' ')[0]} 👋</h2>
                    <p>
                        <MapPin size={14} />
                        Assigned District: <span className="font-medium text-gray-900">{district}</span>
                    </p>
                </div>
                <div className={styles.districtBadge}>
                    <Activity size={16} />
                    <span>Managing {salesData.chartData.length} Talukas</span>
                </div>
            </div>

            {/* 2. Total Sales Card */}
            <div className={styles.salesCard}>
                <div className={styles.salesHeader}>
                    <div>
                        <div className={styles.salesSub} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Total District Sales
                            {loading && <RefreshCw className="animate-spin" size={12} />}
                        </div>
                        <div className={styles.salesValue}>
                            {salesData.totalSales.toFixed(2)} T
                        </div>
                        <div className={styles.salesSub} style={{ opacity: 0.8 }}>
                            Across {salesData.chartData.length} Talukas in {district}
                        </div>
                    </div>
                    <div className={styles.salesIcon}>
                        <TrendingUp size={32} color="white" />
                    </div>
                </div>
                <div className={styles.liveIndicator}>
                    <div className={styles.blinkDot}></div>
                    <span>Live updates from completed orders</span>
                </div>
            </div>

            {/* 3. Sales Trend Chart */}
            <div className={styles.chartCard}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Sales Trend by Taluka</h3>
                    <div className={styles.districtBadge} style={{ background: '#eff6ff', color: '#2563eb' }}>
                        <MapPin size={14} /> {district}
                    </div>
                </div>
                <div className={styles.chartContainer}>
                    {salesData.chartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <AlertCircle size={48} className="mb-2" />
                            <p>No sales data available</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData.chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="taluka"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={(val) => `${val}T`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value} T`, 'Sales']}
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
                    )}
                </div>
            </div>

            <div className={styles.grid2}>
                {/* 4. Assigned Target Card */}
                <div className={styles.targetSection}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Your Monthly Target</h3>
                        <div className={styles.districtBadge} style={{ background: '#f3f4f6', color: '#4b5563' }}>
                            {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
                        </div>
                    </div>

                    {!targets ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Target size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No target assigned yet</p>
                        </div>
                    ) : (
                        <>
                            {/* Revenue Target */}
                            <TargetMetric
                                title="Revenue Target"
                                icon={<TrendingUp size={20} className="text-blue-600" />}
                                current={targets.achieved_revenue || 0}
                                target={targets.revenue_target || 0}
                                isCurrency={true}
                                color="blue"
                            />

                            {/* Order Target */}
                            <TargetMetric
                                title="Order Target"
                                icon={<ShoppingCart size={20} className="text-purple-600" />}
                                current={targets.achieved_orders || 0}
                                target={targets.order_target || 0}
                                isCurrency={false}
                                color="purple"
                            />
                        </>
                    )}
                </div>

                {/* 5. Team Performance Card */}
                <div className={styles.metricCard}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Team Performance</h3>
                        <div className={styles.districtBadge}>
                            <Users size={14} />
                            {teamPerformance?.activeEmployees || 0}/{teamPerformance?.totalEmployees || 0} Active
                        </div>
                    </div>

                    {!teamPerformance ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Users size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No team data</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <TeamStat
                                    label="Total Revenue"
                                    value={`₹${(teamPerformance.totalAchievedRevenue / 100000).toFixed(1)}L`}
                                    sub="Revenue"
                                    color="green"
                                />
                                <TeamStat
                                    label="Avg Progress"
                                    value={`${teamPerformance.averageProgress.toFixed(0)}%`}
                                    sub="Target"
                                    color="orange"
                                />
                            </div>

                            <div className={styles.cardTitle} style={{ fontSize: '14px', marginBottom: '12px' }}>
                                Top Performers
                            </div>

                            <div className={styles.topPerformerList}>
                                {teamPerformance.topPerformers.map((p, i) => (
                                    <div key={p.id} className={styles.performerItem}>
                                        <div className={clsx(styles.rankBadge,
                                            i === 0 ? styles.rank1 : i === 1 ? styles.rank2 : styles.rank3
                                        )}>
                                            {i + 1}
                                        </div>
                                        <div className={styles.performerInfo}>
                                            <h4 className={styles.performerName}>{p.name}</h4>
                                            <p className={styles.performerStats}>
                                                {p.achievedOrders} orders • ₹{p.achievedRevenue.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={styles.performerScore}>
                                            {(p.overallProgress * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 6. Action Buttons */}
            <div className={styles.actionRow}>
                <button
                    className={styles.refreshBtn}
                    onClick={() => fetchDashboardData()}
                >
                    <RefreshCw size={20} />
                    Refresh All
                </button>
                <button className={styles.manageBtn}>
                    <UserPlus size={20} />
                    Manage Team
                </button>
            </div>

            {/* 7. Real-time Info */}
            <div className={styles.infoCard}>
                <Info size={20} className="text-blue-500 mt-1" />
                <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Real-time Dashboard</h4>
                    <p className="text-xs text-gray-500 mt-1">All data updates automatically as orders are completed. Targets are auto-calculated based on achievements.</p>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const TargetMetric = ({ title, icon, current, target, isCurrency, color }) => {
    const progress = Math.min((current / (target || 1)) * 100, 100);
    const completed = progress >= 100;

    return (
        <div className="mb-6 last:mb-0">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-${color}-50`}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-700">{title}</div>
                        <div className="text-xs text-gray-500">
                            {completed ? 'Target Achieved 🎉' : 'In Progress'}
                        </div>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${completed ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {progress.toFixed(0)}%
                </div>
            </div>

            <div className="flex justify-between items-end mb-2">
                <div className="text-2xl font-bold text-gray-800">
                    {isCurrency ? '₹' : ''}{current.toLocaleString()}
                    <span className="text-sm text-gray-400 font-normal ml-1">
                        / {isCurrency ? '₹' : ''}{target.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{
                        width: `${progress}%`,
                        backgroundColor: completed ? '#22c55e' : (color === 'purple' ? '#9333ea' : '#3b82f6')
                    }}
                ></div>
            </div>
        </div>
    );
};

const TeamStat = ({ label, value, sub, color }) => (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <div className={`text-lg font-bold text-${color}-600`}>{value}</div>
    </div>
);

export default MarketingDashboard;