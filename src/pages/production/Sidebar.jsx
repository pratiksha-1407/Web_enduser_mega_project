import React from 'react';
import {
    Home, Package, ClipboardList, User, LogOut, X,
    Calendar, CheckCircle, Clock
} from 'lucide-react';
// import '../../index.css';

const colors = {
    primaryBlue: '#2563EB',
    white: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    danger: '#ef4444',
    overlay: 'rgba(0, 0, 0, 0.5)',
};

const Sidebar = ({ isOpen, onClose, onNavigate, onLogout, user }) => {
    const sidebarWidth = '280px';

    // Backdrop style
    const backdropStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: colors.overlay,
        zIndex: 40,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
    };

    // Drawer style
    const drawerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: sidebarWidth,
        height: '100vh',
        backgroundColor: colors.white,
        zIndex: 50,
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
    };

    const headerStyle = {
        backgroundColor: colors.primaryBlue,
        padding: '48px 20px 24px 20px',
        borderBottomRightRadius: '24px',
        color: colors.white,
    };

    const itemStyle = (isDanger = false) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        cursor: 'pointer',
        color: isDanger ? colors.danger : colors.textPrimary,
        transition: 'background-color 0.2s',
        fontSize: '15px',
        fontWeight: 500,
        textDecoration: 'none',
    });

    const iconStyle = (isDanger = false) => ({
        marginRight: '16px',
        color: isDanger ? colors.danger : colors.primaryBlue,
    });

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Package, label: 'Inventory', path: '/inventory' },
        { icon: ClipboardList, label: 'Production Orders', path: '/orders' },
        { icon: User, label: 'My Profile', path: '/profile' },
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && <div style={backdropStyle} onClick={onClose} />}

            {/* Drawer */}
            <div style={drawerStyle}>
                {/* Header */}
                <div style={headerStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            backgroundColor: colors.white,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <User size={28} color={colors.primaryBlue} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.full_name || 'Production Manager'}
                            </div>
                            <div style={{ fontSize: '13px', opacity: 0.8 }}>
                                {user?.position || 'Manager'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
                    {menuItems.map((item) => (
                        <div
                            key={item.label}
                            style={itemStyle()}
                            onClick={() => {
                                onNavigate(item.path);
                                onClose();
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <item.icon size={22} style={iconStyle()} />
                            {item.label}
                        </div>
                    ))}

                    <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '8px 24px' }} />

                    <div
                        style={itemStyle(true)}
                        onClick={() => {
                            onLogout();
                            onClose();
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <LogOut size={22} style={iconStyle(true)} />
                        Logout
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
