import React, { useState } from 'react';
import styles from '../../styles/employee/tables.module.css';
import { Search, Package, AlertCircle } from 'lucide-react';

const CATEGORIES = {
    "मिल्क पॉवर / Milk Power": { weight: 20, unit: "kg", price: 350 },
    "दुध सरिता / Dugdh Sarita": { weight: 25, unit: "kg", price: 450 },
    "दुग्धराज / Dugdh Raj": { weight: 30, unit: "kg", price: 600 },
    "डायमंड संतुलित पशु आहार / Diamond Balanced Animal Feed": { weight: 10, unit: "kg", price: 800 },
    "मिल्क पॉवर प्लस / Milk Power Plus": { weight: 5, unit: "kg", price: 1200 },
    "संतुलित पशु आहार / Santulit Pashu Aahar": { weight: 5, unit: "kg", price: 1200 },
    "जीवन धारा / Jeevan Dhara": { weight: 5, unit: "kg", price: 1200 },
    "Dairy Special संतुलित पशु आहार": { weight: 5, unit: "kg", price: 1200 },
};

const Inventory = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const products = Object.entries(CATEGORIES).map(([name, details], index) => ({
        id: index,
        name,
        ...details,
        status: 'In Stock', // Simulated
        stock: 100 + Math.floor(Math.random() * 500) // Simulated stock level
    }));

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-4">
                <AlertCircle className="text-blue-500 shrink-0 mt-1" />
                <div>
                    <h3 className="font-semibold text-blue-900">Inventory Status</h3>
                    <p className="text-blue-700 text-sm mt-1">
                        This view reflects the current feed categories available for order.
                        Stock levels are monitored by Production.
                        You cannot modify inventory items from this portal.
                    </p>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Package size={20} />
                        </div>
                        <h2 className={styles.tableTitle}>Feed Inventory</h2>
                    </div>
                    <div className={styles.searchBox}>
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search feed..."
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
                                <th>Weight / Unit</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Est. Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td className="font-medium">{product.name}</td>
                                    <td>{product.weight} {product.unit}</td>
                                    <td>₹{product.price}</td>
                                    <td>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="text-gray-500">{product.stock} bags</td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No products found
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
