import React from 'react';
import theme from '../global/theme';
import typography from '../global/textStyles';

// Summary Card Component
export const SummaryCard = ({ title, value, icon, onClick, color = theme.colors.global.primaryBlue }) => {
  const cardStyle = {
    backgroundColor: theme.colors.global.white,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `0 4px 12px ${theme.colors.shadows.grey}`,
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    height: '100%',
  };

  const iconStyle = {
    color: color,
    fontSize: '24px',
    marginBottom: '6px',
  };

  const valueStyle = {
    ...typography.metric,
    margin: '6px 0',
    color: color,
  };

  const titleStyle = {
    ...typography.bodySmall,
    color: theme.colors.global.textGrey,
  };

  return (
    <div 
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = `0 6px 16px ${theme.colors.shadows.grey}`;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = `0 4px 12px ${theme.colors.shadows.grey}`;
      }}
    >
      <span style={iconStyle}>{icon}</span>
      <div style={valueStyle}>{value}</div>
      <div style={titleStyle}>{title}</div>
    </div>
  );
};

// KPI Card Component
export const KPICard = ({ icon, title, value, growth, down = false }) => {
  const cardStyle = {
    backgroundColor: theme.colors.global.white,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `0 4px 10px ${theme.colors.shadows.grey}`,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const iconContainerStyle = {
    padding: '12px',
    backgroundColor: theme.colors.primary.lightBlue,
    borderRadius: theme.borderRadius.lg,
    marginBottom: '12px',
  };

  const valueStyle = {
    ...typography.metric,
    fontSize: '22px',
    marginBottom: '4px',
  };

  const titleStyle = {
    ...typography.bodySmall,
    color: theme.colors.global.textGrey,
    marginBottom: '8px',
  };

  const growthStyle = {
    ...typography.bodyMedium,
    color: down ? theme.colors.global.danger : theme.colors.global.success,
    fontWeight: 'bold',
  };

  return (
    <div style={cardStyle}>
      <div style={iconContainerStyle}>
        <span style={{ color: theme.colors.global.primaryBlue, fontSize: '28px' }}>{icon}</span>
      </div>
      <div style={valueStyle}>{value}</div>
      <div style={titleStyle}>{title}</div>
      <div style={growthStyle}>{down ? '↓' : '↑'} {growth}</div>
    </div>
  );
};

// Status Card Component
export const StatusCard = ({ title, value, status, statusColor, icon, onClick }) => {
  const cardStyle = {
    backgroundColor: theme.colors.global.white,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `0 4px 12px ${theme.colors.shadows.grey}`,
    padding: '16px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const titleStyle = {
    ...typography.headingSmall,
    margin: 0,
    color: theme.colors.text.primary,
  };

  const valueStyle = {
    ...typography.metric,
    fontSize: '18px',
    color: theme.colors.text.primary,
    marginBottom: '4px',
  };

  const statusStyle = {
    ...typography.statusSuccess,
    color: statusColor,
    fontWeight: 'bold',
  };

  return (
    <div 
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={headerStyle}>
        <h3 style={titleStyle}>{title}</h3>
        {icon && <span>{icon}</span>}
      </div>
      <div style={valueStyle}>{value}</div>
      <div style={statusStyle}>{status}</div>
    </div>
  );
};

// Performance Card Component
export const PerformanceCard = ({ title, subtitle, data, labels }) => {
  const cardStyle = {
    backgroundColor: theme.colors.global.white,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `0 4px 12px ${theme.colors.shadows.grey}`,
    padding: '16px',
  };

  const titleStyle = {
    ...typography.headingSmall,
    marginBottom: '6px',
  };

  const subtitleStyle = {
    ...typography.bodySmall,
    color: theme.colors.global.textGrey,
    marginBottom: '20px',
  };

  const chartContainerStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '200px',
    padding: '10px',
    gap: '5px',
  };

  const barStyle = {
    width: '20px',
    backgroundColor: theme.colors.global.primaryBlue,
    borderRadius: '4px',
    position: 'relative',
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <p style={subtitleStyle}>{subtitle}</p>
      <div style={chartContainerStyle}>
        {data && labels && data.map((value, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div 
              style={{ 
                ...barStyle, 
                height: `${(value / Math.max(...data)) * 150}px`, 
                backgroundColor: theme.colors.global.primaryBlue 
              }} 
            />
            <div style={{ 
              ...typography.bodyMuted, 
              color: theme.colors.global.textGrey, 
              marginTop: '8px',
              fontSize: '10px'
            }}>
              {labels[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Metric Card Component
export const MetricCard = ({ title, value, icon, description, color = theme.colors.global.primaryBlue }) => {
  const cardStyle = {
    backgroundColor: theme.colors.global.white,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `0 4px 12px ${theme.colors.shadows.grey}`,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
  };

  const iconContainerStyle = {
    padding: '12px',
    backgroundColor: `${color}1A`, // 10% opacity
    borderRadius: theme.borderRadius.lg,
    marginRight: '14px',
  };

  const contentStyle = {
    flex: 1,
  };

  const valueStyle = {
    ...typography.metric,
    color: color,
    marginBottom: '4px',
  };

  const titleStyle = {
    ...typography.bodySmall,
    color: theme.colors.global.textGrey,
  };

  const descriptionStyle = {
    ...typography.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: '8px',
  };

  return (
    <div style={cardStyle}>
      <div style={iconContainerStyle}>
        <span style={{ color: color, fontSize: '24px' }}>{icon}</span>
      </div>
      <div style={contentStyle}>
        <div style={valueStyle}>{value}</div>
        <div style={titleStyle}>{title}</div>
        {description && <div style={descriptionStyle}>{description}</div>}
      </div>
    </div>
  );
};

// Bar Chart Component
export const BarChart = ({ data, labels, title, subtitle, color = theme.colors.global.primaryBlue }) => {
  const cardStyle = {
    backgroundColor: theme.colors.global.white,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `0 4px 12px ${theme.colors.shadows.grey}`,
    padding: '16px',
  };

  const titleStyle = {
    ...typography.headingSmall,
    marginBottom: '6px',
  };

  const subtitleStyle = {
    ...typography.bodySmall,
    color: theme.colors.global.textGrey,
    marginBottom: '20px',
  };

  const chartContainerStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '200px',
    padding: '10px',
    gap: '5px',
  };

  const barStyle = {
    width: '20px',
    backgroundColor: color,
    borderRadius: '4px',
    position: 'relative',
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <p style={subtitleStyle}>{subtitle}</p>
      <div style={chartContainerStyle}>
        {data && labels && data.map((value, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div 
              style={{ 
                ...barStyle, 
                height: `${(value / Math.max(...data)) * 150}px`, 
                backgroundColor: color 
              }} 
            />
            <div style={{ 
              ...typography.bodyMuted, 
              color: theme.colors.global.textGrey, 
              marginTop: '8px',
              fontSize: '10px'
            }}>
              {labels[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line Chart Component
export const LineChart = ({ data, labels, title, subtitle, color = theme.colors.global.primaryBlue }) => {
  const cardStyle = {
    backgroundColor: theme.colors.global.white,
    borderRadius: theme.borderRadius.xl,
    boxShadow: `0 4px 12px ${theme.colors.shadows.grey}`,
    padding: '16px',
  };

  const titleStyle = {
    ...typography.headingSmall,
    marginBottom: '6px',
  };

  const subtitleStyle = {
    ...typography.bodySmall,
    color: theme.colors.global.textGrey,
    marginBottom: '20px',
  };

  const chartContainerStyle = {
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    padding: '20px',
    gap: '20px',
    position: 'relative',
  };

  const linePointStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: color,
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
  };

  const lineAreaStyle = {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: `${color}26`, // 15% opacity
    zIndex: -1,
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <p style={subtitleStyle}>{subtitle}</p>
      <div style={chartContainerStyle}>
        {data && labels && data.map((value, index) => {
          const heightPercentage = (value / Math.max(...data)) * 150;
          const leftPosition = `${(index / (data.length - 1)) * 100}%`;
          
          return (
            <div 
              key={index} 
              style={{ 
                position: 'relative', 
                height: '100%', 
                width: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}
            >
              <div 
                style={{ 
                  ...linePointStyle, 
                  left: leftPosition,
                  bottom: `${heightPercentage}px`,
                }} 
              />
              {index < data.length - 1 && (
                <div 
                  style={{
                    position: 'absolute',
                    height: '2px',
                    backgroundColor: color,
                    width: `${100 / (data.length - 1)}%`,
                    left: leftPosition,
                    bottom: `${heightPercentage}px`,
                    transform: `translateX(${(index === 0) ? 0 : 50}%)`,
                  }}
                />
              )}
            </div>
          );
        })}
        <div style={lineAreaStyle}></div>
      </div>
    </div>
  );
};