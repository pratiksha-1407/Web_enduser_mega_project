import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../services/apiOrders';
import OrderTable from '../../components/tables/OrderTable';
import Card from '../../components/ui/Card';
import { Plus, Filter } from 'lucide-react';

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadOrders();
    }, [filterStatus]);

    const loadOrders = async () => {
        setLoading(true);
        const { data } = await fetchOrders({ status: filterStatus });
        setOrders(data);
        setLoading(false);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
                    <p className="text-gray-500">Manage and track all customer orders</p>
                </div>
                <button
                    onClick={() => navigate('/employee/orders/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-all"
                >
                    <Plus size={18} className="mr-2" /> Create New Order
                </button>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Filter Status:</span>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="text-sm border-none bg-transparent focus:ring-0 font-medium text-gray-800 cursor-pointer"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading orders...</div>
                ) : (
                    <OrderTable orders={orders} onViewDetails={(order) => console.log('View', order)} />
                )}
            </Card>
        </div>
    );
};

export default OrderHistoryPage;
