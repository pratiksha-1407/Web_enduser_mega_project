import React, { useState, useEffect, useMemo } from 'react';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/employees.module.css';
import { Filter, RefreshCw, X, User, Users, Phone, Mail, MapPin, Calendar, Briefcase } from 'lucide-react';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const loadEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ownerService.getEmployees();
            setEmployees(data);
        } catch (err) {
            console.error("Failed to load employees", err);
            setError("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        if (selectedStatus === 'All') return employees;
        return employees.filter(emp => {
            const status = (emp.status || 'Active').toLowerCase();
            return status === selectedStatus.toLowerCase();
        });
    }, [employees, selectedStatus]);

    const getStatusColor = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'active': return '#16a34a'; // green-600
            case 'inactive': return '#dc2626'; // red-600
            default: return '#6b7280'; // gray-500
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Employee Details</h1>
                <div className={styles.headerActions}>
                    <button
                        className={styles.iconButton}
                        onClick={() => setShowFilter(!showFilter)}
                        title="Filter"
                    >
                        <Filter size={20} />
                    </button>
                    <button
                        className={styles.iconButton}
                        onClick={loadEmployees}
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Filter Dropdown (Simple implementation) */}
            {showFilter && (
                <div className="bg-white p-4 rounded-lg shadow-lg mb-4 border border-gray-100 absolute right-6 top-20 z-10 w-48">
                    <p className="font-semibold mb-2 text-sm text-gray-600">Filter by Status</p>
                    {['All', 'Active', 'Inactive'].map(status => (
                        <div
                            key={status}
                            className={`p-2 rounded cursor-pointer text-sm ${selectedStatus === status ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                            onClick={() => {
                                setSelectedStatus(status);
                                setShowFilter(false);
                            }}
                        >
                            {status}
                        </div>
                    ))}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className={styles.loading}>
                    <RefreshCw size={32} className="animate-spin text-blue-500 mb-2" />
                    <p>Loading employees...</p>
                </div>
            ) : error ? (
                <div className={styles.error}>
                    <p className="text-red-500 mb-2">{error}</p>
                    <button onClick={loadEmployees} className={styles.retryBtn}>Retry</button>
                </div>
            ) : filteredEmployees.length === 0 ? (
                <div className={styles.empty}>
                    <Users size={48} className="text-gray-300 mb-2" />
                    <p>No employees found</p>
                </div>
            ) : (
                <>
                    {/* Summary Bar */}
                    <div className={styles.summaryBar}>
                        <span className={styles.summaryText}>{filteredEmployees.length} Employees</span>
                        <div
                            className={styles.activeFilter}
                            style={{
                                backgroundColor: `${getStatusColor(selectedStatus)}15`,
                                color: getStatusColor(selectedStatus)
                            }}
                        >
                            {selectedStatus}
                        </div>
                    </div>

                    {/* Employee List */}
                    <div className={styles.list}>
                        {filteredEmployees.map(emp => (
                            <div
                                key={emp.id}
                                className={styles.card}
                                onClick={() => setSelectedEmployee(emp)}
                            >
                                <div className={styles.avatar}>
                                    {(emp.name || emp.full_name || 'E').charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.info}>
                                    <h3 className={styles.name}>{emp.name || emp.full_name || 'Unknown'}</h3>
                                    <div className={styles.subInfo}>
                                        <p className={styles.email}>{emp.email || 'N/A'}</p>
                                        <div className={styles.detailsRow}>
                                            <span className={styles.badge}>{emp.district || 'Not assigned'}</span>
                                            <span className={styles.date}>{formatDate(emp.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.trailing}>
                                    <div
                                        className={styles.statusPill}
                                        style={{
                                            backgroundColor: `${getStatusColor(emp.status)}15`,
                                            color: getStatusColor(emp.status)
                                        }}
                                    >
                                        <div
                                            className={styles.statusDot}
                                            style={{ backgroundColor: getStatusColor(emp.status) }}
                                        />
                                        <span>{emp.status || 'Active'}</span>
                                    </div>
                                    <span className={styles.phone}>{emp.phone || ''}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Employee Details Modal */}
            {selectedEmployee && (
                <div className={styles.modalOverlay} onClick={() => setSelectedEmployee(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Employee Details</h2>
                            <button className={styles.closeButton} onClick={() => setSelectedEmployee(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.largeAvatar}>
                            {(selectedEmployee.name || selectedEmployee.full_name || 'E').charAt(0).toUpperCase()}
                        </div>

                        <DetailRow label="Name" value={selectedEmployee.name || selectedEmployee.full_name || 'Unknown'} icon={User} />
                        <DetailRow label="Email" value={selectedEmployee.email || 'N/A'} icon={Mail} />
                        <DetailRow label="Phone" value={selectedEmployee.phone || 'N/A'} icon={Phone} />
                        <DetailRow label="District" value={selectedEmployee.district || 'Not assigned'} icon={MapPin} />
                        <DetailRow label="Role" value={selectedEmployee.role || 'Employee'} icon={Briefcase} />
                        <DetailRow label="Status" value={selectedEmployee.status || 'Active'} icon={null} />
                        <DetailRow label="Join Date" value={formatDate(selectedEmployee.created_at)} icon={Calendar} />

                        <button className={styles.modalCloseBtn} onClick={() => setSelectedEmployee(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailRow = ({ label, value, icon: Icon }) => (
    <div className={styles.detailRow}>
        <div style={{ width: 120, display: 'flex', alignItems: 'center', gap: 8, color: '#4b5563' }}>
            {Icon && <Icon size={16} />}
            <span className={styles.detailLabel}>{label}:</span>
        </div>
        <span className={styles.detailValue}>{value}</span>
    </div>
);

export default Employees;
