import React from 'react';
import { Search, Package, Scale, IndianRupee } from 'lucide-react';

const colors = {
    primaryBlue: '#2563EB',
    white: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    background: '#F3F4F6',
    border: '#E5E7EB',
    green: '#22c55e',
    orange: '#f97316',
};

const SummaryCard = ({ title, value, icon: Icon, color }) => (
    <div style={{
        backgroundColor: colors.white,
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minWidth: '100px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{
                padding: '6px',
                backgroundColor: `${color}1A`,
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon size={16} color={color} />
            </div>
            <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 600, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {value}
            </span>
        </div>
        <span style={{ fontSize: '12px', color: colors.textSecondary }}>{title}</span>
    </div>
);

const Prod_InventoryHeader = ({
    searchQuery,
    onSearchChange,
    itemCount,
    totalBags,
    totalTons,
    totalValue,
    showMarathi,
    setShowMarathi
}) => {
    return (
        <div style={{ marginBottom: '16px' }}>
            {/* Search and Count Row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                    flex: 1,
                    backgroundColor: colors.white,
                    borderRadius: '12px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <Search size={20} color={colors.primaryBlue} style={{ marginRight: '12px' }} />
                    <input
                        type="text"
                        placeholder="Search products"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            width: '100%',
                            color: colors.textPrimary
                        }}
                    />
                </div>
                <div style={{
                    backgroundColor: colors.primaryBlue,
                    borderRadius: '12px',
                    padding: '8px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '60px'
                }}>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: colors.white }}>{itemCount}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>Items</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <SummaryCard title="Total Bags" value={totalBags.toLocaleString()} icon={Package} color={colors.primaryBlue} />
                <SummaryCard title="Total Tons" value={`${totalTons.toFixed(2)}`} icon={Scale} color={colors.green} />
                <SummaryCard title="Total Value" value={`₹${totalValue.toLocaleString()}`} icon={IndianRupee} color={colors.orange} />
            </div>

            {/* Language Toggle */}
            <div style={{
                backgroundColor: colors.white,
                borderRadius: '10px',
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `1px solid ${colors.border}`
            }}>
                <span style={{ fontSize: '14px', color: colors.textPrimary, fontWeight: 500 }}>Language:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setShowMarathi(false)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: `1px solid ${!showMarathi ? colors.primaryBlue : colors.border}`,
                            backgroundColor: !showMarathi ? colors.primaryBlue : '#F3F4F6',
                            color: !showMarathi ? colors.white : colors.textSecondary,
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setShowMarathi(true)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: `1px solid ${showMarathi ? colors.primaryBlue : colors.border}`,
                            backgroundColor: showMarathi ? colors.primaryBlue : '#F3F4F6',
                            color: showMarathi ? colors.white : colors.textSecondary,
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        मराठी
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Prod_InventoryHeader;
