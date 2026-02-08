import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Prod_InventoryHeader from './Prod_InventoryHeader';
import Prod_InventoryTable from './Prod_InventoryTable';

const Prod_InventoryManager = ({ inventoryData, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showMarathi, setShowMarathi] = useState(false);

    // Filter items based on search
    const filteredItems = useMemo(() => {
        if (!searchQuery) return inventoryData;
        const lowerQuery = searchQuery.toLowerCase();
        return inventoryData.filter(item =>
            (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
            (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
            (item.name_hindi && item.name_hindi.toLowerCase().includes(lowerQuery))
        );
    }, [inventoryData, searchQuery]);

    // Calculate totals
    const { totalBags, totalTons, totalValue } = useMemo(() => {
        return filteredItems.reduce((acc, item) => {
            acc.totalBags += (item.bags || 0);

            // Logic based on field availability
            const tons = item.tons !== undefined ? item.tons : ((item.bags || 0) * (item.weight_per_bag || 50)) / 1000;
            const value = (item.bags || 0) * (item.price_per_bag || 0);

            acc.totalTons += tons;
            acc.totalValue += value;
            return acc;
        }, { totalBags: 0, totalTons: 0, totalValue: 0 });
    }, [filteredItems]);

    const handleAddProduct = () => {
        // Open Add Product Modal
        console.log('Open Add Product Modal');
        alert('Add Product - Coming Soon');
    };

    return (
        <div style={{ position: 'relative', minHeight: '80vh' }}>
            <Prod_InventoryHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                itemCount={filteredItems.length}
                totalBags={totalBags}
                totalTons={totalTons}
                totalValue={totalValue}
                showMarathi={showMarathi}
                setShowMarathi={setShowMarathi}
            />

            <Prod_InventoryTable
                products={filteredItems}
                showMarathi={showMarathi}
                onRefresh={onRefresh}
            />

            {/* FAB */}
            <button
                onClick={handleAddProduct}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    backgroundColor: '#2563EB',
                    color: 'white',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    border: 'none',
                    zIndex: 30,
                }}
                title="Add Product"
            >
                <Plus size={24} />
            </button>
        </div>
    );
};

export default Prod_InventoryManager;
