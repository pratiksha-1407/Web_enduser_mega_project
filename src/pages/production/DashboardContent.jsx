import React, { useState, useEffect } from 'react';
import { productionService } from '../../services/productionService';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/production/dashboard.module.css';
import {
    Factory,
    RefreshCw,
    TrendingUp,
    AlertCircle,
    Package,
    Activity,
    CheckCircle,
    IndianRupee,
    Settings,
    Truck
} from 'lucide-react';
import clsx from 'clsx';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

const ProductionDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        metrics: { produced: 0, target: 120 },
        machines: { active: 0, total: 15, quality: 0 },
        financials: {
            totalRevenue: 0,
            totalMaterialCost: 0,
            totalProfit: 0,
            profitMargin: 0,
            materialBreakdown: {}
        },
        orders: [],
        inventoryBags: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [metrics, machines, financials, orders, bags] = await Promise.all([
                productionService.getProductionMetrics(),
                productionService.getMachineStatus(),
                productionService.getProfitMetrics(),
                productionService.getRecentOrders(),
                productionService.getTotalInventoryBags()
            ]);

            setData({
                metrics,
                machines,
                financials,
                orders,
                inventoryBags: bags
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
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

    const { metrics, machines, financials, orders, inventoryBags } = data;
    const progress = Math.min((metrics.produced / metrics.target) * 100, 100);
    const isTargetAchieved = metrics.produced >= metrics.target;

    // Chart Data for Profit Margin
    const marginData = [
        { name: 'Profit', value: financials.profitMargin },
        { name: 'Cost', value: 100 - financials.profitMargin }
    ];
    const COLORS = ['#10b981', '#f3f4f6'];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.dashboardHeader}>
                <div className={styles.welcomeText}>
                    <h2>Production Dashboard</h2>
                    <p>
                        <RefreshCw size={12} className="inline mr-1" />
                        Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <button className={styles.refreshButton} onClick={fetchDashboardData}>
                    <RefreshCw size={16} />
                    Refresh Data
                </button>
            </div>

            {/* Grid 1: Production & Machines */}
            <div className={styles.grid}>
                {/* Production Status Card - Matches Flutter's Radial Gauge Look */}
                <div className={styles.productionCard}>
                    <div className={styles.headerRow}>
                        <div className={styles.cardTitle}>Today's Production</div>
                        <Factory size={24} className="text-white opacity-80" />
                    </div>

                    <div className="flex flex-col items-center justify-center py-4 relative">
                        {/* Custom Circular Progress using SVG */}
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                    className="text-white opacity-20"
                                    strokeWidth="10"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                />
                                <circle
                                    className="text-white transition-all duration-1000 ease-out"
                                    strokeWidth="10"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (progress / 100 * 251.2)}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
                                <span className="text-3xl font-bold">{progress.toFixed(0)}%</span>
                                <span className="text-xs opacity-80">Achieved</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mt-2 text-white">
                        <div>
                            <div className="text-xs opacity-70">Target</div>
                            <div className="text-lg font-bold">{metrics.target} T</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs opacity-70">Produced</div>
                            <div className="text-lg font-bold">{metrics.produced.toFixed(1)} T</div>
                        </div>
                    </div>
                </div>

                {/* Machine Status Card - Matches DashboardMachineStatus */}
                <div className={styles.machineCard}>
                    <div className={styles.headerRow}>
                        <h3 className={styles.title}>Machine Status</h3>
                        <Activity size={20} className="text-gray-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center justify-center border border-green-100">
                            <div className="text-3xl font-bold text-green-600 mb-1">{machines.active}</div>
                            <div className="text-sm text-green-800 font-medium">Running</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl flex flex-col items-center justify-center border border-red-100">
                            <div className="text-3xl font-bold text-red-600 mb-1">{machines.total - machines.active}</div>
                            <div className="text-sm text-red-800 font-medium">Stopped</div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Overall Plant Health</span>
                            <span className="text-sm font-bold text-blue-600">{machines.quality}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${machines.quality}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview */}
            <div className={styles.financialCard}>
                <div className={styles.headerRow}>
                    <h3 className={styles.title}>Financial Overview</h3>
                    <div className={clsx(styles.marginBadge,
                        financials.totalProfit >= 0 ? styles.marginPositive : styles.marginNegative
                    )}>
                        {financials.profitMargin.toFixed(1)}% Margin
                    </div>
                </div>

                <div className={styles.financialGrid}>
                    <div className={styles.profitSection}>
                        <span className={styles.netProfitLabel}>Net Monthly Profit</span>
                        <div className={clsx(styles.netProfitValue, financials.totalProfit < 0 && styles.negative)}>
                            ₹{financials.totalProfit.toLocaleString()}
                        </div>
                        <div className="h-40 w-full relative">
                            {/* Simple Pie Chart for visual Flair */}
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={marginData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={5}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <Cell fill={financials.totalProfit >= 0 ? '#10b981' : '#ef4444'} />
                                        <Cell fill="#f3f4f6" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center', fontSize: '12px', color: '#6b7280'
                            }}>
                                P/L
                            </div>
                        </div>
                    </div>

                    <div className={styles.financialDetails}>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Revenue</span>
                            <span className={styles.detailValue} style={{ color: '#2563eb' }}>
                                ₹{financials.totalRevenue.toLocaleString()}
                            </span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Material Cost</span>
                            <span className={styles.detailValue} style={{ color: '#ef4444' }}>
                                ₹{financials.totalMaterialCost.toLocaleString()}
                            </span>
                        </div>
                        <div style={{ borderTop: '1px solid #e2e8f0', margin: '12px 0' }}></div>
                        <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Est. Profit</span>
                            <span className={styles.detailValue} style={{ color: financials.totalProfit >= 0 ? '#10b981' : '#ef4444' }}>
                                ₹{financials.totalProfit.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Cost Breakdown */}
                <div className={styles.materialCard}>
                    <div className={styles.headerRow}>
                        <h3 className={styles.title}>Material Cost Breakdown</h3>
                    </div>
                    {Object.keys(financials.materialBreakdown).length === 0 ? (
                        <div className={styles.emptyState}>No material usage recorded</div>
                    ) : (
                        <div className={styles.costList}>
                            {Object.entries(financials.materialBreakdown).map(([name, cost], index) => {
                                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                                return (
                                    <div key={name} className={styles.costItem}>
                                        <div className={styles.costName}>
                                            <div className={styles.dot} style={{ backgroundColor: colors[index % colors.length] }}></div>
                                            {name}
                                        </div>
                                        <div className={styles.costValue}>₹{cost.toLocaleString()}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Inventory Overview */}
                <div className={styles.materialCard}>
                    <div className={styles.headerRow}>
                        <h3 className={styles.title}>Inventory Overview</h3>
                        <Package size={20} className="text-blue-500" />
                    </div>
                    <div className="flex flex-col items-center justify-center py-8">
                        <div className="text-4xl font-bold text-gray-800 mb-2">{inventoryBags.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Total Bags in Stock</div>
                        <div className="mt-6 w-full bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                            <span className="text-sm text-gray-600">Stock Status</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Optimal</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className={styles.ordersCard}>
                <div className={styles.headerRow}>
                    <h3 className={styles.title}>Recent Completed Orders</h3>
                    <Truck size={20} className="text-gray-400" />
                </div>
                {orders.length === 0 ? (
                    <div className={styles.emptyState}>No recent orders found</div>
                ) : (
                    <div className={styles.orderList}>
                        {orders.map((order, i) => (
                            <div key={i} className={styles.orderItem}>
                                <div className={styles.orderInfo}>
                                    <h4>Order #{order.id}</h4>
                                    <p>{new Date(order.created_at).toLocaleDateString()} • {order.taluka}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-800">
                                        {order.total_weight} {order.weight_unit}
                                    </div>
                                    <div className={styles.orderStatus}>{order.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductionDashboard;
