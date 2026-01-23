import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/trackOrder.module.css';
import { Check, ArrowLeft, RefreshCw } from 'lucide-react';

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const data = await employeeService.getOrderDetails(orderId);
            setOrder(data);
        } catch (error) {
            console.error("Failed to load order", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    if (loading) return (
        <div className={styles.pageContainer}>
            <div className={styles.headerBlock}>
                <div className={styles.headerLabel}>Order ID</div>
                <h1 className={styles.orderIdTitle}>#{orderId?.substring(0, 8).toUpperCase()}</h1>
            </div>
            <div className={styles.loadingContainer}>
                Loading...
            </div>
        </div>
    );

    if (!order) return (
        <div className={styles.pageContainer}>
            <div className={styles.headerBlock}>
                <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginBottom: 10, display: 'inline-block' }}>
                    <ArrowLeft color="white" size={24} />
                </div>
                <h1 className={styles.orderIdTitle}>Order Not Found</h1>
            </div>
            <div className={styles.errorState}>
                <p>Could not find details for this order.</p>
                <button onClick={loadOrder} className="text-blue-600 font-semibold mt-4">Retry</button>
            </div>
        </div>
    );

    // Helpers
    const displayId = order.order_number || order.display_id || `#${order.id.substring(0, 8).toUpperCase()}`;
    const status = (order.status || 'pending').toLowerCase();

    // Status Logic
    const getStatusText = (s) => {
        const map = {
            'pending': 'Order Confirmed',
            'packing': 'Packing',
            'ready_for_dispatch': 'Ready for Dispatch',
            'dispatched': 'Dispatched',
            'delivered': 'Delivered',
            'completed': 'Completed',
            'cancelled': 'Cancelled'
        };
        return map[s] || 'Order Placed';
    };

    const getStatusColor = (s) => {
        // Similar to Flutter colors
        switch (s) {
            case 'pending': return '#ea580c'; // Orange
            case 'packing':
            case 'ready_for_dispatch': return '#d97706'; // Amber
            case 'dispatched': return '#2563eb'; // Blue
            case 'delivered':
            case 'completed': return '#10b981'; // Green
            case 'cancelled': return '#dc2626'; // Red
            default: return '#6b7280';
        }
    };

    const statusColor = getStatusColor(status);
    const statusText = getStatusText(status);

    // Simulated Timeline
    const getTimelineSteps = () => {
        const now = new Date();
        const getTime = (minOffset) => {
            const d = new Date(now.getTime() + minOffset * 60000);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        const steps = [
            { title: 'Order Confirmed', desc: 'Order placed successfully', time: getTime(-30), key: 'pending' },
            { title: 'Packing', desc: 'Feed bags are being packed', time: getTime(0), key: 'packing' },
            { title: 'Ready for Dispatch', desc: 'Order packed and ready', time: getTime(15), key: 'ready_for_dispatch' },
            { title: 'Dispatched', desc: 'Order has been dispatched', time: getTime(30), key: 'dispatched' },
            { title: 'Delivered', desc: 'Order delivered to customer', time: getTime(120), key: 'delivered' }
        ];

        let currentIndex = 0;
        const s = status;
        if (s === 'pending') currentIndex = 0;
        else if (s === 'packing') currentIndex = 1;
        else if (s === 'ready_for_dispatch') currentIndex = 2;
        else if (s === 'dispatched') currentIndex = 3;
        else if (s === 'delivered' || s === 'completed') currentIndex = 4;
        else if (s === 'cancelled') currentIndex = -1;

        return steps.map((step, idx) => ({
            ...step,
            isCompleted: status !== 'cancelled' && idx <= currentIndex,
            isActive: status !== 'cancelled' && idx === currentIndex,
            isCancelled: status === 'cancelled'
        }));
    };

    const timeline = getTimelineSteps();

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.headerBlock}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <ArrowLeft color="white" size={24} style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
                    <span className={styles.headerLabel}>Order ID</span>
                </div>
                <h1 className={styles.orderIdTitle}>{displayId}</h1>
                <p className={styles.orderSubtitle}>{order.bags} Bags • {order.feed_category}</p>
            </div>

            {/* Content */}
            <div className={styles.contentArea}>
                {/* Status Card */}
                <div className={styles.statusCard}>
                    <div className={styles.statusHeader}>
                        <div>
                            <div className={styles.statusLabel}>Current Status</div>
                            <div className={styles.statusValue} style={{ color: statusColor }}>{statusText}</div>
                        </div>
                        <div className={styles.statusBadge} style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
                            {statusText}
                        </div>
                    </div>

                    <div className={styles.hasDivider} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <InfoRow label="Order Date" value={new Date(order.created_at).toLocaleString()} />
                        <InfoRow label="Customer" value={order.customer_name} />
                        <InfoRow label="Mobile" value={order.customer_mobile || 'N/A'} />
                        <InfoRow label="Delivery Address" value={order.customer_address || 'N/A'} />
                        <InfoRow label="Weight" value={`${order.total_weight || 0} kg`} />
                        <InfoRow label="Total Amount" value={`₹${order.total_price || 0}`} />
                    </div>
                </div>

                {/* Timeline */}
                <h3 className={styles.sectionTitle}>Order Timeline</h3>
                <div className={styles.timelineCard}>
                    {timeline.map((step, index) => (
                        <div key={index} className={styles.timelineStep}>
                            <div className={styles.stepIndicator}>
                                <div className={`${styles.dot} ${step.isActive ? styles.dotActive : ''} ${step.isCompleted && !step.isActive ? styles.dotCompleted : ''}`}>
                                    {(step.isCompleted || step.isActive) && <Check size={12} color="white" />}
                                </div>
                                {index < timeline.length - 1 && (
                                    <div className={`${styles.line} ${(step.isCompleted && timeline[index + 1].isCompleted) ? styles.lineCompleted : ''}`} />
                                )}
                            </div>
                            <div className={styles.stepContent}>
                                <div className={styles.stepHeader}>
                                    <span className={`${styles.stepTitle} ${step.isActive ? styles.stepTitleActive : ''} ${step.isCompleted && !step.isActive ? styles.stepTitleCompleted : ''}`}>
                                        {step.title}
                                    </span>
                                    <span className={styles.stepTime}>{step.time}</span>
                                </div>
                                <span className={styles.stepDesc}>{step.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className={styles.infoRow}>
        <span className={styles.infoLabel}>{label}</span>
        <span className={styles.infoValue}>{value}</span>
    </div>
);

export default TrackOrder;
