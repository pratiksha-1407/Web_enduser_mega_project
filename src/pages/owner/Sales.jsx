import React, { useState } from 'react';
import Revenue from './Revenue';
import Orders from './Orders';
import styles from '../../styles/owner/sales.module.css';

const SalesPage = () => {
    const [activeTab, setActiveTab] = useState('revenue');

    return (
        <div className={styles.container}>
            <div className={styles.tabBar}>
                <button
                    className={`${styles.tab} ${activeTab === 'revenue' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('revenue')}
                >
                    Sales Revenue
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Order Details
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'revenue' ? <Revenue /> : <Orders />}
            </div>
        </div>
    );
};

export default SalesPage;
