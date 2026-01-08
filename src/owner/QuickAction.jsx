import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const OwnerQuickActions = () => {
  const { user, logout } = useAuth();
  
  // State for announcement
  const [announcement, setAnnouncement] = useState('');
  
  // State for target assignment
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [revenueTarget, setRevenueTarget] = useState('');
  const [orderTarget, setOrderTarget] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Mock data
  const branches = ["All Branches", "Nagpur", "Kolhapur", "Pune"];
  const marketingManagers = ["All Managers", "Amit Sharma", "Priya Verma", "Rohit Desai"];

  // Handle sending announcement
  const handleSendAnnouncement = () => {
    if (announcement.trim() === '') return;
    
    // In a real app, this would send to backend
    alert(`Announcement sent: ${announcement}`);
    setAnnouncement('');
  };

  // Handle assigning target
  const handleAssignTarget = () => {
    if (!selectedBranch || !selectedManager || !revenueTarget || !orderTarget || !selectedMonth) {
      alert('Please fill all required fields');
      return;
    }
    
    // In a real app, this would send to backend
    alert(`Target assigned: ${revenueTarget} revenue, ${orderTarget} orders for ${selectedMonth}`);
    
    // Reset form
    setSelectedBranch('');
    setSelectedManager('');
    setRevenueTarget('');
    setOrderTarget('');
    setRemarks('');
    setSelectedMonth('');
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
            Control Panel
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
        {/* Announcement Section */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '18px',
          boxShadow: `0 4px 10px ${theme.colors.shadow}`,
        }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: theme.colors.primaryText }}>
            Company Announcement
          </h2>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: theme.colors.textGrey }}>
            Broadcast message to all departments
          </p>
          
          <div style={{ marginBottom: '12px' }}>
            <textarea
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Enter announcement message..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.borderGrey}`,
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical',
              }}
            />
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <button
              onClick={handleSendAnnouncement}
              style={{
                backgroundColor: theme.colors.primaryBlue,
                color: theme.colors.white,
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Target Assignment Section */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: '14px',
          padding: '16px',
          boxShadow: `0 4px 10px ${theme.colors.shadow}`,
        }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: theme.colors.primaryText }}>
            Assign Monthly Target
          </h2>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: theme.colors.textGrey }}>
            Set revenue & order goals
          </p>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Select Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.borderGrey}`,
                fontSize: '14px',
              }}
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Marketing Manager
            </label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.borderGrey}`,
                fontSize: '14px',
              }}
            >
              <option value="">Select Manager</option>
              {marketingManagers.map((manager) => (
                <option key={manager} value={manager}>{manager}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Revenue Target (₹)
            </label>
            <input
              type="text"
              value={revenueTarget}
              onChange={(e) => setRevenueTarget(e.target.value)}
              placeholder="Enter revenue target"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.borderGrey}`,
                fontSize: '14px',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Order Target (Qty)
            </label>
            <input
              type="text"
              value={orderTarget}
              onChange={(e) => setOrderTarget(e.target.value)}
              placeholder="Enter order target"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.borderGrey}`,
                fontSize: '14px',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.borderGrey}`,
                fontSize: '14px',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: `1px solid ${theme.colors.borderGrey}`,
                fontSize: '14px',
                minHeight: '60px',
                resize: 'vertical',
              }}
            />
          </div>
          
          <button
            onClick={handleAssignTarget}
            style={{
              backgroundColor: theme.colors.primaryBlue,
              color: theme.colors.white,
              border: 'none',
              padding: '12px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '14px',
            }}
          >
            Assign Target
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerQuickActions;