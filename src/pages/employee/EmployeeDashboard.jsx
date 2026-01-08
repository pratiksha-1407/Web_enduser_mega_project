import { useEffect, useState } from 'react';
import { fetchEmployeeStats, fetchRecentOrders } from '../../services/apiStats';
import Card from '../../components/ui/Card';
import { ShoppingBag, Clock, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="flex items-center p-4">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    </Card>
);

// Helper for tailwind-like colors since we use CSS modules/global
// We'll just instantiate style objects or classes
const colors = {
    blue: 'bg-blue-500', // We might need to map these to real styles if not using Tailwind
    green: 'bg-green-500',
    orange: 'bg-orange-500'
};

const EmployeeDashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [statsData, ordersData] = await Promise.all([
                fetchEmployeeStats(),
                fetchRecentOrders()
            ]);
            setStats(statsData);
            setRecentOrders(ordersData);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="bg-primary-blue bg-opacity-90"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={Clock}
                    color="bg-orange-500" // using inline style class approach assuming global CSS has these utilities or we style locally
                />
                <StatCard
                    title="Performance"
                    value="Good"
                    icon={TrendingUp}
                    color="bg-green-500"
                />
            </div>

            {/* Recent Activity */}
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Customer</th>
                                <th style={{ padding: '1rem' }}>Product</th>
                                <th style={{ padding: '1rem' }}>Amount</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">No recent orders found.</td>
                                </tr>
                            ) : (
                                recentOrders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '1rem' }}>{order.customer_name}</td>
                                        <td style={{ padding: '1rem' }}>{order.feed_category}</td>
                                        <td style={{ padding: '1rem' }}>₹{order.total_price}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.85rem',
                                                backgroundColor: order.status === 'completed' ? '#dcfce7' : '#ffedd5',
                                                color: order.status === 'completed' ? '#166534' : '#9a3412'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default EmployeeDashboard;
