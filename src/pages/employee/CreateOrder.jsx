import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/forms.module.css';
import { CheckCircle, AlertCircle, Loader2, User, Phone, MapPin, Package, ShoppingBag, FileText, ChevronRight, Check, Printer, Share2, Home, Plus } from 'lucide-react';

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

const BAG_OPTIONS = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50];

const CreateOrder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [createdOrder, setCreatedOrder] = useState(null);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_mobile: '',
        customer_address: '',
        feed_category: '',
        bags: 1,
        remarks: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e) => {
        setFormData({ ...formData, feed_category: e.target.value });
    };

    const handleBagChange = (bags) => {
        setFormData({ ...formData, bags });
    };

    const calculateTotals = () => {
        if (!formData.feed_category) return { weight: 0, price: 0, unit: 'kg' };

        const categoryData = CATEGORIES[formData.feed_category];
        const weight = formData.bags * categoryData.weight;
        const price = formData.bags * categoryData.price;

        return { weight, price, unit: categoryData.unit, perBagPrice: categoryData.price };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.feed_category) {
            setError("Please select a feed category");
            return;
        }

        setLoading(true);
        try {
            const totals = calculateTotals();
            const categoryData = CATEGORIES[formData.feed_category];

            const newOrder = await employeeService.createOrder({
                ...formData,
                weight_per_bag: categoryData.weight,
                weight_unit: categoryData.unit,
                price_per_bag: categoryData.price,
            });

            setCreatedOrder(newOrder);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    if (success && createdOrder) {
        const orderId = createdOrder.order_number
            ? `#${createdOrder.order_number}`
            : `#${createdOrder.id?.substring(0, 8).toUpperCase()}`;

        const timestamp = new Date().toLocaleString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Use captured totals from calculation to ensure display matches what was just calculated
        // OR rely on createdOrder if backend returns totals (it should)
        const displayTotal = createdOrder.total_price || calculateTotals().price;

        return (
            <div className={styles.receiptCard}>
                <div className={styles.receiptHeader}>
                    <div className={styles.receiptLogo}>
                        <Check size={32} strokeWidth={3} />
                    </div>
                    <h2 className={styles.receiptTitle}>Payment Successful!</h2>
                    <p className={styles.receiptSubtitle}>Your order has been placed successfully</p>
                </div>

                <div className={styles.receiptBody}>
                    <div className={styles.receiptRow}>
                        <span className={styles.receiptLabel}>Order ID</span>
                        <span className={styles.receiptValue}>{orderId}</span>
                    </div>
                    <div className={styles.receiptRow}>
                        <span className={styles.receiptLabel}>Date & Time</span>
                        <span className={styles.receiptValue}>{timestamp}</span>
                    </div>

                    <div className={styles.dashedDivider}></div>

                    <div className="mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Customer Details</span>
                        <div className={styles.receiptRow}>
                            <span className={styles.receiptLabel}>Name</span>
                            <span className={styles.receiptValue}>{createdOrder.customer_name}</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span className={styles.receiptLabel}>Mobile</span>
                            <span className={styles.receiptValue}>{createdOrder.customer_mobile}</span>
                        </div>
                    </div>

                    <div className={styles.dashedDivider}></div>

                    <div className="mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Item Summary</span>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-800 text-sm">{createdOrder.feed_category}</span>
                                <span className="text-xs text-gray-500">{createdOrder.bags} Bags x {createdOrder.weight_per_bag} {createdOrder.weight_unit}</span>
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">₹{displayTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className={styles.dashedDivider}></div>

                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Total Amount</span>
                        <span className={styles.totalValue}>₹{displayTotal.toLocaleString()}</span>
                    </div>
                </div>

                <div className={styles.receiptActions}>
                    <button
                        onClick={() => {
                            setSuccess(false);
                            setCreatedOrder(null);
                            setFormData({
                                customer_name: '',
                                customer_mobile: '',
                                customer_address: '',
                                feed_category: '',
                                bags: 1,
                                remarks: ''
                            });
                        }}
                        className={styles.primaryActionBtn}
                    >
                        <Plus size={18} /> Create New Order
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className={styles.secondaryActionBtn}
                        >
                            <Printer size={18} /> Print
                        </button>
                        <button
                            onClick={() => navigate('/employee')}
                            className={styles.secondaryActionBtn}
                        >
                            <Home size={18} /> Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { weight, price, unit, perBagPrice } = calculateTotals();

    return (
        <div className={styles.formContainer}>
            <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className={styles.sectionTitle} style={{ border: 'none', padding: 0, margin: 0 }}>New Order</h2>
                    <p className="text-gray-500 mt-1">Fill in the details to create a new feed order</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <ShoppingBag size={24} />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Info */}
                <section>
                    <h3 className={styles.formSectionTitle}>
                        <User size={18} className="text-blue-500" />
                        Customer Information
                    </h3>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Customer Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    required
                                    className={`${styles.input} pl-10`}
                                    placeholder="Enter full name"
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Mobile Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    name="customer_mobile"
                                    value={formData.customer_mobile}
                                    onChange={handleChange}
                                    required
                                    pattern="[0-9]{10}"
                                    className={`${styles.input} pl-10`}
                                    placeholder="10 digit mobile"
                                />
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                            <label className={styles.label}>Delivery Address</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-4 text-gray-400" />
                                <textarea
                                    name="customer_address"
                                    value={formData.customer_address}
                                    onChange={handleChange}
                                    required
                                    className={`${styles.textarea} pl-10`}
                                    rows="2"
                                    placeholder="Enter complete delivery address"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Order Details */}
                <section>
                    <h3 className={styles.formSectionTitle}>
                        <Package size={18} className="text-blue-500" />
                        Order Details
                    </h3>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Feed Category</label>
                        <select
                            name="feed_category"
                            value={formData.feed_category}
                            onChange={handleCategoryChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Select feed type...</option>
                            {Object.keys(CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {formData.feed_category && (
                        <div className="mt-6 animate-in slide-in-from-top-4 duration-300">
                            <label className={styles.label}>Select Quantity (Bags)</label>
                            <div className={styles.chipContainer}>
                                {BAG_OPTIONS.map(num => (
                                    <div
                                        key={num}
                                        className={`${styles.chip} ${formData.bags === num ? styles.active : ''}`}
                                        onClick={() => handleBagChange(num)}
                                    >
                                        {num}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryCard}>
                                <div className="space-y-3">
                                    <div className={styles.summaryRow}>
                                        <div className="flex items-center gap-2">
                                            <Package size={16} className="text-blue-400" />
                                            <span className={styles.summaryLabel}>Package Type</span>
                                        </div>
                                        <span className={styles.summaryValue}>{CATEGORIES[formData.feed_category].weight} {CATEGORIES[formData.feed_category].unit}</span>
                                    </div>
                                    <div className={styles.summaryRow}>
                                        <div className="flex items-center gap-2">
                                            <ShoppingBag size={16} className="text-blue-400" />
                                            <span className={styles.summaryLabel}>Total Weight</span>
                                        </div>
                                        <span className={styles.summaryValue}>{formData.bags} Bags × {CATEGORIES[formData.feed_category].weight} {CATEGORIES[formData.feed_category].unit} = {weight} {unit}</span>
                                    </div>
                                    <div className="h-px bg-blue-200/50 my-3"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-500">Total Payable</span>
                                        <span className="text-2xl font-bold text-blue-600">₹{price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Additional Info */}
                <section>
                    <h3 className={styles.formSectionTitle}>
                        <FileText size={18} className="text-blue-500" />
                        Additional Notes
                    </h3>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Remarks (Optional)</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className={styles.textarea}
                            rows="2"
                            placeholder="Add any special instructions or notes..."
                        />
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Processing Order...
                        </>
                    ) : (
                        <>
                            Place Order
                            <ChevronRight size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateOrder;
