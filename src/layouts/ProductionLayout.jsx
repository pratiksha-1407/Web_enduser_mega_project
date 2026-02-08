import React from 'react';
import Dashboard from '../pages/production/Dashboard';

export default function ProductionLayout() {
    return (
        <div style={{ height: '100vh', width: '100vw', overflowY: 'auto' }}>
            <Dashboard />
        </div>
    );
}
