import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const ViewReports = () => {
  const { user, logout } = useAuth();
  
  const [showTargets, setShowTargets] = useState(true);
  const [expandedAnnouncementIndex, setExpandedAnnouncementIndex] = useState(null);

  // Mock data for assigned targets
  const assignedTargets = [
    {
      branch: "All Branches",
      manager: "All Managers",
      month: "October 2023",
      revenue: "5000000",
      orders: "500",
      remarks: "Quarterly target increase by 10%"
    },
    {
      branch: "Pune Branch",
      manager: "Rajesh Kumar",
      month: "October 2023",
      revenue: "1200000",
      orders: "120",
      remarks: "Focus on new customer acquisition"
    },
    {
      branch: "Mumbai Branch",
      manager: "Priya Sharma",
      month: "October 2023",
      revenue: "1500000",
      orders: "150",
      remarks: "New product launch support needed"
    }
  ];

  // Mock data for activity logs (announcements)
  const activityLogs = [
    {
      type: "announcement",
      message: "New safety protocols effective from next week. All staff must attend mandatory training session.",
      time: "15 Oct 2023 • 10:30 AM"
    },
    {
      type: "announcement",
      message: "Quarterly performance review scheduled for next month. Managers prepare reports.",
      time: "10 Oct 2023 • 02:15 PM"
    },
    {
      type: "announcement",
      message: "New inventory management system going live next Monday. Training sessions available.",
      time: "05 Oct 2023 • 11:45 AM"
    }
  ];

  // Filter announcements
  const announcements = activityLogs.filter(log => log.type === "announcement");

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
            Owner Reports
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
        {/* Toggle Buttons */}
        <div style={{
          backgroundColor: theme.colors.cardBg,
          borderRadius: '14px',
          marginBottom: '20px',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex' }}>
            <button
              onClick={() => setShowTargets(true)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: showTargets ? theme.colors.primaryBlue : 'transparent',
                color: showTargets ? theme.colors.white : theme.colors.primaryBlue,
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Assigned Targets
            </button>
            <button
              onClick={() => setShowTargets(false)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: !showTargets ? theme.colors.primaryBlue : 'transparent',
                color: !showTargets ? theme.colors.white : theme.colors.primaryBlue,
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Announcements
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {showTargets ? (
            // Targets View
            <div>
              {assignedTargets.length === 0 ? (
                <div style={{
                  backgroundColor: theme.colors.cardBg,
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  color: theme.colors.textGrey,
                }}>
                  No targets assigned yet
                </div>
              ) : (
                assignedTargets.map((target, index) => {
                  const isSummary = 
                    target.branch === "All Branches" || target.manager === "All Managers";
                  
                  return (
                    <div 
                      key={index}
                      style={{
                        backgroundColor: theme.colors.cardBg,
                        borderRadius: '14px',
                        padding: '16px',
                        marginBottom: '14px',
                        boxShadow: `0 4px 10px ${theme.colors.shadow}`,
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: theme.colors.primaryBlue, fontSize: '16px' }}>🚩</span>
                        <div style={{ flex: 1, marginLeft: '8px' }}>
                          <div style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                          }}>
                            {isSummary ? "Target Assigned to All" : `${target.branch} • ${target.month}`}
                          </div>
                        </div>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: theme.colors.primaryBlue,
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: '4px',
                        }}>
                          ✏️
                        </button>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: theme.colors.danger,
                          fontSize: '16px',
                          cursor: 'pointer',
                          padding: '4px',
                        }}>
                          🗑️
                        </button>
                      </div>

                      {/* Info Rows */}
                      <div style={{ padding: '4px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span style={{ color: theme.colors.textGrey }}>Branch</span>
                          <span style={{ fontWeight: '600' }}>{target.branch}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span style={{ color: theme.colors.textGrey }}>Manager</span>
                          <span style={{ fontWeight: '600' }}>{target.manager}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span style={{ color: theme.colors.textGrey }}>Month</span>
                          <span style={{ fontWeight: '600' }}>{target.month}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span style={{ color: theme.colors.textGrey }}>Revenue</span>
                          <span style={{ fontWeight: '600' }}>₹{parseInt(target.revenue).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span style={{ color: theme.colors.textGrey }}>Orders</span>
                          <span style={{ fontWeight: '600' }}>{target.orders}</span>
                        </div>

                        {target.remarks && (
                          <div style={{ paddingTop: '8px' }}>
                            <div style={{ 
                              fontSize: '12px', 
                              color: theme.colors.textGrey,
                            }}>
                              Remarks: {target.remarks}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            // Announcements View
            <div>
              {announcements.length === 0 ? (
                <div style={{
                  backgroundColor: theme.colors.cardBg,
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  color: theme.colors.textGrey,
                }}>
                  No announcements sent yet
                </div>
              ) : (
                announcements.map((announcement, index) => {
                  const isExpanded = expandedAnnouncementIndex === index;
                  
                  return (
                    <div 
                      key={index}
                      style={{
                        backgroundColor: theme.colors.cardBg,
                        borderRadius: '14px',
                        padding: '16px',
                        marginBottom: '14px',
                        boxShadow: `0 4px 10px ${theme.colors.shadow}`,
                      }}
                      onClick={() => setExpandedAnnouncementIndex(isExpanded ? null : index)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: theme.colors.primaryBlue, fontSize: '16px' }}>📢</span>
                        <div style={{ flex: 1, marginLeft: '8px' }}>
                          <div style={{ 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                          }}>
                            Announcement
                          </div>
                        </div>
                        <span style={{ 
                          fontSize: '16px',
                          cursor: 'pointer',
                        }}>
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                      
                      <div style={{ 
                        fontSize: '12px', 
                        color: theme.colors.textGrey,
                        marginBottom: '6px',
                      }}>
                        {announcement.time}
                      </div>
                      
                      {isExpanded && (
                        <>
                          <hr style={{ 
                            border: 'none', 
                            borderTop: `1px solid ${theme.colors.borderGrey}`,
                            margin: '12px 0',
                          }} />
                          <div style={{ 
                            fontSize: '15px', 
                            fontWeight: '500',
                          }}>
                            {announcement.message}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewReports;