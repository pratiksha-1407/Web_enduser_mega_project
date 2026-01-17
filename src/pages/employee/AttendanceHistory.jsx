import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import styles from '../../styles/employee/tables.module.css';
import { Calendar, History, MapPin, Clock, LogOut, Filter, RefreshCw } from 'lucide-react';

const AttendanceHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [error, setError] = useState(null);

    const loadHistory = async (month) => {
        setLoading(true);
        setError(null);
        try {
            const data = await attendanceService.getAttendanceHistory(month);
            setHistory(data || []);
        } catch (error) {
            console.error(error);
            setError("Failed to load attendance records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory(selectedMonth);
    }, [selectedMonth]);

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const isToday = (dateString) => {
        const today = new Date().toISOString().split('T')[0];
        return dateString === today;
    };

    // Generate last 12 months for filter
    const monthOptions = [];
    const date = new Date();
    for (let i = 0; i < 12; i++) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const value = d.toISOString().slice(0, 7); // YYYY-MM
        const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthOptions.push({ value, label });
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconWrapper}>
                        <History size={20} />
                    </div>
                    <div>
                        <h2 className={styles.tableTitle}>Attendance History</h2>
                        <p className={styles.tableSubtitle}>View check-in and check-out records</p>
                    </div>
                </div>

                <div className={styles.actionsGroup}>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-gray-400" />
                        <select
                            className={styles.filterSelect}
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            <option value="">All Months</option>
                            {monthOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className={styles.refreshBtn}
                        onClick={() => loadHistory(selectedMonth)}
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Clock In</th>
                            <th>Clock Out</th>
                            <th>Status</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className={styles.centerMessage}>
                                    <div className="flex justify-center mb-2">
                                        <div className={styles.loadingSpinner}></div>
                                    </div>
                                    Loading attendance records...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className={styles.centerMessage}>
                                    <span className="text-red-500">{error}</span>
                                </td>
                            </tr>
                        ) : history.length > 0 ? (
                            history.map((record, index) => {
                                const todayClass = isToday(record.date) ? styles.highlightRow : '';
                                return (
                                    <tr key={index} className={todayClass}>
                                        <td>
                                            <div className={styles.flexCell}>
                                                <Calendar size={14} color="#9CA3AF" />
                                                <span className={styles.primaryText}>
                                                    {new Date(record.date).toLocaleDateString('en-GB', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </span>
                                                {isToday(record.date) && (
                                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">Today</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.flexCell}>
                                                <Clock size={14} color="#22c55e" />
                                                <span className={styles.monoText}>{record.clock_in || '-'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.flexCell}>
                                                <LogOut size={14} color="#f59e0b" />
                                                <span className={styles.monoText}>{record.clock_out && record.clock_out !== '-' ? record.clock_out : '--:--'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusPill} ${record.status === 'Absent' ? styles.statusCancelled : styles.statusSuccess}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.flexCell} title={record.location}>
                                                <MapPin size={14} color="#9CA3AF" />
                                                <span className={styles.secondaryText}>
                                                    {record.location?.length > 25
                                                        ? record.location.substring(0, 25) + '...'
                                                        : (record.location || 'Unknown')}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.centerMessage}>
                                    No attendance records found for this period.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceHistory;
