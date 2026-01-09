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
                    const empId = empProfile?.emp_id || user.id; // use emp_id from profile primarily

                    // 2. Load Attendance
                    const isMarked = await employeeService.checkTodayAttendance(user.id); // check attendance by user_id
                    setAttendanceMarked(isMarked);

                    // 3. Load Order Counts
                    const counts = await employeeService.getOrderCounts();
                    setOrderCounts(counts);

                    // 4. Load Targets
                    // Note: Targets depend on emp_id textual ID usually, but let's see. 
                    // In Flutter: empProvider.profile?['emp_id']
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

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
                <h1>Welcome, {profile?.full_name || user?.fullName}</h1>
                <p>Here's what's happening today.</p>
            </div>

            {/* Attendance Card */}
            <div
                className={`${styles.attendanceCard} ${attendanceMarked ? styles.attendanceMarked : ''}`}
                onClick={() => !attendanceMarked && navigate('/employee/attendance/mark')}
            >
                <div className={styles.attendanceIcon}>
                    {attendanceMarked ? <Check size={24} /> : <CalendarCheck size={24} />}
                </div>
                <div>
                    <h3 className="font-semibold text-lg">
                        {attendanceMarked ? "Attendance Marked" : "Mark Attendance"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {attendanceMarked
                            ? "You have already marked your attendance for today."
                            : "Tap here to mark your attendance now."}
                    </p>
                </div>
                {!attendanceMarked && <div className="ml-auto text-blue-500">→</div>}
            </div>

            {/* Orders Overview */}
            <div>
                <h2 className={styles.sectionTitle}>Orders Overview</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard} onClick={() => navigate('/employee/orders/total')}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIconWrapper} ${styles.iconBlue}`}>
                                <ShoppingCart size={24} />
                            </div>
                            <div className="p-2"></div>
                        </div>
                        <div>
                            <h3 className={styles.statValue}>{orderCounts.total}</h3>
                            <p className={styles.statLabel}>Total Orders</p>
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

            {/* Performance Chart */}
            <div className={styles.chartContainer}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Performance vs Target</h2>
                    <span className="text-sm text-gray-500">{new Date().getFullYear()}</span>
                </div>

                <div className={styles.monthStats}>
                    <div className={styles.monthStatItem}>
                        <div className={styles.monthStatValue}>{currentMonthTarget} T</div>
                        <div className={styles.monthStatLabel}>Target (This Month)</div>
                    </div>
                    <div className={styles.monthStatItem}>
                        <div className={`${styles.monthStatValue} ${currentMonthAchieved >= currentMonthTarget ? 'text-green-600' : 'text-blue-600'}`}>
                            {currentMonthAchieved} T
                        </div>
                        <div className={styles.monthStatLabel}>Achieved</div>
                    </div>
                    <div className={styles.monthStatItem}>
                        <div className={`${styles.monthStatValue} ${progress >= 100 ? 'text-green-600' : 'text-orange-500'}`}>
                            {progress}%
                        </div>
                        <div className={styles.monthStatLabel}>Progress</div>
                    </div>
                </div>

                <div style={{ height: 260, width: '100%', position: 'relative', minHeight: 260, minWidth: 0 }}>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="Target" fill="#cbd5e0" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="Achieved" fill="#007bff" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <BarChart2 size={48} className="mb-2 opacity-20" />
                            <p>No performance data available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
