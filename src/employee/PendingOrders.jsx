import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const PendingOrders = () => {
  const { user, logout } = useAuth();

  const pendingOrders = [
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
      id: 'ORD-006',
      customer: 'Amit Verma',
      feedType: 'Bull Feed',
      quantity: '350 kg',
      date: '2023-10-10',
      status: 'Processing',
      amount: '₹17,500',
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Transit': return theme.colors.warning;
      case 'Processing': return theme.colors.info;
      case 'Confirmed': return theme.colors.primaryBlue;
      default: return theme.colors.textGrey;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'In Transit': return theme.colors.warningLight;
      case 'Processing': return theme.colors.infoLight;
      case 'Confirmed': return theme.colors.primaryLight;
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
            Pending Orders
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
            Pending Cattle Feed Orders
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingOrders.map((order) => (
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

export default PendingOrders;