import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/orders.module.css';
import {
    Filter,
    RefreshCw,
    X,
    Check,
    ArrowLeft,
    ShoppingCart,
    CheckCircle,
    Truck,
    Clock,
    AlertCircle
} from 'lucide-react';

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statusFilters = ['All', 'Pending', 'Completed', 'Dispatched'];

    const loadOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ownerService.getAllOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to load orders", err);
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        if (selectedStatus === 'All') return orders;
        return orders.filter(order => {
            const status = (order.status || '').toLowerCase();
            return status === selectedStatus.toLowerCase();
        });
    }, [orders, selectedStatus]);

    const getStatusColor = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'completed': return '#16a34a'; // green-600
            case 'pending': return '#ea580c'; // orange-600
            case 'dispatched': return '#2563eb'; // blue-600
            case 'cancelled': return '#dc2626'; // red-600
            default: return '#6b7280'; // gray-500
        }
    };

    const getStatusIcon = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'completed': return CheckCircle;
            case 'pending': return Clock;
            case 'dispatched': return Truck;
            case 'cancelled': return AlertCircle;
            default: return ShoppingCart;
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
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
                    <h1 className={styles.title}>Order Details</h1>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.iconButton}
                        onClick={() => setShowFilter(!showFilter)}
                        title="Filter"
                    >
                        <Filter size={20} />
                    </button>
                    <button
                        className={styles.iconButton}
                        onClick={loadOrders}
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Filter Dropdown */}
            {showFilter && (
                <div className={styles.filterDropdown}>
                    <div className={styles.filterHeader}>Filter by Status</div>
                    {statusFilters.map(status => (
                        <div
                            key={status}
                            className={`${styles.filterOption} ${selectedStatus === status ? styles.filterOptionActive : ''}`}
                            onClick={() => {
                                setSelectedStatus(status);
                                setShowFilter(false);
                            }}
                        >
                            {status}
                            {selectedStatus === status && <Check size={16} />}
                        </div>
                    ))}
                </div>
            )}

            {/* Body */}
            {loading ? (
                <div className={styles.loading}>
                    <RefreshCw size={32} className="animate-spin mb-4 text-blue-600" />
                    <p>Loading orders...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <p className="text-red-500 mb-2">{error}</p>
                    <button onClick={loadOrders} className="text-blue-600 font-semibold">Retry</button>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className={styles.empty}>
                    <ShoppingCart size={48} className="text-gray-300 mb-2" />
                    <p>No orders found</p>
                </div>
            ) : (
                <>
                    {/* Summary Bar */}
                    <div className={styles.summaryBar}>
                        <span className={styles.summaryText}>{filteredOrders.length} Orders</span>
                        <div
                            className={styles.activeFilter}
                            style={{
                                backgroundColor: `${getStatusColor(selectedStatus)}15`, // very light opacity
                                color: selectedStatus === 'All' ? '#2563eb' : getStatusColor(selectedStatus)
                            }}
                        >
                            {selectedStatus}
                        </div>
                    </div>

                    {/* Order List */}
                    <div className={styles.list}>
                        {filteredOrders.map(order => {
                            const StatusIcon = getStatusIcon(order.status);
                            const statusColor = getStatusColor(order.status);
                            // Ensure ID display format matches Flutter: #ABCD1234
                            const displayId = order.order_number || `#${(order.id?.toString() || '').slice(0, 8).toUpperCase()}`;

                            return (
                                <div
                                    key={order.id}
                                    className={styles.card}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className={styles.statusIconBox} style={{ backgroundColor: `${statusColor}15` }}>
                                        <StatusIcon size={24} color={statusColor} />
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.customerName}>{order.customer_name || 'Unknown'}</div>
                                        <div className={styles.orderSubtext}>
                                            Order {displayId} • {formatDate(order.created_at)}
                                        </div>
                                        {order.feed_category && (
                                            <div className={styles.categoryPill}>{order.feed_category}</div>
                                        )}
                                    </div>
                                    <div className={styles.trailing}>
                                        <div className={styles.amount}>{formatCurrency(order.total_price)}</div>
                                        <div className={styles.statusPill} style={{ backgroundColor: `${statusColor}15`, color: statusColor }}>
                                            {order.status || 'PENDING'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Order Details Modal (Parity with showModalBottomSheet) */}
            {selectedOrder && (
                <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Order Details</h2>
                            <button className={styles.closeIconBtn} onClick={() => setSelectedOrder(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <DetailRow label="Order ID" value={selectedOrder.order_number || `#${selectedOrder.id?.toString().slice(0, 8).toUpperCase()}`} />
                            <DetailRow label="Customer" value={selectedOrder.customer_name || 'Unknown'} />
                            <DetailRow label="Phone" value={selectedOrder.customer_phone || 'N/A'} />
                            <DetailRow label="Category" value={selectedOrder.feed_category || 'N/A'} />
                            <DetailRow label="Bags" value={selectedOrder.bags?.toString() || '0'} />
                            <DetailRow label="Amount" value={formatCurrency(selectedOrder.total_price)} />
                            <DetailRow label="Status" value={selectedOrder.status?.toUpperCase() || 'PENDING'} />
                            <DetailRow label="Payment" value={selectedOrder.payment_method || 'N/A'} />
                            <DetailRow label="Date" value={formatDate(selectedOrder.created_at)} />
                        </div>

                        <button className={styles.closeButton} onClick={() => setSelectedOrder(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ label, value }) => (
    <div className={styles.detailRow}>
        <div className={styles.detailLabel}>{label}:</div>
        <div className={styles.detailValue}>{value}</div>
    </div>
);

export default Orders;
