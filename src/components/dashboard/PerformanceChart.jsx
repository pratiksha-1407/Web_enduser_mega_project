import React from 'react';
import Card from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ data }) => {
    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Monthly Performance</h3>
            <div style={{ height: 256, width: '100%', position: 'relative', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                    <BarChart data={data}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default PerformanceChart;
