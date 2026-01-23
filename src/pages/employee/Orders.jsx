import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/orders.module.css';
import {
    Search,
    Scale,
    IndianRupee,
    LayoutGrid,
    ChevronDown,
    FileText,
    CheckCircle,
    Package
} from 'lucide-react';

const Orders = () => {
    const { status } = useParams(); // 'total', 'pending', 'completed'
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const allOrders = await employeeService.getOrders();
            setOrders(allOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter Logic
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        // 1. Status Filter
        if (status && status !== 'total') {
            filtered = filtered.filter(o => {
                const s = (o.status || '').toLowerCase();
                if (status === 'completed') return s === 'completed' || s === 'delivered';
                if (status === 'pending') return s === 'pending' || s === 'packing' || s === 'ready_for_dispatch' || s === 'dispatched';
                return s === status;
            });
        }

        // 2. Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(o =>
                (o.customer_name || '').toLowerCase().includes(term) ||
                (o.display_id || '').toLowerCase().includes(term) ||
                (o.order_number || '').toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [orders, status, searchTerm]);

    // Grouping by Date
    const groupedOrders = useMemo(() => {
        const groups = {};

        filteredOrders.forEach(order => {
            const dateStr = getDateString(order.created_at);
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(order);
        });

        return groups;
    }, [filteredOrders]);

    // Flatten for rendering with visibility limit
    const visibleOrderList = useMemo(() => {
        const dates = Object.keys(groupedOrders);
        // Logic to verify sort if needed, assumes server sorted.

        const result = [];
        for (const date of dates) {
            for (const order of groupedOrders[date]) {
                if (result.length >= visibleCount) break;
                result.push({ ...order, _dateHeader: date });
            }
            if (result.length >= visibleCount) break;
        }
        return result;
    }, [groupedOrders, visibleCount]);


    // Helper: Date String Formatter
    function getDateString(dateString) {
        if (!dateString) return "Unknown Date";
        try {
            const date = new Date(dateString);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            if (orderDate.getTime() === today.getTime()) return `TODAY, ${formatDate(date)}`;
            if (orderDate.getTime() === yesterday.getTime()) return `YESTERDAY, ${formatDate(date)}`;
            return formatDate(date);
        } catch (e) {
            return dateString;
        }
    }

    function formatDate(date) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    }

    // Helper: Status Color
    const getStatusClass = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'completed' || s === 'delivered') return styles.status_completed;
        if (s === 'pending') return styles.status_pending;
        if (s === 'cancelled') return styles.status_cancelled;
        if (s === 'packing' || s === 'ready_for_dispatch') return styles.status_packing;
        if (s === 'dispatched') return styles.status_dispatched;
        return styles.status_pending;
    };

    // UI Components
    const OrderCard = ({ order, showHeader }) => {
        const isActiveDate = showHeader && order._dateHeader;

        return (
            <>
                {isActiveDate && (
                    <div className={styles.dateGroupHeader}>{order._dateHeader}</div>
                )}
                <div
                    className={styles.orderCard}
                    onClick={() => navigate(`/employee/orders/track/${order.id}`)}
                >
                    {/* Header */}
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={styles.orderId}>
                                {order.display_id || order.order_number || `#${order.id?.slice(0, 8).toUpperCase()}`}
                            </div>
                            <div className={styles.customerName}>
                                {order.customer_name || 'Valued Customer'}
                            </div>
                        </div>
                        <div className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                            {order.status?.replace(/_/g, ' ').toUpperCase()}
                        </div>
                    </div>

                    {/* Details */}
                    <div className={styles.cardDetails}>
                        <div className={styles.detailColumn}>
                            <Scale size={16} className={styles.detailIcon} />
                            <span className={styles.detailLabel}>Bags</span>
                            <span className={styles.detailValue}>{order.bags || 0} Bags</span>
                        </div>
                        <div className={styles.detailColumn}>
                            <IndianRupee size={16} className={styles.detailIcon} />
                            <span className={styles.detailLabel}>Total</span>
                            <span className={styles.detailValue}>₹{order.total_price || 0}</span>
                        </div>
                        <div className={styles.detailColumn}>
                            <LayoutGrid size={16} className={styles.detailIcon} />
                            <span className={styles.detailLabel}>Category</span>
                            <span className={styles.detailValue}>{order.feed_category || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const getPageTitle = () => {
        if (status === 'pending') return { title: 'Pending Orders', sub: 'Orders awaiting processing & delivery' };
        if (status === 'completed') return { title: 'Completed Orders', sub: 'History of delivered orders' };
        return { title: 'All Orders', sub: 'View and manage all customer orders' };
    };

    const { title, sub } = getPageTitle();

    if (loading) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Header Block */}
            <div className={styles.headerBlock}>
                <h1 className={styles.headerTitle}>{title}</h1>
                <p className={styles.headerSubtitle}>{sub}</p>
            </div>

            {/* Main Content */}
            <div className={styles.contentArea}>
                {/* Search Box */}
                <div className={styles.searchCard}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Search by order number or customer..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* List Title */}
                <div className={styles.listHeaderRow}>
                    <span className={styles.listTitle}>
                        {status === 'pending' ? 'Pending Orders List' : 'Order List'}
                    </span>
                    <span className={styles.listCount}>
                        Showing {visibleOrderList.length} of {filteredOrders.length}
                    </span>
                </div>

                {/* List Items */}
                {visibleOrderList.length > 0 ? (
                    <div>
                        {visibleOrderList.map((order, index) => {
                            const prev = visibleOrderList[index - 1];
                            const showHeader = index === 0 || (prev && prev._dateHeader !== order._dateHeader);
                            return (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    showHeader={showHeader}
                                />
                            );
                        })}

                        {/* Load More */}
                        {visibleCount < filteredOrders.length && (
                            <button
                                className={styles.loadMoreBtn}
                                onClick={() => setVisibleCount(prev => prev + 10)}
                            >
                                <ChevronDown size={18} />
                                Load More Orders
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        {status === 'pending' ? (
                            <CheckCircle size={64} className={styles.emptyIcon} style={{ color: '#d1d5db' }} />
                        ) : (
                            <FileText size={64} className={styles.emptyIcon} />
                        )}
                        <h3 className={styles.emptyTitle}>
                            {status === 'pending' ? 'No Pending Orders' : 'No Orders Found'}
                        </h3>
                        <p style={{ marginBottom: 0 }}>
                            {status === 'pending' ? 'All orders are processed! Great work!' : 'Try adjusting your search criteria'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
