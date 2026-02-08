import React, { useState, useEffect } from 'react';
import {
    Clock, Package, Truck, Navigation,
    CheckCircle, CheckSquare, XCircle,
    RefreshCw, AlertCircle, Calendar, User, Phone, MapPin, Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { fetchProductionOrders, fetchOrderStatistics, updateOrderStatus, getProductionManagerDistrict } from '../../../services/production/prodOrdersService';
import { supabase } from '../../../services/supabaseClient';

// --- Colors ---
const colors = {
    primaryBlue: '#2563EB',
    background: '#F3F4F8',
    white: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#9333ea',
    indigo: '#6366f1',
    border: '#E5E7EB',
};

// --- Constants ---
const STATUS_CONFIG = {
    pending: { label: 'Pending', icon: Clock, color: colors.warning },
    packing: { label: 'Packing', icon: Package, color: colors.primaryBlue },
    ready_for_dispatch: { label: 'Ready', icon: Truck, color: colors.purple },
    dispatched: { label: 'Dispatched', icon: Navigation, color: colors.indigo },
    delivered: { label: 'Delivered', icon: CheckCircle, color: colors.success },
    completed: { label: 'Completed', icon: CheckSquare, color: colors.success },
    cancelled: { label: 'Cancelled', icon: XCircle, color: colors.danger },
};

// --- Components ---

const StatusChip = ({ status }) => {
    const config = STATUS_CONFIG[status.toLowerCase()] || { label: status, icon: AlertCircle, color: '#9CA3AF' };
    const Icon = config.icon;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px',
            backgroundColor: `${config.color}1A`, // 10% opacity
            borderRadius: '20px',
            border: `1px solid ${config.color}33`,
        }}>
            <Icon size={14} color={config.color} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: config.color }}>
                {config.label}
            </span>
        </div>
    );
};

const StatCard = ({ title, count, icon: Icon, color }) => (
    <div style={{
        minWidth: '100px',
        padding: '12px',
        backgroundColor: `${color}1A`,
        borderRadius: '12px',
        border: `1px solid ${color}33`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        marginRight: '12px',
        flexShrink: 0
    }}>
        <div style={{
            padding: '6px', backgroundColor: `${color}26`, borderRadius: '8px', marginBottom: '8px'
        }}>
            <Icon size={18} color={color} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary }}>{count}</span>
        <span style={{ fontSize: '11px', fontWeight: 500, color: colors.textSecondary }}>{title}</span>
    </div>
);

const OrderCard = ({ order, onEditStatus }) => {
    return (
        <div style={{
            backgroundColor: colors.white,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: `1px solid ${colors.border}`
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.textPrimary }}>
                        Order #{order.order_number || order.id?.substring(0, 8)}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <Calendar size={12} color={colors.textSecondary} />
                        <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                            {order.created_at ? format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a') : 'N/A'}
                        </span>
                    </div>
                </div>
                <StatusChip status={order.status} />
            </div>

            {/* Customer Info */}
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <User size={14} color={colors.textSecondary} />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textPrimary }}>{order.customer_name}</span>
                </div>
                {order.customer_mobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Phone size={14} color={colors.textSecondary} />
                        <span style={{ fontSize: '13px', color: colors.textSecondary }}>{order.customer_mobile}</span>
                    </div>
                )}
                {order.district && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} color={colors.textSecondary} />
                        <span style={{ fontSize: '13px', color: colors.textSecondary }}>{order.district}</span>
                    </div>
                )}
            </div>

            {/* Product & Price */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, backgroundColor: '#EFF6FF', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: colors.primaryBlue, marginBottom: '2px' }}>
                        {order.bags} Bags
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                        {order.feed_category || 'Product'}
                    </div>
                </div>
                <div style={{ flex: 1, backgroundColor: '#F0FDF4', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: colors.success, marginBottom: '2px' }}>
                        ₹{order.total_price?.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                        Total Price
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={() => onEditStatus(order)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 16px', borderRadius: '8px',
                        backgroundColor: colors.primaryBlue,
                        color: colors.white,
                        border: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 500
                    }}
                >
                    <Edit size={14} /> Update Status
                </button>
            </div>
        </div>
    );
};

