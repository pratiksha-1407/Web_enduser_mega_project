import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Dispatch = () => {
  const { user, logout } = useAuth();

  const dispatchOrders = [
    {
      id: 'DS-001',
      orderId: 'ORD-001',
      customer: 'Rajesh Kumar',
      feedType: 'Calf Starter Feed',
      quantity: '250 kg',
      dispatchDate: '2023-10-15',
      status: 'Dispatched',
      vehicle: 'MH-12 AB 1234',
    },
    {
      id: 'DS-002',
      orderId: 'ORD-002',
      customer: 'Suresh Patel',
      feedType: 'Grower Feed',
      quantity: '500 kg',
      dispatchDate: '2023-10-16',
      status: 'Ready for Dispatch',
      vehicle: 'MH-12 CD 5678',
    },
    {
      id: 'DS-003',
      orderId: 'ORD-003',
      customer: 'Anil Sharma',
      feedType: 'Lactating Cow Feed',
      quantity: '300 kg',
      dispatchDate: '2023-10-14',
      status: 'Delivered',
      vehicle: 'MH-12 EF 9012',
    },
    {
      id: 'DS-004',
      orderId: 'ORD-004',
      customer: 'Vijay Singh',
      feedType: 'Finisher Feed',
      quantity: '400 kg',
      dispatchDate: '2023-10-17',
      status: 'In Transit',
      vehicle: 'MH-12 GH 3456',
    },
    {
      id: 'DS-005',
      orderId: 'ORD-005',
      customer: 'Mohan Desai',
      feedType: 'Dry Cow Feed',
      quantity: '200 kg',
      dispatchDate: '2023-10-13',
      status: 'Delivered',
      vehicle: 'MH-12 IJ 7890',
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return theme.colors.success;
      case 'Dispatched': return theme.colors.info;
      case 'In Transit': return theme.colors.warning;
      case 'Ready for Dispatch': return theme.colors.primaryBlue;
      default: return theme.colors.textGrey;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Delivered': return theme.colors.successLight;
      case 'Dispatched': return theme.colors.infoLight;
      case 'In Transit': return theme.colors.warningLight;
      case 'Ready for Dispatch': return theme.colors.primaryLight;
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
            Dispatch Management
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
            Dispatch Orders
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dispatchOrders.map((order) => (
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
                    ...textStyles.bodySmall,
                    color: theme.colors.textGrey,
                    marginBottom: '4px',
                  }}>
                    Order ID: {order.orderId}
                  </div>
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
                  <div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                    }}>
                      Dispatch Date: {new Date(order.dispatchDate).toLocaleDateString()}
                    </div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                    }}>
                      Vehicle: {order.vehicle}
                    </div>
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

export default Dispatch;