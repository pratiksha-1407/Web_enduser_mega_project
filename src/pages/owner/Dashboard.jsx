import { useState, useEffect } from 'react';
import { ownerService } from '../../services/ownerService';
import StatCard from '../../components/owner/StatCard';
import Modal from '../../components/common/Modal';
import styles from '../../styles/owner/dashboard.module.css';
import modalStyles from '../../components/common/Modal.module.css';
import {
    Users,
    Package,
    IndianRupee,
    ShoppingCart,
    AlertTriangle,
    Bell,
    Target,
    UserPlus,
    Plus,
    ArrowUpRight,
    TrendingUp,
    CheckCircle,
    User,
    CreditCard,
    ShoppingBag,
    Clock,
    Truck
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import clsx from 'clsx';

const OwnerDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });
    const [formState, setFormState] = useState({});

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await ownerService.getDashboardData();
            setData(res);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = (type) => {
        setModalConfig({ isOpen: true, type });
        setFormState({});
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalConfig.type === 'announcement') {
                await ownerService.sendAnnouncement(formState.message);
                alert('Announcement sent successfully!');
            } else if (modalConfig.type === 'target') {
                await ownerService.assignTarget({
                    branch: formState.branch,
                    manager_id: formState.manager,
                    target_amount: parseFloat(formState.revenue || 0),
                    target_month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
                    remarks: formState.remarks
                });
                alert('Target assigned successfully!');
            }
            setModalConfig({ isOpen: false, type: null });
            fetchDashboardData(); // Refresh activity
        } catch (err) {
            alert('Action failed: ' + err.message);
        }
    };

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const getActivityIcon = (iconName) => {
        const icons = {
            ShoppingCart,
            Package,
            IndianRupee: IndianRupee,
            CreditCard,
            Bell,
            Target,
            UserPlus,
            CheckCircle,
            Clock,
            Truck
        };
        return icons[iconName] || ShoppingBag;
    };

    const getActivityColor = (color) => {
        const colors = {
            blue: '#3b82f6',
            green: '#10b981',
            orange: '#f59e0b',
            purple: '#8b5cf6',
            red: '#ef4444',
            grey: '#6b7280'
        };
        return colors[color] || '#3b82f6';
    };

    // Date formatter
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className={styles.container}>
            <header className={styles.dashboardHeader}>
                <div className={styles.welcomeText}>
                    <h2>Owner Portal</h2>
                    <p>Business Overview & Growth Metrics</p>
                </div>
                <div className={styles.dateFilter}>
                    <TrendingUp size={16} className="text-green-500" />
                    <span className="text-sm font-semibold">{dateStr}</span>
                </div>
            </header>

            {/* Profit Card - New from Flutter Parity */}
            <div className={`${styles.profitCard} ${data.totalProfit < 0 ? styles.negative : ''}`}>
                <div className={styles.profitHeader}>
                    <div>
                        <div className={styles.profitTitle}>Monthly Net Profit</div>
                        <h2 className={styles.profitValue}>₹{data.totalProfit.toLocaleString()}</h2>
                        <div className={styles.profitSub}>{data.profitMargin.toFixed(1)}% Margin</div>
                    </div>
                    <div className={styles.profitChart}>
                        {/* Circular Progress Placeholder */}
                        <div style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', background: `conic-gradient(white ${data.profitMargin}%, rgba(255,255,255,0.2) 0)` }}>
                            <div style={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}></div>
                        </div>
                    </div>
                </div>
                <div className={styles.profitFooter}>
                    <div className={styles.profitPill}>
                        <IndianRupee size={16} />
                        <span>Rev: ₹{(data.totalRevenue / 100000).toFixed(1)}L</span>
                    </div>
                    <div className={styles.profitPill}>
                        <Package size={16} />
                        <span>Cost: ₹{(data.totalRawMaterialCost / 100000).toFixed(1)}L</span>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className={styles.grid}>
                <StatCard
                    title="Total Revenue"
                    value={`₹${data.totalRevenue.toLocaleString()}`}
                    icon={IndianRupee}
                    color="green"
                    growth={data.revenueGrowth}
                    subtitle="Monthly performance"
                />
                <StatCard
                    title="Total Orders"
                    value={data.totalOrders}
                    icon={ShoppingCart}
                    color="blue"
                    growth={data.orderGrowth}
                    subtitle="Platform wide"
                />
                <StatCard
                    title="Active Employees"
                    value={data.activeEmployees}
                    icon={Users}
                    color="purple"
                    growth={data.employeeGrowth}
                    subtitle="Current Staff"
                />
                <StatCard
                    title="Pending Orders"
                    value={data.pendingOrders}
                    icon={AlertTriangle}
                    color="orange"
                    isWarning={data.pendingOrders > 0}
                    subtitle="Needs attention"
                />
            </div>

            {/* Charts & Actions Section */}
            <div className={styles.chartSection}>
                {/* Revenue Chart */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Revenue Overview</h3>
                        <span className={styles.viewAll}>Last 7 Days</span>
                    </div>
                    <div style={{ height: 300, width: '100%', position: 'relative', minHeight: 300, minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                            <BarChart data={data.revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Bar
                                    dataKey="revenue"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Actions & Products */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Production Card - New from Flutter Parity */}
                    <div className={styles.productionCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Production Status</h3>
                        </div>
                        <div className={styles.productionItem}>
                            <div className={styles.prodHeader}>
                                <span>Production</span>
                                <span>{data.productionToday} / {data.productionTarget} T</span>
                            </div>
                            <div className={styles.prodBarBg}>
                                <div
                                    className={styles.prodBarFill}
                                    style={{
                                        width: `${Math.min((data.productionToday / data.productionTarget) * 100, 100)}%`,
                                        backgroundColor: '#3B82F6'
                                    }}
                                ></div>
                            </div>
                            <div className={styles.prodFooter}>
                                <span>Today's Output</span>
                                <span>{((data.productionToday / data.productionTarget) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className={styles.productionItem}>
                            <div className={styles.prodHeader}>
                                <span>Dispatch</span>
                                <span>{data.dispatchedToday} / {data.ordersToDispatch} Orders</span>
                            </div>
                            <div className={styles.prodBarBg}>
                                <div
                                    className={styles.prodBarFill}
                                    style={{
                                        width: `${Math.min((data.dispatchedToday / data.ordersToDispatch) * 100, 100)}%`,
                                        backgroundColor: '#10B981'
                                    }}
                                ></div>
                            </div>
                            <div className={styles.prodFooter}>
                                <span>Order Fulfillment</span>
                                <span>{((data.dispatchedToday / data.ordersToDispatch) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Quick Actions</h3>
                        </div>
                        <div className={styles.quickActionsGrid}>
                            <button
                                onClick={() => handleQuickAction('announcement')}
                                className={clsx(styles.actionButton, styles.bgBlue)}
                            >
                                <Bell size={20} />
                                <span>Announcement</span>
                            </button>
                            <button
                                onClick={() => handleQuickAction('target')}
                                className={clsx(styles.actionButton, styles.bgPurple)}
                            >
                                <Target size={20} />
                                <span>Assign Target</span>
                            </button>
                            <button className={clsx(styles.actionButton, styles.bgGreen)}>
                                <UserPlus size={20} />
                                <span>Add Staff</span>
                            </button>
                            <button className={clsx(styles.actionButton, styles.bgOrange)}>
                                <Package size={20} />
                                <span>Update Stock</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Material Cost Breakdown - New from Flutter Parity */}
            {data.materialCostBreakdown && (
                <div className={styles.costCard}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Material Cost Breakdown</h3>
                    </div>
                    {Object.entries(data.materialCostBreakdown).map(([name, cost], index) => {
                        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
                        const color = colors[index % colors.length];
                        return (
                            <div key={name} className={styles.costItem}>
                                <div className={styles.costLabel}>
                                    <div className={styles.costColor} style={{ backgroundColor: color }}></div>
                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>{name}</span>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                                    ₹{cost.toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles.chartSection} style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Top Products */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h3 className={styles.cardTitle}>Top Selling Products</h3>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>By revenue</p>
                        </div>
                    </div>
                    {data.topProducts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Package size={40} className={styles.emptyIcon} />
                            <p className={styles.emptyText}>No product data</p>
                        </div>
                    ) : (
                        <div className={styles.productList}>
                            {data.topProducts.map((product, index) => {
                                const rankClass = index === 0 ? styles.rank1 : index === 1 ? styles.rank2 : styles.rank3;
                                return (
                                    <div key={index} className={styles.productItem}>
                                        <div className={clsx(styles.rankBadge, rankClass)}>
                                            {index + 1}
                                        </div>
                                        <div className={styles.productInfo}>
                                            <h4 className={styles.productName}>{product.name}</h4>
                                            <div className={styles.productMeta}>
                                                <div className={styles.salesTag}>
                                                    {product.sales} sales
                                                </div>
                                                <span className={styles.revenueText}>
                                                    ₹{product.revenue.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.productRevenuePill}>
                                            ₹{(product.revenue / 1000).toFixed(0)}k
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h3 className={styles.cardTitle}>Recent Activities</h3>
                            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>Latest updates</p>
                        </div>
                    </div>
                    {data.recentActivities.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Bell size={40} className={styles.emptyIcon} />
                            <p className={styles.emptyText}>No recent activities</p>
                        </div>
                    ) : (
                        <div className={styles.activityList}>
                            {data.recentActivities.map((activity, index) => {
                                const Icon = getActivityIcon(activity.icon);
                                const color = getActivityColor(activity.color);
                                return (
                                    <div key={index} className={styles.activityItem}>
                                        <div className={styles.activityIcon} style={{
                                            backgroundColor: `${color}1A`, // 10% opacity
                                            border: `1px solid ${color}33`, // 20% opacity
                                        }}>
                                            <Icon size={20} color={color} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{activity.title}</span>
                                                <span className={styles.activityTime}>{activity.time}</span>
                                            </div>
                                            {activity.description && (
                                                <p style={{ fontSize: '12px', color: '#4b5563', margin: 0, lineHeight: '1.4' }}>
                                                    {activity.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {/* Action Modals */}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, type: null })}
                title={modalConfig.type === 'announcement' ? 'Send Announcement' : 'Assign New Target'}
            >
                <form onSubmit={handleActionSubmit} className="p-4">
                    {modalConfig.type === 'announcement' ? (
                        <div className={modalStyles.formGroup}>
                            <label className={modalStyles.label}>Broadcast Message</label>
                            <textarea
                                className={modalStyles.textarea}
                                placeholder="Message to all employees..."
                                required
                                value={formState.message || ''}
                                onChange={e => setFormState({ ...formState, message: e.target.value })}
                                style={{ minHeight: '120px' }}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className={modalStyles.formGroup}>
                                <label className={modalStyles.label}>Branch Name</label>
                                <input
                                    className={modalStyles.input}
                                    placeholder="e.g. Pune Branch"
                                    required
                                    value={formState.branch || ''}
                                    onChange={e => setFormState({ ...formState, branch: e.target.value })}
                                />
                            </div>
                            <div className={modalStyles.formGroup}>
                                <label className={modalStyles.label}>Manager</label>
                                <input
                                    className={modalStyles.input}
                                    placeholder="Select Manager"
                                    required
                                    value={formState.manager || ''}
                                    onChange={e => setFormState({ ...formState, manager: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className={modalStyles.formGroup}>
                                    <label className={modalStyles.label}>Revenue Target (₹)</label>
                                    <input
                                        type="number"
                                        className={modalStyles.input}
                                        placeholder="Amount"
                                        required
                                        value={formState.revenue || ''}
                                        onChange={e => setFormState({ ...formState, revenue: e.target.value })}
                                    />
                                </div>
                                <div className={modalStyles.formGroup}>
                                    <label className={modalStyles.label}>Month</label>
                                    <input
                                        type="text"
                                        className={modalStyles.input}
                                        defaultValue={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className={modalStyles.formGroup}>
                                <label className={modalStyles.label}>Remarks</label>
                                <input
                                    className={modalStyles.input}
                                    placeholder="Any notes..."
                                    value={formState.remarks || ''}
                                    onChange={e => setFormState({ ...formState, remarks: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    <div className={modalStyles.footer} style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" className={modalStyles.secondaryBtn} onClick={() => setModalConfig({ isOpen: false, type: null })}>Cancel</button>
                        <button type="submit" className={modalStyles.primaryBtn}>
                            {modalConfig.type === 'announcement' ? 'Broadcast' : 'Assign Target'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default OwnerDashboard;
