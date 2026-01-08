import React, { useState, useEffect } from 'react';

const OrderForm = ({ onSubmit, products }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_mobile: '',
        customer_address: '',
        feed_category: '',
        bags: 1,
        weight_per_bag: 0,
        weight_unit: 'kg',
        price_per_bag: 0,
        remarks: ''
    });

    // Auto-fill price & weight based on selected product
    const handleProductChange = (e) => {
        const productId = e.target.value; // In this simplified case we might store category name or ID
        // Assuming feed_category stores the product NAME for now as per Flutter model
        // Ideally it should be ID, but preserving Flutter logic where category seems key
        const product = products.find(p => p.name === productId || p.category === productId);

        if (product) {
            setFormData(prev => ({
                ...prev,
                feed_category: product.category || product.name,
                weight_per_bag: product.weight_per_bag,
                price_per_bag: product.price_per_bag,
                weight_unit: product.weight_unit || 'kg'
            }));
        } else {
            setFormData(prev => ({ ...prev, feed_category: productId }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Calculate totals
        const total_weight = formData.bags * formData.weight_per_bag;
        const total_price = formData.bags * formData.price_per_bag;

        onSubmit({
            ...formData,
            total_weight,
            total_price,
            bags: parseInt(formData.bags),
            weight_per_bag: parseInt(formData.weight_per_bag),
            price_per_bag: parseInt(formData.price_per_bag)
        });
    };

    const totalPrice = formData.bags * formData.price_per_bag;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                        required
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter full name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                        required
                        name="customer_mobile"
                        value={formData.customer_mobile}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        placeholder="10-digit number"
                        pattern="[0-9]{10}"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        required
                        name="customer_address"
                        value={formData.customer_address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Delivery address"
                    />
                </div>
            </div>

            <div className="border-t border-gray-200 py-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Order Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                        <select
                            required
                            name="feed_category"
                            onChange={handleProductChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white"
                        >
                            <option value="">Select Product API</option>
                            {products.map(p => (
                                <option key={p.id} value={p.category}>{p.name} ({p.category})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bags</label>
                        <input
                            required
                            type="number"
                            min="1"
                            name="bags"
                            value={formData.bags}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Bag (₹)</label>
                        <input
                            readOnly
                            value={formData.price_per_bag}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                        />
                    </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-sm text-blue-800">Total Weight: <span className="font-bold">{formData.bags * formData.weight_per_bag} {formData.weight_unit}</span></p>
                    </div>
                    <div>
                        <p className="text-lg text-blue-900">Total Payable: <span className="font-bold text-2xl">₹{totalPrice.toLocaleString()}</span></p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
                <input
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5"
                    placeholder="Any special instructions..."
                />
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                >
                    Create Order
                </button>
            </div>
        </form>
    );
};

export default OrderForm;
