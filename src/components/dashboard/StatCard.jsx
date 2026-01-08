import React from 'react';
import Card from '../ui/Card';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="flex items-center p-4">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
    </Card>
);

export default StatCard;
