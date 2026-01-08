import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder, fetchProducts } from '../../services/apiOrders';
import OrderForm from '../../components/forms/OrderForm';
import Card from '../../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

const CreateOrderPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
            setLoading(false);
        };
        loadProducts();
    }, []);

    const handleCreateOrder = async (formData) => {
        const result = await createOrder(formData);
        if (result.success) {
            navigate('/employee/orders');
        } else {
            alert('Failed to create order: ' + result.error);
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
            >
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            <h1 className="text-2xl font-bold mb-6">Create New Order</h1>
            <Card className="p-6">
                <OrderForm onSubmit={handleCreateOrder} products={products} />
            </Card>
        </div>
    );
};

export default CreateOrderPage;
