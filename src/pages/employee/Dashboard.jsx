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
    TrendingUp
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
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryButton}>
                Retry
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

    return (
        <div className={styles.dashboard}>
            {/* Welcome */}
            <div className={styles.welcomeSection}>
                <h1>Welcome back, {profile?.full_name?.split(' ')[0] || 'Employee'}</h1>
                <p>Here is your daily performance overview.</p>
            </div>

            {/* Attendance Card */}
            <div
                className={`${styles.attendanceCard} ${attendanceMarked ? styles.attendanceMarked : ''}`}
                onClick={() => !attendanceMarked && navigate('/employee/attendance/mark')}
            >
                <div className={styles.attendanceIcon}>
                    {attendanceMarked ? <Check size={24} /> : <CalendarCheck size={24} />}
                </div>
                <div className={styles.attendanceContent}>
                    <h3 className={styles.cardTitle}>
                        {attendanceMarked ? "Attendance Marked" : "Action Required: Mark Attendance"}
                    </h3>
                    <p className={styles.cardSub}>
                        {attendanceMarked
                            ? "You have successfully successfully marked your attendance for today."
                            : "Your daily attendance has not been recorded yet. Click to mark now."}
                    </p>
                </div>
                {!attendanceMarked && <ChevronRight className={styles.actionArrow} size={20} />}
            </div>

            {/* Orders Section */}
            <div>
                <h2 className={styles.sectionTitle}>
                    <ShoppingCart size={20} className="text-gray-400" />
                    Order Metrics
                </h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard} onClick={() => navigate('/employee/orders/total')}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
                                <ShoppingCart size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.statValue}>{orderCounts.total}</h3>
                            <p className={styles.statLabel}>Total Orders</p>
                        </div>
                    </div>
                    <div className={styles.statCard} onClick={() => navigate('/employee/orders/pending')}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.iconOrange}`}>
                                <Clock size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.statValue}>{orderCounts.pending}</h3>
                            <p className={styles.statLabel}>Pending Processing</p>
                        </div>
                    </div>
                    <div className={styles.statCard} onClick={() => navigate('/employee/orders/completed')}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.iconGreen}`}>
                                <CheckCircle size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className={styles.statValue}>{orderCounts.completed}</h3>
                            <p className={styles.statLabel}>Completed Orders</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Section */}
            <div className={styles.chartContainer}>
                <div className={styles.chartHeader}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                        <TrendingUp size={20} className="text-gray-400" />
                        Sales Performance
                    </h2>
                    <select className={styles.chartSelect}>
                        <option>{new Date().getFullYear()}</option>
                    </select>
                </div>

                <div className={styles.monthStats}>
                    <div className={styles.monthStatItem}>
                        <div className={styles.monthStatLabel}>Monthly Target</div>
                        <div className={styles.monthStatValue}>{currentMonthTarget} Tons</div>
                    </div>
                    <div className={styles.monthStatItem}>
                        <div className={styles.monthStatLabel}>Achieved</div>
                        <div className={`${styles.monthStatValue} ${currentMonthAchieved >= currentMonthTarget ? styles.monthStatValueSuccess : styles.monthStatValuePrimary}`}>
                            {currentMonthAchieved} Tons
                        </div>
                    </div>
                    <div className={styles.monthStatItem}>
                        <div className={styles.monthStatLabel}>Completion</div>
                        <div className={`${styles.monthStatValue} ${progress >= 100 ? styles.monthStatValueSuccess : styles.monthStatValueWarning}`}>
                            {progress}%
                        </div>
                    </div>
                </div>

                <div className={styles.chartWrapper} style={{ width: '100%', height: 300 }}>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6B7280' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    fontSize={12}
                                    tick={{ fill: '#6B7280' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F9FAFB' }}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        padding: '12px'
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '20px' }}
                                />
                                <Bar
                                    dataKey="Target"
                                    fill="#E5E7EB"
                                    radius={[4, 4, 0, 0]}
                                    barSize={24}
                                    name="Target (Tons)"
                                />
                                <Bar
                                    dataKey="Achieved"
                                    fill="#2563EB"
                                    radius={[4, 4, 0, 0]}
                                    barSize={24}
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
            </div>
        </div>
    );
};

export default Dashboard;
