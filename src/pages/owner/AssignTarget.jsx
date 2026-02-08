import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/assignTarget.module.css';
import {
    ArrowLeft,
    Info,
    Check,
    History,
    X,
    Users
} from 'lucide-react';

const AssignTarget = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Data
    const [managers, setManagers] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [targetsHistory, setTargetsHistory] = useState([]);

    // Form State
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedManagers, setSelectedManagers] = useState([]);
    const [revenueTarget, setRevenueTarget] = useState('');
    const [orderTarget, setOrderTarget] = useState('');
    const [remarks, setRemarks] = useState('');
    const [targetMonth, setTargetMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Validation
    const [validationError, setValidationError] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    // Initial Load
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const managersData = await ownerService.getMarketingManagers();
            setManagers(managersData);

            // Extract unique districts
            const uniqueDistricts = [...new Set(managersData
                .map(m => m.district)
                .filter(d => d && d !== 'null')
            )].sort();
            setDistricts(['All Districts', ...uniqueDistricts]);

            // Load history
            const history = await ownerService.getRecentTargets();
            setTargetsHistory(history);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered Managers
    const filteredManagers = selectedDistrict && selectedDistrict !== 'All Districts'
        ? managers.filter(m => m.district === selectedDistrict)
        : managers;

    // Validation Logic
    const avgPricePerKg = 450; // Approximated from Flutter code logic (simplified)

    useEffect(() => {
        validateInputs();
    }, [revenueTarget, orderTarget]);

    const validateInputs = () => {
        if (!revenueTarget || !orderTarget) {
            setValidationError('');
            return;
        }

        const rev = parseFloat(revenueTarget);
        const ord = parseFloat(orderTarget);

        if (rev <= 0 || ord <= 0) return;

        const avgOrderValue = rev / ord;
        const avgOrderWeight = avgOrderValue / avgPricePerKg;

        if (avgOrderWeight < 1) { // 5kg is strict, maybe 1kg for flexibility
            setValidationError(`Average order weight is too low (${avgOrderWeight.toFixed(1)}kg).`);
        } else if (avgOrderValue < 100) {
            setValidationError(`Average order value is too low (₹${avgOrderValue.toFixed(0)}).`);
        } else {
            setValidationError('');
        }
    };

    const handleAssign = async () => {
        if (selectedManagers.length === 0) {
            alert("Please select at least one manager.");
            return;
        }
        if (validationError) {
            alert("Please fix validation errors.");
            return;
        }

        setSubmitting(true);
        try {
            await ownerService.assignTargets({
                managerIds: selectedManagers,
                district: selectedDistrict || 'All',
                targetMonth,
                revenue: parseFloat(revenueTarget),
                orders: parseInt(orderTarget),
                remarks
            });
            alert("Targets assigned successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Assignment failed", error);
            alert("Failed to assign targets.");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleManager = (id) => {
        if (selectedManagers.includes(id)) {
            setSelectedManagers(selectedManagers.filter(mId => mId !== id));
        } else {
            setSelectedManagers([...selectedManagers, id]);
        }
    };

    const formatCurrency = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <div onClick={() => navigate(-1)} className={styles.iconButton}>
                        <ArrowLeft size={20} />
                    </div>
                    Assign Monthly Targets
                </div>
                <div onClick={() => setShowHistory(true)} className={styles.iconButton}>
                    <History size={20} />
                </div>
            </div>

            {/* Info Card */}
            <div className={styles.infoCard}>
                <Info size={20} className={styles.infoIcon} />
                <div className={styles.infoText}>
                    Targets are assigned based on average product prices.
                    Ensure realistic goals for your team based on their region's potential.
                </div>
            </div>

            {/* District Selection */}
            <h3 className={styles.sectionTitle}>Select District</h3>
            <div className={styles.grid}>
                {districts.map(d => (
                    <div
                        key={d}
                        className={`${styles.chip} ${selectedDistrict === d ? styles.chipSelected : ''}`}
                        onClick={() => {
                            setSelectedDistrict(d);
                            setSelectedManagers([]);
                        }}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Month Selection */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>Target Month</label>
                <input
                    type="month"
                    className={styles.input}
                    value={targetMonth}
                    onChange={(e) => setTargetMonth(e.target.value)}
                />
            </div>

            {/* Managers Selection */}
            <h3 className={styles.sectionTitle}>Select Managers ({selectedManagers.length})</h3>
            <div className={styles.managerList}>
                {filteredManagers.length === 0 ? (
                    <div style={{ color: '#9ca3af', fontSize: 13, fontStyle: 'italic' }}>
                        No managers found in this district.
                    </div>
                ) : (
                    filteredManagers.map(m => (
                        <div
                            key={m.id}
                            className={`${styles.managerItem} ${selectedManagers.includes(m.id) ? styles.managerItemSelected : ''}`}
                            onClick={() => toggleManager(m.id)}
                        >
                            <div className={styles.avatar}>
                                {m.name ? m.name.charAt(0) : 'U'}
                            </div>
                            <div className={styles.managerInfo}>
                                <div className={styles.managerName}>{m.name || 'Unknown Manager'}</div>
                                <div className={styles.managerId}>{m.emp_id || 'ID: --'} • {m.district}</div>
                            </div>
                            {selectedManagers.includes(m.id) && <Check size={18} color="#2563eb" />}
                        </div>
                    ))
                )}
            </div>

            {/* Targets Set */}
            <h3 className={styles.sectionTitle}>Set Targets</h3>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Revenue Target (₹)</label>
                <input
                    type="number"
                    className={styles.input}
                    placeholder="e.g. 500000"
                    value={revenueTarget}
                    onChange={(e) => setRevenueTarget(e.target.value)}
                />
            </div>
            <div className={styles.inputGroup}>
                <label className={styles.label}>Order Target (Count)</label>
                <input
                    type="number"
                    className={styles.input}
                    placeholder="e.g. 50"
                    value={orderTarget}
                    onChange={(e) => setOrderTarget(e.target.value)}
                />
            </div>

            {/* Auto Calc */}
            {(revenueTarget && orderTarget) && (
                <div className={styles.calcBox}>
                    <div className={styles.calcItem}>
                        <span className={styles.calcLabel}>Avg per Order</span>
                        <span className={styles.calcValue}>
                            {formatCurrency(parseFloat(revenueTarget) / parseInt(orderTarget))}
                        </span>
                    </div>
                    <div className={styles.calcItem} style={{ alignItems: 'flex-end' }}>
                        <span className={styles.calcLabel}>Est. Weight</span>
                        <span className={styles.calcValue}>
                            {((parseFloat(revenueTarget) / parseInt(orderTarget)) / avgPricePerKg).toFixed(1)} kg
                        </span>
                    </div>
                </div>
            )}

            {/* Validation Error */}
            {validationError && (
                <div className={styles.errorBox}>
                    {validationError}
                </div>
            )}

            {/* Remarks */}
            <div className={styles.inputGroup}>
                <label className={styles.label}>Remarks (Optional)</label>
                <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Add a note or instruction..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                />
            </div>

            {/* Submit */}
            <button
                className={`${styles.submitBtn} ${(submitting || selectedManagers.length === 0 || validationError) ? styles.submitBtnDisabled : ''}`}
                onClick={handleAssign}
                disabled={submitting || selectedManagers.length === 0 || !!validationError}
            >
                {submitting ? 'Assigning...' : 'Assign Targets'}
            </button>

            {/* History Modal */}
            {showHistory && (
                <div className={styles.modalOverlay} onClick={() => setShowHistory(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.title} style={{ marginBottom: 0 }}>Target History</h3>
                            <div onClick={() => setShowHistory(false)} style={{ cursor: 'pointer' }}>
                                <X size={24} color="#6b7280" />
                            </div>
                        </div>
                        <div className={styles.modalBody}>
                            {targetsHistory.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#6b7280', marginTop: 40 }}>
                                    No history available
                                </div>
                            ) : (
                                targetsHistory.map((t, idx) => (
                                    <div key={idx} className={styles.historyCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontWeight: 600, fontSize: 14 }}>{t.manager_name}</span>
                                            <span style={{ fontSize: 12, color: '#6b7280' }}>{t.target_month.slice(0, 7)}</span>
                                        </div>
                                        <div className={styles.progressLabel}>
                                            <span>Revenue</span>
                                            <span>{formatCurrency(t.achieved_revenue || 0)} / {formatCurrency(t.revenue_target)}</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${Math.min(((t.achieved_revenue || 0) / t.revenue_target) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <div className={styles.progressLabel}>
                                            <span>Orders</span>
                                            <span>{t.achieved_orders || 0} / {t.order_target}</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${Math.min(((t.achieved_orders || 0) / t.order_target) * 100, 100)}%`, backgroundColor: '#f59e0b' }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignTarget;
