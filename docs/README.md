# 📚 GreenEduMapApp Documentation

> **Tài liệu hướng dẫn phát triển và sử dụng GreenEduMapApp**

---

## 🎯 Quick Links

| Tài liệu | Mô tả | Đọc khi nào? |
|----------|-------|--------------|
| [🚀 IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) | Tổng quan các cải tiến | Đầu tiên |
| [📋 REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) | Chi tiết refactoring | Khi cần hiểu kiến trúc mới |
| [🎨 THEME_USAGE_GUIDE.md](./THEME_USAGE_GUIDE.md) | Hướng dẫn sử dụng theme | Khi code UI components |
| [✅ THEME_MIGRATION_CHECKLIST.md](./THEME_MIGRATION_CHECKLIST.md) | Checklist migrate theme | Khi refactor components |
| [🔐 AUTH_CONTEXT_GUIDE.md](./AUTH_CONTEXT_GUIDE.md) | Hướng dẫn AuthContext | Khi làm authentication |
| [🧹 CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md) | Cleanup summary | Reference |
| [📖 EXAMPLE_USAGE.tsx](./EXAMPLE_USAGE.tsx) | Code examples | Khi cần tham khảo |
| [🗺️ GREENEDUMAP_CONTEXT_OVERVIEW.md](./GREENEDUMAP_CONTEXT_OVERVIEW.md) | Context overview | Khi cần hiểu contexts |

---

## 🚀 Getting Started

