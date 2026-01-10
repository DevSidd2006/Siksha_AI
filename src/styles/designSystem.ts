// Design System for Siksha AI - Student-Focused UI

export const Colors = {
  // Primary
  primary: '#FF6B35',
  primaryLight: '#FFE5D9',
  primaryDark: '#E55A24',

  // Secondary
  secondary: '#2196F3',
  secondaryLight: '#E3F2FD',
  secondaryDark: '#1976D2',

  // Success
  success: '#4CAF50',
  successLight: '#E8F5E9',
  successDark: '#388E3C',

  // Warning
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  warningDark: '#F57C00',

  // Error
  error: '#f44336',
  errorLight: '#FFEBEE',
  errorDark: '#D32F2F',

  // Neutral
  white: '#ffffff',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Text
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#ffffff',

  // Background
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceVariant: '#f5f5f5',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
  },
  h6: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Transitions = {
  fast: 150,
  normal: 300,
  slow: 500,
};
