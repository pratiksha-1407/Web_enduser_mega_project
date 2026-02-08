import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Truck, UserCircle } from 'lucide-react';

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active tab based on current path
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'dashboard';
        if (path.includes('/inventory')) return 'inventory';
        if (path.includes('/orders')) return 'orders';
        if (path.includes('/profile')) return 'profile';
        return 'dashboard';
    };

    const activeTab = getActiveTab();

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Home', path: '/production/dashboard' },
        { id: 'inventory', icon: Package, label: 'Inventory', path: '/production/inventory' },
        { id: 'orders', icon: Truck, label: 'Orders', path: '/production/orders' },
        { id: 'profile', icon: UserCircle, label: 'Profile', path: '/production/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
                            }`}
                    >
                        <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BottomNavigation;
