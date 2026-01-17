import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/employee/layout.module.css';
import {
    LayoutDashboard,
    PlusSquare,
    ShoppingBag,
    Clock,
    CheckCircle,
    User,
    LogOut,
    CalendarCheck,
    History,
    Package,
    Menu,
    X,
    ChevronRight,
    AlignLeft
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const EmployeeLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    // Fetch basic profile info
    useEffect(() => {
        const fetchProfile = async () => {
            if (user?.id) {
                const { data } = await supabase
                    .from('emp_profile')
                    .select('full_name, position')
                    .eq('user_id', user.id)
                    .maybeSingle();
                if (data) setProfile(data);
            }
        };
        fetchProfile();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('create-order')) return 'Create New Order';
        if (path.includes('inventory')) return 'Inventory Management';
        if (path.includes('orders/total')) return 'Orders Management';
        if (path.includes('orders/pending')) return 'Pending Orders';
        if (path.includes('orders/completed')) return 'Completed Orders';
        if (path.includes('attendance/mark')) return 'Mark Attendance';
        if (path.includes('attendance/history')) return 'Attendance History';
        if (path.includes('profile')) return 'My Profile';
        return 'Dashboard';
    };

    const NavItem = ({ to, icon: Icon, label, end }) => (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
            }
            onClick={() => setSidebarOpen(false)}
        >
            <Icon size={18} />
            <span>{label}</span>
        </NavLink>
    );

    return (
        <div className={styles.layout}>
            {/* Mobile Header Overlay */}
            <div
                className={`${styles.mobileOverlay} ${isSidebarOpen ? styles.show : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.userAvatar}>
                        {profile?.full_name?.charAt(0) || user?.fullName?.charAt(0) || 'E'}
                    </div>
                    <div className={styles.userInfo}>
                        <h3>{profile?.full_name || user?.fullName || 'Employee'}</h3>
                        <p>{profile?.position || 'Staff Member'}</p>
                    </div>
                    <button className={styles.closeSidebarBtn} onClick={toggleSidebar}>
                        <X size={20} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    <div className={styles.navSectionTitle}>Overview</div>
                    <NavItem to="/employee" end icon={LayoutDashboard} label="Dashboard" />

                    <div className={styles.navSectionTitle}>Operations</div>
                    <NavItem to="/employee/create-order" icon={PlusSquare} label="New Order" />
                    <NavItem to="/employee/inventory" icon={Package} label="Inventory" />

                    <div className={styles.navSectionTitle}>Orders</div>
                    <NavItem to="/employee/orders/total" icon={ShoppingBag} label="All Orders" />
                    <NavItem to="/employee/orders/pending" icon={Clock} label="Pending" />
                    <NavItem to="/employee/orders/completed" icon={CheckCircle} label="Completed" />

                    <div className={styles.navSectionTitle}>Workforce</div>
                    <NavItem to="/employee/attendance/mark" icon={CalendarCheck} label="Attendance" />
                    <NavItem to="/employee/attendance/history" icon={History} label="History" />

                    <div className={styles.navSectionTitle}>Account</div>
                    <NavItem to="/employee/profile" icon={User} label="My Profile" />
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <div className={styles.logoutContent}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </div>
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {/* Top Header */}
                <header className={styles.topBar}>
                    <div className={styles.headerLeft}>
                        <button className={styles.mobileMenuBtn} onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
                            <div className={styles.breadcrumbs}>
                                Employee Portal <ChevronRight size={12} className={styles.chevronIcon} /> {getPageTitle()}
                            </div>
                        </div>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.dateDisplay}>
                            <div className={styles.dateText}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                            <div className={styles.activeStatus}>System Active</div>
                        </div>
                    </div>
                </header>

                <div className={styles.contentContainer}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default EmployeeLayout;
