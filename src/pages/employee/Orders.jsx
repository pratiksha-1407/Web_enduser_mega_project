import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/tables.module.css';
import { Search, ShoppingBag, Eye, RefreshCw } from 'lucide-react';

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
        if (s.includes('complete') || s.includes('deliver')) return styles.statusCompleted;
        if (s.includes('cancel')) return styles.statusCancelled;
        if (s.includes('pack')) return styles.statusPacking;
        if (s.includes('ready')) return styles.statusReady;
        return styles.statusPending; // Default
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <ShoppingBag size={20} />
                    </div>
                    <h2 className={styles.tableTitle}>
                        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'} Orders
                    </h2>
                    <button onClick={fetchOrders} className="p-2 ml-2 hover:bg-gray-100 rounded-full transition-colors" title="Refresh">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
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
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                    Loading orders...
                                </td>
                            </tr>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="font-mono text-xs font-semibold">{order.display_id}</td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                                        <div className="text-xs text-gray-500">{order.customer_mobile}</div>
                                    </td>
                                    <td>
                                        <div className="text-sm text-gray-900">{order.feed_category}</div>
                                        <div className="text-xs text-gray-500">{order.bags} Bags</div>
                                    </td>
                                    <td className="font-medium">₹{order.total_price}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${getStatusStyle(order.status)}`}>
                                            {order.status?.replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    {/* <td>
                                        <button className={styles.actionBtn}>
                                            <Eye size={18} />
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500">
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
