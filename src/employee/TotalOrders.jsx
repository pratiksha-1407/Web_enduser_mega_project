import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const TotalOrders = () => {
  const { user, logout } = useAuth();
  
  const [filter, setFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      customer: 'Rajesh Kumar',
      feedType: 'Calf Starter Feed',
      quantity: '250 kg',
      date: '2023-10-15',
      status: 'Delivered',
      amount: '₹12,500',
    },
    {
      id: 'ORD-002',
      customer: 'Suresh Patel',
      feedType: 'Grower Feed',
      quantity: '500 kg',
      date: '2023-10-14',
      status: 'In Transit',
      amount: '₹24,000',
    },
    {
      id: 'ORD-003',
      customer: 'Anil Sharma',
      feedType: 'Lactating Cow Feed',
      quantity: '300 kg',
      date: '2023-10-13',
      status: 'Processing',
      amount: '₹18,000',
    },
    {
      id: 'ORD-004',
      customer: 'Vijay Singh',
      feedType: 'Finisher Feed',
      quantity: '400 kg',
      date: '2023-10-12',
      status: 'Confirmed',
      amount: '₹20,000',
    },
    {
      id: 'ORD-005',
      customer: 'Mohan Desai',
      feedType: 'Dry Cow Feed',
      quantity: '200 kg',
      date: '2023-10-11',
      status: 'Delivered',
      amount: '₹10,000',
    },
    {
      id: 'ORD-006',
      customer: 'Amit Verma',
      feedType: 'Bull Feed',
      quantity: '350 kg',
      date: '2023-10-10',
      status: 'Processing',
      amount: '₹17,500',
    },
    {
      id: 'ORD-007',
      customer: 'Ravi Gupta',
      feedType: 'Calf Starter Feed',
      quantity: '400 kg',
      date: '2023-10-09',
      status: 'Delivered',
      amount: '₹20,000',
    },
  ];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return theme.colors.success;
      case 'In Transit': return theme.colors.warning;
      case 'Processing': return theme.colors.info;
      case 'Confirmed': return theme.colors.primaryBlue;
      default: return theme.colors.textGrey;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Delivered': return theme.colors.successLight;
      case 'In Transit': return theme.colors.warningLight;
      case 'Processing': return theme.colors.infoLight;
      case 'Confirmed': return theme.colors.primaryLight;
      default: return theme.colors.softGreyBg;
    }
  };

  const statusCounts = {
    all: orders.length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    'in transit': orders.filter(o => o.status === 'In Transit').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* App Bar */}
      <div style={{
        backgroundColor: theme.colors.primaryBlue,
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            color: theme.colors.white,
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            Total Orders
          </span>
        </div>
        <button 
          onClick={logout}
          style={{
            backgroundColor: theme.colors.white,
            color: theme.colors.primaryBlue,
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          Logout
        </button>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Status Filters */}
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          marginBottom: '16px',
          paddingBottom: '4px',
        }}>
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'delivered', label: 'Delivered', count: statusCounts.delivered },
            { key: 'in transit', label: 'In Transit', count: statusCounts['in transit'] },
            { key: 'processing', label: 'Processing', count: statusCounts.processing },
            { key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
          ].map((status) => (
            <button
              key={status.key}
              onClick={() => setFilter(status.key)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === status.key ? theme.colors.primaryBlue : theme.colors.white,
                color: filter === status.key ? theme.colors.white : theme.colors.textGrey,
                border: `1px solid ${theme.colors.borderGrey}`,
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {status.label} ({status.count})
            </button>
          ))}
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: theme.colors.white,
          borderRadius: '16px',
          boxShadow: `0 12px 12px ${theme.colors.shadowGrey}`,
        }}>
          <h2 style={{
            ...textStyles.headingMedium,
            color: theme.colors.primaryText,
            marginBottom: '20px',
          }}>
            All Cattle Feed Orders
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                style={{
                  padding: '16px',
                  border: `1px solid ${theme.colors.borderGrey}`,
                  borderRadius: '8px',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    ...textStyles.bodyMedium,
                    fontWeight: 'bold',
                    color: theme.colors.primaryText,
                  }}>
                    {order.id}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusBg(order.status),
                    color: getStatusColor(order.status),
                    ...textStyles.label,
                  }}>
                    {order.status}
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{
                    ...textStyles.bodyMedium,
                    color: theme.colors.primaryText,
                    marginBottom: '4px',
                  }}>
                    {order.customer}
                  </div>
                  <div style={{
                    ...textStyles.bodySmall,
                    color: theme.colors.textGrey,
                  }}>
                    {order.feedType} | {order.quantity}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{
                    ...textStyles.bodySmall,
                    color: theme.colors.textGrey,
                  }}>
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                  <div style={{
                    ...textStyles.bodyMedium,
                    fontWeight: 'bold',
                    color: theme.colors.primaryText,
                  }}>
                    {order.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalOrders;