import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/profile.module.css';
import {
    ArrowLeft,
    RefreshCw,
    LogOut,
    Camera,
    Mail,
    Phone,
    Briefcase,
    Calendar,
    MapPin,
    Shield,
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    Edit2,
    Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerProfile = () => {
    const navigate = useNavigate();
    const { profile, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const [isEditing, setIsEditing] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        position: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load dashboard stats for the "Company Overview" tab
            const data = await ownerService.getDashboardData();
            setDashboardData(data);

            // Initialize form data from auth profile
            if (profile) {
                setFormData({
                    full_name: profile.full_name || '',
                    phone: profile.mobile_number || '',
                    position: profile.position || 'Owner'
                });
            }
        } catch (error) {
            console.error("Failed to load profile data", error);
            toast.error("Failed to load company stats");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            await logout();
            navigate('/login');
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        // In a real app, you would call an updateProfile API endpoint here.
        // For now, we'll just toggle edit mode and show a success toast.
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // Optimistically update local display if needed, or reload auth context
    };

    const formatDate = (dateString) => {
        if (!dateString) return new Date().toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <RefreshCw className="animate-spin" size={32} />
                <p className={styles.loadingText}>Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Blue Header Section */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <button className={styles.iconBtn} onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className={styles.headerTitle}>My Profile</h1>
                    <div className="flex gap-2">
                        <button className={styles.iconBtn} onClick={loadData} title="Refresh">
                            <RefreshCw size={20} />
                        </button>
                        <button className={styles.iconBtn} onClick={handleLogout} title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.profileInfo}>
                    <div className="relative">
                        <div className={styles.avatar}>
                            {profile?.full_name?.charAt(0).toUpperCase() || 'O'}
                        </div>
                        {isEditing && (
                            <div className={styles.editBadge}>
                                <Camera size={14} color="#2563eb" />
                            </div>
                        )}
                    </div>

                    <div className={styles.nameSection}>
                        <h2 className={styles.name}>{profile?.full_name || 'Owner'}</h2>
                        <p className={styles.position}>{profile?.position || 'Managing Director'}</p>
                        <div className={styles.statusBadge}>{profile?.status || 'Active'}</div>
                    </div>
                </div>

                {/* ID Card Stats */}
                <div className={styles.idCard}>
                    <div className={styles.idItem}>
                        <span className={styles.idLabel}>Employee ID</span>
                        <span className={styles.idValue}>{profile?.emp_id || 'OWN-001'}</span>
                    </div>
                    <div className={styles.idItem}>
                        <span className={styles.idLabel}>Department</span>
                        <span className={styles.idValue}>Management</span>
                    </div>
                    <div className={styles.idItem}>
                        <span className={styles.idLabel}>Since</span>
                        <span className={styles.idValue}>{formatDate(profile?.created_at).split(' ')[1] + ' ' + formatDate(profile?.created_at).split(' ')[2]}</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabSection}>
                <div className={styles.tabHeader}>
                    <div
                        className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === 'stats' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        Company Overview
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'details' ? (
                    <div className="animate-fadeIn">
                        {isEditing ? (
                            <div className={styles.card}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">Edit Profile Information</h3>
                                    <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                                        Cancel
                                    </button>
                                </div>
                                <form onSubmit={handleSaveProfile}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Full Name</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Phone Number</label>
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Position</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className={styles.saveBtn}>
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className={styles.card}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-gray-800 hidden">Personal Info</h3>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="ml-auto text-blue-600 font-semibold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={14} /> Edit Profile
                                    </button>
                                </div>

                                <InfoRow icon={Mail} label="Email Address" value={profile?.email} />
                                <InfoRow icon={Phone} label="Phone Number" value={profile?.mobile_number || 'Not Provided'} />
                                <InfoRow icon={BusinessIcon} label="Branch" value="Corporate HQ" />
                                <InfoRow icon={MapPin} label="Location" value="Main Office" />
                                <InfoRow icon={Calendar} label="Joining Date" value={formatDate(profile?.created_at)} />
                                <InfoRow icon={Shield} label="Role" value={profile?.role || 'Owner'} />

                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        {/* Summary Cards */}
                        <div className={styles.card}>
                            <div className={styles.metricRow}>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>Total Revenue</span>
                                    <span className={styles.metricValue}>
                                        ₹{(dashboardData?.totalRevenue / 100000).toFixed(1)}L
                                    </span>
                                </div>
                                <div className="w-px bg-gray-200 h-12 mx-4"></div>
                                <div className={styles.metricItem}>
                                    <span className={styles.metricLabel}>Net Profit</span>
                                    <span className={styles.metricValue} style={{ color: '#16a34a' }}>
                                        ₹{(dashboardData?.totalProfit / 1000).toFixed(1)}K
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Metrics */}
                        <div className={styles.card}>
                            <h3 className="text-base font-bold text-gray-800 mb-4">Performance Overview</h3>
                            <div className={styles.metricGrid}>
                                <GridMetric
                                    label="Total Orders"
                                    value={dashboardData?.totalOrders?.toString() || '0'}
                                    icon={ShoppingCart}
                                    color="blue"
                                />
                                <GridMetric
                                    label="Active Staff"
                                    value={dashboardData?.activeEmployees?.toString() || '0'}
                                    icon={Users}
                                    color="purple"
                                />
                                <GridMetric
                                    label="Growth"
                                    value={`${dashboardData?.revenueGrowth > 0 ? '+' : ''}${dashboardData?.revenueGrowth}%`}
                                    icon={TrendingUp}
                                    color="green"
                                />
                                <GridMetric
                                    label="Avg Order"
                                    value={`₹${(dashboardData?.totalRevenue / (dashboardData?.totalOrders || 1) / 1000).toFixed(1)}K`}
                                    icon={DollarSign}
                                    color="orange"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Components
const InfoRow = ({ icon: Icon, label, value }) => (
    <div className={styles.infoRow}>
        <div className={styles.infoIcon}>
            <Icon size={18} />
        </div>
        <div className={styles.infoContent}>
            <p className={styles.infoLabel}>{label}</p>
            <p className={styles.infoValue}>{value || 'N/A'}</p>
        </div>
    </div>
);

const GridMetric = ({ label, value, icon: Icon, color }) => {
    const colors = {
        blue: { bg: '#eff6ff', text: '#2563eb' },
        green: { bg: '#f0fdf4', text: '#16a34a' },
        purple: { bg: '#faf5ff', text: '#9333ea' },
        orange: { bg: '#fff7ed', text: '#ea580c' },
    };
    const theme = colors[color] || colors.blue;

    return (
        <div className={styles.gridItem}>
            <div className="flex justify-between items-start mb-2">
                <span className={styles.gridTitle}>{label}</span>
                <div style={{ backgroundColor: theme.bg, padding: 6, borderRadius: 8 }}>
                    <Icon size={16} color={theme.text} />
                </div>
            </div>
            <span className={styles.gridValue}>{value}</span>
        </div>
    );
};

const BusinessIcon = (props) => (
    <Briefcase {...props} />
);

export default OwnerProfile;