### 1. Nếu bạn là Developer mới
Đọc theo thứ tự:
1. ✅ [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) - Hiểu tổng quan
2. ✅ [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Hiểu kiến trúc
3. ✅ [THEME_USAGE_GUIDE.md](./THEME_USAGE_GUIDE.md) - Học cách code

### 2. Nếu bạn đang Code UI
Đọc ngay:
- 🎨 [THEME_USAGE_GUIDE.md](./THEME_USAGE_GUIDE.md)
- 📝 [EXAMPLE_USAGE.tsx](./EXAMPLE_USAGE.tsx)

### 3. Nếu bạn đang Refactor Component
Đọc:
- ✅ [THEME_MIGRATION_CHECKLIST.md](./THEME_MIGRATION_CHECKLIST.md)
- 🎨 [THEME_USAGE_GUIDE.md](./THEME_USAGE_GUIDE.md)

### 4. Nếu bạn đang làm Authentication
Đọc:
- 🔐 [AUTH_CONTEXT_GUIDE.md](./AUTH_CONTEXT_GUIDE.md)
- 📋 [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Section Auth

---

## 📖 Documentation Overview

### 🚀 IMPROVEMENTS_SUMMARY.md
**Tổng kết toàn bộ cải tiến dự án**

Bao gồm:
- Tổng quan các thay đổi
- Architecture improvements
- Theme system
- API & error handling
- Type safety
- UI/UX improvements
- Next steps & roadmap

**👉 Đọc đầu tiên để hiểu big picture**

---

### 📋 REFACTORING_SUMMARY.md
**Chi tiết các thay đổi trong refactoring**

Bao gồm:
- Cách xử lý API (Api.tsx)
- API Types (ApiResponse wrapper)
- Auth Service (authService.ts)
- ModalCustom improvements
- AuthContext updates
- Migration guide
- So sánh trước/sau

**👉 Đọc khi cần hiểu chi tiết implementation**

---

### 🎨 THEME_USAGE_GUIDE.md
**Hướng dẫn đầy đủ về Theme System**

Bao gồm:
- Import theme
- Colors, Typography, Spacing
- Icons, Shadows, Animations
- Component styles
- Best practices
- Complete examples
- Quick reference cheat sheet

**👉 Tài liệu quan trọng nhất khi code UI**

---

### ✅ THEME_MIGRATION_CHECKLIST.md
**Checklist migrate components sang theme system**

Bao gồm:
- Danh sách components cần migrate
- Priority order
- Step-by-step guide
- Common patterns
- Verification checklist
- Useful commands

**👉 Dùng khi refactor components**

---

### 🔐 AUTH_CONTEXT_GUIDE.md
**Hướng dẫn sử dụng AuthContext**

Bao gồm:
- Authentication flow
- Cách sử dụng useAuth hook
- SignIn, SignUp, SignOut
- User management
- Environmental features

**👉 Đọc khi làm tính năng auth**

---

### 🧹 CLEANUP_SUMMARY.md
**Tóm tắt cleanup codebase**

Reference document về các file đã cleanup.

---

### 📖 EXAMPLE_USAGE.tsx
**Code examples**

Examples về cách sử dụng AuthContext.

---

### 🗺️ GREENEDUMAP_CONTEXT_OVERVIEW.md
**Overview các Contexts**

Tổng quan về AuthContext và các features.

---

## 🎯 Common Tasks

### Task 1: Tạo Component mới
```typescript
// 1. Import theme
import { theme, ICON_SIZE, componentStyles } from "../theme";

// 2. Sử dụng componentStyles nếu có
const MyComponent = () => (
  <View style={componentStyles.card}>
    <Text style={componentStyles.heading2}>Title</Text>
  </View>
);

// 3. Hoặc tạo custom styles với theme
const styles = StyleSheet.create({
  custom: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
  },
});
```

**📖 Đọc thêm:** [THEME_USAGE_GUIDE.md](./THEME_USAGE_GUIDE.md)

---

### Task 2: Refactor Component cũ
```bash
# 1. Backup
git checkout -b refactor/component-name

# 2. Follow checklist
# Xem: THEME_MIGRATION_CHECKLIST.md

# 3. Replace hard-coded values
# 4. Test
# 5. Commit
```

**📖 Đọc thêm:** [THEME_MIGRATION_CHECKLIST.md](./THEME_MIGRATION_CHECKLIST.md)

---

### Task 3: Làm Authentication Feature
```typescript
// 1. Import useAuth
import { useAuth } from '../contexts/AuthContext';

// 2. Use hooks
const MyScreen = () => {
  const { user, signIn, signOut, loading } = useAuth();
  
  // 3. Use methods
  const handleLogin = async () => {
    const result = await signIn({ email, password });
    if (result.success) {
      // Navigate to home
    }
  };
};
```

**📖 Đọc thêm:** [AUTH_CONTEXT_GUIDE.md](./AUTH_CONTEXT_GUIDE.md)

---

### Task 4: Call API mới
```typescript
// 1. Tạo types trong types/api/
export interface MyDataResponse {
  id: number;
  name: string;
}

// 2. Tạo service trong services/
export const myService = {
  getData: async (): Promise<MyDataResponse> => {
    const response = await api.get<ApiResponse<MyDataResponse>>('/my-data');
    return response.data.data;
  },
};

// 3. Sử dụng trong component
const data = await myService.getData();
```

**📖 Đọc thêm:** [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Section authService

---

## 🔍 Quick Search

### Colors
```typescript
theme.colors.primary
theme.colors.success
STATUS_COLORS.error
```
→ [THEME_USAGE_GUIDE.md#colors](./THEME_USAGE_GUIDE.md#colors)

### Spacing
```typescript
theme.spacing.md
theme.borderRadius.lg
```
→ [THEME_USAGE_GUIDE.md#spacing--layout](./THEME_USAGE_GUIDE.md#spacing--layout)

### Icons
```typescript
ICON_SIZE.lg
```
→ [THEME_USAGE_GUIDE.md#icons](./THEME_USAGE_GUIDE.md#icons)

### Authentication
```typescript
useAuth()
signIn()
signOut()
```
→ [AUTH_CONTEXT_GUIDE.md](./AUTH_CONTEXT_GUIDE.md)

---

## 💡 Tips

1. **Luôn import từ `"../theme"`** không phải từng file riêng
2. **Không hard-code colors, spacing, sizes** - dùng theme constants
3. **Reuse `componentStyles`** khi có thể
4. **Follow TypeScript strict mode** - không dùng `any`
5. **Test trên cả iOS và Android** sau khi refactor

---

## 🎓 Learning Path

### Week 1: Basics
- [ ] Đọc IMPROVEMENTS_SUMMARY.md
- [ ] Đọc THEME_USAGE_GUIDE.md
- [ ] Thử tạo 1 component đơn giản
- [ ] Refactor 1 component nhỏ

### Week 2: Advanced
- [ ] Đọc REFACTORING_SUMMARY.md
- [ ] Đọc AUTH_CONTEXT_GUIDE.md
- [ ] Tạo 1 service mới
- [ ] Implement 1 feature auth

### Week 3: Mastery
- [ ] Refactor 5+ components
- [ ] Review code của team
- [ ] Contribute to documentation
- [ ] Mentor new developers

---

## 🆘 Troubleshooting

### Lỗi: "Cannot find module '../theme'"
**Giải pháp:** Check path, nên import từ `"../theme"` không phải `"../theme/colors"`

### Lỗi: Type errors sau khi refactor
**Giải pháp:** Check REFACTORING_SUMMARY.md, đảm bảo dùng đúng types từ `types/api/`

### UI không đúng sau khi migrate
**Giải pháp:** Check THEME_USAGE_GUIDE.md, verify constants mapping

### Hard-coded values vẫn còn
**Giải pháp:** Run commands trong THEME_MIGRATION_CHECKLIST.md để tìm

---

## 📊 Documentation Stats

```
📄 Total Documents:     8
📖 Guides:              4
✅ Checklists:          1
📝 Examples:            1
📋 References:          2
📏 Total Lines:         ~3000+
⏱️ Reading Time:        ~2 hours
```

---

## 🔄 Update Log

| Date | Version | Changes |
|------|---------|---------|
| 05/12/2025 | 1.0.0 | Initial documentation |
| 05/12/2025 | 1.1.0 | Added all guides & checklists |

---

## 🙋 FAQ

**Q: Tài liệu nào nên đọc đầu tiên?**  
A: IMPROVEMENTS_SUMMARY.md để hiểu tổng quan

**Q: Làm sao để code component mới?**  
A: Đọc THEME_USAGE_GUIDE.md và follow examples

**Q: Refactor component cũ như thế nào?**  
A: Follow THEME_MIGRATION_CHECKLIST.md

**Q: Cách sử dụng authentication?**  
A: Đọc AUTH_CONTEXT_GUIDE.md

**Q: Tìm hard-coded values như thế nào?**  
A: Dùng commands trong THEME_MIGRATION_CHECKLIST.md

---

## 🎉 Happy Coding!

**Remember:**
- 📖 Documentation is your friend
- 🎨 Theme is your best practice
- 🔐 Type safety is your protection
- 🧹 Clean code is your pride

**Let's build something amazing! 🌱🚀**

---

**Last Updated:** 05/12/2025  
**Maintained by:** Development Team  
**Status:** ✅ Active

