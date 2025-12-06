import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const responsive = {
  wp,
  hp,
};

// Font sizes
export const FONT_SIZE = {
  '2xs': wp('2.5%'),  // ~10px
  xs: wp('3%'),       // ~12px
  sm: wp('3.5%'),     // ~14px
  md: wp('4%'),       // ~16px
  lg: wp('4.5%'),     // ~18px
  xl: wp('5%'),       // ~20px
  '2xl': wp('6%'),    // ~24px
  '3xl': wp('7.5%'),  // ~30px
  '4xl': wp('9%'),    // ~36px
  xxl: wp('6%'),
};

// Spacing
export const SPACING = {
  xs: wp('2%'),       // ~8px
  sm: wp('3%'),       // ~12px
  md: wp('4%'),       // ~16px
  lg: wp('5%'),       // ~20px
  xl: wp('6%'),       // ~24px
  '2xl': wp('10%'),   // ~40px
  '3xl': wp('12%'),   // ~48px
  '4xl': wp('16%'),   // ~64px
  xxl: wp('8%'),      // ~32px
};

// Border radius
export const BORDER_RADIUS = {
  xs: wp('1%'),
  sm: wp('2%'),
  md: wp('3%'),
  lg: wp('4%'),
  xl: wp('5%'),
  '2xl': wp('8%'),
  full: wp('50%'),
};

// Screen Padding
export const SCREEN_PADDING = {
  horizontal: wp('4%'),  // ~16px
  vertical: hp('2%'),    // ~16px
  small: wp('3%'),       // ~12px
  large: wp('5%'),       // ~20px
}; 