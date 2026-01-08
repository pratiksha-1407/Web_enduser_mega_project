import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import clsx from 'clsx';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Define links based on role
  const getLinks = () => {
    const common = [
      { to: '/profile', icon: User, label: 'Profile' },
    ];

    if (role === 'Employee') {
      return [
        { to: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/employee/orders/new', icon: PlusCircle, label: 'New Order' },
        { to: '/employee/orders', icon: ShoppingCart, label: 'History' },
        ...common
      ];
    }

    if (role === 'Marketing Manager') {
      return [
        { to: '/marketing/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ...common
      ];
    }

    if (role === 'Production Manager') {
      return [
        { to: '/production/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ...common
      ];
    }

    if (role === 'Owner') {
      return [
        { to: '/owner/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        ...common
      ];
    }

    return common;
  };

  const links = getLinks();

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <aside className={clsx(styles.sidebar, sidebarOpen && styles.open)}>
        <div className={styles.brand}>
          <h2>Mega Feeds</h2>
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
              onClick={() => setSidebarOpen(false)} // Close on mobile navigate
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
            <h1>{profile?.role || 'Dashboard'}</h1>
          </div>
          <div className={styles.userDisplay}>
            {profile?.full_name?.charAt(0) || 'U'}
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

export default DashboardLayout;