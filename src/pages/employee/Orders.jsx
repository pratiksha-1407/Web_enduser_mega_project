import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/tables.module.css';
import { Search, ShoppingBag, RefreshCw } from 'lucide-react';

const Orders = () => {
    const { status } = useParams(); // 'total', 'pending', 'completed'
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const allOrders = await employeeService.getOrders();
            setOrders(allOrders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getFilteredOrders = () => {
        let filtered = orders;

        // Status Filter
        if (status && status !== 'total') {
            filtered = filtered.filter(o => {
                if (status === 'completed') return o.status === 'completed' || o.status === 'delivered';
                if (status === 'pending') return o.status === 'pending' || o.status === 'packing' || o.status === 'ready_for_dispatch' || o.status === 'dispatched';
                return o.status === status;
            });
        }

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(o =>
                o.customer_name?.toLowerCase().includes(term) ||
                o.display_id?.toLowerCase().includes(term) ||
                o.feed_category?.toLowerCase().includes(term)
            );
        }

        return filtered;
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase() || '';
        if (s.includes('pending')) return styles.statusPending;
        if (s.includes('complete') || s.includes('deliver')) return styles.statusSuccess;
        if (s.includes('cancel')) return styles.statusCancelled;
        if (s.includes('pack')) return styles.statusPacking;
        if (s.includes('ready') || s.includes('dispatch')) return styles.statusReady;
        return styles.statusPending; // Default
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconWrapper}>
                        <ShoppingBag size={20} />
                    </div>
                    <h2 className={styles.tableTitle}>
                        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'} Orders
                    </h2>
                    <button onClick={fetchOrders} className={styles.refreshBtn} title="Refresh">
                        <RefreshCw size={16} className={loading ? styles.spinning : ''} />
                    </button>
                </div>
                <div className={styles.searchBox}>
                    <Search size={18} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Prod / Qty</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className={styles.centerMessage}>
                                    <div className="flex justify-center mb-2">
                                        <div className={styles.loadingSpinner}></div>
                                    </div>
                                    Loading orders...
                                </td>
                            </tr>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className={styles.monoText}>{order.display_id}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.primaryText}>{order.customer_name}</div>
                                        <div className={styles.secondaryText}>{order.customer_mobile}</div>
                                    </td>
                                    <td>
                                        <div className={styles.primaryText}>{order.feed_category}</div>
                                        <div className={styles.secondaryText}>{order.bags} Bags</div>
                                    </td>
                                    <td className={styles.primaryText}>₹{order.total_price}</td>
                                    <td>
                                        <span className={`${styles.statusPill} ${getStatusStyle(order.status)}`}>
                                            {order.status?.replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className={styles.centerMessage}>
                                    No orders found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
