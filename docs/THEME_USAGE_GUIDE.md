# 🎨 Theme Usage Guide - GreenEduMapApp

> **Hướng dẫn sử dụng Theme System cho Clean Code & Consistent Design**

## 📋 Mục Lục

1. [Import Theme](#import-theme)
2. [Colors](#colors)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Icons](#icons)
6. [Shadows](#shadows)
7. [Component Styles](#component-styles)
8. [Best Practices](#best-practices)
9. [Examples](#examples)

---

## 🎯 Import Theme

### ✅ Cách đúng - Import từ theme index

```typescript
// Import tất cả từ theme index
import { 
  theme, 
  ICON_SIZE, 
  MODAL_CONSTANTS, 
  STATUS_COLORS, 
  ANIMATION,
  wp,
  hp 
} from "../theme";
```

### ❌ Cách sai - Import từng file riêng lẻ

```typescript
// Không nên làm thế này
import { theme } from "../theme/colors";
import { ICON_SIZE } from "../theme/responsive";
```

---

## 🎨 Colors

### Theme Colors

```typescript
import { theme, STATUS_COLORS } from "../theme";

// Primary & Secondary Colors
theme.colors.primary         // '#03A66D' - Main green
theme.colors.secondary       // '#0ECB81' - Light green
theme.colors.background      // '#FFFFFF'
theme.colors.backgroundDark  // '#0B0E11'

// Text Colors
theme.colors.text           // '#1E2329'
theme.colors.textLight      // '#707A8A'
theme.colors.textDark       // '#EAECEF'

// Status Colors (từ STATUS_COLORS constant)
STATUS_COLORS.success       // '#10b981' - Green
STATUS_COLORS.error         // '#ef4444' - Red
STATUS_COLORS.warning       // '#f59e0b' - Orange/Yellow
STATUS_COLORS.info          // '#3b82f6' - Blue

// UI Colors
theme.colors.border         // '#E6E8EA'
theme.colors.disabled       // '#B7BDC6'
theme.colors.white          // '#FFFFFF'
theme.colors.black          // '#000000'
theme.colors.overlay        // 'rgba(0, 0, 0, 0.5)'
```

### ✅ Example: Sử dụng Colors

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background, // ✅
    // backgroundColor: '#FFFFFF', // ❌ Hard-coded
  },
  successButton: {
    backgroundColor: STATUS_COLORS.success, // ✅
    // backgroundColor: '#10b981', // ❌ Hard-coded
  },
  overlay: {
    backgroundColor: theme.colors.overlay, // ✅
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // ❌ Hard-coded
  },
});
```

---

## ✍️ Typography

### Font Sizes

```typescript
theme.typography.fontSize['2xs']  // 10
theme.typography.fontSize.xs      // 12
theme.typography.fontSize.sm      // 14
theme.typography.fontSize.md      // 16
theme.typography.fontSize.lg      // 18
theme.typography.fontSize.xl      // 20
theme.typography.fontSize['2xl']  // 24
theme.typography.fontSize['3xl']  // 30
theme.typography.fontSize['4xl']  // 36
theme.typography.fontSize['5xl']  // 48
```

### Line Heights

```typescript
theme.typography.lineHeight.tight    // 1.2
theme.typography.lineHeight.normal   // 1.5
theme.typography.lineHeight.relaxed  // 1.75
```

### Letter Spacing

```typescript
theme.typography.letterSpacing.tighter  // -0.8
theme.typography.letterSpacing.tight    // -0.4
theme.typography.letterSpacing.normal   // 0
theme.typography.letterSpacing.wide     // 0.4
theme.typography.letterSpacing.wider    // 0.8
```

### ✅ Example: Sử dụng Typography

```typescript
import { theme, textStyles } from "../theme";

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.xl, // ✅
    // fontSize: 20, // ❌ Magic number
    fontWeight: '700',
    color: theme.colors.text,
  },
  
  // Hoặc sử dụng textStyles có sẵn
  heading: {
    ...textStyles.h2, // ✅ Pre-defined style
  },
  
  body: {
    ...textStyles.bodyMedium, // ✅ Pre-defined style
  },
});
```

---

## 📏 Spacing & Layout

### Spacing

```typescript
theme.spacing.xs    // 4
theme.spacing.sm    // 8
theme.spacing.md    // 16
theme.spacing.lg    // 24
theme.spacing.xl    // 32
theme.spacing.xxl   // 48
```

### Border Radius

```typescript
theme.borderRadius.sm   // 4
theme.borderRadius.md   // 8
theme.borderRadius.lg   // 16
theme.borderRadius.xl   // 24
theme.borderRadius.xxl  // 32
```

### Layout Constants

```typescript
theme.layout.containerPadding   // 16
theme.layout.maxWidth          // 480
theme.layout.bottomTabHeight   // 60
theme.layout.headerHeight      // 56
```

### ✅ Example: Sử dụng Spacing & Layout

```typescript
const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,              // ✅
    // padding: 24, // ❌
    margin: theme.spacing.md,               // ✅
    borderRadius: theme.borderRadius.xl,    // ✅
    // borderRadius: 24, // ❌
  },
  
  container: {
    paddingHorizontal: theme.layout.containerPadding, // ✅
    maxWidth: theme.layout.maxWidth,                  // ✅
  },
});
```

---

## 🎭 Icons

### Icon Sizes

```typescript
import { ICON_SIZE } from "../theme";

