import { useState, useEffect } from 'react';
import { marketingService } from '../../services/marketingService';
import { supabase } from '../../services/supabaseClient';
import styles from '../../styles/marketing/team.module.css';
import modalStyles from '../../components/common/Modal.module.css';
import Modal from '../../components/common/Modal';
import {
    Users,
    Target,
    Calendar,
    Send,
    RefreshCw,
    AlertCircle,
    User,
    Mail,
    Phone,
    Briefcase,
    ChevronRight,
    Search
} from 'lucide-react';

const TeamManagement = () => {
    const [loading, setLoading] = useState(true);
    const [managerProfile, setManagerProfile] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [employeeTargets, setEmployeeTargets] = useState({}); // emp_id -> target
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [globalTarget, setGlobalTarget] = useState('');
    const [isAssigning, setIsAssigning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editModalConfig, setEditModalConfig] = useState({ isOpen: false, employee: null, target: '' });

    useEffect(() => {
        loadInitialData();
    }, [selectedMonth]);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Get Manager Profile
            const profile = await marketingService.getProfile(user.id);
            setManagerProfile(profile);

            // 2. Get Team Members (District-wise)
            const team = await marketingService.getTeamMembers(profile.district);
            setEmployees(team);

            // 3. Get Existing Targets for selected month
            const monthStr = selectedMonth.toISOString().split('T')[0].substring(0, 7) + '-01';
            const targets = await marketingService.getTeamTargets(team.map(e => e.emp_id), monthStr);

            const targetMap = {};
            targets.forEach(t => {
                targetMap[t.emp_id] = t.target_amount;
            });
            setEmployeeTargets(targetMap);

        } catch (error) {
            console.error('Error loading team data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignToAll = async () => {
        if (!globalTarget || isNaN(globalTarget) || parseFloat(globalTarget) <= 0) {
            alert('Please enter a valid target amount (Tons)');
            return;
        }

        try {
            setIsAssigning(true);
            const monthStr = selectedMonth.toISOString().split('T')[0].substring(0, 7) + '-01';
            const monthDisplay = `${selectedMonth.getMonth() + 1}/${selectedMonth.getFullYear()}`;

            const assignments = employees.map(emp => ({
                emp_id: emp.emp_id,
                employee_name: emp.full_name,
                branch: emp.branch,
                district: emp.district,
                assigned_by: managerProfile.email,
                target_amount: parseFloat(globalTarget),
                target_month: monthStr,
                month_display: monthDisplay,
                assigned_date: new Date().toISOString(),
                status: 'Assigned'
            }));

            await marketingService.assignTargetsToTeam(assignments);

            // Update local state
            const newTargetMap = { ...employeeTargets };
            employees.forEach(emp => {
                newTargetMap[emp.emp_id] = parseFloat(globalTarget);
            });
            setEmployeeTargets(newTargetMap);
            setGlobalTarget('');
            alert('Targets assigned successfully to all district employees!');

        } catch (error) {
            console.error('Error assigning targets:', error);
            alert('Failed to assign targets.');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleUpdateIndividual = async (e) => {
        e.preventDefault();
        const { employee, target } = editModalConfig;

        if (!target || isNaN(target) || parseFloat(target) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            const monthStr = selectedMonth.toISOString().split('T')[0].substring(0, 7) + '-01';
            const monthDisplay = `${selectedMonth.getMonth() + 1}/${selectedMonth.getFullYear()}`;

            const assignment = {
                emp_id: employee.emp_id,
                employee_name: employee.full_name,
                branch: employee.branch,
                district: employee.district,
                assigned_by: managerProfile.email,
                target_amount: parseFloat(target),
                target_month: monthStr,
                month_display: monthDisplay,
                assigned_date: new Date().toISOString(),
                status: 'Assigned'
            };

            await marketingService.assignTargetsToTeam([assignment]);

            setEmployeeTargets(prev => ({ ...prev, [employee.emp_id]: parseFloat(target) }));
            setEditModalConfig({ isOpen: false, employee: null, target: '' });
        } catch (error) {
            console.error('Error updating target:', error);
            alert('Failed to update target.');
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.emp_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading Team...</div>;

    return (
        <div className={styles.container}>
            {/* Header Control Panel */}
            <div className={styles.controlPanel}>
                <div className={styles.bulkTargetCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerTitle}>
                            <Target className={styles.headerIcon} />
                            <h3>Bulk Target Assignment</h3>
                        </div>
                        <div className={styles.districtBadge}>District: {managerProfile?.district}</div>
                    </div>

                    <div className={styles.bulkForm}>
                        <div className={styles.formGroup}>
                            <label>Select Month</label>
                            <input
                                type="month"
                                value={selectedMonth.toISOString().substring(0, 7)}
                                onChange={(e) => setSelectedMonth(new Date(e.target.value + '-01'))}
                                className={styles.dateInput}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Monthly Target (Tons)</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="number"
                                    placeholder="Enter Tons"
                                    value={globalTarget}
                                    onChange={(e) => setGlobalTarget(e.target.value)}
                                    className={styles.targetInput}
                                />
                                <span className={styles.unit}>T</span>
                            </div>
                        </div>

                        <button
                            className={styles.assignBtn}
                            onClick={handleAssignToAll}
                            disabled={isAssigning}
                        >
                            {isAssigning ? <RefreshCw className={styles.spin} /> : <Send size={18} />}
                            Assign to All
                        </button>
                    </div>
                </div>

                <div className={styles.summaryCard}>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Total Members</span>
                        <span className={styles.summaryValue}>{employees.length}</span>
                    </div>
                    <div className={styles.summaryDivider}></div>
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Targets Assigned</span>
                        <span className={`${styles.summaryValue} ${Object.keys(employeeTargets).length === employees.length ? styles.textGreen : styles.textOrange}`}>
                            {Object.keys(employeeTargets).length} / {employees.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Employee List Section */}
            <div className={styles.teamSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <Users size={20} />
                        Team Members
                    </h2>
                    <div className={styles.searchBar}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.employeeGrid}>
                    {filteredEmployees.map((emp) => (
                        <div key={emp.emp_id} className={styles.employeeCard}>
                            <div className={styles.empHeader}>
                                <div className={styles.empAvatar}>
                                    {emp.full_name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className={styles.empBasicInfo}>
                                    <h4>{emp.full_name}</h4>
                                    <span>ID: {emp.emp_id}</span>
                                </div>
                                <div className={styles.empStatusBadge}>{emp.status}</div>
                            </div>

                            <div className={styles.empContact}>
                                <div className={styles.contactItem}>
                                    <Mail size={14} /> {emp.email}
                                </div>
                                <div className={styles.contactItem}>
                                    <Phone size={14} /> {emp.phone || 'N/A'}
                                </div>
                                <div className={styles.contactItem}>
                                    <Briefcase size={14} /> {emp.position}
                                </div>
                            </div>

                            <div className={styles.empTargetSection}>
                                <div className={styles.targetInfo}>
                                    <span className={styles.targetLabel}>Target ({selectedMonth.toLocaleString('default', { month: 'short' })})</span>
                                    <span className={employeeTargets[emp.emp_id] ? styles.targetValue : styles.targetMissing}>
                                        {employeeTargets[emp.emp_id] ? `${employeeTargets[emp.emp_id]} Tons` : 'Not Set'}
                                    </span>
                                </div>
                                <button
                                    className={styles.updateTargetBtn}
                                    onClick={() => setEditModalConfig({ isOpen: true, employee: emp, target: employeeTargets[emp.emp_id] || '' })}
                                >
                                    Modify Target
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEmployees.length === 0 && (
                    <div className={styles.emptyState}>
                        <AlertCircle size={48} />
                        <p>No team members found in your district.</p>
                    </div>
                )}
            </div>

            {/* Edit Target Modal */}
            <Modal
                isOpen={editModalConfig.isOpen}
                onClose={() => setEditModalConfig({ isOpen: false, employee: null, target: '' })}
                title={`Set Target for ${editModalConfig.employee?.full_name}`}
            >
                <form onSubmit={handleUpdateIndividual} className="p-6">
                    <div className={modalStyles.formGroup}>
                        <label className={modalStyles.label}>Target Amount (Tons)</label>
                        <div className="relative">
                            <input
                                type="number"
                                className={modalStyles.input}
                                value={editModalConfig.target}
                                onChange={(e) => setEditModalConfig({ ...editModalConfig, target: e.target.value })}
                                required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">T</span>
                        </div>
                    </div>
                    <div className={modalStyles.footer}>
                        <button type="button" className={modalStyles.secondaryBtn} onClick={() => setEditModalConfig({ isOpen: false, employee: null, target: '' })}>Cancel</button>
                        <button type="submit" className={modalStyles.primaryBtn}>Save Target</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TeamManagement;
