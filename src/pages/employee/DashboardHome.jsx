import React, { useEffect, useState } from 'react';
import { fetchEmployeeStats, fetchMonthlyPerformance } from '../../services/apiStats';
import StatCard from '../../components/dashboard/StatCard';
import PerformanceChart from '../../components/dashboard/PerformanceChart';
import { ShoppingBag, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Assuming you have an AuthContext

const DashboardHome = () => {
    const { user } = useAuth(); // Get user for greeting
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
    });
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [statsData, chartData] = await Promise.all([
                    fetchEmployeeStats(),
                    fetchMonthlyPerformance()
                ]);
                setStats(statsData);
                setPerformanceData(chartData);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header / Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Good Morning, {user?.user_metadata?.full_name || 'Employee'}!
                </h1>
                <p className="text-gray-500">Here's what's happening with your orders today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={Clock}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Completed Orders"
                    value={stats.completedOrders}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-purple-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <PerformanceChart data={performanceData} />
                </div>
                {/* Placeholder for Recent Activity or Notifications */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-left flex items-center">
                            <ShoppingBag size={18} className="mr-3" /> Create New Order
                        </button>
                        <button className="w-full py-2 px-4 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors text-left flex items-center">
                            <Clock size={18} className="mr-3" /> Mark Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
