import React, { useState, useEffect } from 'react';
import {
    Users,
    ArrowLeft,
    History,
    Info,
    Check,
    X,
    Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { marketingService } from '../../services/marketingService';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/marketing/teamManagement.module.css';

const TargetManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Data
    const [teamMembers, setTeamMembers] = useState([]);
    const [activeTargets, setActiveTargets] = useState({});

    // Form State
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [revenueTarget, setRevenueTarget] = useState('');
    const [orderTarget, setOrderTarget] = useState('');
    const [remarks, setRemarks] = useState('');
    const [targetMonth, setTargetMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // UI State
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, targetMonth]);

    useEffect(() => {
        validateInputs();
    }, [revenueTarget, orderTarget]);

    const loadData = async () => {
        setLoading(true);
        try {
            const profile = await marketingService.getProfile(user.id);
            if (!profile?.district) throw new Error('District not found');

            // Get Team
            const members = await marketingService.getTeamMembers(profile.district);
            setTeamMembers(members || []);

            // Get Existing Targets
            if (members && members.length > 0) {
                const empIds = members.map(e => e.id);
                const targets = await marketingService.getTeamTargets(empIds, `${targetMonth}-01`);

                const targetMap = {};
                if (targets) {
                    targets.forEach(t => {
                        targetMap[t.emp_id] = t;
                    });
                }
                setActiveTargets(targetMap);
            } else {
                setActiveTargets({});
            }
        } catch (error) {
            console.error('Error loading team data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMember = (id) => {
        if (selectedMembers.includes(id)) {
            setSelectedMembers(selectedMembers.filter(mId => mId !== id));
        } else {
            setSelectedMembers([...selectedMembers, id]);
        }
    };

    const validateInputs = () => {
        if (!revenueTarget || !orderTarget) {
            setValidationError('');
            return;
        }

        const rev = parseFloat(revenueTarget);
        const ord = parseFloat(orderTarget);
        if (rev <= 0 || ord <= 0) return;

        const avgPricePerKg = 450; // Approx
        const avgOrderValue = rev / ord;
        const avgOrderWeight = avgOrderValue / avgPricePerKg;

        if (avgOrderValue < 100) {
            setValidationError(`Average order value is too low (₹${avgOrderValue.toFixed(0)}).`);
        } else {
            setValidationError('');
        }
    };

    const handleAssign = async () => {
        if (selectedMembers.length === 0) {
            alert("Please select at least one executive.");
            return;
        }
        if (validationError) {
            alert("Please fix validation errors.");
            return;
        }

        setSubmitting(true);
        try {
            const assignments = selectedMembers.map(empId => ({
                emp_id: empId, // Current table uses emp_id
                marketing_executive_id: empId, // Legacy/Supabase compatibility if needed
                target_month: `${targetMonth}-01`,
                revenue_target: parseFloat(revenueTarget),
                order_target: parseInt(orderTarget),
                remarks: remarks,
                assigned_by: user.id,
                status: 'Assigned',
                updated_at: new Date().toISOString()
            }));

            await marketingService.assignTargetsToTeam(assignments);

            // Refresh Data to show updates
            await loadData();

            // Reset Form (keep month)
            setSelectedMembers([]);
            setRevenueTarget('');
            setOrderTarget('');
            setRemarks('');

            alert("Targets assigned successfully!");
        } catch (error) {
            console.error("Assignment failed", error);
            alert("Failed to assign targets.");
        } finally {
            setSubmitting(false);
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
                    Assign Team Targets
                </div>
                {/* Could add history here */}
            </div>

            {/* Info Card */}
            <div className={styles.infoCard}>
                <Info size={20} className={styles.infoIcon} />
                <div className={styles.infoText}>
                    Select one or more executives to assign monthly targets.
                    Targets update automatically if already assigned.
                </div>
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

            {/* Team Selection */}
            <h3 className={styles.sectionTitle}>Select Executives ({selectedMembers.length})</h3>
            <div className={styles.managerList}>
                {teamMembers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
                        No team members found in your district.
                    </div>
                ) : (
                    teamMembers.map(m => {
                        const target = activeTargets[m.id];
                        const isSelected = selectedMembers.includes(m.id);
                        return (
                            <div
                                key={m.id}
                                className={`${styles.managerItem} ${isSelected ? styles.managerItemSelected : ''}`}
                                onClick={() => toggleMember(m.id)}
                            >
                                <div className={styles.avatar}>
                                    {m.full_name ? m.full_name.charAt(0) : 'U'}
                                </div>
                                <div className={styles.managerInfo}>
                                    <div className={styles.managerName}>{m.full_name}</div>
                                    <div className={styles.managerId}>
                                        {m.emp_id || 'ID: --'}
                                        {target && (
                                            <span className="ml-2 text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold">
                                                Target Set: ₹{(target.revenue_target / 1000).toFixed(0)}k
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isSelected && <Check size={18} color="#2563eb" />}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Target Inputs */}
            <h3 className={styles.sectionTitle}>Set Monthly Goals</h3>
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
                        <span className={styles.calcLabel}>Est. Weight (Approx)</span>
                        <span className={styles.calcValue}>
                            {((parseFloat(revenueTarget) / parseInt(orderTarget)) / 450).toFixed(1)} kg
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
                    placeholder="Add a note for the team..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                />
            </div>

            {/* Submit */}
            <button
                className={`${styles.submitBtn} ${(submitting || selectedMembers.length === 0 || validationError) ? styles.submitBtnDisabled : ''}`}
                onClick={handleAssign}
                disabled={submitting || selectedMembers.length === 0 || !!validationError}
            >
                {submitting ? 'Assigning...' : 'Assign Targets'}
            </button>
        </div>
    );
};

export default TargetManagement;
