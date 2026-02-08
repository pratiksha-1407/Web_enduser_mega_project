import React, { useState, useEffect } from 'react';
import {
    Camera, Mail, Phone, Briefcase, MapPin,
    Calendar, Clock, TrendingUp, LogOut, CheckCircle,
    Shield, Activity, Settings, User, DollarSign,
    Award, BarChart2
} from 'lucide-react';
import { format } from 'date-fns';
import { fetchuserProfile, logoutUser } from '../../../services/production/prodProfileService';
// import '../../index.css';

// --- Colors ---
const colors = {
    primaryBlue: '#2563EB',
    background: '#F3F4F8',
    white: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    success: '#22c55e',
    danger: '#ef4444',
    purple: '#9333ea',
    orange: '#f59e0b',
    border: '#E5E7EB',
};

// --- Helper Components ---

const InfoItem = ({ icon: Icon, label, value }) => (
    <div style={{ padding: '12px 0', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center' }}>
        <div style={{
            padding: '8px',
            backgroundColor: `${colors.primaryBlue}1A`,
            borderRadius: '50%',
            marginRight: '16px'
        }}>
            <Icon size={20} color={colors.primaryBlue} />
        </div>
        <div>
            <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '2px' }}>{label}</div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: colors.textPrimary }}>{value || 'N/A'}</div>
        </div>
    </div>
);

const StatCard = ({ title, value, color }) => (
    <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: colors.textSecondary, marginBottom: '8px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: color }}>{value}%</div>
        <div style={{
            height: '6px',
            backgroundColor: '#E5E7EB',
            borderRadius: '3px',
            marginTop: '4px',
            overflow: 'hidden'
        }}>
            <div style={{
                width: `${Math.min(value, 100)}%`,
                height: '100%',
                backgroundColor: color
            }} />
        </div>
    </div>
);

const MetricRow = ({ title, value, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: colors.textSecondary }}>{title}</span>
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: color }}>{value}</span>
    </div>
);

const IdItem = ({ title, value }) => (
    <div style={{ textAlign: 'center', flex: 1 }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: colors.white }}>{value}</div>
    </div>
);

const Prod_Profile = ({ onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details'); // 'details' or 'stats'

    useEffect(() => {
        const loadProfile = async () => {
            const data = await fetchuserProfile();
            setProfile(data);
            setLoading(false);
        };
        loadProfile();
    }, []);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            if (onLogout) {
                onLogout();
            } else {
                await logoutUser();
                window.location.href = '/login';
            }
        }
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: colors.primaryBlue }}>
                Loading Profile...
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <h3>Profile Not Found</h3>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    // Format Data
    const formattedDate = profile.joining_date
        ? format(new Date(profile.joining_date), 'dd MMMM yyyy')
        : 'N/A';

    const initials = profile.full_name
        ? profile.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'PM';

    // Provide default values if missing
    const performance = profile.performance || 92.0;
    const attendance = profile.attendance || 96.0;

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Header Section */}
            <div style={{
                backgroundColor: colors.primaryBlue,
                borderRadius: '0 0 24px 24px',
                padding: '24px',
                color: colors.white,
                marginBottom: '20px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', marginRight: '20px' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            backgroundColor: colors.white,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '3px solid white',
                            fontSize: '28px', fontWeight: 'bold', color: colors.primaryBlue
                        }}>
                            {/* Initials or Image */}
                            {initials}
                        </div>
                        <button style={{
                            position: 'absolute', bottom: 0, right: 0,
                            backgroundColor: colors.white,
                            borderRadius: '50%', padding: '6px',
                            border: 'none', cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                        }}>
                            <Camera size={16} color={colors.primaryBlue} />
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{profile.full_name || 'User'}</h2>
                            <button
                                onClick={handleLogout}
                                title="Logout"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.white }}
                            >
                                <LogOut size={24} />
                            </button>
                        </div>

                        <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
                            {profile.position || 'Position'}
                        </div>

                        <div style={{
                            display: 'inline-block',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            padding: '4px 12px',
                            marginTop: '8px',
                            fontSize: '12px', fontWeight: 600
                        }}>
                            {profile.status || 'Active'}
                        </div>
                    </div>
                </div>

                {/* ID Card */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <IdItem title="Employee ID" value={profile.emp_id || profile.id?.substring(0, 8) || 'N/A'} />
                    <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    <IdItem title="Department" value={profile.department || 'Production'} />
                    <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    <IdItem title="Since" value={profile.joining_date ? format(new Date(profile.joining_date), 'MMM yyyy') : 'N/A'} />
                </div>
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 16px' }}>
                <div style={{
                    backgroundColor: colors.white,
                    borderRadius: '12px',
                    padding: '4px',
                    display: 'flex',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <button
                        onClick={() => setActiveTab('details')}
                        style={{
                            flex: 1, padding: '10px',
                            border: 'none', borderRadius: '8px',
                            backgroundColor: activeTab === 'details' ? colors.primaryBlue : 'transparent',
                            color: activeTab === 'details' ? colors.white : colors.textSecondary,
                            fontWeight: 600, cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        style={{
                            flex: 1, padding: '10px',
                            border: 'none', borderRadius: '8px',
                            backgroundColor: activeTab === 'stats' ? colors.primaryBlue : 'transparent',
                            color: activeTab === 'stats' ? colors.white : colors.textSecondary,
                            fontWeight: 600, cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Production Stats
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'details' ? (
                    <div style={{
                        backgroundColor: colors.white,
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                        <InfoItem icon={Mail} label="Email" value={profile.email} />
                        <InfoItem icon={Phone} label="Phone" value={profile.phone} />
                        <InfoItem icon={MapPin} label="Branch" value={profile.branch || 'Headquarters'} />
                        <InfoItem icon={Briefcase} label="Department" value={profile.department || 'Production'} />
                        <InfoItem icon={Calendar} label="Joining Date" value={formattedDate} />
                        <InfoItem icon={User} label="Role" value={profile.role || 'User'} />
                        <InfoItem icon={Clock} label="Shift" value={profile.shift || 'Day'} />
                        <InfoItem icon={TrendingUp} label="Experience" value={profile.experience || 'N/A'} />
                        {profile.salary > 0 && (
                            <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                                <div style={{ padding: '8px', backgroundColor: `${colors.primaryBlue}1A`, borderRadius: '50%', marginRight: '16px' }}>
                                    <DollarSign size={20} color={colors.primaryBlue} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '2px' }}>Salary</div>
                                    <div style={{ fontSize: '15px', fontWeight: 500, color: colors.textPrimary }}>₹{profile.salary}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Attendance & Performance */}
                        <div style={{
                            backgroundColor: colors.white,
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            display: 'flex', gap: '20px'
                        }}>
                            <StatCard title="Performance" value={performance} color={colors.primaryBlue} />
                            <div style={{ width: '1px', backgroundColor: colors.border }} />
                            <StatCard title="Attendance" value={attendance} color={colors.success} />
                        </div>

                        {/* Additional Metrics */}
                        <div style={{
                            backgroundColor: colors.white,
                            borderRadius: '16px',
                            padding: '20px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                        }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', marginTop: 0 }}>Production Performance</h3>
                            <MetricRow title="Quality Rate" value="98.5%" color={colors.success} />
                            <MetricRow title="Efficiency" value="94%" color={colors.primaryBlue} />
                            <MetricRow title="Machine Uptime" value="96%" color={colors.orange} />
                            <MetricRow title="Safety Score" value="99%" color={colors.purple} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prod_Profile;
