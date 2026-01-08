import React from 'react';
import { useAuth } from '../context/AuthContext';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const QualityControl = () => {
  const { user, logout } = useAuth();

  const qualityTests = [
    {
      id: 'QC-001',
      productName: 'Calf Starter Feed',
      batchNumber: 'BATCH-001',
      testDate: '2023-10-15',
      status: 'Passed',
      parameters: {
        protein: '18.5%',
        moisture: '12.2%',
        fat: '4.1%',
        fiber: '5.8%',
      },
    },
    {
      id: 'QC-002',
      productName: 'Grower Feed',
      batchNumber: 'BATCH-002',
      testDate: '2023-10-14',
      status: 'Passed',
      parameters: {
        protein: '16.2%',
        moisture: '11.8%',
        fat: '3.9%',
        fiber: '6.1%',
      },
    },
    {
      id: 'QC-003',
      productName: 'Finisher Feed',
      batchNumber: 'BATCH-003',
      testDate: '2023-10-13',
      status: 'Failed',
      parameters: {
        protein: '14.5%',
        moisture: '13.5%',
        fat: '3.2%',
        fiber: '7.2%',
      },
    },
    {
      id: 'QC-004',
      productName: 'Lactating Cow Feed',
      batchNumber: 'BATCH-004',
      testDate: '2023-10-12',
      status: 'Passed',
      parameters: {
        protein: '17.8%',
        moisture: '11.5%',
        fat: '4.3%',
        fiber: '5.5%',
      },
    },
    {
      id: 'QC-005',
      productName: 'Dry Cow Feed',
      batchNumber: 'BATCH-005',
      testDate: '2023-10-11',
      status: 'Pending',
      parameters: {
        protein: 'N/A',
        moisture: 'N/A',
        fat: 'N/A',
        fiber: 'N/A',
      },
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Passed': return theme.colors.success;
      case 'Failed': return theme.colors.danger;
      case 'Pending': return theme.colors.warning;
      default: return theme.colors.textGrey;
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'Passed': return theme.colors.successLight;
      case 'Failed': return theme.colors.dangerLight;
      case 'Pending': return theme.colors.warningLight;
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
            Quality Control
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
            Quality Control Tests
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {qualityTests.map((test) => (
              <div 
                key={test.id}
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
                    {test.id}
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusBg(test.status),
                    color: getStatusColor(test.status),
                    ...textStyles.label,
                  }}>
                    {test.status}
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    ...textStyles.bodyMedium,
                    color: theme.colors.primaryText,
                    marginBottom: '4px',
                  }}>
                    {test.productName}
                  </div>
                  <div style={{
                    ...textStyles.bodySmall,
                    color: theme.colors.textGrey,
                  }}>
                    Batch: {test.batchNumber} | Test Date: {new Date(test.testDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}>
                  <div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                      marginBottom: '4px',
                    }}>
                      Protein Content
                    </div>
                    <div style={{
                      ...textStyles.bodySmall,
                      color: theme.colors.primaryText,
                    }}>
                      {test.parameters.protein}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                      marginBottom: '4px',
                    }}>
                      Moisture Content
                    </div>
                    <div style={{
                      ...textStyles.bodySmall,
                      color: theme.colors.primaryText,
                    }}>
                      {test.parameters.moisture}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                      marginBottom: '4px',
                    }}>
                      Fat Content
                    </div>
                    <div style={{
                      ...textStyles.bodySmall,
                      color: theme.colors.primaryText,
                    }}>
                      {test.parameters.fat}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{
                      ...textStyles.label,
                      color: theme.colors.textGrey,
                      marginBottom: '4px',
                    }}>
                      Fiber Content
                    </div>
                    <div style={{
                      ...textStyles.bodySmall,
                      color: theme.colors.primaryText,
                    }}>
                      {test.parameters.fiber}
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

export default QualityControl;