# Hướng dẫn Setup Firebase Cloud Messaging (FCM) cho GreenEduMapApp

## Tổng quan
Tài liệu này hướng dẫn cấu hình Firebase Cloud Messaging để nhận push notification trên iOS và Android cho ứng dụng GreenEduMapApp.

## Những gì đã được tích hợp

### 1. Dependencies đã thêm
- `@react-native-firebase/app`: ^23.4.1
- `@react-native-firebase/messaging`: ^23.4.1

### 2. File đã tạo
- `src/components/NotificationService.tsx` - Component quản lý notification
- `src/services/NotificationTokenService.ts` - Service quản lý FCM token
- `src/utils/PushNotificationHelper.ts` - Helper functions cho push notification

### 3. File đã cập nhật
- `App.tsx` - Tích hợp NotificationService
- `src/contexts/AuthContext.tsx` - Đăng ký/hủy FCM token khi login/logout
- `ios/Podfile` - Thêm Firebase pods
- `ios/GreenEduMapApp/AppDelegate.swift` - Cấu hình Firebase và notification delegate
- `ios/GreenEduMapApp/Info.plist` - Thêm UIBackgroundModes

## Các bước cần thực hiện

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc sử dụng project có sẵn
3. Thêm app iOS và Android vào project

### Bước 2: Cấu hình iOS

1. **Download GoogleService-Info.plist**
   - Tải file `GoogleService-Info.plist` từ Firebase Console
   - Copy file vào thư mục `ios/GreenEduMapApp/`
   - Thêm file vào Xcode project (right-click Add Files to "GreenEduMapApp")

2. **Cài đặt CocoaPods dependencies**
   ```bash
   cd ios
   pod install
   ```

3. **Cấu hình APNs (Apple Push Notification service)**
   - Đăng nhập vào [Apple Developer Portal](https://developer.apple.com/)
   - Tạo APNs Key hoặc Certificate
   - Upload lên Firebase Console (Project Settings > Cloud Messaging)

4. **Enable Push Notifications trong Xcode**
   - Mở file `.xcworkspace` trong Xcode
   - Chọn target GreenEduMapApp
   - Vào tab "Signing & Capabilities"
   - Click "+" và thêm "Push Notifications"
   - Thêm "Background Modes" và check:
     - Remote notifications
     - Background fetch

### Bước 3: Cấu hình Android

1. **Download google-services.json**
   - Tải file `google-services.json` từ Firebase Console
   - Copy file vào thư mục `android/app/`

2. **Cập nhật build.gradle**
   
   **File: android/build.gradle**
   ```gradle
   buildscript {
       dependencies {
           classpath 'com.google.gms:google-services:4.4.0'
       }
   }
   ```

   **File: android/app/build.gradle**
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   ```

3. **Thêm permissions vào AndroidManifest.xml**
   
   **File: android/app/src/main/AndroidManifest.xml**
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
   ```

### Bước 4: Cài đặt dependencies

```bash
# Cài đặt node modules
yarn install

# Cài đặt iOS pods
cd ios && pod install && cd ..

# Build lại app
# iOS
yarn ios

# Android
yarn android
```

### Bước 5: Test notification

1. **Test từ Firebase Console**
   - Vào Firebase Console > Cloud Messaging
   - Click "Send your first message"
   - Nhập title và message
   - Chọn target app
   - Gửi test message

2. **Test từ code**
   - Đăng nhập vào app
   - Check console log để lấy FCM token
   - Sử dụng FCM token để gửi test notification

## API Backend cần implement

Backend cần implement endpoint để nhận và lưu FCM token:

```typescript
// POST /api/auth/update-fcm-token
{
  "push_token": "FCM_TOKEN_STRING"
}
```

Endpoint này đã được tích hợp sẵn trong `authService.updateFcmToken()`.

## Cách hoạt động

### 1. Khi user đăng nhập
- `AuthContext.signIn()` được gọi
- Sau khi login thành công, `NotificationTokenService.registerTokenAfterLogin()` được gọi
- Xin quyền notification (nếu chưa có)
- Lấy FCM token
- Gửi token lên server thông qua `authService.updateFcmToken()`

### 2. Khi user đăng xuất
- `AuthContext.signOut()` được gọi
- `NotificationTokenService.unregisterTokenAfterLogout()` được gọi
- Gửi empty token lên server
- Xóa FCM token local
- Xóa token khỏi AsyncStorage

### 3. Khi nhận notification
- **App foreground**: Hiển thị Alert với title và body
- **App background**: Hiển thị notification ở notification tray
- **App closed**: Notification xuất hiện, app mở khi user tap

### 4. Khi token refresh
- Firebase tự động refresh token
- `NotificationService` lắng nghe event `onTokenRefresh`
- Token mới được gửi lên server tự động

## Customization

### Thay đổi cách hiển thị notification foreground

Edit file `src/components/NotificationService.tsx`:

```typescript
const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
  // Custom logic ở đây
  console.log('Notification:', remoteMessage);
  
  // Có thể dùng Toast thay vì Alert
  Toast.show({
    type: 'info',
    text1: remoteMessage.notification?.title,
    text2: remoteMessage.notification?.body,
  });
});
```

### Thêm navigation khi tap notification

Edit file `App.tsx`:

```typescript
const handleNotificationOpened = (notification: any) => {
  // Navigation logic
  if (notification.data?.screen) {
    navigationRef.current?.navigate(notification.data.screen, notification.data.params);
  }
};
```

## Troubleshooting

### iOS không nhận được notification

1. Check APNs certificate/key trong Firebase Console
2. Verify Push Notifications capability trong Xcode
3. Check Bundle ID khớp với Firebase config
4. Rebuild app sau khi thêm GoogleService-Info.plist

### Android không nhận được notification

1. Verify google-services.json trong android/app/
2. Check internet permission
3. Verify package name khớp với Firebase config
4. Check Google Play Services đã cài đặt trên device

### Token không được gửi lên server

1. Check network connection
2. Verify API endpoint `/auth/update-fcm-token` hoạt động
3. Check console logs để xem error message
4. Verify user đã đăng nhập trước khi gửi token

## Tham khảo

- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [APNs Configuration](https://firebase.google.com/docs/cloud-messaging/ios/certs)

## Changelog

### 2025-12-06
- Initial Firebase Cloud Messaging integration
- Thêm NotificationService, NotificationTokenService, PushNotificationHelper
- Cấu hình iOS và Android
- Tích hợp với AuthContext cho auto register/unregister token
