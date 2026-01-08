import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const CreateOrder = () => {
  const { user, logout } = useAuth();

  const [orderData, setOrderData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    feedType: '',
    quantity: '',
    deliveryDate: '',
    specialInstructions: '',
  });

  const feedTypes = [
    'Calf Starter Feed',
    'Grower Feed',
    'Finisher Feed',
    'Lactating Cow Feed',
    'Dry Cow Feed',
    'Bull Feed',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', orderData);
    // In a real app, this would make an API call
    alert('Order created successfully!');
    setOrderData({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      feedType: '',
      quantity: '',
      deliveryDate: '',
      specialInstructions: '',
    });
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
            Create Order
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
        <form onSubmit={handleSubmit}>
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
              New Cattle Feed Order
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Customer Information */}
              <div>
                <label style={{
                  display: 'block',
                  ...textStyles.label,
                  color: theme.colors.primaryText,
                  marginBottom: '6px',
                }}>
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={orderData.customerName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${theme.colors.borderGrey}`,
                    borderRadius: '8px',
                    ...textStyles.bodyMedium,
                  }}
                  required
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  ...textStyles.label,
                  color: theme.colors.primaryText,
                  marginBottom: '6px',
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={orderData.customerPhone}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${theme.colors.borderGrey}`,
                    borderRadius: '8px',
                    ...textStyles.bodyMedium,
                  }}
                  required
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  ...textStyles.label,
                  color: theme.colors.primaryText,
                  marginBottom: '6px',
                }}>
                  Address
                </label>
                <textarea
                  name="customerAddress"
                  value={orderData.customerAddress}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${theme.colors.borderGrey}`,
                    borderRadius: '8px',
                    ...textStyles.bodyMedium,
                    minHeight: '80px',
                  }}
                  required
                />
              </div>

              {/* Feed Type */}
              <div>
                <label style={{
                  display: 'block',
                  ...textStyles.label,
                  color: theme.colors.primaryText,
                  marginBottom: '6px',
                }}>
                  Feed Type
                </label>
                <select
                  name="feedType"
                  value={orderData.feedType}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${theme.colors.borderGrey}`,
                    borderRadius: '8px',
                    ...textStyles.bodyMedium,
                    backgroundColor: theme.colors.white,
                  }}
                  required
                >
                  <option value="">Select Feed Type</option>
                  {feedTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    ...textStyles.label,
                    color: theme.colors.primaryText,
                    marginBottom: '6px',
                  }}>
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={orderData.quantity}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${theme.colors.borderGrey}`,
                      borderRadius: '8px',
                      ...textStyles.bodyMedium,
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    ...textStyles.label,
                    color: theme.colors.primaryText,
                    marginBottom: '6px',
                  }}>
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={orderData.deliveryDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `1px solid ${theme.colors.borderGrey}`,
                      borderRadius: '8px',
                      ...textStyles.bodyMedium,
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  ...textStyles.label,
                  color: theme.colors.primaryText,
                  marginBottom: '6px',
                }}>
                  Special Instructions
                </label>
                <textarea
                  name="specialInstructions"
                  value={orderData.specialInstructions}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: `1px solid ${theme.colors.borderGrey}`,
                    borderRadius: '8px',
                    ...textStyles.bodyMedium,
                    minHeight: '80px',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '16px',
                  backgroundColor: theme.colors.primaryBlue,
                  color: theme.colors.white,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Create Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;