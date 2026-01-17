import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { employeeService } from '../../services/employeeService';
import profileStyles from '../../styles/employee/profile.module.css';
import formStyles from '../../styles/employee/forms.module.css';
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
            // Only update fields that are safe to update. 400 Error indicates bad request, likely schema/policy mismatch.
            // Removing 'position' and 'updated_at' for now to be safe, assuming only phone is editable by employee or admin manages rest.
            // But let's try just phone and name if name is editable.
            const updates = {};
            if (formData.phone !== profile.phone) updates.phone = formData.phone;
            if (formData.full_name !== profile.full_name) updates.full_name = formData.full_name;
            // if (formData.position !== profile.position) updates.position = formData.position; // Commenting out potential conflict

            if (Object.keys(updates).length === 0) {
                setIsEditing(false);
                return;
            }

            updates.updated_at = new Date().toISOString();

            const updatedProfile = await employeeService.updateEmployeeProfile(profile.id, updates);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Save failed:", error);
            alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!profile) return <div className={profileStyles.loadingContainer}>Loading Profile...</div>;

    const InfoItem = ({ icon: Icon, label, value }) => (
        <div className={profileStyles.infoItem}>
            <div className={profileStyles.iconBox}>
                <Icon size={20} />
            </div>
            <div className={profileStyles.itemContent}>
                <h5>{label}</h5>
                <p>{value || 'N/A'}</p>
            </div>
        </div>
    );

    const MetricCard = ({ title, value, color }) => (
        <div className={profileStyles.metric}>
            <div className={profileStyles.metricTitle}>{title}</div>
            <div className={profileStyles.metricValue} style={{ color }}>{value}%</div>
            <div className={profileStyles.metricBar}>
                <div
                    className={profileStyles.metricFill}
                    style={{ width: `${value}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );

    return (
        <div className={profileStyles.container}>
            {/* Header Section */}
            <header className={profileStyles.header}>
                <div className={profileStyles.profileInfo}>
                    <div className={profileStyles.avatarContainer}>
                        <div className={profileStyles.avatar}>
                            {profile.profile_image ? (
                                <img src={profile.profile_image} alt="Profile" className={profileStyles.avatarImg} />
                            ) : (
                                <span>{profile.full_name?.substring(0, 2).toUpperCase() || 'EM'}</span>
                            )}
                        </div>
                        {isEditing && (
                            <label className={profileStyles.editIcon}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <Camera size={16} />
                            </label>
                        )}
                    </div>
                    <div className={profileStyles.nameSection}>
                        <h1>{profile.full_name}</h1>
                        <p>{profile.position || 'Employee'}</p>
                        <span className={profileStyles.statusBadge}>{profile.status || 'Active'}</span>
                    </div>
                </div>

                <div className={profileStyles.idCard}>
                    <div className={profileStyles.idItem}>
                        <h4>Employee ID</h4>
                        <p>{profile.emp_id || 'N/A'}</p>
                    </div>
                    <div className={profileStyles.idItem}>
                        <h4>Department</h4>
                        <p>{profile.department || 'General'}</p>
                    </div>
                    <div className={profileStyles.idItem}>
                        <h4>Since</h4>
                        <p>{profile.joining_date ? new Date(profile.joining_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}</p>
                    </div>
                </div>
            </header>

            <div className={profileStyles.content}>
                <div className={profileStyles.tabs}>
                    <div
                        className={`${profileStyles.tab} ${activeTab === 'details' ? profileStyles.activeTab : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </div>
                    <div
                        className={`${profileStyles.tab} ${activeTab === 'performance' ? profileStyles.activeTab : ''}`}
                        onClick={() => setActiveTab('performance')}
                    >
                        Performance
                    </div>
                </div>

                {activeTab === 'details' ? (
                    <div className={profileStyles.card}>
                        <div className={profileStyles.sectionHeader}>
                            <h3 className={profileStyles.cardTitle}>Profile Information</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={profileStyles.editButton}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className={formStyles.formGroup} style={{ gap: '20px' }}>
                                <div className={formStyles.formGroup}>
                                    <label className={formStyles.label}>Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name || ''}
                                        onChange={handleInputChange}
                                        className={formStyles.input}
                                    />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label className={formStyles.label}>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                        className={formStyles.input}
                                    />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label className={formStyles.label}>Position (Read Only)</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={formData.position || ''}
                                        readOnly
                                        className={formStyles.input}
                                        style={{ backgroundColor: '#F3F4F6' }}
                                    />
                                </div>
                                <div className={formStyles.formGroup}>
                                    <label className={formStyles.label}>Email (Read Only)</label>
                                    <input
                                        type="text"
                                        value={profile.email}
                                        readOnly
                                        className={formStyles.input}
                                        style={{ backgroundColor: '#F3F4F6' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className={formStyles.submitBtn}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData(profile);
                                        }}
                                        className={profileStyles.outlineBtn}
                                        style={{ justifyContent: 'center', flex: 1 }}
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
                            <div className={profileStyles.actionButtons}>
                                <button className={profileStyles.outlineBtn}>
                                    <Lock size={16} /> Change Password
                                </button>
                                <button className={profileStyles.outlineBtn} onClick={handleLogout}>
                                    <HelpCircle size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className={profileStyles.card}>
                            <div className={profileStyles.metricsRow}>
                                <MetricCard
                                    title="Performance"
                                    value={profile.performance || 85.0} // Fallback
                                    color="#007bff"
                                />
                                <MetricCard
                                    title="Attendance"
                                    value={profile.attendance || 95.0} // Fallback
                                    color="#22c55e"
                                />
                            </div>
                        </div>

                        <div className={profileStyles.card}>
                            <h3 className={profileStyles.cardTitle}>Employee Performance</h3>
                            <div className={profileStyles.employeeMetric}>
                                <span className={profileStyles.empMetricTitle}>Task Completion</span>
                                <span className={profileStyles.empMetricValue} style={{ color: '#22c55e' }}>92.5%</span>
                            </div>
                            <div className={profileStyles.employeeMetric}>
                                <span className={profileStyles.empMetricTitle}>Work Quality</span>
                                <span className={profileStyles.empMetricValue} style={{ color: '#f97316' }}>88%</span>
                            </div>
                            <div className={profileStyles.employeeMetric}>
                                <span className={profileStyles.empMetricTitle}>Team Collaboration</span>
                                <span className={profileStyles.empMetricValue} style={{ color: '#a855f7' }}>95%</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
