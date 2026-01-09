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
    X
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const EmployeeLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
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

    const NavItem = ({ to, icon: Icon, label, end }) => (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.activeNavItem : ''}`
            }
            onClick={() => setSidebarOpen(false)} // Close on mobile on click
        >
            <Icon size={20} />
            <span>{label}</span>
        </NavLink>
    );

    return (
        <div className={styles.layout}>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b px-4 flex items-center justify-between z-40">
                <button onClick={toggleSidebar}>
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>
                <span className="font-bold text-lg">Employee Portal</span>
                <div className="w-6" /> {/* Spacer */}
            </div>

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <User size={24} />
                    </div>
                    <div className={styles.userInfo}>
                        <h3>{profile?.full_name || user?.fullName || 'Employee'}</h3>
                        <p>{profile?.position || user?.role || 'Staff'}</p>
                    </div>
                </div>

                <nav className={styles.nav}>
                    <NavItem to="/employee" end icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/employee/create-order" icon={PlusSquare} label="Create Order" />
                    <NavItem to="/employee/inventory" icon={Package} label="Inventory" />

                    <div className={styles.navSectionTitle}>Orders</div>
                    <NavItem to="/employee/orders/total" icon={ShoppingBag} label="Total Orders" />
                    <NavItem to="/employee/orders/pending" icon={Clock} label="Pending Orders" />
                    <NavItem to="/employee/orders/completed" icon={CheckCircle} label="Completed Orders" />

                    <div className={styles.navSectionTitle}>Attendance</div>
                    <NavItem to="/employee/attendance/mark" icon={CalendarCheck} label="Mark Attendance" />
                    <NavItem to="/employee/attendance/history" icon={History} label="History" />

                    <div className={styles.navSectionTitle}>Account</div>
                    <NavItem to="/employee/profile" icon={User} label="Profile" />

                    <button onClick={handleLogout} className={`${styles.navItem} ${styles.logoutBtn}`}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`${styles.mainContent} md:pt-6 pt-20`}>
                <Outlet />
            </main>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default EmployeeLayout;