export default function Prod_Orders() {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [district, setDistrict] = useState(null);

    // Initial Load
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const dist = await getProductionManagerDistrict(user.id);
                setDistrict(dist);
            }

            loadOrders(true);
            loadStats();
        };
        init();
    }, []);

    // Load Orders
    const loadOrders = async (reset = false) => {
        setLoading(true);
        try {
            const currentPage = reset ? 0 : page;
            const res = await fetchProductionOrders({
                page: currentPage,
                filter,
                district
            });

            if (reset) {
                setOrders(res.data);
                setPage(1);
            } else {
                setOrders(prev => [...prev, ...res.data]);
                setPage(prev => prev + 1);
            }

            setHasMore(res.data.length === 20); // Limit is 20
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Load Stats
    const loadStats = async () => {
        const s = await fetchOrderStatistics(district);
        setStats(s);
    };

    // On Filter Change
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        loadOrders(true);
    }, [filter, district]);

    const handleUpdateStatus = async (order) => {
        const nextStatus = prompt('Enter new status (pending, packing, ready_for_dispatch, dispatched, delivered, completed, cancelled):', order.status);
        if (nextStatus && STATUS_CONFIG[nextStatus]) {
            await updateOrderStatus(order.id, nextStatus);
            loadOrders(true); // simpler to reload
            loadStats();
        } else if (nextStatus) {
            alert('Invalid status');
        }
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Header / Stats */}
            {stats && (
                <div style={{
                    display: 'flex', overflowX: 'auto', paddingBottom: '16px', marginBottom: '8px',
                    scrollbarWidth: 'none', msOverflowStyle: 'none'
                }}>
                    <StatCard title="Total" count={stats.total} icon={RefreshCw} color={colors.primaryBlue} />
                    <StatCard title="Pending" count={stats.pending} icon={Clock} color={colors.warning} />
                    <StatCard title="Packing" count={stats.packing} icon={Package} color={colors.primaryBlue} />
                    <StatCard title="Ready" count={stats.ready_for_dispatch} icon={Truck} color={colors.purple} />
                    <StatCard title="Dispatched" count={stats.dispatched} icon={Navigation} color={colors.indigo} />
                    <StatCard title="Completed" count={stats.completed} icon={CheckSquare} color={colors.success} />
                </div>
            )}

            {/* Filter Tabs */}
            <div style={{
                display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px',
                borderBottom: `1px solid ${colors.border}`
            }}>
                {['all', ...Object.keys(STATUS_CONFIG)].map(key => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: `1px solid ${filter === key ? colors.primaryBlue : colors.border}`,
                            backgroundColor: filter === key ? colors.primaryBlue : colors.white,
                            color: filter === key ? colors.white : colors.textSecondary,
                            fontSize: '13px', fontWeight: 500,
                            cursor: 'pointer', whiteSpace: 'nowrap'
                        }}
                    >
                        {key === 'all' ? 'All' : STATUS_CONFIG[key].label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading && orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>Loading orders...</div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <RefreshCw size={48} color={colors.border} />
                    </div>
                    <h3 style={{ color: colors.textSecondary }}>No orders found</h3>
                    <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Try changing the filter or refresh.</p>
                </div>
            ) : (
                <>
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} onEditStatus={handleUpdateStatus} />
                    ))}

                    {hasMore && (
                        <button
                            onClick={() => loadOrders(false)}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '12px',
                                backgroundColor: colors.white,
                                border: `1px solid ${colors.border}`,
                                borderRadius: '8px',
                                color: colors.primaryBlue,
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: '16px'
                            }}
                        >
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
