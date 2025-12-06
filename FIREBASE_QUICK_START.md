# 🔥 Firebase Notification - Quick Start Guide

## ✅ Đã tích hợp

Firebase Cloud Messaging đã được tích hợp vào GreenEduMapApp với các tính năng:

- ✅ Auto đăng ký FCM token khi user đăng nhập
- ✅ Auto hủy đăng ký token khi user đăng xuất
- ✅ Auto refresh và update token mới
- ✅ Nhận notification ở foreground, background và closed state
- ✅ Support cả iOS và Android
- ✅ Tích hợp với AuthContext

## 🚀 Các bước tiếp theo

### 1. Cài đặt dependencies
```bash
yarn install
cd ios && pod install && cd ..
```

### 2. Setup Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo hoặc chọn project
3. Thêm iOS app (Bundle ID: com.greenedumapapp)
4. Thêm Android app (Package name: com.greenedumapapp)

### 3. Thêm config files

**iOS:**
- Download `GoogleService-Info.plist`
- Copy vào `ios/GreenEduMapApp/`
- Add vào Xcode project

**Android:**
- Download `google-services.json`
- Copy vào `android/app/`

### 4. iOS: Cấu hình APNs

1. Tạo APNs Key trong [Apple Developer Portal](https://developer.apple.com/)
2. Upload lên Firebase Console (Settings > Cloud Messaging)
3. Enable "Push Notifications" trong Xcode capabilities

### 5. Android: Update build.gradle

**android/build.gradle:**
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

**android/app/build.gradle:**
```gradle
apply plugin: 'com.google.gms.google-services'
```

### 6. Build và test
```bash
# iOS
yarn ios

# Android
yarn android
```

## 📚 Documentation

Chi tiết hơn xem:
- [`docs/FIREBASE_NOTIFICATION_SETUP.md`](docs/FIREBASE_NOTIFICATION_SETUP.md) - Hướng dẫn đầy đủ
- [`docs/NOTIFICATION_CHECKLIST.md`](docs/NOTIFICATION_CHECKLIST.md) - Checklist các bước

## 🔧 Backend API Required

Backend cần implement endpoint:

```
POST /api/auth/update-fcm-token
Body: { "push_token": "FCM_TOKEN_STRING" }
```

Endpoint này đã được gọi tự động trong code.

## 🧪 Test Notification

1. Login vào app
2. Check console log để lấy FCM token
3. Vào Firebase Console > Cloud Messaging > "Send test message"
4. Paste FCM token và gửi

## 📝 Files đã tạo/sửa

### Files mới:
- `src/components/NotificationService.tsx`
- `src/services/NotificationTokenService.ts`
- `src/utils/PushNotificationHelper.ts`

### Files đã cập nhật:
- `package.json` - Thêm Firebase dependencies
- `App.tsx` - Tích hợp NotificationService
- `src/contexts/AuthContext.tsx` - Auto register/unregister token
- `ios/Podfile` - Firebase pods
- `ios/GreenEduMapApp/AppDelegate.swift` - Firebase config
- `ios/GreenEduMapApp/Info.plist` - Background modes

## ⚡ How it works

1. **User đăng nhập** → FCM token tự động gửi lên server
2. **Token refresh** → Token mới tự động update lên server
3. **User đăng xuất** → Token tự động xóa khỏi server
4. **Nhận notification** → Hiển thị alert (foreground) hoặc notification (background/closed)

## 🆘 Troubleshooting

**iOS không nhận notification:**
- Check APNs certificate trong Firebase Console
- Verify Push Notifications enabled trong Xcode
- Rebuild app sau khi add GoogleService-Info.plist

**Android không nhận notification:**
- Check google-services.json trong android/app/
- Verify Google Services plugin đã apply
- Check Google Play Services đã cài trên device

**Token không gửi lên server:**
- Check network connection
- Verify API endpoint hoạt động
- Check console logs

## 📞 Support

Nếu gặp vấn đề, check:
1. Console logs
2. Firebase Console > Cloud Messaging
3. Network tab để xem API call

---

**Happy Coding! 🎉**
