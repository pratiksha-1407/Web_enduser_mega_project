import React from 'react';
import { theme } from '../global/theme';
import { textStyles } from '../global/textStyles';

const StockStatusGrid = ({ stockData, themePrimary, themeSecondary }) => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: theme.colors.white,
      borderRadius: '16px',
      boxShadow: `0 12px 12px ${theme.colors.shadowGrey}`,
      marginBottom: '36px',
    }}>
      <h2 style={{
        ...textStyles.headingSmall,
        color: theme.colors.primaryText,
        marginBottom: '16px',
      }}>
        Raw Material Stock Status
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
      }}>
        {Object.entries(stockData).map(([material, amount]) => (
          <div 
            key={material}
            style={{
              padding: '16px',
              backgroundColor: theme.colors.white,
              borderRadius: '12px',
              border: `1px solid ${theme.colors.primaryBlue}4D`, // 30% opacity
              boxShadow: `0 4px 8px ${theme.colors.shadowGrey}`,
            }}
          >
            <div style={{
              ...textStyles.bodyMedium,
              color: theme.colors.primaryText,
              marginBottom: '4px',
            }}>
              {material}
            </div>
            <div style={{
              ...textStyles.metric,
              color: theme.colors.primaryBlue,
            }}>
              {amount.toFixed(0)} kg
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockStatusGrid;