import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import styles from '../../styles/employee/forms.module.css';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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

            await employeeService.createOrder({
                ...formData,
                weight_per_bag: categoryData.weight,
                weight_unit: categoryData.unit,
                price_per_bag: categoryData.price,
                // total_weight and total_price calculated in service too, but passing details helps
            });

            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm text-center max-w-lg mx-auto mt-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-500 mb-8">Order will appear in production orders.</p>
                <div className="flex gap-4 w-full">
                    <button
                        onClick={() => {
                            setSuccess(false);
                            setFormData({
                                customer_name: '',
                                customer_mobile: '',
                                customer_address: '',
                                feed_category: '',
                                bags: 1,
                                remarks: ''
                            });
                        }}
                        className="flex-1 py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-50"
                    >
                        NEW ORDER
                    </button>
                    <button
                        onClick={() => navigate('/employee')}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600"
                    >
                        HOME
                    </button>
                </div>
            </div>
        );
    }

    const { weight, price, unit, perBagPrice } = calculateTotals();

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.sectionTitle}>New Feed Order</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Customer Info */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Information</h3>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Customer Name *</label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="Enter full name"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Mobile Number *</label>
                        <input
                            type="tel"
                            name="customer_mobile"
                            value={formData.customer_mobile}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10}"
                            className={styles.input}
                            placeholder="10 digit mobile number"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Delivery Address *</label>
                        <textarea
                            name="customer_address"
                            value={formData.customer_address}
                            onChange={handleChange}
                            required
                            className={styles.textarea}
                            rows="2"
                            placeholder="Enter complete delivery address"
                        />
                    </div>
                </div>

                {/* Order Details */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Order Details</h3>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Feed Category *</label>
                        <select
                            name="feed_category"
                            value={formData.feed_category}
                            onChange={handleCategoryChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Select feed category</option>
                            {Object.keys(CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {formData.feed_category && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Number of Bags *</label>
                            <div className={styles.chipContainer}>
                                {BAG_OPTIONS.map(num => (
                                    <div
                                        key={num}
                                        className={`${styles.chip} ${formData.bags === num ? styles.active : ''}`}
                                        onClick={() => handleBagChange(num)}
                                    >
                                        {num} Bags
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summaryCard}>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Package Info</span>
                                    <span className={styles.summaryValue}>{CATEGORIES[formData.feed_category].weight} {CATEGORIES[formData.feed_category].unit} / bag</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Total Quantity</span>
                                    <span className={styles.summaryValue}>{formData.bags} Bags ({weight} {unit})</span>
                                </div>
                                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center text-lg">
                                    <span className="font-bold text-gray-800">Total Amount</span>
                                    <span className="font-bold text-blue-600">₹{price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Additional Information</h3>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className={styles.textarea}
                            rows="2"
                            placeholder="Any special instructions..."
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={styles.submitBtn}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={20} />
                            PLACE ORDER
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateOrder;
