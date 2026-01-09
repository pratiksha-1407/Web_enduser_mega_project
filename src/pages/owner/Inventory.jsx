import { useState, useEffect } from 'react';
import { ownerService } from '../../services/ownerService';
import styles from '../../styles/owner/inventory.module.css';
import { Package, BarChart3, Search } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock branch data as per Flutter repo
    const branches = [
        { name: "Karad", stock: 420, sold: 120, inbound: 80 },
        { name: "Satara", stock: 320, sold: 150, inbound: 60 },
        { name: "Patan", stock: 210, sold: 80, inbound: 50 },
        { name: "Koynanagar", stock: 160, sold: 60, inbound: 40 },
    ];

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const data = await ownerService.getInventory();
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h2>
                <p className="text-gray-500 text-sm mt-1">Real-time stock monitoring and distribution.</p>
            </div>

            {/* Chart Section */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                    <BarChart3 size={20} className="text-blue-600" />
                    Stock vs Sold (Taluka-wise)
                </h3>
                <div style={{ height: 300, width: '100%', position: 'relative', minHeight: 300, minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                        <BarChart data={branches} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Legend iconType="circle" />
                            <Bar name="Current Stock" dataKey="stock" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                            <Bar name="Units Sold" dataKey="sold" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Branch Cards */}
            <div className={styles.branchGrid}>
                {branches.map((b, i) => (
                    <div key={i} className={styles.branchCard}>
                        <h4 className={styles.branchName}>{b.name}</h4>
                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <span className={`${styles.statValue} text-blue-700`}>{b.stock}</span>
                                <span className={styles.statLabel}>Stock (kg)</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={`${styles.statValue} text-blue-400`}>{b.sold}</span>
                                <span className={styles.statLabel}>Sold (kg)</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={`${styles.statValue} text-indigo-400`}>{b.inbound}</span>
                                <span className={styles.statLabel}>Inbound</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Overview */}
            <div className={`${styles.card} mt-8`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={styles.cardTitle}>
                        <Package size={20} className="text-blue-600" />
                        Product Inventory
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter products..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        Loading inventory...
                    </div>
                ) : (
                    <div className={styles.productGrid}>
                        {filteredProducts.map((p) => {
                            const stockValue = parseInt(p.stock_quantity) || 0;
                            const isLow = stockValue < 500;
                            return (
                                <div key={p.id} className={styles.productCard}>
                                    <div className={styles.prodHeader}>
                                        <span className={styles.prodName}>{p.name}</span>
                                        <span className={`${styles.prodStock} ${isLow ? 'text-red-500' : ''}`}>
                                            {stockValue} {p.unit || 'kg'}
                                        </span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={`${styles.progress} ${isLow ? styles.lowStock : ''}`}
                                            style={{ width: `${Math.min((stockValue / 2000) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-wider">
                                        Price: ₹{p.price_per_unit || p.price} / {p.unit || 'kg'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryPage;
