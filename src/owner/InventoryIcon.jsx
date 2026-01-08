import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const Inventory = () => {
  const { user, logout } = useAuth();
  
  // Initial mock data for inventory
  const [branches, setBranches] = useState([
    {
      name: "Karad",
      stock: 420,
      sold: 120,
      inbound: 80,
      color: theme.colors.primaryBlue,
    },
    {
      name: "Satara",
      stock: 320,
      sold: 150,
      inbound: 60,
      color: theme.colors.primaryBlue,
    },
    {
      name: "Patan",
      stock: 210,
      sold: 80,
      inbound: 50,
      color: theme.colors.primaryBlue,
    },
    {
      name: "Koynanagar",
      stock: 160,
      sold: 60,
      inbound: 40,
      color: theme.colors.primaryBlue,
    },
  ]);

  // Simulate live updating values every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBranches(prevBranches => 
        prevBranches.map(branch => ({
          ...branch,
          stock: Math.max(0, branch.stock + (5 - branch.sold % 3)),
          sold: branch.sold + 2,
          inbound: branch.inbound + 1,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            Inventory Dashboard
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
        {/* Chart Card - Stock vs Sold */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '18px',
          padding: '18px',
          marginBottom: '20px',
          boxShadow: `0 4px 10px ${theme.colors.shadow}`,
        }}>
          <h2 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: theme.colors.primaryBlue,
            textAlign: 'center'
          }}>
            Stock vs Sold (Taluka-wise)
          </h2>
          
          {/* Chart Placeholder */}
          <div style={{
            height: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.softGreyBg,
            borderRadius: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ textAlign: 'center', color: theme.colors.textGrey }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>Inventory Chart</div>
              <div>Bar chart visualization would go here</div>
            </div>
          </div>
        </div>

        {/* Branch-wise Cards */}
        <div>
          {branches.map((branch, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: theme.colors.white,
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '16px',
                border: `1px solid ${theme.colors.borderGrey}`,
                boxShadow: `0 4px 10px ${theme.colors.shadow}`,
              }}
            >
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: theme.colors.primaryBlue,
                marginBottom: '10px' 
              }}>
                {branch.name}
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: theme.colors.primaryBlue, 
                    fontSize: '20px', 
                    fontWeight: 'bold' 
                  }}>
                    {branch.stock}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: theme.colors.textGrey 
                  }}>
                    Stock (kg)
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: theme.colors.primaryBlue, 
                    fontSize: '20px', 
                    fontWeight: 'bold' 
                  }}>
                    {branch.sold}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: theme.colors.textGrey 
                  }}>
                    Sold (kg)
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: theme.colors.primaryBlue, 
                    fontSize: '20px', 
                    fontWeight: 'bold' 
                  }}>
                    {branch.inbound}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: theme.colors.textGrey 
                  }}>
                    Inbound (kg)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;