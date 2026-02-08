import React, { useState, useEffect } from 'react';
import { productionService } from '../../services/productionService';
import { Package, Search, Filter } from 'lucide-react';

const Inventory = () => {
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await productionService.getInventory();
            setInventory(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Package className="text-blue-600" /> Finished Goods Inventory
                </h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInventory.map(item => (
                        <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Package className="text-blue-600" size={24} />
                                </div>
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${item.bags > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.bags > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-4">{item.category || 'General Category'}</p>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Quantity</div>
                                    <div className="font-bold text-gray-900">{item.bags} Bags</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 mb-1">Weight</div>
                                    <div className="font-bold text-gray-900">{item.weight_per_bag} kg/bag</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredInventory.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No inventory items found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inventory;
