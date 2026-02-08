import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import styles from '../../styles/marketing/profile.module.css'; // Reuse marketing profile styles
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building,
    Briefcase,
    LogOut,
    Award,
    TrendingUp,
    Activity
} from 'lucide-react';
import { marketingService } from '../../services/marketingService'; // Generic profile fetch

const ProductionProfile = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Reuse existing profile fetch as it targets emp_profile
                const data = await marketingService.getProfile(user.id);
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    if (loading) return <div>Loading Profile...</div>;
    if (!profile) return <div>Profile not found.</div>;

    // Production Specific Stats (Mocked or derived if available)
    const stats = [
        { label: 'Plant Efficiency', value: '94.2%', color: '#10b981', icon: Activity },
        { label: 'Production Vol', value: '450 T', color: '#2563eb', icon: TrendingUp },
        { label: 'Quality Score', value: '98/100', color: '#8b5cf6', icon: Award },
    ];

    return (
        <div className={styles.container}>
            {/* Profile Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            {profile.full_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className={styles.nameInfo}>
                            <h1>{profile.full_name}</h1>
                            <span className={styles.designation}>{profile.position}</span>
                            <div className={styles.statusBadge}>{profile.status || 'Active'}</div>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* ID Card Stats */}
                <div className={styles.idCardGrid}>
                    <div className={styles.idItem}>
                        <span className={styles.idLabel}>Employee ID</span>
                        <span className={styles.idValue}>{profile.emp_id}</span>
                    </div>
                    <div className={styles.idItem}>
                        <span className={styles.idLabel}>Branch</span>
                        <span className={styles.idValue}>{profile.branch}</span>
                    </div>
                    <div className={styles.idItem}>
                        <span className={styles.idLabel}>District</span>
                        <span className={styles.idValue}>{profile.district}</span>
                    </div>
                    <div className={styles.idItem}>
                        <span className={styles.idLabel}>Member Since</span>
                        <span className={styles.idValue}>
                            {new Date(profile.joining_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Performance Stats Row */}
            <div className={styles.statsRow}>
                {stats.map((stat, idx) => (
                    <div key={idx} className={styles.statMiniCard}>
                        <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={20} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <span className={styles.statValue}>{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs Section */}
            <div className={styles.tabsSection}>
                <div className={styles.tabList}>
                    <button
                        className={`${styles.tabItem} ${activeTab === 'details' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Detailed Information
                    </button>
                    <button
                        className={`${styles.tabItem} ${activeTab === 'performance' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Performance Analytics
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'details' ? (
                        <div className={styles.detailsGrid}>
                            <div className={styles.infoGroup}>
                                <div className={styles.groupIcon}><Mail size={20} /></div>
                                <div className={styles.groupText}>
                                    <label>Email Address</label>
                                    <p>{profile.email}</p>
                                </div>
                            </div>
                            <div className={styles.infoGroup}>
                                <div className={styles.groupIcon}><Phone size={20} /></div>
                                <div className={styles.groupText}>
                                    <label>Phone Number</label>
                                    <p>{profile.phone || 'Not Provided'}</p>
                                </div>
                            </div>
                            <div className={styles.infoGroup}>
                                <div className={styles.groupIcon}><Building size={20} /></div>
                                <div className={styles.groupText}>
                                    <label>Work Location</label>
                                    <p>{profile.branch}, {profile.district}</p>
                                </div>
                            </div>
                            <div className={styles.infoGroup}>
                                <div className={styles.groupIcon}><Briefcase size={20} /></div>
                                <div className={styles.groupText}>
                                    <label>Department</label>
                                    <p>Production & Manufacturing</p>
                                </div>
                            </div>
                            <div className={styles.infoGroup}>
                                <div className={styles.groupIcon}><Calendar size={20} /></div>
                                <div className={styles.groupText}>
                                    <label>Date of Joining</label>
                                    <p>{new Date(profile.joining_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.performanceTab}>
                            <div className={styles.metricItem}>
                                <div className={styles.metricHeader}>
                                    <span>Plant Uptime</span>
                                    <span>98%</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: '98%' }}></div>
                                </div>
                            </div>
                            <div className={styles.metricItem}>
                                <div className={styles.metricHeader}>
                                    <span>Safety Compliance</span>
                                    <span>100%</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: '100%', backgroundColor: '#10b981' }}></div>
                                </div>
                            </div>
                            <div className={styles.metricItem}>
                                <div className={styles.metricHeader}>
                                    <span>Maintenance Schedule</span>
                                    <span>On Track</span>
                                </div>
                                <div className={styles.progressTrack}>
                                    <div className={styles.progressFill} style={{ width: '100%', backgroundColor: '#8b5cf6' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductionProfile;
