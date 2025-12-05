# Hướng dẫn Sửa Lỗi iOS Archive

## Tóm tắt các lỗi đã được sửa

### ✅ 1. Lỗi Icon (ĐÃ SỬA)
**Lỗi gốc:**
```
Missing required icon file. The bundle does not contain an app icon for iPhone / iPod Touch of exactly '120x120' pixels
```

**Nguyên nhân:** File `Contents.json` trong `AppIcon.appiconset` không tham chiếu đến các file icon thực tế.

**Giải pháp:** Đã cập nhật file `ios/GreenEduMapApp/Images.xcassets/AppIcon.appiconset/Contents.json` để thêm thuộc tính `filename` cho mỗi kích thước icon.

**Files đã sửa:**
- `ios/GreenEduMapApp/Images.xcassets/AppIcon.appiconset/Contents.json`

### ✅ 1b. Lỗi Icon 1024x1024 có Alpha Channel (ĐÃ SỬA)
**Lỗi gốc:**
```
Invalid large app icon. The large app icon in the asset catalog can't be transparent or contain an alpha channel
```

**Nguyên nhân:** Icon 1024x1024 (App Store icon) chứa alpha channel (độ trong suốt), vi phạm yêu cầu của Apple.

**Giải pháp:** 
- Đã xóa alpha channel khỏi file `Icon-1024.png` bằng cách convert qua JPEG rồi quay lại PNG
- Đã cập nhật script `generate_icons.sh` để tự động xóa alpha channel khi tạo icon 1024x1024

**Lưu ý:** Chỉ icon 1024x1024 mới bắt buộc không được có alpha channel. Các icon khác có thể có alpha channel.

**Files đã sửa:**
- `ios/GreenEduMapApp/Images.xcassets/AppIcon.appiconset/Icon-1024.png`
- `generate_icons.sh`

### ✅ 2. Lỗi CFBundleIconName (ĐÃ CÓ SẴN)
**Lỗi gốc:**
```
Missing Info.plist value. A value for the Info.plist key 'CFBundleIconName' is missing
```

**Trạng thái:** File `Info.plist` đã có giá trị `CFBundleIconName = AppIcon` từ trước. Không cần sửa.

### ⚠️ 3. Lỗi dSYM Symbols (ĐÃ CẤU HÌNH)
**Lỗi gốc:**
```
The archive did not include a dSYM for MapboxCommon.framework, MapboxCoreMaps.framework, hermes.framework
```

**Giải pháp:** 
- Đã thêm `DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym"` vào cả Debug và Release configuration trong `project.pbxproj`
- Podfile đã có sẵn cấu hình dSYM cho Release builds (dòng 64-69)

**Lưu ý:** Lỗi dSYM cho các frameworks của third-party (Mapbox, Hermes) là **cảnh báo** chứ không phải lỗi nghiêm trọng. Apple vẫn có thể chấp nhận app mặc dù có các cảnh báo này.

**Files đã sửa:**
- `ios/GreenEduMapApp.xcodeproj/project.pbxproj`

## Các bước tiếp theo

### 1. Clean và Rebuild Project

```bash
cd ios
rm -rf Pods
rm -rf build
rm Podfile.lock
pod deintegrate
pod install
cd ..
```

### 2. Clean Build Folder trong Xcode

1. Mở Xcode: `open ios/GreenEduMapApp.xcworkspace`
2. Chọn menu: **Product** → **Clean Build Folder** (hoặc `Shift + Cmd + K`)
3. Chọn menu: **Product** → **Archive**

### 3. Kiểm tra Archive

Sau khi archive thành công:
1. Xcode sẽ mở **Organizer** window
2. Chọn archive vừa tạo
3. Click **Validate App** để kiểm tra validation
4. Nếu pass validation, click **Distribute App** để submit lên App Store

## Lưu ý quan trọng

### Về lỗi dSYM
- Nếu vẫn còn cảnh báo về dSYM cho MapboxCommon, MapboxCoreMaps, hermes:
  - **Không cần lo lắng!** Đây là cảnh báo thông thường với third-party frameworks
  - Apple vẫn chấp nhận app với các cảnh báo này
  - Các frameworks này thường không có dSYM files vì được cung cấp dưới dạng pre-compiled binary

### Nếu vẫn gặp lỗi Icon
1. Kiểm tra xem tất cả các file icon có tồn tại:
   ```bash
   ls -la ios/GreenEduMapApp/Images.xcassets/AppIcon.appiconset/*.png
   ```

2. Nếu thiếu icon, chạy script để generate lại:
   ```bash
   ./generate_icons.sh
   ```

3. Đảm bảo file logo gốc tồn tại:
   ```bash
   ls -la src/assets/images/logo.png
   ```

## Kiểm tra kích thước Icon

Các kích thước icon hiện tại:
- `Icon-40.png` → 40x40 (iPhone 2x notification)
- `Icon-60.png` → 60x60 (iPhone 3x notification)
- `Icon-58.png` → 58x58 (iPhone 2x settings)
- `Icon-87.png` → 87x87 (iPhone 3x settings)
- `Icon-80.png` → 80x80 (iPhone 2x spotlight)
- `Icon-120.png` → 120x120 (iPhone 2x app icon / 3x spotlight)
- `Icon-180.png` → 180x180 (iPhone 3x app icon)
- `Icon-1024.png` → 1024x1024 (App Store)

## Troubleshooting

### Nếu archive vẫn thất bại với lỗi icon:
1. Xóa DerivedData:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/*
   ```

2. Trong Xcode, kiểm tra Asset Catalog:
   - Mở `ios/GreenEduMapApp/Images.xcassets/AppIcon.appiconset`
   - Đảm bảo tất cả các icon slots đều có image
   - Nếu có slot trống, drag & drop file icon tương ứng vào

### Nếu gặp lỗi "Invalid large app icon" (Alpha Channel):
1. Kiểm tra xem icon 1024x1024 có alpha channel không:
   ```bash
   sips -g hasAlpha ios/GreenEduMapApp/Images.xcassets/AppIcon.appiconset/Icon-1024.png
   ```

2. Nếu kết quả là `hasAlpha: yes`, xóa alpha channel:
   ```bash
   cd ios/GreenEduMapApp/Images.xcassets/AppIcon.appiconset
   sips -s format jpeg Icon-1024.png --out Icon-1024-temp.jpg
   sips -s format png Icon-1024-temp.jpg --out Icon-1024-noalpha.png
   mv Icon-1024-noalpha.png Icon-1024.png
   rm Icon-1024-temp.jpg
   ```

3. Hoặc đơn giản hơn, chạy lại script generate icons:
   ```bash
   ./generate_icons.sh
   ```

### Nếu gặp lỗi codesign:
1. Kiểm tra Bundle Identifier trong Xcode
2. Đảm bảo có provisioning profile hợp lệ
3. Check signing team trong Xcode settings

## Tài liệu tham khảo

- [Apple - App Icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Apple - Debugging Symbols](https://developer.apple.com/documentation/xcode/building-your-app-to-include-debugging-information)
- [React Native - Publishing to App Store](https://reactnative.dev/docs/publishing-to-app-store)
