import React from 'react';
import { Package, Scale, IndianRupee, Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const colors = {
    primaryBlue: '#2563EB',
    white: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    success: '#22c55e',
    warning: '#f97316',
    danger: '#ef4444',
    border: '#E5E7EB',
    background: '#F9FAFB',
};

const InfoChip = ({ text, icon: Icon, color }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 12px',
        backgroundColor: color ? `${color}1A` : '#F3F4F6',
        borderRadius: '8px',
        marginRight: '8px',
        marginBottom: '8px',
    }}>
        {Icon && <Icon size={14} color={color || '#6B7280'} style={{ marginRight: '6px' }} />}
        <span style={{ fontSize: '12px', fontWeight: 500, color: color || '#4B5563' }}>
            {text}
        </span>
    </div>
);

const InventoryItemCard = ({ item, showMarathi, onEdit, onDelete }) => {
    const displayName = showMarathi ? (item.name_hindi || item.name) : item.name;
    const isLowStock = (item.bags || 0) < (item.min_bags_stock || 10);

    return (
        <div style={{
            backgroundColor: colors.white,
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: `1px solid ${colors.border}`
        }}>
            {/* Name & Category */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: colors.textPrimary, flex: 1 }}>
                    {displayName}
                </h3>
                <span style={{
                    fontSize: '12px',
                    color: colors.primaryBlue,
                    backgroundColor: '#EFF6FF',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 500
                }}>
                    {item.category}
                </span>
            </div>

            {/* Stock Summary */}
            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '8px' }}>
                <InfoChip text={`${(item.bags || 0).toFixed(0)} Bags`} icon={Package} />
                <InfoChip text={`${(item.tons || 0).toFixed(2)} Tons`} icon={Scale} />
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px' }}>
                <InfoChip
                    text={`${(item.weight_per_bag || 0)} ${item.unit || 'kg'}/bag`}
                    icon={Scale}
                />
                <InfoChip
                    text={`₹${(item.price_per_bag || 0)}/bag`}
                    icon={IndianRupee}
                />
            </div>

            {/* Footer: Status & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isLowStock ? (
                        <>
                            <AlertTriangle size={16} color={colors.warning} />
                            <span style={{ fontSize: '12px', color: colors.warning, fontWeight: 500 }}>Low Stock</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={16} color={colors.success} />
                            <span style={{ fontSize: '12px', color: colors.success, fontWeight: 500 }}>In Stock</span>
                        </>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => onEdit(item)}
                        style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            backgroundColor: '#EFF6FF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', color: colors.primaryBlue
                        }}
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>

                    <button
                        onClick={() => onDelete(item)}
                        style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            backgroundColor: '#FEF2F2',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', color: colors.danger
                        }}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Prod_InventoryTable = ({ products, loading, onRefresh, showMarathi }) => {
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '40px', color: colors.textSecondary }}>Loading inventory...</div>;
    }

    if (!products || products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Package size={48} color={colors.border} style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: colors.textSecondary }}>No products found</h3>
                <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Add a new product to get started.</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '16px', padding: '0 4px'
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Products Inventory</h2>
                {/* Refresh logic handled by parent via pull-to-refresh or separate button if needed */}
            </div>

            <div style={{ paddingBottom: '80px' }}> {/* Space for FAB */}
                {products.map(item => (
                    <InventoryItemCard
                        key={item.id}
                        item={item}
                        showMarathi={showMarathi}
                        onEdit={(item) => console.log('Edit', item)}
                        onDelete={(item) => console.log('Delete', item)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Prod_InventoryTable;
