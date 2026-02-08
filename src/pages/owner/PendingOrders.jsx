import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/pendingOrders.module.css';
import {
    ArrowLeft,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Clock,
    Truck,
    Check,
    AlertCircle
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

const PendingOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPendingOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ownerService.getPendingOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to load pending orders", err);
            setError("Failed to fetch pending orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('emp_mar_orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Log activity (mocked function call as generic service doesn't have it exposed yet, or minimal implementation)
            console.log(`Order ${orderId} updated to ${newStatus}`);

            // Refresh list
            loadPendingOrders();

            alert(`Order updated to ${newStatus}`);
        } catch (e) {
            console.error("Update failed", e);
            alert("Failed to update order status");
        }
    };

    const isUrgent = (dateStr) => {
        if (!dateStr) return false;
        const diff = new Date() - new Date(dateStr);
        return diff > 24 * 60 * 60 * 1000; // > 24 hours
    };

    const getTimeAgo = (dateStr) => {
        if (!dateStr) return '';
        const diff = new Date() - new Date(dateStr);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor(diff / (1000 * 60));

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const getUrgencyColor = (dateStr) => {
        if (!dateStr) return '#3b82f6'; // blue default
        const hours = (new Date() - new Date(dateStr)) / (1000 * 60 * 60);
        if (hours > 48) return '#ef4444'; // red
        if (hours > 24) return '#f97316'; // orange
        return '#3b82f6'; // blue
    };

    const formatCurrency = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className={styles.iconButton} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className={styles.title}>Pending Orders</h1>
                </div>
                <button
                    className={styles.iconButton}
                    onClick={loadPendingOrders}
                    title="Refresh"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className={styles.loading}>
                    <RefreshCw size={32} className="animate-spin mb-4 text-blue-600" />
                    <p>Loading pending orders...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <p className="text-red-500 mb-2">{error}</p>
                    <button onClick={loadPendingOrders} className="text-blue-600 font-semibold">Retry</button>
                </div>
            ) : orders.length === 0 ? (
                <div className={styles.empty}>
                    <CheckCircle size={48} className="text-green-500 mb-2" />
                    <h2 className="text-xl font-bold text-green-600 mb-1">All clear!</h2>
                    <p>No pending orders</p>
                </div>
            ) : (
                <>
                    {/* Summary Card */}
                    <div className={styles.summaryCard}>
                        <AlertTriangle size={32} className="text-orange-700" />
                        <div className={styles.summaryContent}>
                            <div className={styles.summaryTitle}>{orders.length} Pending Orders</div>
                            <div className={styles.summarySubtitle}>Needs immediate attention</div>
                        </div>
                    </div>

                    {/* Pending List */}
                    <div className={styles.list}>
                        {orders.map(order => {
                            const urgencyColor = getUrgencyColor(order.created_at);
                            const urgent = isUrgent(order.created_at);
                            const displayId = order.order_number || `#${order.id?.toString().slice(0, 8).toUpperCase()}`;

                            return (
                                <div
                                    key={order.id}
                                    className={styles.card}
                                    style={urgent ? { border: '1px solid #fca5a5' } : {}}
                                >
                                    <div className={styles.cardHeader}>
                                        <div
                                            className={styles.statusIconBox}
                                            style={{ backgroundColor: `${urgencyColor}15` }}
                                        >
                                            {urgent ? (
                                                <AlertTriangle size={24} color={urgencyColor} />
                                            ) : (
                                                <Clock size={24} color={urgencyColor} />
                                            )}
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.customerName}>{order.customer_name || 'Unknown'}</div>
                                            <div className={styles.orderSubtext}>
                                                Order {displayId} • {getTimeAgo(order.created_at)}
                                            </div>
                                            <div className={styles.chipsRow}>
                                                <div className={styles.chip} style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                                                    {order.bags || 0} bags
                                                </div>
                                                {order.feed_category && (
                                                    <div className={styles.chip} style={{ background: '#f0fdf4', color: '#15803d' }}>
                                                        {order.feed_category}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={styles.cardTrailing}>
                                            <div className={styles.amount}>{formatCurrency(order.total_price)}</div>
                                            {urgent && <div className={styles.urgentLabel}>Urgent</div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default PendingOrders;
