// Web-compatible text styles based on Flutter textstyles.dart
import { colors } from './colors';

export const textStyles = {
  // HEADINGS
  headingLarge: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: colors.primaryText,
  },

  headingMedium: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.primaryText,
  },

  headingSmall: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.primaryText,
  },

  // BODY
  bodyRegular: {
    fontSize: '14px',
    fontWeight: 'normal',
    color: colors.primaryText,
  },

  bodyMedium: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.primaryText,
  },

  bodySmall: {
    fontSize: '12px',
    fontWeight: 'normal',
    color: colors.secondaryText,
  },

  bodyMuted: {
    fontSize: '11px',
    fontWeight: 'normal',
    color: colors.mutedText,
  },

  // LABELS
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: colors.secondaryText,
  },

  // KPI / NUMBERS
  metric: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.primaryText,
  },

  metricSuccess: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: colors.successGreen,
  },

  // STATUS
  statusSuccess: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: colors.successGreen,
  },
};

export default textStyles;
