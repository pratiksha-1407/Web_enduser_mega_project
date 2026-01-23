import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/dashboard.module.css';
import {
    CalendarCheck,
    ShoppingCart,
    Clock,
    CheckCircle,
    BarChart2,
    Check,
    ChevronRight,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [orderCounts, setOrderCounts] = useState({ total: 0, pending: 0, completed: 0 });
    const [targetData, setTargetData] = useState({ targets: [], achieved: [], months: [] });
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Load Profile to get emp_id
                const empProfile = await employeeService.loadEmployeeProfile();
                setProfile(empProfile);

                if (empProfile?.emp_id || user?.id) {
                    const empId = empProfile?.emp_id || user.id;

                    // 2. Load Attendance
                    const isMarked = await employeeService.checkTodayAttendance(user.id);
                    setAttendanceMarked(isMarked);

                    // 3. Load Order Counts
                    const counts = await employeeService.getOrderCounts();
                    setOrderCounts(counts);

                    // 4. Load Targets
                    if (empProfile && empProfile.emp_id) {
                        const targets = await employeeService.loadTargetData(empProfile.emp_id);
                        setTargetData(targets);
                    }
                }
            } catch (err) {
                console.error("Dashboard load error:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (user) loadData();
    }, [user]);

    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
        </div>
    );

    if (error) return (
        <div className={styles.errorContainer}>
            <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
                Retry Connection
            </button>
        </div>
    );

    // Prepare Chart Data
    const chartData = targetData.months?.map((month, index) => ({
        name: new Date(month).toLocaleString('default', { month: 'short' }),
        Target: targetData.targets[index],
        Achieved: targetData.achieved[index]
    })) || [];

    // Current Month Stats
    const currentMonthIndex = new Date().getMonth();
    const currentMonthTarget = targetData.targets?.[currentMonthIndex] || 0;
    const currentMonthAchieved = targetData.achieved?.[currentMonthIndex] || 0;
    const progress = currentMonthTarget > 0 ? Math.round((currentMonthAchieved / currentMonthTarget) * 100) : 0;

    // Year Summary Stats
    const totalTarget = targetData.targets?.reduce((a, b) => a + b, 0) || 0;
    const totalAchieved = targetData.achieved?.reduce((a, b) => a + b, 0) || 0;
    const yearProgress = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

    // Date for Welcome
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    const currentMonthName = new Date().toLocaleString('default', { month: 'short' });

    return (
        <div className={styles.dashboard}>
            {/* Welcome */}
            <div className={styles.welcomeSection}>
                <h1>Hello, {profile?.full_name?.split(' ')[0] || 'Employee'}! 👋</h1>
                <p>{today} • Here is your daily activity overview</p>
            </div>

            {/* Attendance Card - Call to Action */}
            <div
                className={`${styles.attendanceCard} ${attendanceMarked ? styles.attendanceMarked : ''}`}
                onClick={() => !attendanceMarked && navigate('/employee/attendance/mark')}
            >
                <div className={styles.attendanceIcon}>
                    {attendanceMarked ? <Check size={32} strokeWidth={3} /> : <CalendarCheck size={32} />}
                </div>
                <div className={styles.attendanceContent}>
                    <h3 className={styles.cardTitle}>
                        {attendanceMarked ? "Attendance Recorded" : "Mark Today's Attendance"}
                    </h3>
                    <p className={styles.cardSub}>
                        {attendanceMarked
                            ? `You checked in successfully. Have a productive day!`
                            : "Your daily attendance is pending. Tap here to verify location and selfie."}
                    </p>
                </div>
                {!attendanceMarked && <ChevronRight className={styles.actionArrow} size={24} />}
            </div>

            {/* Orders Section */}
            <div>
                <h2 className={styles.sectionTitle}>
                    <ShoppingCart size={22} className="text-blue-500" />
                    Orders Overview
                </h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard} onClick={() => navigate('/employee/orders/total')}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
                                <ShoppingCart size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.statValue}>{orderCounts.total}</h3>
                            <p className={styles.statLabel}>Total</p>
                        </div>
                    </div>
                    <div className={styles.statCard} onClick={() => navigate('/employee/orders/pending')}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.iconOrange}`}>
                                <Clock size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.statValue}>{orderCounts.pending}</h3>
                            <p className={styles.statLabel}>Pending</p>
                        </div>
                    </div>
                    <div className={styles.statCard} onClick={() => navigate('/employee/orders/completed')}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.iconGreen}`}>
                                <CheckCircle size={24} />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.statValue}>{orderCounts.completed}</h3>
                            <p className={styles.statLabel}>Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Month Progress */}
            <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                    <h3 className={styles.cardTitle} style={{ fontSize: '16px', margin: 0 }}>Current Month Progress</h3>
                    <span className={styles.monthBadge}>{currentMonthName}</span>
                </div>

                <div className={styles.progressLabels}>
                    <span style={{ color: currentMonthTarget > 0 ? '#6B7280' : '#F59E0B' }}>
                        Target: {currentMonthTarget.toFixed(1)} T
                    </span>
                    <span style={{ color: '#2563EB', fontWeight: '600' }}>
                        Achieved: {currentMonthAchieved.toFixed(1)} T
                    </span>
                </div>

                <div className={styles.progressBarBack}>
                    <div
                        className={`${styles.progressBarFill} ${progress >= 100 ? styles.success : ''}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                </div>

                <div className={styles.progressFooter}>
                    <span style={{ color: progress >= 100 ? '#10B981' : '#2563EB' }}>
                        {progress >= 100 ? "Target Achieved" : `${progress}%`}
                    </span>
                    {currentMonthTarget > 0 && currentMonthAchieved < currentMonthTarget && (
                        <span style={{ color: '#F59E0B', fontWeight: '500', fontSize: '12px' }}>
                            {(currentMonthTarget - currentMonthAchieved).toFixed(1)} T remaining
                        </span>
                    )}
                </div>
            </div>

            {/* Performance Section */}
            <div className={styles.chartContainer}>
                <div className={styles.chartHeader}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                        <TrendingUp size={22} className="text-blue-500" />
                        Performance vs Target
                    </h2>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2563EB', background: '#EFF6FF', padding: '4px 12px', borderRadius: '12px' }}>
                        {new Date().getFullYear()}
                    </span>
                </div>

                <div className={styles.chartWrapper}>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6B7280', fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6B7280', fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '20px' }}
                                />
                                <Bar
                                    dataKey="Target"
                                    fill="#E5E7EB" // Grey target bar
                                    radius={[4, 4, 0, 0]}
                                    barSize={14}
                                    name="Target (Tons)"
                                />
                                <Bar
                                    dataKey="Achieved"
                                    fill="#2563EB" // Blue achieved bar
                                    radius={[4, 4, 0, 0]}
                                    barSize={10}
                                    name="Achieved (Tons)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className={styles.emptyChart}>
                            <BarChart2 size={48} className={styles.emptyChartIcon} />
                            <p className={styles.emptyChartText}>No performance data available for this period.</p>
                        </div>
                    )}
                </div>

                {/* Year Summary */}
                {chartData.length > 0 && (
                    <div className={styles.yearSummary}>
                        <h4 className={styles.yearSummaryTitle}>Year {new Date().getFullYear()} Summary</h4>
                        <div className={styles.summaryLoginGrid}>
                            <div className={styles.summaryItem}>
                                <h4>Total Target</h4>
                                <p style={{ color: '#374151' }}>{totalTarget.toFixed(1)} T</p>
                            </div>
                            <div className={styles.summaryItem}>
                                <h4>Total Achieved</h4>
                                <p style={{ color: '#2563EB' }}>{totalAchieved.toFixed(1)} T</p>
                            </div>
                            <div className={styles.summaryItem}>
                                <h4>Overall Progress</h4>
                                <p style={{ color: yearProgress >= 100 ? '#10B981' : '#F59E0B' }}>
                                    {yearProgress.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