ICON_SIZE.xs     // 16
ICON_SIZE.sm     // 20
ICON_SIZE.md     // 24
ICON_SIZE.lg     // 32
ICON_SIZE.xl     // 40
ICON_SIZE.xxl    // 48
ICON_SIZE.xxxl   // 64
```

### ✅ Example: Sử dụng Icon Sizes

```typescript
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ICON_SIZE, theme } from "../theme";

// ✅ Correct
<Icon name="check" size={ICON_SIZE.lg} color={theme.colors.primary} />

// ❌ Incorrect
<Icon name="check" size={32} color="#03A66D" />
```

---

## 🌑 Shadows

### Shadow Styles

```typescript
theme.shadows.sm      // Small shadow
theme.shadows.md      // Medium shadow
theme.shadows.lg      // Large shadow
theme.shadows.green   // Green shadow (for primary buttons)
```

### ✅ Example: Sử dụng Shadows

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    ...theme.shadows.md, // ✅
    // Thay vì:
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.08,
    // shadowRadius: 8,
    // elevation: 4,
  },
  
  primaryButton: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.green, // ✅ Special green shadow
  },
});
```

---

## 🧩 Component Styles

### Pre-defined Component Styles

```typescript
import { componentStyles } from "../theme";

// Containers
componentStyles.container
componentStyles.containerDark

// Cards
componentStyles.card
componentStyles.cardDark

// Buttons
componentStyles.buttonPrimary
componentStyles.buttonSecondary
componentStyles.buttonText

// Inputs
componentStyles.input
componentStyles.inputDark

// Typography
componentStyles.heading1
componentStyles.heading2
componentStyles.heading3
componentStyles.body
componentStyles.caption

// Headers
componentStyles.header
componentStyles.headerDark

// Modals
componentStyles.modalContent
componentStyles.modalContentDark
```

### ✅ Example: Sử dụng Component Styles

```typescript
import { View, Text } from 'react-native';
import { componentStyles, theme } from "../theme";

const MyScreen = () => (
  <View style={componentStyles.container}>
    <View style={componentStyles.card}>
      <Text style={componentStyles.heading2}>Title</Text>
      <Text style={componentStyles.body}>Content</Text>
    </View>
  </View>
);
```

---

## 🎯 Modal Constants

```typescript
import { MODAL_CONSTANTS } from "../theme";

MODAL_CONSTANTS.maxWidth          // 400
MODAL_CONSTANTS.iconSize          // 80
MODAL_CONSTANTS.iconBorderRadius  // 40
```

---

## ⚡ Animation Constants

