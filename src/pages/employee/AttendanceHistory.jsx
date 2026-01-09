import React, { useState, useEffect } from 'react';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/tables.module.css';
import { Calendar, History } from 'lucide-react';

const AttendanceHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const data = await employeeService.getAttendanceHistory();
                setHistory(data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <History size={20} />
                    </div>
                    <h2 className={styles.tableTitle}>Attendance History</h2>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time In</th>
                            <th>Location</th>
                            <th>Selfie</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    Loading history...
                                </td>
                            </tr>
                        ) : history.length > 0 ? (
                            history.map((record, index) => (
                                <tr key={index}>
                                    <td className="font-medium text-gray-900">{record.date}</td>
                                    <td>{record.marked_time}</td>
                                    <td className="text-sm text-gray-500 max-w-xs truncate" title={record.location}>
                                        {record.location}
                                    </td>
                                    <td>
                                        {record.selfie_url ? (
                                            <a href={record.selfie_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                            Present
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    No attendance records found
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
