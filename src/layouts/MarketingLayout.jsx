import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    ClipboardList,
    UserCircle,
    LogOut,
    Menu,
    X,
    Bell
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import styles from '../styles/marketing/layout.module.css';

const MarketingLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [managerName, setManagerName] = useState('Marketing Manager');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('emp_profile')
                .select('full_name')
                .eq('user_id', user.id)
                .single();
            if (data) setManagerName(data.full_name);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/marketing/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/marketing/team', icon: Users, label: 'Team Management' },
        { path: '/marketing/orders', icon: ShoppingCart, label: 'New Order' },
        { path: '/marketing/visits', icon: ClipboardList, label: 'Field Visit' },
        { path: '/marketing/profile', icon: UserCircle, label: 'My Profile' },
    ];

    const getPageTitle = () => {
        const current = navItems.find(item => item.path === location.pathname);
        return current ? current.label : 'Marketing Manager';
    };

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>M</div>
                        {!isSidebarOpen ? null : <span>Mega Marketing</span>}
                    </div>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                            }
                        >
                            <item.icon size={20} />
                            {isSidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button
                            className={styles.toggleBtn}
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
                    </div>

                    <div className={styles.headerRight}>
                        <button className={styles.iconBtn}>
                            <Bell size={20} />
                            <span className={styles.badge}></span>
                        </button>
                        <div className={styles.userProfile}>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{managerName}</span>
                                <span className={styles.userRole}>Marketing Manager</span>
                            </div>
                            <div className={styles.avatar}>
                                {managerName.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MarketingLayout;
