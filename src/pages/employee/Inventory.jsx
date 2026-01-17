
import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, AlertTriangle } from 'lucide-react';
import styles from '../../styles/employee/tables.module.css';

// Mock inventory data service (replace with actual API later if needed)
// Assuming for now stock data is fetched or mocked similar to other modules
const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulate API fetch
        const loadInventory = async () => {
            setLoading(true);
            try {
                // Mock data based on Flutter "Stock" or similar availability
                // Since user didn't explicitly ask for backend integration for this yet, 
                // we'll provide a UI with mock data or empty state consistent with the new design.
                await new Promise(r => setTimeout(r, 800));
                setInventory([
                    { id: 1, name: 'Cattle Feed A', category: 'Premium', stock: 120, unit: 'Bags', price: 1200, status: 'In Stock' },
                    { id: 2, name: 'Cattle Feed B', category: 'Standard', stock: 45, unit: 'Bags', price: 950, status: 'Low Stock' },
                    { id: 3, name: 'Mineral Mixture', category: 'Supplements', stock: 200, unit: 'Kg', price: 450, status: 'In Stock' },
                    { id: 4, name: 'Calf Starter', category: 'Starter', stock: 0, unit: 'Bags', price: 1400, status: 'Out of Stock' },
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadInventory();
    }, []);

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        if (status === 'In Stock') return styles.statusSuccess;
        if (status === 'Low Stock') return styles.statusPending; // Orange/Warning
        return styles.statusError; // Red/Out of Stock
    };

    return (
        <div className="space-y-6">
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Package size={20} />
                        </div>
                        <h2 className={styles.tableTitle}>Current Inventory</h2>
                    </div>
                    <div className={styles.searchBox}>
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Stock Level</th>
                                <th>Unit Price</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        <div className="flex justify-center mb-2">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        </div>
                                        Loading inventory...
                                    </td>
                                </tr>
                            ) : filteredInventory.length > 0 ? (
                                filteredInventory.map((item) => (
                                    <tr key={item.id}>
                                        <td className="font-medium text-gray-900">{item.name}</td>
                                        <td className="text-gray-500">{item.category}</td>
                                        <td>
                                            <div className="font-medium">
                                                {item.stock} <span className="text-xs text-gray-400 font-normal">{item.unit}</span>
                                            </div>
                                        </td>
                                        <td>₹{item.price}</td>
                                        <td>
                                            <span className={`${styles.statusPill} ${getStatusBadge(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
