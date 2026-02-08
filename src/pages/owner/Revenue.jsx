import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/revenue.module.css';
import { ArrowLeft, RefreshCw, X, ArrowUp, ArrowDown } from 'lucide-react';

const Revenue = () => {
    const navigate = useNavigate();
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('All Districts');
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    // Mock filters for UI parity - functionality would require backend support
    const filters = ['All Districts', 'This Month', 'Last Month', 'This Year'];

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await ownerService.getDistrictRevenueData();
            setDistricts(data);
        } catch (error) {
            console.error("Failed to load district data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const totalRevenue = useMemo(() => districts.reduce((sum, d) => sum + (d.revenue || 0), 0), [districts]);
    const totalOrders = useMemo(() => districts.reduce((sum, d) => sum + (d.orders || 0), 0), [districts]);

    const getDistrictColor = (index) => {
        const colors = ['#1d4ed8', '#15803d', '#ea580c', '#7e22ce', '#b91c1c', '#0f766e'];
        return colors[index % colors.length];
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
                    <h1 className={styles.title}>District Revenue</h1>
                </div>
                <button className={styles.iconButton} onClick={loadData}>
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Filter Bar (Scrollable horizontally) */}
            <div className={styles.filterBar}>
                {filters.map(f => (
                    <div
                        key={f}
                        className={`${styles.filterChip} ${selectedFilter === f ? styles.filterChipActive : ''}`}
                        onClick={() => setSelectedFilter(f)}
                    >
                        {f}
                    </div>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className={styles.loading}>
                    <RefreshCw size={32} className="animate-spin mb-4 text-blue-600" />
                    <span>Loading district data...</span>
                </div>
            ) : districts.length === 0 ? (
                <div className={styles.empty}>
                    <p>No district data available</p>
                    <button onClick={loadData} className={styles.retryBtn}>Load Data</button>
                </div>
            ) : (
                <>
                    {/* Summary Card */}
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryItem}>
                            <div className={styles.summaryValue} style={{ color: '#16a34a' }}>{formatCurrency(totalRevenue)}</div>
                            <div className={styles.summaryLabel}>Total Revenue</div>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <div className={styles.summaryValue} style={{ color: '#2563eb' }}>{totalOrders}</div>
                            <div className={styles.summaryLabel}>Total Orders</div>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <div className={styles.summaryValue} style={{ color: '#9333ea' }}>{districts.length}</div>
                            <div className={styles.summaryLabel}>Districts</div>
                        </div>
                    </div>

                    {/* List */}
                    <div className={styles.list}>
                        {districts.map((district, index) => {
                            const percent = totalRevenue > 0 ? (district.revenue / totalRevenue * 100).toFixed(1) : 0;
                            const color = getDistrictColor(index);
                            const growth = district.growth || 0;
                            const isPositive = growth >= 0;

                            return (
                                <div
                                    key={index}
                                    className={styles.card}
                                    onClick={() => setSelectedDistrict(district)}
                                >
                                    <div className={styles.avatar} style={{ backgroundColor: color }}>
                                        {district.district?.charAt(0) || 'D'}
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.districtName}>{district.district}</div>
                                        <div className={styles.branchName}>{district.branch}</div>
                                        <div className={styles.tagsRow}>
                                            <div className={styles.pill} style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                                                {district.orders} orders
                                            </div>
                                            <div
                                                className={styles.pill}
                                                style={{
                                                    backgroundColor: isPositive ? '#f0fdf4' : '#fef2f2',
                                                    color: isPositive ? '#15803d' : '#dc2626'
                                                }}
                                            >
                                                {isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                                {Math.abs(growth).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.trailing}>
                                        <div className={styles.revenueValue}>{formatCurrency(district.revenue)}</div>
                                        <div className={styles.percentage}>{percent}% of total</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Modal */}
            {selectedDistrict && (
                <div className={styles.modalOverlay} onClick={() => setSelectedDistrict(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>District Details</h2>
                            <button className={styles.closeIconBtn} onClick={() => setSelectedDistrict(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.centeredAvatar}>
                            <div
                                className={styles.largeAvatar}
                                style={{ backgroundColor: getDistrictColor(districts.indexOf(selectedDistrict)) }}
                            >
                                {selectedDistrict.district?.charAt(0) || 'D'}
                            </div>
                        </div>


                        <DetailRow label="District" value={selectedDistrict.district} />
                        <DetailRow label="Branch" value={selectedDistrict.branch} />
                        <DetailRow label="Revenue" value={formatCurrency(selectedDistrict.revenue)} />
                        <DetailRow label="Total Orders" value={selectedDistrict.orders.toString()} />
                        <DetailRow label="Growth" value={`${selectedDistrict.growth >= 0 ? '+' : ''}${selectedDistrict.growth.toFixed(1)}%`} />

                        {selectedDistrict.topProducts && selectedDistrict.topProducts.length > 0 && (
                            <div style={{ marginTop: 16 }}>
                                <div className={styles.detailLabel} style={{ marginBottom: 8 }}>Top Products:</div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {selectedDistrict.topProducts.map(p => (
                                        <span key={p} className={styles.productChip}>
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button className={styles.closeButton} onClick={() => setSelectedDistrict(null)}>
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

export default Revenue;
