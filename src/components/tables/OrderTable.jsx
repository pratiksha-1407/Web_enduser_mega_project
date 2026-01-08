import React from 'react';
import { Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    let colorClass, Icon;

    switch (status) {
        case 'completed':
            colorClass = 'bg-green-100 text-green-700';
            Icon = CheckCircle;
            break;
        case 'pending':
            colorClass = 'bg-yellow-100 text-yellow-700';
            Icon = Clock;
            break;
        case 'cancelled':
            colorClass = 'bg-red-100 text-red-700';
            Icon = XCircle;
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-700';
            Icon = Clock;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            <Icon size={12} className="mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const OrderTable = ({ orders, onViewDetails }) => {
    if (!orders || orders.length === 0) {
        return <div className="p-8 text-center text-gray-500">No orders found.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                #{order.order_number || order.id.slice(0, 8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {order.customer_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order.feed_category} <span className="text-xs text-gray-400">({order.bags} bags)</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ₹{order.total_price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={order.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onViewDetails(order)}
                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <Eye size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
