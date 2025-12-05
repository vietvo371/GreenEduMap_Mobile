# 🔍 Theme Migration Checklist

> **Checklist để đảm bảo tất cả components sử dụng theme system đúng cách**

## ✅ Components Đã Migrate

### Core Components
- [x] **ModalCustom.tsx** - Hoàn toàn sử dụng theme
  - ✅ Colors: `STATUS_COLORS`, `theme.colors.*`
  - ✅ Spacing: `theme.spacing.*`
  - ✅ Border Radius: `theme.borderRadius.*`
  - ✅ Icons: `ICON_SIZE.xxxl`
  - ✅ Shadows: `theme.shadows.lg`
  - ✅ Animation: `ANIMATION.*`

### API & Services
- [x] **Api.tsx** - Cải tiến error handling
- [x] **authService.ts** - Service layer chuẩn
- [x] **ErrorModalManager.tsx** - Error management

### Contexts
- [x] **AuthContext.tsx** - Sử dụng authService mới

### Types
- [x] **types/api/** - API types chuẩn hóa

---

## 📋 Components Cần Review

### High Priority

#### 1. Component Folder
```bash
src/component/
├── AlertServiceConnector.tsx
├── AuthButton.tsx
├── AuthInput.tsx
├── Badge.tsx
├── ButtonCustom.tsx
├── Card.tsx
├── CircularProgress.tsx
├── CountryCodePicker.tsx
├── CustomAlert.tsx
├── DatePicker.tsx
├── DropdownMenu.tsx
├── ErrorModal.tsx
├── Header.tsx
├── ImagePicker.tsx
├── InputCustom.tsx
├── ItemMenu.tsx
├── ItemMenuTab.tsx
├── LanguageSelector.tsx
├── LoadingOverlay.tsx
├── LocationPicker.tsx
├── Marquee.tsx
├── ✅ ModalCustom.tsx (DONE)
├── NoDataModal.tsx
├── OnboardingCard.tsx
├── QRCode.tsx
├── QRScanner.tsx
├── Rating.tsx
├── ReviewCard.tsx
├── RoleSelector.tsx
├── SelectCustom.tsx
├── StatsCard.tsx
├── TextAreaCustom.tsx
├── ThemedText.tsx
├── ToastCustom.tsx
├── UploadFile.tsx
├── VerificationModal.tsx
└── VerifyOTPBottomSheet.tsx
```

**Checklist for each component:**
- [ ] Replace hard-coded colors
- [ ] Replace hard-coded spacing/padding/margin
- [ ] Replace hard-coded border radius
- [ ] Replace hard-coded font sizes
- [ ] Replace hard-coded icon sizes
- [ ] Replace hard-coded shadow values
- [ ] Import from `"../theme"` not `"../theme/colors"`
- [ ] Use `componentStyles` when applicable

#### 2. Screen Folder
```bash
src/screens/
├── ActionsScreen.tsx
├── AlertDemoScreen.tsx
├── ChangePasswordScreen.tsx
├── EditProfileScreen.tsx
├── EmailVerificationScreen.tsx
├── ForgotPasswordScreen.tsx
├── HelpScreen.tsx
├── HistoryScreen.tsx
├── HomeScreen.tsx
├── LearnScreen.tsx
├── LoadingScreen.tsx
├── LoginScreen.tsx
├── MapScreen.tsx
├── MapScreenMapbox.tsx
├── NotificationsScreen.tsx
├── OnboardingScreen.tsx
├── OTPVerificationScreen.tsx
├── PhoneVerificationScreen.tsx
├── ProfileScreen.tsx
├── RegisterScreen.tsx
├── SecurityScreen.tsx
├── SettingsScreen.tsx
├── SplashScreen.tsx
└── UpdatePasswordScreen.tsx
```

#### 3. Navigation
```bash
src/navigation/
├── MainTabNavigator.tsx
├── NavigationService.ts
└── types.ts
```

---

## 🔍 Common Hard-coded Values to Look For

### Colors
```bash
# Search for hex colors
grep -r "#[0-9A-Fa-f]\{6\}" src/ --include="*.tsx" --include="*.ts"

# Common hard-coded colors to replace:
'#03A66D'     → theme.colors.primary
'#0ECB81'     → theme.colors.secondary
'#FFFFFF'     → theme.colors.white
'#000000'     → theme.colors.black
'#E6E8EA'     → theme.colors.border
'#10b981'     → STATUS_COLORS.success
'#ef4444'     → STATUS_COLORS.error
'#f59e0b'     → STATUS_COLORS.warning
'#3b82f6'     → STATUS_COLORS.info
'rgba(0,0,0,0.5)' → theme.colors.overlay
```

### Spacing & Sizes
```bash
# Common magic numbers to replace:
4   → theme.spacing.xs
8   → theme.spacing.sm
16  → theme.spacing.md
24  → theme.spacing.lg
32  → theme.spacing.xl
48  → theme.spacing.xxl

# Border Radius:
4   → theme.borderRadius.sm
8   → theme.borderRadius.md
16  → theme.borderRadius.lg
24  → theme.borderRadius.xl

# Font Sizes:
12  → theme.typography.fontSize.xs
14  → theme.typography.fontSize.sm
16  → theme.typography.fontSize.md
18  → theme.typography.fontSize.lg
20  → theme.typography.fontSize.xl
```

### Icons
```bash
# Icon sizes to replace:
16  → ICON_SIZE.xs
20  → ICON_SIZE.sm
24  → ICON_SIZE.md
32  → ICON_SIZE.lg
40  → ICON_SIZE.xl
48  → ICON_SIZE.xxl
64  → ICON_SIZE.xxxl
```

---

## 🛠️ Migration Steps

### Step 1: Backup
```bash
# Tạo backup branch
git checkout -b feature/theme-migration
```

### Step 2: Update Imports
```typescript
// ❌ Before
import { theme } from "../theme/colors";

// ✅ After
import { theme, ICON_SIZE, STATUS_COLORS } from "../theme";
```

### Step 3: Replace Hard-coded Values

**Example: ButtonCustom.tsx**

```typescript
// ❌ Before
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#03A66D',
    padding: 16,
    borderRadius: 8,
  },
});

// ✅ After
import { theme } from "../theme";

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
});
```

### Step 4: Use Pre-defined Styles

```typescript
// ❌ Before - Duplicate code
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});

// ✅ After - Reuse componentStyles
import { componentStyles, theme } from "../theme";

const styles = StyleSheet.create({
  card: {
    ...componentStyles.card,
    // Add custom overrides if needed
    marginTop: theme.spacing.xl,
  },
});
```

### Step 5: Test
- [ ] Run app and check UI
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Check dark mode (if applicable)

---

## 📊 Progress Tracking

### Components (39 total)
- [x] ModalCustom.tsx (1/39)
- [ ] ButtonCustom.tsx
- [ ] InputCustom.tsx
- [ ] Card.tsx
- [ ] AuthButton.tsx
- [ ] AuthInput.tsx
- [ ] Badge.tsx
- [ ] ... (34 more)

**Progress: 1/39 (2.5%)**

### Screens (23 total)
- [ ] LoginScreen.tsx
- [ ] RegisterScreen.tsx
- [ ] HomeScreen.tsx
- [ ] ProfileScreen.tsx
- [ ] ... (19 more)

**Progress: 0/23 (0%)**

---

## 🎯 Priority Order

### Phase 1: Core Components (Week 1)
1. **ButtonCustom.tsx** - Used everywhere
2. **InputCustom.tsx** - Forms
3. **Card.tsx** - Layout
4. **AuthButton.tsx** - Auth flows
5. **AuthInput.tsx** - Auth forms

### Phase 2: UI Components (Week 2)
6. Badge.tsx
7. CircularProgress.tsx
8. CustomAlert.tsx
9. ErrorModal.tsx
10. LoadingOverlay.tsx
11. ToastCustom.tsx
12. NoDataModal.tsx

### Phase 3: Specific Components (Week 3)
13. DatePicker.tsx
14. DropdownMenu.tsx
15. ImagePicker.tsx
16. LocationPicker.tsx
17. CountryCodePicker.tsx
18. LanguageSelector.tsx
19. RoleSelector.tsx
20. SelectCustom.tsx

### Phase 4: Screens (Week 4)
- Auth Screens (Login, Register, etc.)
- Main Screens (Home, Profile, etc.)
- Feature Screens (Map, Learn, etc.)

---

## ✅ Verification Checklist

Sau khi migrate từng component:

- [ ] No hard-coded colors (search `#[0-9A-Fa-f]{6}`)
- [ ] No magic numbers for spacing
- [ ] No magic numbers for font sizes
- [ ] No magic numbers for border radius
- [ ] All imports from `"../theme"`
- [ ] Reuse `componentStyles` where possible
- [ ] TypeScript no errors
- [ ] Linter no errors
- [ ] Component renders correctly
- [ ] UI matches design

---

## 🔧 Useful Commands

### Find Hard-coded Colors
```bash
# Find hex colors
grep -r "#[0-9A-Fa-f]\{6\}" src/component/ --include="*.tsx"
grep -r "#[0-9A-Fa-f]\{6\}" src/screens/ --include="*.tsx"

# Find rgba colors
grep -r "rgba(" src/component/ --include="*.tsx"
```

### Find Magic Numbers
```bash
# Find common spacing numbers
grep -r "padding: [0-9]" src/component/ --include="*.tsx"
grep -r "margin: [0-9]" src/component/ --include="*.tsx"
grep -r "borderRadius: [0-9]" src/component/ --include="*.tsx"
```

### Check Imports
```bash
# Find old theme imports
grep -r 'from.*theme/colors' src/ --include="*.tsx"
grep -r 'from.*theme/typography' src/ --include="*.tsx"
```

---

## 📝 Notes

### Common Patterns

#### Pattern 1: Button with Status Color
```typescript
// ✅ Good
import { STATUS_COLORS, theme } from "../theme";

const getButtonColor = (type: string) => {
  switch (type) {
    case 'success': return STATUS_COLORS.success;
    case 'error': return STATUS_COLORS.error;
    case 'warning': return STATUS_COLORS.warning;
    default: return theme.colors.primary;
  }
};
```

#### Pattern 2: Responsive Spacing
```typescript
// ✅ Good
import { wp, hp, theme } from "../theme";

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    width: wp('90%'),
    height: hp('70%'),
  },
});
```

#### Pattern 3: Conditional Styles
```typescript
// ✅ Good
import { theme } from "../theme";

<View style={[
  componentStyles.card,
  isActive && { borderColor: theme.colors.primary, borderWidth: 2 }
]} />
```

---

## 🎉 Benefits After Migration

1. **Consistency** - Toàn bộ UI sử dụng cùng design system
2. **Maintainability** - Chỉ cần update theme file
3. **Type Safety** - TypeScript báo lỗi nếu dùng sai
4. **Dark Mode Ready** - Dễ dàng thêm dark theme
5. **Code Quality** - Clean code, dễ đọc, dễ review
6. **Performance** - Reuse styles, ít re-render

---

**Last Updated:** 05/12/2025  
**Status:** In Progress (1/62 components migrated)

