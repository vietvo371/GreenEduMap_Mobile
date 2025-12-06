# Firebase Notification Setup Checklist

## ✅ Đã hoàn thành

- [x] Thêm Firebase dependencies vào package.json
- [x] Tạo NotificationService component
- [x] Tạo NotificationTokenService
- [x] Tạo PushNotificationHelper
- [x] Update App.tsx để tích hợp NotificationService
- [x] Update AuthContext để auto register/unregister token
- [x] Cấu hình iOS Podfile
- [x] Cấu hình iOS AppDelegate.swift
- [x] Cấu hình iOS Info.plist

## 📋 Cần thực hiện

### Firebase Console Setup
- [ ] Tạo Firebase project hoặc sử dụng project có sẵn
- [ ] Thêm iOS app vào Firebase project
- [ ] Thêm Android app vào Firebase project

### iOS Configuration
- [ ] Download GoogleService-Info.plist từ Firebase Console
- [ ] Copy GoogleService-Info.plist vào ios/GreenEduMapApp/
- [ ] Add GoogleService-Info.plist vào Xcode project
- [ ] Chạy `cd ios && pod install`
- [ ] Tạo APNs Key hoặc Certificate trong Apple Developer Portal
- [ ] Upload APNs Key/Certificate lên Firebase Console
- [ ] Mở project trong Xcode và enable Push Notifications capability
- [ ] Enable Background Modes (Remote notifications, Background fetch)

### Android Configuration
- [ ] Download google-services.json từ Firebase Console
- [ ] Copy google-services.json vào android/app/
- [ ] Thêm Google Services plugin vào android/build.gradle
- [ ] Apply plugin trong android/app/build.gradle
- [ ] Thêm POST_NOTIFICATIONS permission vào AndroidManifest.xml
- [ ] Build lại app Android

### Backend API
- [ ] Implement endpoint POST /api/auth/update-fcm-token
- [ ] Test endpoint với sample FCM token
- [ ] Implement logic lưu FCM token vào database
- [ ] Implement logic gửi notification từ backend

### Testing
- [ ] Test notification trên iOS device
- [ ] Test notification trên Android device
- [ ] Test foreground notification
- [ ] Test background notification
- [ ] Test notification khi app closed
- [ ] Test token auto-refresh
- [ ] Test token register khi login
- [ ] Test token unregister khi logout

## 🚀 Next Steps

1. **Setup Firebase Project**
   ```
   Truy cập: https://console.firebase.google.com/
   Tạo project mới hoặc sử dụng project có sẵn
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   cd ios && pod install && cd ..
   ```

3. **Add Firebase Config Files**
   - iOS: GoogleService-Info.plist
   - Android: google-services.json

4. **Build và Test**
   ```bash
   # iOS
   yarn ios
   
   # Android
   yarn android
   ```

5. **Send Test Notification**
   - Từ Firebase Console > Cloud Messaging
   - Hoặc từ Backend API

## 📝 Notes

- FCM token sẽ tự động được gửi lên server sau khi user đăng nhập
- Token sẽ tự động refresh và update lên server
- Khi user đăng xuất, token sẽ bị xóa khỏi server
- Notification foreground sẽ hiển thị dạng Alert (có thể customize)
- Notification background/closed sẽ hiển thị trong notification tray

## ⚠️ Important

- **iOS**: Cần APNs Key/Certificate để nhận notification
- **Android**: Cần google-services.json và Google Play Services
- **Both**: Cần internet permission và valid Firebase config
- **Backend**: Cần implement API endpoint để lưu FCM token
