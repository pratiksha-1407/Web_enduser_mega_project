import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    BarChart3,
    Shield,
    Zap,
    Globe,
    Menu,
    X
} from 'lucide-react';
import styles from './LandingPage.module.css';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={styles.wrapper}>
            {/* ================= NAVIGATION ================= */}
            <nav
                className={`${styles.navbar} ${scrolled ? styles.scrolled : ''
                    }`}
            >
                <div className={styles.navContainer}>
                    {/* Logo */}
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Globe size={20} />
                        </div>
                        <span>Mega Feeds</span>
                    </div>

                    {/* Desktop Status */}
                    <div className={styles.desktopStats}>
                        <div className={styles.statusIndicator}>
                            <span className={styles.dot}></span>
                            System Operational
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div
                        className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''
                            }`}
                    >
                        <a
                            href="#features"
                            className={styles.navLink}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Platform
                        </a>
                        <a
                            href="#solutions"
                            className={styles.navLink}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Solutions
                        </a>
                        <a
                            href="#enterprise"
                            className={styles.navLink}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Enterprise
                        </a>

                        {/* Mobile-only login */}
                        <Link
                            to="/login"
                            className={styles.loginBtnMobile}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Login Portal
                        </Link>
                    </div>

                    {/* Desktop Login Button */}
                    <Link to="/login" className={styles.loginBtn}>
                        Access Portal
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className={styles.menuBtn}
                        aria-label="Toggle navigation menu"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* ================= HERO ================= */}
            <header className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        Internal Release v2.4.0
                    </div>

                    <h1 className={styles.title}>
                        Next-Gen{' '}
                        <span className={styles.gradientText}>
                            Feed Production
                        </span>{' '}
                        Management
                    </h1>

                    <p className={styles.subtitle}>
                        A centralized enterprise dashboard for Mega Feeds
                        employees to track inventory, manage orders, and analyze
                        production performance in real time.
                    </p>

                    <div className={styles.ctaGroup}>
                        <Link to="/login" className={styles.primaryCta}>
                            Enter Employee Portal
                            <ArrowRight size={18} />
                        </Link>

                        <button
                            className={styles.secondaryCta}
                            type="button"
                        >
                            View Documentation
                        </button>
                    </div>

                    <div className={styles.trustRow}>
                        <div className={styles.trustItem}>
                            <strong>2.5k+</strong>
                            <span>Orders / Month</span>
                        </div>

                        <div className={styles.divider}></div>

                        <div className={styles.trustItem}>
                            <strong>99.9%</strong>
                            <span>Uptime</span>
                        </div>

                        <div className={styles.divider}></div>

                        <div className={styles.trustItem}>
                            <strong>Secure</strong>
                            <span>End-to-End</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className={styles.heroVisual}>
                    <div className={styles.glassCard}>
                        <div className={styles.cardHeader}>
                            <span
                                className={styles.cardDot}
                                style={{ background: '#ef4444' }}
                            ></span>
                            <span
                                className={styles.cardDot}
                                style={{ background: '#f59e0b' }}
                            ></span>
                            <span
                                className={styles.cardDot}
                                style={{ background: '#22c55e' }}
                            ></span>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.metricRow}>
                                <span className={styles.metricLabel}>
                                    Production Output
                                </span>
                                <span className={styles.metricValue}>
                                    +24.5%
                                </span>
                            </div>

                            <div className={styles.chartLine}></div>
                            <div
                                className={styles.chartLine}
                                style={{ width: '70%', marginTop: '8px' }}
                            ></div>

                            <div className={styles.miniStats}>
                                <div className={styles.miniStat}>
                                    <Zap size={16} />
                                    <span>Efficiency</span>
                                </div>
                                <div className={styles.miniStat}>
                                    <BarChart3 size={16} />
                                    <span>Analytics</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.glowEffect}></div>
                </div>
            </header>

            {/* ================= FEATURES ================= */}
            <section className={styles.features} id="features">
                <div className={styles.featureCard}>
                    <div className={styles.iconBox}>
                        <BarChart3 size={24} />
                    </div>
                    <h3>Process Analytics</h3>
                    <p>
                        Real-time monitoring and visualization of production
                        metrics across all manufacturing units.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconBox}>
                        <Shield size={24} />
                    </div>
                    <h3>Role-Based Access</h3>
                    <p>
                        Secure, permission-based system ensuring controlled
                        access for every employee role.
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <div className={styles.iconBox}>
                        <Zap size={24} />
                    </div>
                    <h3>Fast Dispatch</h3>
                    <p>
                        Optimized order processing built for high-volume
                        logistics and dispatch operations.
                    </p>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <span>Mega Feeds</span>
                        <span className={styles.copyright}>
                            © 2026
                        </span>
                    </div>

                    <div className={styles.footerLinks}>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Status</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
