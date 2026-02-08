import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Info,
    Calendar,
    ArrowUp,
    DollarSign
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import clsx from 'clsx';

const MarketingDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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

            const managerId = profile.id;
            const district = profile.district;
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

            // 2. Parallel Fetching
            const [salesRes, targetRes, teamRes] = await Promise.all([
                marketingService.getTalukaSales(district),
                marketingService.getManagerTarget(managerId, currentMonth),
                marketingService.getTeamPerformance(managerId)
            ]);

            setDashboardData({
                managerName: profile.full_name || 'Manager',
                district: district || 'Unknown',
                salesData: salesRes,
                targets: targetRes || {},
                teamPerformance: teamRes || { activeEmployees: 0, totalEmployees: 0, topPerformers: [] }
            });

        } catch (error) {
            console.error('Dashboard Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const { managerName, district, salesData, targets, teamPerformance } = dashboardData;
    const currentMonthName = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });

    return (
        <div className={styles.container}>
            {/* 1. Welcome Section */}
            <div className={styles.welcomeCard}>
                <div className={styles.welcomeText}>
                    <h2>Welcome, {managerName.split(' ')[0]} 👋</h2>
                    <p>
                        <span className="font-semibold text-gray-700">Marketing Manager</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <MapPin size={14} className="text-gray-500" />
                        <span className="ml-1">{district}</span>
                    </p>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        onClick={() => navigate('/marketing/targets')}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: '#eff6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#2563eb'
                        }}
                        title="Target Management"
                    >
                        <Target size={20} />
                    </div>
                    <div
                        onClick={() => navigate('/marketing/team')}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: '#f0fdf4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#16a34a'
                        }}
                        title="District Team"
                    >
                        <Users size={20} />
                    </div>
                </div>
            </div>

            {/* 2. Total Sales Card */}
            <div className={styles.salesCard}>
                <div className={styles.salesHeader}>
                    <div>
                        <div className={styles.salesSub} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            Total District Sales
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
                    <span>Live updates active</span>
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
                            <AreaChart data={salesData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="taluka"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                                    dy={10}
                                    interval={0}
                                    angle={-15}
                                    textAnchor="end"
                                    height={50}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                    tickFormatter={(val) => `${val}T`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                                        backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                        color: 'white'
                                    }}
                                    itemStyle={{ color: 'white' }}
                                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                    formatter={(value) => [`${value} Tons`, 'Sales']}
                                    cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                    activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
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
                            <Calendar size={12} className="mr-1" />
                            {currentMonthName}
                        </div>
                    </div>

                    {!targets || !targets.revenue_target ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <Target size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm font-medium">No target assigned yet</p>
                            <p className="text-xs text-gray-400 mt-1">Contact your supervisor</p>
                        </div>
                    ) : (
                        <>
                            {/* Revenue Target */}
                            <TargetMetric
                                title="Revenue Target"
                                icon={<DollarSign size={18} className="text-blue-600" />}
                                current={targets.achieved_revenue || 0}
                                target={targets.revenue_target || 0}
                                isCurrency={true}
                                color="blue"
                            />

                            {/* Order Target */}
                            <TargetMetric
                                title="Order Target"
                                icon={<ShoppingCart size={18} className="text-purple-600" />}
                                current={targets.achieved_orders || 0}
                                target={targets.order_target || 0}
                                isCurrency={false}
                                color="purple"
                            />

                            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-3 border border-green-100">
                                <RefreshCw size={16} className="text-green-600 animate-spin-slow" />
                                <div>
                                    <h4 className="text-xs font-bold text-green-700">Live Updates Active</h4>
                                    <p className="text-[10px] text-green-600">Targets update automatically based on team sales</p>
                                </div>
                            </div>
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

                    {!teamPerformance || teamPerformance.totalEmployees === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <Users size={40} className="text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No team members assigned</p>
                            <p className="text-xs text-gray-400 mt-1">Add executives to your team</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <TeamStat
                                    label="Total Revenue"
                                    value={`₹${((teamPerformance.totalAchievedRevenue || 0) / 100000).toFixed(2)}L`}
                                    icon={<TrendingUp size={16} className="text-green-600" />}
                                    color="green"
                                />
                                <TeamStat
                                    label="Avg Progress"
                                    value={`${(teamPerformance.averageProgress || 0).toFixed(0)}%`}
                                    icon={<Activity size={16} className="text-orange-600" />}
                                    color="orange"
                                />
                            </div>

                            <div className="text-sm font-semibold text-gray-700 mb-3">Top Performers</div>

                            <div className={styles.topPerformerList}>
                                {teamPerformance.topPerformers && teamPerformance.topPerformers.length > 0 ? (
                                    teamPerformance.topPerformers.map((p, i) => (
                                        <div key={p.id || i} className={styles.performerItem}>
                                            <div className={clsx(styles.rankBadge, i === 0 ? styles.rank1 : i === 1 ? styles.rank2 : styles.rank3)}>
                                                {i + 1}
                                            </div>
                                            <div className={styles.performerInfo}>
                                                <h4 className={styles.performerName}>{p.name}</h4>
                                                <p className={styles.performerStats}>
                                                    {p.achievedOrders} orders • ₹{p.achievedRevenue?.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className={styles.performerScore}>
                                                {((p.overallProgress || 0) * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-400 text-xs">No performance data yet</div>
                                )}
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
                    <RefreshCw size={18} />
                    Refresh Data
                </button>
                <button
                    className={styles.manageBtn}
                    onClick={() => navigate('/marketing/team')}
                >
                    <UserPlus size={18} />
                    Manage Team
                </button>
            </div>
        </div>
    );
};

// Helper Components
const TargetMetric = ({ title, icon, current, target, isCurrency, color }) => {
    const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    const completed = progress >= 100;
    const remaining = Math.max(target - current, 0);

    return (
        <div className="mb-6 last:mb-0 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-${color}-50`}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-700">{title}</div>
                        <div className="text-xs text-gray-500 font-medium">
                            {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${completed ? 'bg-green-100 text-green-700' : color === 'purple' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {progress.toFixed(0)}%
                </div>
            </div>

            {/* Values & Progress */}
            <div className="mb-4">
                <div className="flex justify-between items-end mb-2">
                    <div className="flex items-baseline">
                        <span className={`text-2xl font-bold ${completed ? 'text-green-600' : color === 'purple' ? 'text-purple-600' : 'text-blue-600'}`}>
                            {isCurrency ? '₹' : ''}{current.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 font-medium ml-1">
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
                <div className="text-right mt-1">
                    <span className="text-[10px] text-gray-500">{progress.toFixed(0)}% Complete</span>
                </div>
            </div>

            {/* Footer: Status & Remaining */}
            <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                    <div className="text-[10px] text-gray-500 font-medium mb-0.5">Status</div>
                    <div className={`text-xs font-bold ${completed ? 'text-green-600' : color === 'purple' ? 'text-purple-600' : 'text-blue-600'}`}>
                        {completed ? 'Target Achieved 🎉' : 'In Progress'}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-medium mb-0.5">Remaining</div>
                    <div className="text-xs font-bold text-gray-700">
                        {isCurrency ? '₹' : ''}{remaining.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamStat = ({ label, value, icon, color }) => (
    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
            <div className="text-xs text-gray-500 mb-1 font-medium">{label}</div>
            <div className={`text-base font-bold ${color === 'green' ? 'text-green-600' : 'text-orange-600'}`}>{value}</div>
        </div>
        <div className={`p-2 rounded-lg ${color === 'green' ? 'bg-green-50' : 'bg-orange-50'}`}>
            {icon}
        </div>
    </div>
);

export default MarketingDashboard;