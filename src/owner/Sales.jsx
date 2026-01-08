import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Sales = () => {
  const { user, logout } = useAuth();

  // Mock data for sales
  const salesData = [
    { id: 1, customer: 'ABC Dairy', location: 'Pune', quantity: '500 kg', amount: '₹25,000', date: '2023-10-15', status: 'Delivered' },
    { id: 2, customer: 'XYZ Poultry', location: 'Mumbai', quantity: '300 kg', amount: '₹18,000', date: '2023-10-16', status: 'Pending' },
    { id: 3, customer: 'MNO Cattle Farm', location: 'Nagpur', quantity: '750 kg', amount: '₹37,500', date: '2023-10-17', status: 'Processing' },
    { id: 4, customer: 'PQR Livestock', location: 'Kolhapur', quantity: '400 kg', amount: '₹22,000', date: '2023-10-18', status: 'Delivered' },
  ];

  const summaryData = [
    { title: 'Total Sales', value: '₹1,02,500', icon: '💰' },
    { title: 'Total Orders', value: '4', icon: '📦' },
    { title: 'Avg. Order Value', value: '₹25,625', icon: '📊' },
    { title: 'Pending Orders', value: '1', icon: '⏳' },
  ];

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
            Sales Dashboard
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
        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}>
          {summaryData.map((item, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: theme.colors.white,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: `0 4px 10px ${theme.colors.shadow}`,
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', color: theme.colors.primaryText }}>
                {item.value}
              </div>
              <div style={{ color: theme.colors.textGrey, fontSize: '12px' }}>
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {/* Sales Table */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: `0 4px 10px ${theme.colors.shadow}`,
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: theme.colors.primaryText }}>
            Recent Sales
          </h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${theme.colors.borderGrey}` }}>
                  <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', color: theme.colors.textGrey }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', color: theme.colors.textGrey }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', color: theme.colors.textGrey }}>Quantity</th>
                  <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', color: theme.colors.textGrey }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', color: theme.colors.textGrey }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px', fontSize: '14px', color: theme.colors.textGrey }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale) => (
                  <tr key={sale.id} style={{ borderBottom: `1px solid ${theme.colors.borderGrey}` }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{sale.customer}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{sale.location}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{sale.quantity}</td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold' }}>{sale.amount}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{sale.date}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: sale.status === 'Delivered' ? theme.colors.successLight : 
                                        sale.status === 'Processing' ? theme.colors.warning + '20' : 
                                        theme.colors.textLightGrey,
                        color: sale.status === 'Delivered' ? theme.colors.successGreen : 
                               sale.status === 'Processing' ? theme.colors.warning : 
                               theme.colors.mutedText,
                      }}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '12px',
          padding: '16px',
          marginTop: '24px',
          boxShadow: `0 4px 10px ${theme.colors.shadow}`,
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', color: theme.colors.primaryText }}>
            Sales Trend
          </h2>
          <div style={{
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.softGreyBg,
            borderRadius: '8px',
          }}>
            <div style={{ textAlign: 'center', color: theme.colors.textGrey }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>Sales Trend Chart</div>
              <div>Line chart visualization would go here</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;