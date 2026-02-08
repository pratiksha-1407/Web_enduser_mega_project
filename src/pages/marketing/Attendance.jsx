import React, { useState, useEffect } from 'react';
import styles from '../../styles/marketing/dashboard.module.css'; // Reusing dashboard styles for consistency
import { marketingService } from '../../services/marketingService';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, UserCheck, Clock, CheckCircle } from 'lucide-react';

const ManagerAttendancePage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Placeholder for attendance functionality
    // in a real app, this would fetch attendance logs and allow marking in/out

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar className="text-blue-600" />
                    Manager Attendance
                </h2>

                <div style={{
                    padding: '20px',
                    background: '#f0f9ff',
                    borderRadius: '12px',
                    border: '1px solid #bae6fd',
                    marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '14px', color: '#0369a1', marginBottom: '4px' }}>Current Date</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c4a6e' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', color: '#0369a1', marginBottom: '4px' }}>Time</div>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0c4a6e' }}>
                                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <button style={{
                        padding: '16px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <UserCheck size={24} />
                        Mark Check-In
                    </button>

                    <button style={{
                        padding: '16px',
                        background: 'white',
                        color: '#4b5563',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <LogOutIcon size={24} />
                        Mark Check-Out
                    </button>
                </div>

                <div style={{ marginTop: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Recent History</h3>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} style={{
                                padding: '12px 16px',
                                borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '32px', height: '32px',
                                        background: '#dcfce7', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <CheckCircle size={16} className="text-green-600" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '500', fontSize: '14px' }}>Present</div>
                                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: '#374151' }}>
                                    09:00 AM - 06:00 PM
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LogOutIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

export default ManagerAttendancePage;
