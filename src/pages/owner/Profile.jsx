import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/owner/profile.module.css';
import {
    Mail,
    Phone,
    Shield,
    Settings,
    LogOut,
    User,
    Home
} from 'lucide-react';

const OwnerProfile = () => {
    const { profile, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to logout?")) {
            await logout();
            navigate('/login');
        }
    };

    if (!profile) return null;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.profileInfo}>
                    <div className={styles.avatar}>
                        {profile.full_name?.charAt(0) || 'O'}
                    </div>
                    <div className={styles.nameSection}>
                        <h1>{profile.full_name}</h1>
                        <p>Managing Director</p>
                        <span className={styles.statusBadge}>Owner Account</span>
                    </div>
                </div>
                <div className="hidden md:block">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                        <Settings size={18} />
                        Edit Profile
                    </button>
                </div>
            </header>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>
                        <Shield size={20} className="text-blue-600" />
                        Account Security
                    </h3>
                    <div className={styles.infoList}>
                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}><Mail size={18} /></div>
                            <div>
                                <p className={styles.itemLabel}>Email Address</p>
                                <p className={styles.itemValue}>{profile.email}</p>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}><Phone size={18} /></div>
                            <div>
                                <p className={styles.itemLabel}>Contact Number</p>
                                <p className={styles.itemValue}>{profile.mobile_number || 'Not provided'}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                            <LogOut size={18} />
                            Change Login Email
                        </button>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>
                        <User size={20} className="text-blue-600" />
                        Organization Details
                    </h3>
                    <div className={styles.infoList}>
                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}><Home size={18} /></div>
                            <div>
                                <p className={styles.itemLabel}>Company Name</p>
                                <p className={styles.itemValue}>Manufacturing Pvt Ltd</p>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}><User size={18} /></div>
                            <div>
                                <p className={styles.itemLabel}>Account Type</p>
                                <p className={styles.itemValue}>System Administrator (Owner)</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            <LogOut size={18} />
                            Logout from System
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerProfile;
