/**
 * Theme System - GreenEduMapApp
 * Centralized theme configuration for consistent UI/UX
 */

export { theme, COLORS } from './colors';
export { typography, textStyles, createTextStyle } from './typography';
export { componentStyles } from './components';
export { responsive, FONT_SIZE, SPACING, BORDER_RADIUS } from './responsive';

// Re-export commonly used utilities
export {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

/**
 * Icon sizes for consistent usage across the app
 */
export const ICON_SIZE = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
  xxxl: 64,
} as const;

/**
 * Modal specific constants
 */
export const MODAL_CONSTANTS = {
  maxWidth: 400,
  iconSize: 80,
  iconBorderRadius: 40,
} as const;

/**
 * Status colors for different message types
 */
export const STATUS_COLORS = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const;

/**
 * Animation constants
 */
export const ANIMATION = {
  spring: {
    tension: 50,
    friction: 7,
  },
  timing: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
} as const;

