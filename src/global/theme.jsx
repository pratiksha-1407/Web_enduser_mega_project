// Combined theme object based on Flutter global variables and text styles
import { colors } from './colors';
import { textStyles } from './textStyles';

// Additional theme properties that might be useful
export const theme = {
  colors,
  textStyles,
  spacing: {
    xxs: '4px',
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radii: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '1024px',
    lg: '1200px',
    xl: '1440px',
  },
  // Additional properties that might be useful
  shadows: {
    sm: `0 1px 3px 0 ${colors.shadow}, 0 1px 2px 0 ${colors.shadow}`,
    md: `0 4px 6px -1px ${colors.shadow}, 0 2px 4px -1px ${colors.shadow}`,
    lg: `0 10px 15px -3px ${colors.shadow}, 0 4px 6px -2px ${colors.shadow}`,
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
};