```typescript
import { ANIMATION } from "../theme";

// Spring animation config
ANIMATION.spring.tension   // 50
ANIMATION.spring.friction  // 7

// Timing durations
ANIMATION.timing.fast     // 150ms
ANIMATION.timing.normal   // 200ms
ANIMATION.timing.slow     // 300ms
```

### ✅ Example: Sử dụng Animation

```typescript
import { Animated } from 'react-native';
import { ANIMATION } from "../theme";

// ✅ Correct
Animated.spring(scaleAnim, {
  toValue: 1,
  ...ANIMATION.spring,
  useNativeDriver: true,
});

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: ANIMATION.timing.normal,
  useNativeDriver: true,
});

// ❌ Incorrect
Animated.spring(scaleAnim, {
  toValue: 1,
  tension: 50,  // Hard-coded
  friction: 7,  // Hard-coded
  useNativeDriver: true,
});
```

---

## 📐 Responsive Design

### Using wp/hp (Width/Height Percentage)

```typescript
import { wp, hp } from "../theme";

const styles = StyleSheet.create({
  container: {
    width: wp('90%'),   // 90% of screen width
    height: hp('50%'),  // 50% of screen height
  },
  
  image: {
    width: wp('80%'),
    height: wp('80%'), // Square based on width
  },
});
```

---

## ✅ Best Practices

### 1. **Luôn Import từ Theme Index**

```typescript
// ✅ Good
import { theme, ICON_SIZE, STATUS_COLORS } from "../theme";

// ❌ Bad
import { theme } from "../theme/colors";
import { ICON_SIZE } from "../theme/responsive";
```

### 2. **Không Hard-code Values**

```typescript
// ✅ Good
const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
});

// ❌ Bad
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#03A66D',
    padding: 16,
    borderRadius: 16,
  },
});
```

### 3. **Sử dụng Pre-defined Styles khi có thể**

```typescript
// ✅ Good - Tái sử dụng
import { componentStyles } from "../theme";

const MyComponent = () => (
  <View style={componentStyles.card}>
    <Text style={componentStyles.heading2}>Title</Text>
  </View>
);

// ❌ Bad - Duplicate code
const MyComponent = () => (
  <View style={{
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  }}>
    <Text style={{ fontSize: 24, fontWeight: '700' }}>Title</Text>
  </View>
);
```

### 4. **Sử dụng Constants cho Status Colors**

```typescript
// ✅ Good
import { STATUS_COLORS } from "../theme";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return STATUS_COLORS.success;
    case 'error': return STATUS_COLORS.error;
    case 'warning': return STATUS_COLORS.warning;
    default: return STATUS_COLORS.info;
  }
};

// ❌ Bad
const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return '#10b981';
    case 'error': return '#ef4444';
    case 'warning': return '#f59e0b';
    default: return '#3b82f6';
  }
};
```

### 5. **Kết hợp Styles một cách Clean**

```typescript
// ✅ Good - Combine pre-defined with custom
const styles = StyleSheet.create({
  customCard: {
    ...componentStyles.card,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.successLight,
  },
});

// ✅ Good - Override specific properties
<View style={[componentStyles.card, { marginTop: theme.spacing.xl }]}>
```

---

## 📝 Complete Examples

### Example 1: Custom Screen

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  theme, 
  componentStyles, 
  ICON_SIZE, 
  STATUS_COLORS 
} from "../theme";

const MyScreen = () => {
  return (
    <View style={componentStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={componentStyles.heading1}>Dashboard</Text>
        <Icon 
          name="bell" 
          size={ICON_SIZE.lg} 
          color={theme.colors.primary} 
        />
      </View>
      
      {/* Card */}
      <View style={[componentStyles.card, styles.statsCard]}>
        <Icon 
          name="leaf" 
          size={ICON_SIZE.xl} 
          color={STATUS_COLORS.success} 
        />
        <Text style={componentStyles.heading2}>150kg</Text>
        <Text style={componentStyles.caption}>CO₂ Saved</Text>
      </View>
      
      {/* Button */}
      <TouchableOpacity style={componentStyles.buttonPrimary}>
        <Text style={componentStyles.buttonText}>Add Action</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  statsCard: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
});

export default MyScreen;
```

### Example 2: Custom Modal Component

```typescript
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  theme, 
  ICON_SIZE, 
  MODAL_CONSTANTS, 
  STATUS_COLORS 
} from "../theme";

