import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingBag,
    FileText,
    User,
    LogOut,
    Menu,
    X,
    Target // For quick actions / assign targets if needed later
} from 'lucide-react';
import clsx from 'clsx';
import styles from '../styles/owner/layout.module.css';

const OwnerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout, profile } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const links = [
        { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/owner/employees', icon: Users, label: 'Employees' },
        { to: '/owner/inventory', icon: Package, label: 'Inventory' },
        { to: '/owner/sales', icon: ShoppingBag, label: 'Sales & Orders' },
        { to: '/owner/reports', icon: FileText, label: 'Reports' },
        { to: '/owner/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className={styles.wrapper}>
            {/* Sidebar */}
            <aside className={clsx(styles.sidebar, sidebarOpen && styles.open)}>
                <div className={styles.brand}>
                    <h2>Owner</h2>
                    <button className={styles.closeBtn} onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => clsx(styles.navLink, isActive && styles.active)}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <link.icon size={20} />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <button className={styles.menuBtn} onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <div className={styles.headerTitle}>
                        <h1>Owner Portal</h1>
                    </div>
                    <div className={styles.userDisplay}>
                        {profile?.full_name?.charAt(0) || 'O'}
                    </div>
                </header>

                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>

            {/* Overlay for mobile */}
            {sidebarOpen && <div className={styles.overlay} onClick={toggleSidebar} />}
        </div>
    );
};

export default OwnerLayout;
