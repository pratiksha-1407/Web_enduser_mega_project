import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Orders = () => {
  const { user, logout } = useAuth();

  const productionOrders = [
    {
      id: 'PO-001',
      customer: 'Rajesh Kumar',
      feedType: 'Calf Starter Feed',
      quantity: '250 kg',
      dueDate: '2023-10-20',
      status: 'In Progress',
      progress: 65,
    },
    {
      id: 'PO-002',
      customer: 'Suresh Patel',
      feedType: 'Grower Feed',
      quantity: '500 kg',
      dueDate: '2023-10-22',
      status: 'Scheduled',
      progress: 0,
    },
    {
      id: 'PO-003',
      customer: 'Anil Sharma',
      feedType: 'Lactating Cow Feed',
      quantity: '300 kg',
      dueDate: '2023-10-18',
      status: 'Completed',
      progress: 100,
    },
    {
      id: 'PO-004',
      customer: 'Vijay Singh',
      feedType: 'Finisher Feed',
      quantity: '400 kg',
      dueDate: '2023-10-25',
      status: 'In Progress',
      progress: 30,
    },
    {
      id: 'PO-005',
      customer: 'Mohan Desai',
      feedType: 'Dry Cow Feed',
      quantity: '200 kg',
      dueDate: '2023-10-17',
      status: 'Completed',
      progress: 100,
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return theme.colors.success;
      case 'In Progress': return theme.colors.warning;
      case 'Scheduled': return theme.colors.info;
      default: return theme.colors.textGrey;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Completed': return theme.colors.successLight;
      case 'In Progress': return theme.colors.warningLight;
      case 'Scheduled': return theme.colors.infoLight;
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
            Production Orders
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
            Production Orders Management
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {productionOrders.map((order) => (
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
                
                <div style={{ marginBottom: '12px' }}>
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
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    ...textStyles.label,
                    color: theme.colors.textGrey,
                    marginBottom: '4px',
                  }}>
                    Due Date: {new Date(order.dueDate).toLocaleDateString()}
                  </div>
                  
                  {order.status !== 'Completed' && (
                    <div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                      }}>
                        <span style={{ ...textStyles.label, color: theme.colors.textGrey }}>
                          Production Progress
                        </span>
                        <span style={{ ...textStyles.label, color: theme.colors.textGrey }}>
                          {order.progress}%
                        </span>
                      </div>
                      <div style={{
                        height: '8px',
                        backgroundColor: theme.colors.softGreyBg,
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <div 
                          style={{
                            height: '100%',
                            width: `${order.progress}%`,
                            backgroundColor: order.status === 'In Progress' ? theme.colors.warning : theme.colors.info,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;