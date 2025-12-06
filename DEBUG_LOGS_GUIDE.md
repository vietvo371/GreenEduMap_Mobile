# 🔍 Hướng dẫn Debug Logs - GreenEduMap

## 📊 Đã thêm Logs vào toàn bộ ứng dụng

### 🎯 Mục đích
Giúp bạn kiểm tra nhanh data từ API, debug lỗi, và theo dõi flow của ứng dụng.

---

## 📍 Vị trí Logs

### 1. **Services Layer** (API Calls)

#### environmentService.ts
```
🌐 [API] GET /air-quality/latest
📥 [API] Response: { status, success, dataLength }
✅ [API] Latest AQI data received: [data]
❌ [API] Get latest air quality error: { message, response, status }

🌐 [API] GET /open-data/weather/current
📥 [API] Response: { status, success, hasData }
✅ [API] Public weather data: { location, temp, humidity }
❌ [API] Get public weather error: { message, response, status }
```

#### schoolService.ts
```
🌐 [API] GET /green-courses
📥 [API] Response: { status, success, total, itemsCount }
✅ [API] Green courses received: [{ id, title, category }]
❌ [API] Get green courses error: { message, response, status }
```

---

### 2. **Custom Hooks Layer**

#### useEnvironment.ts
```
🔄 [useLatestAirQuality] Fetching AQI data, limit: 10
✅ [useLatestAirQuality] Success! Received X records
📊 [useLatestAirQuality] Data: [full JSON data]
❌ [useLatestAirQuality] Error: { error details }

🔄 [useCurrentWeather] Fetching weather data for: { lat, lon }
✅ [useCurrentWeather] Success!
🌡️ [useCurrentWeather] Weather: { location, temp, humidity, description }
❌ [useCurrentWeather] Error: { error details }

🔄 [usePublicCurrentWeather] Fetching public weather for: { lat, lon }
✅ [usePublicCurrentWeather] Success!
🌤️ [usePublicCurrentWeather] Data: { location, temp, humidity, weather }
❌ [usePublicCurrentWeather] Error: { error details }
```

#### useSchools.ts
```
🔄 [useGreenCourses] Fetching courses with params: { skip, limit, category }
✅ [useGreenCourses] Success! Received X / Y courses
📚 [useGreenCourses] Courses: [{ id, title, category, difficulty }]
❌ [useGreenCourses] Error: { error details }

🔄 [useNearbySchools] Fetching nearby schools: { latitude, longitude, radius }
✅ [useNearbySchools] Found X schools
🏫 [useNearbySchools] Schools: [{ name, distance, district }]
❌ [useNearbySchools] Error: { error details }
```

---

### 3. **Screen Layer**

#### HomeScreen.tsx
```
📍 [HomeScreen] Getting current location...
✅ [HomeScreen] Location obtained: { lat, lon }
⚠️ [HomeScreen] Location error: { error }
📍 [HomeScreen] Using fallback location (Da Nang): { lat, lon }

📊 [HomeScreen] AQI Data updated: { count, first }
🌤️ [HomeScreen] Weather Data updated: { location, temp, humidity }
```

#### LearnScreen.tsx
```
📚 [LearnScreen] Courses updated: { count, total, category, courses }
🔄 [LearnScreen] Manual refresh triggered
✅ [LearnScreen] Refresh completed
```

---

## 🚀 Cách xem Logs

### **React Native Debugger** (Recommended)

1. **Mở React Native Debugger**:
```bash
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

2. **Enable Debug Mode**:
   - Shake device (hoặc `Cmd+D` trên iOS Simulator)
   - Chọn "Debug JS Remotely"

3. **Xem Console**:
   - Mở tab Console trong React Native Debugger
   - Logs sẽ hiển thị với icons dễ nhận diện

---

### **Metro Bundler Console**

Logs cũng xuất hiện trực tiếp trong Metro terminal:

```bash
# Khi chạy app
npx react-native start

# Logs sẽ hiển thị như:
🔄 [useLatestAirQuality] Fetching AQI data, limit: 10
✅ [useLatestAirQuality] Success! Received 1 records
📊 [useLatestAirQuality] Data: {...}
```

---

### **Flipper** (Alternative)

1. Mở Flipper app
2. Connect đến device/simulator
3. Xem Logs plugin
4. Filter bằng keywords: `[API]`, `[HomeScreen]`, `[useLatest...]`

---

## 🔎 Filtering Logs

### Tìm kiếm theo module:

**API Calls:**
```
Filter: [API]
```

**Hooks:**
```
Filter: [useLatest] hoặc [useGreen] hoặc [usePublic]
```

**Screens:**
```
Filter: [HomeScreen] hoặc [LearnScreen]
```

**Success only:**
```
Filter: ✅
```

**Errors only:**
```
Filter: ❌
```

---

## 📋 Example Log Output

### Successful API Call Flow:

```
📍 [HomeScreen] Getting current location...
✅ [HomeScreen] Location obtained: { lat: 16.068882, lon: 108.245350 }

