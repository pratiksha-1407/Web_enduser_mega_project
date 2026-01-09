import { useState, useEffect } from 'react';
import { marketingService } from '../../services/marketingService';
import { supabase } from '../../services/supabaseClient';
import styles from '../../styles/marketing/order.module.css';
import {
    User,
    Phone,
    MapPin,
    Package,
    CheckCircle2,
    ArrowLeft,
    Info,
    ChevronDown,
    FileText,
    RefreshCw
} from 'lucide-react';

const OrderPage = () => {
    const [step, setStep] = useState(1); // 1: Form, 2: Success
    const [loading, setLoading] = useState(false);
    const [managerProfile, setManagerProfile] = useState(null);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_mobile: '',
        customer_address: '',
        feed_category: '',
        bags: 1,
        remarks: ''
    });

    const categories = {
        "मिल्क पॉवर / Milk Power": { weight: 20, unit: "kg", price: 350 },
        "दुध सरिता / Dugdh Sarita": { weight: 25, unit: "kg", price: 450 },
        "दुग्धराज / Dugdh Raj": { weight: 30, unit: "kg", price: 600 },
        "डायमंड संतुलित पशु आहार / Diamond Balanced Animal Feed": { weight: 10, unit: "kg", price: 800 },
        "मिल्क पॉवर प्लस / Milk Power Plus": { weight: 5, unit: "kg", price: 1200 },
        "संतुलित पशु आहार / Santulit Pashu Aahar": { weight: 5, unit: "kg", price: 1200 },
        "जीवन धारा / Jeevan Dhara": { weight: 5, unit: "kg", price: 1200 },
        "Dairy Special संतुलित पशु आहार": { weight: 5, unit: "kg", price: 1200 },
    };

    const bagOptions = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50];

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const profile = await marketingService.getProfile(user.id);
                setManagerProfile(profile);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const categoryInfo = categories[formData.feed_category];
            const orderPayload = {
                ...formData,
                branch: managerProfile.branch,
                manager_id: managerProfile.id,
                total_weight: formData.bags * categoryInfo.weight,
                unit: categoryInfo.unit,
                total_price: formData.bags * categoryInfo.price,
                status: 'Pending',
                ordered_at: new Date().toISOString()
            };

            await marketingService.placeOrder(orderPayload);
            setStep(2);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        const categoryInfo = categories[formData.feed_category];
        const totalPrice = formData.bags * categoryInfo.price;
        const totalWeight = formData.bags * categoryInfo.weight;

        return (
            <div className={styles.successContainer}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                        <CheckCircle2 size={64} />
                    </div>
                    <h1 className={styles.successTitle}>Order Confirmed!</h1>
                    <p className={styles.successMsg}>Your order has been placed successfully and sent to production.</p>

                    <div className={styles.receipt}>
                        <div className={styles.receiptHeader}>Order Summary</div>
                        <div className={styles.receiptRow}>
                            <span>Customer</span>
                            <span>{formData.customer_name}</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span>Feed Type</span>
                            <span>{formData.feed_category}</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span>Quantity</span>
                            <span>{formData.bags} Bags</span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span>Total Weight</span>
                            <span>{totalWeight} {categoryInfo.unit}</span>
                        </div>
                        <div className={styles.divider}></div>
                        <div className={`${styles.receiptRow} ${styles.total}`}>
                            <span>Total Amount</span>
                            <span>₹{totalPrice}</span>
                        </div>
                    </div>

                    <div className={styles.actionRow}>
                        <button
                            className={styles.secondaryBtn}
                            onClick={() => {
                                setFormData({
                                    customer_name: '',
                                    customer_mobile: '',
                                    customer_address: '',
                                    feed_category: '',
                                    bags: 1,
                                    remarks: ''
                                });
                                setStep(1);
                            }}
                        >
                            Place Another Order
                        </button>
                        <button
                            className={styles.primaryBtn}
                            onClick={() => window.history.back()}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <div className={styles.formHeader}>
                    <h2>Place New Feed Order</h2>
                    <p>Enter customer and order details below</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Customer Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Customer Information</h3>
                        <div className={styles.grid}>
                            <div className={styles.inputGroup}>
                                <label><User size={14} /> Customer Name *</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label><Phone size={14} /> Mobile Number *</label>
                                <input
                                    type="tel"
                                    name="customer_mobile"
                                    value={formData.customer_mobile}
                                    onChange={handleInputChange}
                                    placeholder="10-digit Number"
                                    pattern="[0-9]{10}"
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label><MapPin size={14} /> Delivery Address *</label>
                            <textarea
                                name="customer_address"
                                value={formData.customer_address}
                                onChange={handleInputChange}
                                placeholder="Full Address with Landmark"
                                rows="2"
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Order Section */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Order Details</h3>
                        <div className={styles.inputGroup}>
                            <label><Package size={14} /> Feed Category *</label>
                            <div className={styles.selectWrapper}>
                                <select
                                    name="feed_category"
                                    value={formData.feed_category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {Object.keys(categories).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <ChevronDown className={styles.chevron} />
                            </div>
                        </div>

                        {formData.feed_category && (
                            <div className={styles.bagsSection}>
                                <label>Number of Bags *</label>
                                <div className={styles.chipGrid}>
                                    {bagOptions.map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            className={`${styles.chip} ${formData.bags === opt ? styles.chipActive : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, bags: opt }))}
                                        >
                                            {opt} Bag{opt > 1 ? 's' : ''}
                                        </button>
                                    ))}
                                </div>
                                <div className={styles.infoBox}>
                                    <Info size={16} />
                                    <span>Each bag contains {categories[formData.feed_category].weight} {categories[formData.feed_category].unit}</span>
                                </div>

                                <div className={styles.calculationCard}>
                                    <div className={styles.calcRow}>
                                        <div className={styles.calcItem}>
                                            <span className={styles.calcLabel}>Total Quantity</span>
                                            <span className={styles.calcValue}>{formData.bags} Bags</span>
                                        </div>
                                        <div className={styles.calcItem}>
                                            <span className={styles.calcLabel}>Total Weight</span>
                                            <span className={styles.calcValue}>
                                                {formData.bags * categories[formData.feed_category].weight} {categories[formData.feed_category].unit}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.calcRow}>
                                        <div className={styles.calcItem}>
                                            <span className={styles.calcLabel}>Price per Bag</span>
                                            <span className={styles.calcValue}>₹{categories[formData.feed_category].price}</span>
                                        </div>
                                        <div className={styles.calcItem}>
                                            <span className={styles.calcLabel}>Grand Total</span>
                                            <span className={styles.grandTotal}>₹{formData.bags * categories[formData.feed_category].price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Additional Information</h3>
                        <div className={styles.inputGroup}>
                            <label><FileText size={14} /> Remarks (Optional)</label>
                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleInputChange}
                                placeholder="Any special instructions..."
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading || !formData.feed_category}
                    >
                        {loading ? <RefreshCw className={styles.spin} /> : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderPage;
