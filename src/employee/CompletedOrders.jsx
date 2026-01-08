import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const CompletedOrders = () => {
  const { user, logout } = useAuth();

  const completedOrders = [
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
      id: 'ORD-005',
      customer: 'Mohan Desai',
      feedType: 'Dry Cow Feed',
      quantity: '200 kg',
      date: '2023-10-11',
      status: 'Delivered',
      amount: '₹10,000',
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
    {
      id: 'ORD-008',
      customer: 'Sanjay Mehta',
      feedType: 'Grower Feed',
      quantity: '600 kg',
      date: '2023-10-08',
      status: 'Delivered',
      amount: '₹28,800',
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return theme.colors.success;
      default: return theme.colors.textGrey;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Delivered': return theme.colors.successLight;
      default: return theme.colors.softGreyBg;
    }
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
            Completed Orders
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
            Completed Cattle Feed Orders
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {completedOrders.map((order) => (
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

export default CompletedOrders;