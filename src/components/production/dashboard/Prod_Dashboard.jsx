import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import {
    Menu, BarChart3, RefreshCw, Plus,
    ChevronRight, Info, Package, TrendingUp,
    Wallet, TriangleAlert, TrendingDown, ArrowRight,
    Factory, Activity, Award
} from 'lucide-react';
import { fetchDashboardData } from '../../../services/supabase/dashboardService';
import '../../../index.css';
import Sidebar from './Sidebar';
import Prod_InventoryManager from '../inventory/Prod_InventoryManager';
import Prod_Orders from '../orders/Prod_Orders';
import Prod_Profile from '../profile/Prod_Profile';
import { logoutUser } from '../../../services/supabase/profileService';

// --- Colors & Styles ---
const colors = {
    primaryBlue: '#2563EB',
    background: '#F3F4F8',
    white: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    success: '#22c55e', // Tw green-500
    warning: '#f59e0b', // Tw amber-500
    danger: '#ef4444', // Tw red-500
    border: '#E5E7EB',
    purple: '#9333ea', // Tw purple-600
};

const styles = {
    container: {
        backgroundColor: colors.background,
        minHeight: '100vh',
        fontFamily: "'Poppins', sans-serif",
    },
    appBar: {
        backgroundColor: colors.primaryBlue,
        color: colors.white,
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    appBarTitle: {
        fontSize: '20px',
        fontWeight: 600,
        margin: 0,
    },
    appBarSubtitle: {
        fontSize: '11px',
        opacity: 0.8,
        margin: 0,
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: colors.white,
        padding: '8px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        padding: '16px',
        maxWidth: '1200px', // Limit width for web
        margin: '0 auto',
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: colors.textPrimary,
        margin: 0,
    },
    currency: {
        fontFamily: 'sans-serif', // For Rupee symbol
    },
    fab: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: colors.primaryBlue,
        color: colors.white,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        border: 'none',
        zIndex: 30, // Above content
    }
};

// --- Components ---

const ProductionMetrics = ({ todayProduction, productionTarget, onRefresh }) => {
    const progress = productionTarget > 0 ? todayProduction / productionTarget : 0;
    const isTargetAchieved = todayProduction >= productionTarget;
    const progressPercent = Math.min(progress * 100, 100);

    // Circular Progress CSS
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div style={{
            ...styles.card,
            background: `linear-gradient(135deg, ${colors.primaryBlue}, #1d4ed8)`, // blue-700
            color: colors.white,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 5px 15px ${colors.primaryBlue}4D`, // 30% opacity
            marginBottom: '20px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
                        Today's Production
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
                        {todayProduction.toFixed(0)} Bags
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            padding: '6px 8px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            {/* flag icon replacement */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                            <span style={{ fontSize: '12px' }}>Target: {productionTarget.toFixed(0)} Bags</span>
                        </div>
                        <button onClick={onRefresh} style={{
                            background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: '4px'
                        }}>
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {/* Circular Progress */}
                <div style={{
                    width: '80px', height: '80px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative'
                }}>
                    <svg width="68" height="68" style={{ transform: 'rotate(-90deg)' }}>
                        {/* Background Circle */}
                        <circle
                            cx="34" cy="34" r={radius}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="6"
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="34" cy="34" r={radius}
                            stroke={isTargetAchieved ? '#4ade80' : '#fbbf24'} // green-400 : amber-400
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div style={{ position: 'absolute', fontSize: '14px', fontWeight: 'bold' }}>
                        {Math.round(progress * 100)}%
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{
        padding: '12px',
        backgroundColor: `${color}0D`, // 5% opacity
        borderRadius: '12px',
        border: `1px solid ${color}33`, // 20% opacity
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'flex-start'
    }}>
        <Icon size={20} color={color} />
        <div style={{ marginTop: '8px', fontSize: '11px', color: '#4B5563' }}>{title}</div>
        <div style={{ marginTop: '4px', fontSize: '16px', fontWeight: '700', color: color }}>{value}</div>
    </div>
);

const QuickStats = ({ stats, productsCount, ordersCount }) => {
    if (!stats) return null;

    return (
        <div style={{ ...styles.card, padding: '16px' }}>
            <h3 style={{ ...styles.sectionTitle, marginBottom: '16px' }}>Quick Stats</h3>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
            }}>
                <StatCard
                    title="Active Machines"
                    value={`${stats.activeMachines}/${stats.totalMachines}`}
                    icon={Activity}
                    color="#2563EB" // Blue
                />
                <StatCard
                    title="Quality Rate"
                    value={`${stats.qualityRate}%`}
                    icon={Award}
                    color="#22C55E" // Green
                />
                <StatCard
                    title="Products"
                    value={productsCount.toString()}
                    icon={Package}
                    color="#9333EA" // Purple
                />
                <StatCard
                    title="Monthly Orders"
                    value={ordersCount.toString()}
                    icon={Wallet}
                    color="#F97316" // Orange
                />
            </div>
        </div>
    );
};

const InventorySummary = ({ totalBags, totalProducts }) => (
    <div style={{ ...styles.card, padding: '0 0 16px 0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 16px 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={styles.sectionTitle}>Inventory Summary</h3>
            <button style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: `${colors.primaryBlue}1A`, color: colors.primaryBlue,
                border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer'
            }}>
                View All <ChevronRight size={10} />
            </button>
        </div>

        <div style={{ padding: '16px' }}>
            <div style={{
                padding: '20px',
                backgroundColor: '#EFF6FF', // blue-50
                borderRadius: '12px',
                border: '1px solid #DBEAFE', // blue-100
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div>
                    <div style={{ fontSize: '14px', color: colors.textSecondary }}>Total Bags</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: colors.primaryBlue, margin: '8px 0 4px 0' }}>
                        {totalBags.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>in inventory</div>
                </div>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '12px',
                    backgroundColor: `${colors.primaryBlue}1A`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Package size={32} color={colors.primaryBlue} />
                </div>
            </div>

            <div style={{
                marginTop: '12px', padding: '12px',
                backgroundColor: '#F0FDF4', borderRadius: '8px', // green-50
                border: '1px solid #DCFCE7', // green-100
                display: 'flex', alignItems: 'center', gap: '8px'
            }}>
                <Info size={16} color={colors.success} />
                <span style={{ fontSize: '12px', color: colors.success }}>based on {totalProducts} products in inventory</span>
            </div>
        </div>
    </div>
);

const ProfitRow = ({ title, value, icon: Icon, color }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: `${color}1A`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon size={18} color={color} />
            </div>
            <span style={{ fontSize: '14px', color: colors.textPrimary }}>{title}</span>
        </div>
        <span style={{ fontSize: '16px', fontWeight: 700, color: color, fontFamily: 'sans-serif' }}>
            {value}
        </span>
    </div>
);

const ProfitMetrics = ({ totalRevenue, totalCost, netProfit, profitMargin }) => {
    const marginColor = profitMargin >= 20 ? colors.success : (profitMargin >= 10 ? colors.warning : colors.danger);
    const MarginIcon = profitMargin >= 20 ? TrendingUp : (profitMargin >= 10 ? ArrowRight : TrendingDown);

    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={styles.sectionTitle}>Monthly Profit & Loss</h3>
                <div style={{ padding: '4px 8px', backgroundColor: '#F3F4F6', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: colors.textSecondary }}>
                    {format(new Date(), 'MMM yyyy')}
                </div>
            </div>

            <ProfitRow title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={TrendingUp} color={colors.success} />
            <ProfitRow title="Raw Material Cost" value={`₹${totalCost.toLocaleString()}`} icon={Package} color={colors.warning} />
            <ProfitRow title="Net Profit" value={`₹${netProfit.toLocaleString()}`} icon={Wallet} color={netProfit >= 0 ? colors.success : colors.danger} />

            <div style={{
                marginTop: '12px', padding: '12px',
                backgroundColor: `${marginColor}1A`,
                borderRadius: '12px',
                border: `1px solid ${marginColor}4D`, // 30% opacity
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MarginIcon size={18} color={marginColor} />
                    <span style={{ fontSize: '13px', color: colors.textPrimary }}>Profit Margin</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: marginColor }}>
                    {profitMargin.toFixed(1)}%
                </span>
            </div>
        </div>
    );
};

const RawMaterialCosts = ({ costs, onAddUsage }) => {
    const sortedCosts = Object.entries(costs).sort(([, a], [, b]) => b - a).slice(0, 5);
    const isEmpty = sortedCosts.length === 0;

    if (isEmpty) {
        return (
            <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={styles.sectionTitle}>Raw Material Costs</h3>
                    <button
                        onClick={onAddUsage}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            backgroundColor: `${colors.primaryBlue}1A`, // 10% opacity
                            color: colors.primaryBlue,
                            border: 'none', padding: '4px 8px', borderRadius: '6px',
                            fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                            fontFamily: "'Poppins', sans-serif"
                        }}
                    >
                        Add Usage <Plus size={10} />
                    </button>
                </div>
                <div style={{
                    height: '100px', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <BarChart3 size={40} color="#9CA3AF" strokeWidth={1.5} /> {/* Grey[400] */}
                    <span style={{ marginTop: '8px', fontSize: '14px', color: '#6B7280' }}> {/* Grey[500] */}
                        No raw material usage data
                    </span>
                    <span style={{ marginTop: '4px', fontSize: '12px', color: '#9CA3AF' }}> {/* Grey[400] */}
                        Tap 'Add Usage' button to start recording
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={styles.sectionTitle}>Top Raw Material Costs</h3>
                <span style={{ fontSize: '11px', color: colors.textSecondary }}>This Month</span>
            </div>

            {sortedCosts.map(([name, cost]) => (
                <div key={name} style={{
                    marginBottom: '10px', padding: '12px',
                    backgroundColor: '#FAFAFA', // Grey[50]
                    borderRadius: '10px',
                    border: `1px solid ${colors.border}`, // Grey[200]
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <span style={{ fontSize: '14px', color: '#1F2937' }}>{name}</span> {/* Grey[800] */}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#FF9800', fontFamily: 'sans-serif' }}> {/* Orange */}
                        ₹{cost.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
};

const InventoryStatus = ({ inventory, onViewAll }) => {
    const isEmpty = inventory.length === 0;

    return (
        <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={styles.sectionTitle}>Raw Material Status</h3>
                <button
                    onClick={onViewAll}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        backgroundColor: `${colors.primaryBlue}1A`,
                        color: colors.primaryBlue,
                        border: 'none', padding: '4px 8px', borderRadius: '6px',
                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif"
                    }}
                >
                    View All <ChevronRight size={10} />
                </button>
            </div>

            {isEmpty ? (
                <div style={{ height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={48} color="#9CA3AF" strokeWidth={1.5} /> {/* Grey[400] */}
                    <span style={{ marginTop: '12px', fontSize: '14px', color: '#4B5563' }}> {/* Grey[600] */}
                        No inventory data
                    </span>
                </div>
            ) : (
                inventory.slice(0, 4).map(item => {
                    const stock = (item.bags || 0); // Use bags
                    const reorder = (item.min_bags_stock || 10); // Use min_bags_stock
                    const isLow = stock < reorder;
                    const percentage = reorder > 0 ? (stock / reorder) : 0;
                    const displayPercentage = Math.round(percentage * 100);
                    const progressValue = Math.min(percentage * 100, 100);

                    // Colors
                    const color = isLow ? colors.danger : colors.success; // Red or Green
                    const bgColor = isLow ? '#FEF2F2' : '#F0FDF4'; // Red-50 or Green-50 for badge

                    return (
                        <div key={item.id} style={{
                            marginBottom: '10px', padding: '12px',
                            backgroundColor: '#FAFAFA', // Grey[50]
                            borderRadius: '10px',
                            border: '1px solid #E5E7EB', // Grey[200]
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>{item.name}</span> {/* Grey[800] */}
                                <div style={{
                                    padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                                    backgroundColor: `${color}1A`, color: color
                                }}>
                                    {stock.toFixed(0)} bags
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ flex: 1, height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progressValue}%`, height: '100%', backgroundColor: color }} />
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#4B5563' }}> {/* Grey[600] */}
                                    {displayPercentage}%
                                </span>
                            </div>

                            {isLow && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                                    <TriangleAlert size={14} color={colors.danger} />
                                    <span style={{ fontSize: '11px', color: colors.danger }}>Below reorder level ({reorder.toFixed(0)} bags)</span>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};


export default function Prod_Dashboard() {
    const [data, setData] = useState({
        inventoryData: [],
        revenueData: [],
        usageData: [],
        quickStats: null
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentView, setCurrentView] = useState('/dashboard');

    const loadData = async () => {
        setLoading(true);
        const result = await fetchDashboardData();
        if (result) {
            setData(result);
            setLastUpdated(new Date());
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    // --- Calculations ---

    // Total Inventory Bags
    const totalBags = data.inventoryData.reduce((acc, item) => acc + (item.bags || 0), 0);

    // Profit Metrics
    const totalRevenue = data.revenueData.reduce((acc, order) => acc + (order.total_price || 0), 0);

    let rawMaterialCosts = {};
    let totalRawMaterialCost = 0;

    data.usageData.forEach(usage => {
        const cost = usage.total_cost || 0;
        totalRawMaterialCost += cost;
        const name = usage.pro_inventory?.name || 'Unknown';
        rawMaterialCosts[name] = (rawMaterialCosts[name] || 0) + cost;
    });

    const totalProfit = totalRevenue - totalRawMaterialCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;


    const handleAddUsage = () => {
        // Placeholder for navigation
        // TODO: Implement navigation to ProRawMaterialEntryPage
        alert("ProRawMaterialEntryPage not implemented yet");
    };

    const handleNavigate = (path) => {
        console.log(`Navigate to ${path}`);
        setCurrentView(path);
        setIsSidebarOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/login'; // Redirect anyway
        }
    };

    const getTitle = () => {
        switch (currentView) {
            case '/inventory': return 'Inventory';
            case '/orders': return 'Production Orders';
            case '/profile': return 'My Profile';
            default: return 'Production Dashboard';
        }
    };

    const renderContent = () => {
        switch (currentView) {
            case '/inventory':
                return (
                    <Prod_InventoryManager
                        inventoryData={data.inventoryData}
                        onRefresh={loadData}
                    />
                );
            case '/orders':
                return <Prod_Orders />;
            case '/profile':
                return <Prod_Profile onLogout={handleLogout} />;
            case '/dashboard':
            default:
                return (
                    <>
                        {data.quickStats && (
                            <ProductionMetrics
                                todayProduction={data.quickStats.todayProduction}
                                productionTarget={data.quickStats.productionTarget}
                                onRefresh={loadData}
                            />
                        )}

                        <QuickStats
                            stats={data.quickStats}
                            productsCount={data.inventoryData.length}
                            ordersCount={data.revenueData.length}
                        />

                        <InventorySummary totalBags={totalBags} totalProducts={data.inventoryData.length} />

                        <ProfitMetrics
                            totalRevenue={totalRevenue}
                            totalCost={totalRawMaterialCost}
                            netProfit={totalProfit}
                            profitMargin={profitMargin}
                        />

                        <RawMaterialCosts costs={rawMaterialCosts} onAddUsage={handleAddUsage} />

                        <InventoryStatus inventory={data.inventoryData} onViewAll={() => handleNavigate('/inventory')} />
                    </>
                );
        }
    };

    if (loading && !data.inventoryData.length) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <div style={{ color: colors.primaryBlue }}>Loading...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                user={{ full_name: 'Production Manager', position: 'Manager' }} // Placeholder
            />

            {/* AppBar */}
            <header style={styles.appBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button style={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <div>
                        <h1 style={styles.appBarTitle}>{getTitle()}</h1>
                        <p style={styles.appBarSubtitle}>Updated: {format(lastUpdated, 'hh:mm')}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {currentView === '/dashboard' && (
                        <>
                            <button style={styles.iconButton} onClick={loadData}><BarChart3 size={24} /></button>
                            <button style={styles.iconButton} onClick={loadData}><RefreshCw size={24} /></button>
                        </>
                    )}
                </div>
            </header>

            {/* Body */}
            <main style={styles.body}>
                {renderContent()}
            </main>

            {/* FAB - Only on Dashboard */}
            {currentView === '/dashboard' && (
                <button style={styles.fab} title="Record Usage" onClick={handleAddUsage}>
                    <Plus size={24} />
                </button>
            )}
        </div>
    );
}
