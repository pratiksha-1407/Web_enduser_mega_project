import { useState, useEffect } from 'react';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/employees.module.css';
import { Search, Plus, Star, MapPin, Users, Briefcase } from 'lucide-react';

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('All Branches');
    const [selectedRole, setSelectedRole] = useState('All Roles');

    // Mock branches based on Flutter repo for visual richness
    const branches = [
        { name: "Pune Branch", district: "Pune", count: 28, manager: "Rajesh Kumar", performance: 4.6 },
        { name: "Mumbai Branch", district: "Mumbai", count: 35, manager: "Priya Sharma", performance: 4.8 },
        { name: "Satara Branch", district: "Satara", count: 18, manager: "Amit Patel", performance: 4.3 },
    ];

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await ownerService.getEmployees();
            setEmployees(data || []);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = (emp.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesBranch = selectedBranch === 'All Branches' || emp.branch_name === selectedBranch;
        const matchesRole = selectedRole === 'All Roles' || emp.role === selectedRole;
        return matchesSearch && matchesBranch && matchesRole;
    });

    const getUniqueBranches = () => {
        const unique = [...new Set(employees.map(e => e.branch_name).filter(Boolean))];
        return ['All Branches', ...unique];
    };

    const getUniqueRoles = () => {
        const unique = [...new Set(employees.map(e => e.role).filter(Boolean))];
        return ['All Roles', ...unique];
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.sectionHeader}>
                <div className={styles.titleSection}>
                    <h2>Employee Management</h2>
                    <p>Monitor performance and manage staff members.</p>
                </div>
                <button className={styles.addButton}>
                    <Plus size={18} />
                    Add New Staff
                </button>
            </div>

            {/* Branch Overview */}
            <div className={styles.card}>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-600" />
                    Branch Overview
                </h3>
                <div className={styles.branchGrid}>
                    {branches.map((branch, i) => (
                        <div key={i} className={styles.branchCard}>
                            <div className={styles.branchHeader}>
                                <span className={styles.branchName}>{branch.name}</span>
                                <div className={styles.rating}>
                                    <Star size={12} fill="currentColor" />
                                    {branch.performance}
                                </div>
                            </div>
                            <div className={styles.branchInfo}>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Users size={14} /> {branch.count} Employees
                                </p>
                                <p className="flex items-center gap-2 text-gray-600 mt-1">
                                    <Briefcase size={14} /> Mgr: {branch.manager}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filtering */}
            <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Name or email..."
                            className={`${styles.select} w-full pl-10`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Branch</label>
                    <select
                        className={styles.select}
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        {getUniqueBranches().map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Role</label>
                    <select
                        className={styles.select}
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                    >
                        {getUniqueRoles().map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Employee List */}
            <div className={styles.card}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Staff Directory</h3>
                    <span className="text-sm font-medium text-gray-500">{filteredEmployees.length} MembersFound</span>
                </div>

                <div className={styles.employeeList}>
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            Loading directory...
                        </div>
                    ) : filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => (
                            <div key={emp.id} className={styles.employeeTile}>
                                <div className={styles.avatar}>
                                    {emp.full_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className={styles.empMainInfo}>
                                    <div className={styles.empName}>{emp.full_name || 'Unknown'}</div>
                                    <div className={styles.empMeta}>
                                        {emp.role} • {emp.branch_name || 'No Branch'}
                                    </div>
                                </div>
                                <div className={styles.empStats}>
                                    <div className={styles.performance}>
                                        <Star size={14} className="text-amber-500" fill="currentColor" />
                                        <span>4.8</span>
                                    </div>
                                    <span className={`${styles.statusBadge} ${emp.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                                        {emp.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 italic">
                            No employees match your search criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;
