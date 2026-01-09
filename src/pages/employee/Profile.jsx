import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/profile.module.css';
import {
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    DollarSign,
    Lock,
    HelpCircle,
    User,
    Camera
} from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (user) {
            const data = await employeeService.loadEmployeeProfile();
            setProfile(data);
            setFormData(data || {});
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const publicUrl = await employeeService.uploadProfileImage(file);
            // Immediately update profile with new image
            await employeeService.updateEmployeeProfile(profile.id, { profile_image: publicUrl });
            setProfile(prev => ({ ...prev, profile_image: publicUrl }));
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Failed to upload image.");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = {
                full_name: formData.full_name,
                phone: formData.phone,
                position: formData.position,
                updated_at: new Date().toISOString()
            };
            const updatedProfile = await employeeService.updateEmployeeProfile(profile.id, updates);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            await logout();
            navigate('/login');
        }
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!profile) return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className={styles.infoItem}>
            <div className={styles.iconBox}>
                <Icon size={20} />
            </div>
            <div className={styles.itemContent}>
                <h5>{label}</h5>
                <p>{value || 'N/A'}</p>
            </div>
        </div>
    );

    const MetricCard = ({ title, value, color }) => (
        <div className={styles.metric}>
            <div className={styles.metricTitle}>{title}</div>
            <div className={styles.metricValue} style={{ color }}>{value}%</div>
            <div className={styles.metricBar}>
                <div
                    className={styles.metricFill}
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.profileInfo}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.avatar}>
                            {profile.profile_image ? (
                                <img src={profile.profile_image} alt="Profile" className={styles.avatarImg} />
                            ) : (
                                <span>{profile.full_name?.substring(0, 2).toUpperCase() || 'EM'}</span>
                            )}
                        </div>
                        {isEditing && (
                            <label className={styles.editIcon}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Camera size={16} />
                            </label>
                        )}
                    </div>
                    <div className={styles.nameSection}>
                        <h1>{profile.full_name}</h1>
                        <p>{profile.position || 'Employee'}</p>
                        <span className={styles.statusBadge}>{profile.status || 'Active'}</span>
                    </div>
                </div>

                {/* Floating ID Card */}
                <div className={styles.idCard}>
                    <div className={styles.idItem}>
                        <h4>Employee ID</h4>
                        <p>{profile.emp_id || 'N/A'}</p>
                    </div>
                    <div className={styles.idItem}>
                        <h4>Department</h4>
                        <p>{profile.department || 'General'}</p>
                    </div>
                    <div className={styles.idItem}>
                        <h4>Since</h4>
                        <p>{profile.joining_date ? new Date(profile.joining_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.content}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    <div
                        className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </div>
                    <div
                        className={`${styles.tab} ${activeTab === 'performance' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Performance
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'details' ? (
                    <div className={styles.card}>

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Profile Information</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-600 font-semibold text-sm hover:underline"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                {/* Read Only Fields */}
                                <div className="opacity-60 pointer-events-none">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                                    <input type="text" value={profile.email} readOnly className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg" />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData(profile);
                                        }}
                                        className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <InfoItem icon={Mail} label="Email Address" value={profile.email} />
                                <InfoItem icon={Phone} label="Phone Number" value={profile.phone} />
                                <InfoItem icon={MapPin} label="District" value={profile.district} />
                                <InfoItem icon={Briefcase} label="Branch" value={profile.branch} />
                                <InfoItem icon={Calendar} label="Joining Date" value={formatDate(profile.joining_date)} />
                                {profile.role && <InfoItem icon={User} label="Role" value={profile.role} />}
                                {profile.salary > 0 && <InfoItem icon={DollarSign} label="Salary" value={`₹${profile.salary}`} />}
                            </>
                        )}

                        {!isEditing && (
                            <div className={styles.actionButtons}>
                                <button className={styles.outlineBtn}>
                                    <Lock size={16} /> Change Password
                                </button>
                                <button className={styles.outlineBtn} onClick={handleLogout}>
                                    <HelpCircle size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Performance Metrics */}
                        <div className={styles.card}>
                            <div className={styles.metricsRow}>
                                <MetricCard
                                    title="Performance"
                                    value={profile.performance || 85.0} // Fallback as per Flutter
                                    color="#007bff"
                                />
                                <MetricCard
                                    title="Attendance"
                                    value={profile.attendance || 95.0} // Fallback as per Flutter
                                    color="#22c55e"
                                />
                            </div>
                        </div>

                        {/* Detailed Metrics */}
                        <div className={styles.card}>
                            <h3 className="font-bold text-gray-800 mb-4">Employee Performance</h3>
                            <div className={styles.employeeMetric}>
                                <span className={styles.empMetricTitle}>Task Completion</span>
                                <span className={styles.empMetricValue} style={{ color: '#22c55e' }}>92.5%</span>
                            </div>
                            <div className={styles.employeeMetric}>
                                <span className={styles.empMetricTitle}>Work Quality</span>
                                <span className={styles.empMetricValue} style={{ color: '#f97316' }}>88%</span>
                            </div>
                            <div className={styles.employeeMetric}>
                                <span className={styles.empMetricTitle}>Team Collaboration</span>
                                <span className={styles.empMetricValue} style={{ color: '#a855f7' }}>95%</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
