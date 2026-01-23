import React, { useState, useEffect, useMemo } from 'react';
import { Package, Search, Scale, IndianRupee, RefreshCw, AlertTriangle, CheckCircle, Box } from 'lucide-react';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/inventory.module.css';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMarathi, setShowMarathi] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await employeeService.getInventoryProducts();
            if (data) {
                setInventory(data);
            }
        } catch (error) {
            console.error("Failed to load inventory", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Calculate derived values and filter
    const filteredInventory = useMemo(() => {
        return inventory.filter(item => {
            const name = (item.name || '').toLowerCase();
            const category = (item.category || '').toLowerCase();
            const search = searchTerm.toLowerCase();
            return name.includes(search) || category.includes(search);
        });
    }, [inventory, searchTerm]);

    const totals = useMemo(() => {
        return inventory.reduce((acc, item) => {
            const bags = item.bags || 0;
            // Fallback for weight: use column or default to 50kg
            const weightPerBag = item.weight_per_bag || 50;
            // Fallback for price: use column or default to 0
            const pricePerBag = item.price_per_bag || 0;

            acc.bags += bags;
            acc.tons += (bags * weightPerBag) / 1000;
            acc.value += (bags * pricePerBag);
            return acc;
        }, { bags: 0, tons: 0, value: 0 });
    }, [inventory]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (bags) => {
        if (bags <= 0) return styles.statusCritical;
        if (bags < 50) return styles.statusLow; // Example threshold
        return styles.statusOptimal;
    };

    const getStatusText = (bags) => {
        if (bags <= 0) return "Out of Stock";
        if (bags < 50) return "Low Stock";
        return "In Stock";
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Inventory Management</h1>
                <button
                    className={styles.refreshButton}
                    onClick={loadData}
                    disabled={loading}
                >
                    <RefreshCw size={16} className={loading ? styles.spin : ''} />
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                {/* Total Bags */}
                <div className={styles.summaryCard}>
                    <div className={styles.summaryHeader}>
                        <div>
                            <span className={styles.summaryLabel}>Total Bags</span>
                            <div className={styles.summaryValue}>{totals.bags.toLocaleString()}</div>
                        </div>
                        <div className={`${styles.summaryIconBox} ${styles.blueIcon}`}>
                            <Package size={20} />
                        </div>
                    </div>
                </div>

                {/* Total Tons */}
                <div className={styles.summaryCard}>
                    <div className={styles.summaryHeader}>
                        <div>
                            <span className={styles.summaryLabel}>Total Tons</span>
                            <div className={styles.summaryValue}>{totals.tons.toFixed(2)} T</div>
                        </div>
                        <div className={`${styles.summaryIconBox} ${styles.greenIcon}`}>
                            <Scale size={20} />
                        </div>
                    </div>
                </div>

                {/* Total Value */}
                <div className={styles.summaryCard}>
                    <div className={styles.summaryHeader}>
                        <div>
                            <span className={styles.summaryLabel}>Total Value</span>
                            <div className={styles.summaryValue}>{formatCurrency(totals.value)}</div>
                        </div>
                        <div className={`${styles.summaryIconBox} ${styles.orangeIcon}`}>
                            <IndianRupee size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search products or categories..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Visual Toggle for Language - Functionality depends on data */}
                <div className={styles.toggleContainer}>
                    <span
                        className={styles.toggleLabel}
                        style={{ fontWeight: !showMarathi ? '700' : '400', color: !showMarathi ? '#2563eb' : '#6b7280', cursor: 'pointer' }}
                        onClick={() => setShowMarathi(false)}
                    >
                        English
                    </span>
                    <div
                        style={{ width: '1px', height: '12px', background: '#ccc' }}
                    />
                    <span
                        className={styles.toggleLabel}
                        style={{ fontWeight: showMarathi ? '700' : '400', color: showMarathi ? '#2563eb' : '#6b7280', cursor: 'pointer' }}
                        onClick={() => setShowMarathi(true)}
                    >
                        मराठी
                    </span>
                </div>
            </div>

            {/* Inventory List */}
            <div className={styles.grid}>
                {filteredInventory.map((item) => {
                    const statusClass = getStatusColor(item.bags || 0);
                    const displayName = showMarathi ? (item.name_hindi || item.name) : item.name;

                    return (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.itemInfo}>
                                    <h3 className={styles.itemName}>{displayName}</h3>
                                    <span className={styles.categoryPill}>{item.category || 'General'}</span>
                                </div>
                                <div className={`${styles.statusPill} ${statusClass}`}>
                                    {(item.bags || 0) < 50 ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                                    {getStatusText(item.bags || 0)}
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.metricRow}>
                                    <div className={styles.metric}>
                                        <span className={styles.metricLabel}>Available Stock</span>
                                        <span className={styles.metricValue}>
                                            <Package size={12} style={{ display: 'inline', marginRight: 4 }} />
                                            {item.bags || 0} Bags
                                        </span>
                                    </div>
                                    <div className={styles.metric}>
                                        <span className={styles.metricLabel}>Total Weight</span>
                                        <span className={styles.metricValue}>
                                            {((item.bags || 0) * (item.weight_per_bag || 50) / 1000).toFixed(2)} T
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.metricRow}>
                                    <div className={styles.metric}>
                                        <span className={styles.metricLabel}>Weight / Bag</span>
                                        <span className={styles.metricValue}>{item.weight_per_bag || 50} kg</span>
                                    </div>
                                    <div className={styles.metric}>
                                        <span className={styles.metricLabel}>Price / Bag</span>
                                        <span className={styles.metricValue}>{formatCurrency(item.price_per_bag || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!loading && filteredInventory.length === 0 && (
                    <div className={styles.emptyState}>
                        <Box size={48} style={{ margin: '0 auto 16px', color: '#d1d5db' }} />
                        <p>No inventory items found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