interface CustomModalProps {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

const CustomModal = ({ visible, type, title, message, onClose }: CustomModalProps) => {
  const iconConfig = {
    success: { name: 'check-circle', color: STATUS_COLORS.success },
    error: { name: 'close-circle', color: STATUS_COLORS.error },
  };
  
  const config = iconConfig[type];
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Icon */}
          <View style={[
            styles.iconContainer, 
            { backgroundColor: `${config.color}15` }
          ]}>
            <Icon 
              name={config.name} 
              size={ICON_SIZE.xxxl} 
              color={config.color} 
            />
          </View>
          
          {/* Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {/* Button */}
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: config.color }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: MODAL_CONSTANTS.maxWidth,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  iconContainer: {
    width: MODAL_CONSTANTS.iconSize,
    height: MODAL_CONSTANTS.iconSize,
    borderRadius: MODAL_CONSTANTS.iconBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    width: '100%',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '700',
    color: theme.colors.white,
  },
});

export default CustomModal;
```

---

## 🎯 Quick Reference Cheat Sheet

```typescript
// Import
import { theme, ICON_SIZE, STATUS_COLORS, ANIMATION } from "../theme";

// Colors
theme.colors.primary          // Main color
theme.colors.background       // Background
STATUS_COLORS.success         // Success green
STATUS_COLORS.error           // Error red
STATUS_COLORS.warning         // Warning orange

// Typography
theme.typography.fontSize.md  // 16
theme.typography.fontSize.xl  // 20

// Spacing
theme.spacing.sm             // 8
theme.spacing.md             // 16
theme.spacing.lg             // 24

// Border Radius
theme.borderRadius.md        // 8
theme.borderRadius.lg        // 16

// Icons
ICON_SIZE.md                 // 24
ICON_SIZE.lg                 // 32

// Shadows
theme.shadows.md             // Medium shadow
theme.shadows.lg             // Large shadow

// Animation
ANIMATION.timing.normal      // 200ms
ANIMATION.spring             // { tension: 50, friction: 7 }
```

---

## 🚀 Migration Checklist

Khi refactor component cũ sang sử dụng theme:

- [ ] Replace hard-coded colors với `theme.colors.*`
- [ ] Replace hard-coded spacing với `theme.spacing.*`
- [ ] Replace hard-coded border radius với `theme.borderRadius.*`
- [ ] Replace hard-coded font sizes với `theme.typography.fontSize.*`
- [ ] Replace hard-coded icon sizes với `ICON_SIZE.*`
- [ ] Replace hard-coded shadows với `theme.shadows.*`
- [ ] Replace status colors với `STATUS_COLORS.*`
- [ ] Replace animation values với `ANIMATION.*`
- [ ] Sử dụng `componentStyles` khi có thể
- [ ] Import từ `"../theme"` thay vì từng file riêng

---

## 💡 Tips

1. **Auto-complete**: Import từ theme index giúp IDE gợi ý tốt hơn
2. **Type Safety**: TypeScript sẽ báo lỗi nếu dùng sai constant
3. **Consistent**: Tất cả components sử dụng cùng một design system
4. **Maintainable**: Chỉ cần update theme file để thay đổi toàn bộ app
5. **Scalable**: Dễ dàng thêm dark mode, themes khác

---

## 📚 Related Documents

- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Tổng quan về refactoring
- [AUTH_CONTEXT_GUIDE.md](./AUTH_CONTEXT_GUIDE.md) - Hướng dẫn AuthContext
- [CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) - Cleanup summary

---

**Happy Theming! 🎨✨**

