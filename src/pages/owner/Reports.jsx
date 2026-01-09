import { useState, useEffect } from 'react';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/dashboard.module.css';
import modalStyles from '../../components/common/Modal.module.css';
import Modal from '../../components/common/Modal';
import {
    Flag,
    Megaphone,
    Edit,
    Trash2,
    ChevronDown,
    ChevronUp,
    Plus,
    Calendar,
    Briefcase
} from 'lucide-react';
import clsx from 'clsx';

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('targets');
    const [targets, setTargets] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
    const [editModalConfig, setEditModalConfig] = useState({ isOpen: false, data: null });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [targetData, announcementData] = await Promise.all([
                ownerService.getTargets(),
                ownerService.getAnnouncements()
            ]);
            setTargets(targetData);
            setAnnouncements(announcementData);
        } catch (error) {
            console.error('Error fetching reports data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTarget = async (id) => {
        if (window.confirm('Are you sure you want to delete this target?')) {
            // Service delete logic would go here
            setTargets(targets.filter(t => t.id !== id));
        }
    };

    const handleEditTarget = (target) => {
        setEditModalConfig({ isOpen: true, data: { ...target } });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        // Update service logic would go here
        setTargets(targets.map(t => t.id === editModalConfig.data.id ? editModalConfig.data : t));
        setEditModalConfig({ isOpen: false, data: null });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.dashboardHeader}>
                <div className={styles.welcomeText}>
                    <h2>Reports & Management</h2>
                    <p>Track targets and organizational broadcasts</p>
                </div>
            </header>

            {/* Toggle Container */}
            <div className={styles.toggleContainer}>
                <button
                    className={clsx(styles.toggleButton, activeTab === 'targets' && styles.toggleButtonActive)}
                    onClick={() => setActiveTab('targets')}
                >
                    Assigned Targets
                </button>
                <button
                    className={clsx(styles.toggleButton, activeTab === 'announcements' && styles.toggleButtonActive)}
                    onClick={() => setActiveTab('announcements')}
                >
                    Announcements
                </button>
            </div>

            {/* Content Section */}
            <div className="space-y-4">
                {activeTab === 'targets' ? (
                    targets.length > 0 ? (
                        targets.map((target) => (
                            <div key={target.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Flag size={20} className="text-blue-600" />
                                        <h3 className={styles.cardTitle}>
                                            {target.branch === 'All Branches' ? 'Global Target' : `${target.branch} • ${target.month}`}
                                        </h3>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEditTarget(target)}
                                            style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#4b5563' }}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTarget(target.id)}
                                            style={{ padding: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Branch</span>
                                        <span className={styles.value}>{target.branch}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Manager</span>
                                        <span className={styles.value}>{target.manager}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Target Month</span>
                                        <span className={styles.value}>{target.month}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Revenue Goal</span>
                                        <span className={styles.value} style={{ color: '#059669' }}>₹{target.revenue.toLocaleString()}</span>
                                    </div>
                                </div>
                                {target.remarks && (
                                    <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '12px', color: '#4b5563' }}>
                                        <strong>Remarks:</strong> {target.remarks}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.card} style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: '#9ca3af' }}>No targets assigned yet.</p>
                        </div>
                    )
                ) : (
                    announcements.length > 0 ? (
                        announcements.map((ann, index) => (
                            <div key={ann.id || index} className={styles.card}>
                                <div
                                    onClick={() => setExpandedAnnouncement(expandedAnnouncement === index ? null : index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={styles.cardHeader}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Megaphone size={20} className="text-purple-600" />
                                            <h3 className={styles.cardTitle}>Company Announcement</h3>
                                        </div>
                                        {expandedAnnouncement === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                        {ann.time}
                                    </div>
                                    {expandedAnnouncement === index && (
                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', fontSize: '14px', lineHeight: 1.5, color: '#1f2937', fontWeight: 500 }}>
                                            {ann.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.card} style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: '#9ca3af' }}>No announcements sent yet.</p>
                        </div>
                    )
                )}
            </div>

            {/* Edit Target Modal */}
            <Modal
                isOpen={editModalConfig.isOpen}
                onClose={() => setEditModalConfig({ isOpen: false, data: null })}
                title="Edit Assigned Target"
            >
                {editModalConfig.data && (
                    <form onSubmit={handleUpdateSubmit} className="p-4 space-y-4">
                        <div className={modalStyles.formGroup}>
                            <label className={modalStyles.label}>Revenue Target (₹)</label>
                            <input
                                type="number"
                                className={modalStyles.input}
                                value={editModalConfig.data.revenue}
                                onChange={e => setEditModalConfig({
                                    ...editModalConfig,
                                    data: { ...editModalConfig.data, revenue: parseFloat(e.target.value) }
                                })}
                                required
                            />
                        </div>
                        <div className={modalStyles.formGroup}>
                            <label className={modalStyles.label}>Remarks</label>
                            <textarea
                                className={modalStyles.textarea}
                                value={editModalConfig.data.remarks || ''}
                                onChange={e => setEditModalConfig({
                                    ...editModalConfig,
                                    data: { ...editModalConfig.data, remarks: e.target.value }
                                })}
                                rows={3}
                            />
                        </div>
                        <div className={modalStyles.footer} style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button type="button" className={modalStyles.secondaryBtn} onClick={() => setEditModalConfig({ isOpen: false, data: null })}>Cancel</button>
                            <button type="submit" className={modalStyles.primaryBtn}>Save Changes</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default ReportsPage;