🔄 [useLatestAirQuality] Fetching AQI data, limit: 1
🌐 [API] GET /air-quality/latest { limit: 1 }
📥 [API] Response: { status: 200, success: true, dataLength: 1 }
✅ [API] Latest AQI data received: [
  {
    id: 1,
    city: "Da Nang",
    location: "Hải Châu",
    aqi: 85,
    pm25: 35.2,
    status: "moderate"
  }
]
✅ [useLatestAirQuality] Success! Received 1 records
📊 [useLatestAirQuality] Data: [...]
📊 [HomeScreen] AQI Data updated: { count: 1, first: {...} }

🔄 [usePublicCurrentWeather] Fetching public weather for: { lat: 16.068882, lon: 108.245350 }
🌐 [API] GET /open-data/weather/current { lat: 16.068882, lon: 108.245350 }
📥 [API] Response: { status: 200, success: true, hasData: true }
✅ [API] Public weather data: {
  location: "Hải Châu, Da Nang",
  temp: 28,
  humidity: 65,
  weather: "Clouds"
}
✅ [usePublicCurrentWeather] Success!
🌤️ [usePublicCurrentWeather] Data: {...}
🌤️ [HomeScreen] Weather Data updated: { location: "Hải Châu, Da Nang", temp: 28, humidity: 65 }
```

---

### Error Handling Example:

```
🔄 [useLatestAirQuality] Fetching AQI data, limit: 1
🌐 [API] GET /air-quality/latest { limit: 1 }
❌ [API] Get latest air quality error: {
  message: "Network Error",
  response: undefined,
  status: undefined
}
❌ [useLatestAirQuality] Error: Network Error
```

---

## 🐛 Common Issues & Solutions

### 1. **Network Error**
```
❌ [API] Get latest air quality error: { message: "Network Error" }
```
**Solutions:**
- Kiểm tra API URL trong `src/config/env.ts`
- Kiểm tra internet connection
- Kiểm tra API server đang chạy

### 2. **401 Unauthorized**
```
❌ [API] Get latest air quality error: { status: 401 }
```
**Solutions:**
- Token hết hạn → Login lại
- Token không được gửi → Check axios interceptor

### 3. **404 Not Found**
```
❌ [API] Get latest air quality error: { status: 404 }
```
**Solutions:**
- Endpoint sai → Check API collection
- API chưa implement endpoint này

### 4. **Empty Data**
```
✅ [useLatestAirQuality] Success! Received 0 records
```
**Solutions:**
- Database chưa có data
- Query params sai (city, limit, etc.)

### 5. **Location Error**
```
⚠️ [HomeScreen] Location error: { code: 1, message: "User denied..." }
```
**Solutions:**
- Enable location permissions
- Fallback location sẽ được sử dụng (Da Nang)

---

## 🎨 Log Icons Reference

| Icon | Meaning |
|------|---------|
| 🌐 | API Request |
| 📥 | API Response |
| ✅ | Success |
| ❌ | Error |
| 🔄 | Loading/Fetching |
| 📊 | Data Received |
| 📚 | Courses Data |
| 🏫 | Schools Data |
| 🌡️ | Weather Data |
| 🌤️ | Public Weather |
| 📍 | Location |
| ⚠️ | Warning |

---

## 💡 Tips

### 1. **Enable Verbose Logging**
Nếu cần thêm logs, uncomment các console.log trong:
- `src/utils/Api.tsx` - Axios interceptor logs
- `src/services/*Service.ts` - Service layer logs

### 2. **Production Logs**
Trong production, nên disable hoặc use logging service như:
- Sentry
- Bugsnag
- Firebase Crashlytics

### 3. **Filter Noise**
Nếu logs quá nhiều, filter bằng:
```javascript
// Chỉ log errors
if (__DEV__) {
  console.error('❌ [API] Error:', error);
}
```

### 4. **Structured Logging**
Logs đã được format JSON để dễ parse:
```javascript
console.log('📊 [Module] Data:', JSON.stringify(data, null, 2));
```

---

## 🚀 Quick Commands

### Clear Metro Cache & Restart:
```bash
npx react-native start --reset-cache
```

### Run with Logs:
```bash
# iOS
npx react-native run-ios --verbose

# Android  
npx react-native run-android --verbose
```

### Filter Logs (Terminal):
```bash
# iOS Simulator
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "GreenEduMap"' --level debug

# Android
adb logcat | grep "GreenEduMap"
```

---

## 📞 Support

Nếu logs không hiển thị:
1. Check console.log hoạt động: `console.log('Test')`
2. Restart Metro bundler
3. Clear cache: `npx react-native start --reset-cache`
4. Reinstall app

---

**Last Updated:** 2025-01-06
**Maintained by:** GreenEduMap Team
