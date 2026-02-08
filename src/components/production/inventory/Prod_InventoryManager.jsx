import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Prod_InventoryHeader from './prod_InventoryHeader';
import Prod_InventoryTable from './prod_InventoryTable';

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
            (item.name_hindi && item.name_hindi.toLowerCase().includes(lowerQuery)) // Assuming name_hindi exists
        );
    }, [inventoryData, searchQuery]);

    // Calculate totals
    const { totalBags, totalTons, totalValue } = useMemo(() => {
        return filteredItems.reduce((acc, item) => {
            acc.totalBags += (item.bags || 0);
            acc.totalTons += (item.tons || 0); // Assuming tons exists or calculate bags * weight / 1000? 
            // Flutter code: totalTons += item.tons; so it must be a field or getter.
            // If DB doesn't have tons, we might need to compute: (bags * weight_per_bag) / 1000

            // Let's check calculation logic based on field availability
            const tons = item.tons !== undefined ? item.tons : ((item.bags || 0) * (item.weight_per_bag || 50)) / 1000;

            // Total Value: Flutter: totalValue += item.totalValue
            // item.totalValue likely (bags * price_per_bag)?
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
                    zIndex: 30, // Above content
                }}
                title="Add Product"
            >
                <Plus size={24} />
            </button>
        </div>
    );
};

export default Prod_InventoryManager;
