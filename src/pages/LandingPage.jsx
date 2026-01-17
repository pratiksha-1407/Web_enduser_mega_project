import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    BarChart3,
    Shield,
    Zap,
    LayoutDashboard,
    Package,
    Truck
} from 'lucide-react';
import styles from './LandingPage.module.css';

const LandingPage = () => {
    return (
        <div className={styles.wrapper}>
            {/* Header / Navbar */}
            <nav className={styles.navbar}>
                <div className={`${styles.container} ${styles.navContainer}`}>
                    <Link to="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <LayoutDashboard size={24} />
                        </div>
                    </Link>

                    <Link to="/login" className={styles.loginBtn}>
                        Log In
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.title}>
                            Management System
                        </h1>
                        <p className={styles.subtitle}>
                            A centralized platform for cattle feed operations. Track inventory,
                            manage orders, and analyze production performance across all
                            departments in real-time.
                        </p>
                        <Link to="/role" className={styles.primaryCta}>
                            Access Portal
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Operational Focus / Features Section */}
            <main className={styles.features}>
                <div className={styles.container}>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.iconBox}>
                                <Package size={20} />
                            </div>
                            <h3>Inventory Control</h3>
                            <p>
                                Monitor raw material stocks and finished feed levels
                                with precision tracking and low-stock alerts.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.iconBox}>
                                <Truck size={20} />
                            </div>
                            <h3>Order Management</h3>
                            <p>
                                Streamline the order process from placement to
                                delivery, ensuring timely supply to all dealers.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.iconBox}>
                                <BarChart3 size={20} />
                            </div>
                            <h3>Production Analysis</h3>
                            <p>
                                Analyze daily output and efficiency metrics to
                                optimize manufacturing processes and reduce waste.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.iconBox}>
                                <Shield size={20} />
                            </div>
                            <h3>Secure Role Access</h3>
                            <p>
                                Role-based permissions for Owners, Managers,
                                and Operations staff to ensure data integrity.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Clean Footer */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerContent}>
                        <span className={styles.copyright}>
                            © 2026 Management System. All rights reserved.
                        </span>
                        <div className={styles.footerLinks}>
                            <Link to="/login">Support</Link>
                            <Link to="/login">Documentation</Link>
                            <Link to="/login">Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
