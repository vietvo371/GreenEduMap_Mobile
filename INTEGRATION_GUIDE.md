# 🚀 Hướng dẫn tích hợp Services vào Dự án GreenEduMap

## ✅ Đã hoàn thành

### 1. **Types & API Structure** ✓
- ✅ Tạo `/src/types/api/environment.ts` - chứa tất cả types cho Environment, Schools, Green Zones
- ✅ Cập nhật `/src/types/api/index.ts` - export types mới
- ✅ Types đồng bộ 100% với API collection

### 2. **Custom Hooks** ✓
- ✅ `/src/hooks/useEnvironment.ts` - Air Quality & Weather hooks
  - `useLatestAirQuality()` - Lấy AQI mới nhất
  - `usePublicAirQuality()` - AQI công khai
  - `useCurrentWeather()` - Thời tiết hiện tại
  - `usePublicCurrentWeather()` - Thời tiết công khai
  - `useWeatherForecast()` - Dự báo 7 ngày

- ✅ `/src/hooks/useSchools.ts` - Schools & Courses hooks
  - `useSchools()` - Danh sách trường học
  - `useNearbySchools()` - Trường học gần đây
  - `useSchool()` - Chi tiết trường học
  - `useGreenCourses()` - Danh sách khóa học
  - `useGreenCourse()` - Chi tiết khóa học
  - `useCourseProgress()` - Tiến độ khóa học

- ✅ `/src/hooks/useGreenResources.ts` - Green Zones & Resources hooks
  - `useGreenZones()` - Danh sách khu vực xanh
  - `useNearbyGreenZones()` - Khu vực xanh gần đây
  - `useGreenResources()` - Danh sách tài nguyên xanh
  - `useNearbyGreenResources()` - Tài nguyên gần đây
  - `useDataCatalog()` - Danh mục dữ liệu

### 3. **HomeScreen** ✓
- ✅ Tích hợp real AQI data với `useLatestAirQuality()`
- ✅ Tích hợp real Weather data với `usePublicCurrentWeather()`
- ✅ Auto-detect location với Geolocation
- ✅ Pull-to-refresh để reload data
- ✅ Loading states & Error handling
- ✅ AQI color coding (Green/Yellow/Orange/Red)
- ✅ Clickable cards navigate to Map screen

### 4. **LearnScreen** ✓
- ✅ Load real courses từ API với `useGreenCourses()`
- ✅ Filter courses by category
- ✅ Pull-to-refresh
- ✅ Loading, Error, Empty states
- ✅ Course progress display
- ✅ Vietnamese translations

---

## 🔨 Cần triển khai tiếp

### 5. **MapScreen** - Cần cập nhật

**Mục tiêu:**
- Hiển thị Schools markers từ `useNearbySchools()`
- Hiển thị Green Zones từ `useNearbyGreenZones()`
- Hiển thị real AQI data từ `useLatestAirQuality()`

**Cách triển khai:**

```typescript
// src/screens/MapScreen.tsx

import { useNearbySchools } from '../hooks/useSchools';
import { useNearbyGreenZones } from '../hooks/useGreenResources';
import { useLatestAirQuality } from '../hooks/useEnvironment';

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  // 1. Fetch nearby schools
  const { data: schools, loading: schoolsLoading } = useNearbySchools(
    currentLocation ? {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      radius: 5,
      limit: 20
    } : null
  );

  // 2. Fetch nearby green zones
  const { data: greenZones, loading: greenZonesLoading } = useNearbyGreenZones(
    currentLocation ? {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      radius: 5,
      limit: 20
    } : null
  );

  // 3. Fetch AQI data
  const { data: aqiData } = useLatestAirQuality(10);

  // 4. Render schools markers
  {schools.map((school) => (
    <Marker
      key={school.id}
      coordinate={{
        latitude: school.latitude,
        longitude: school.longitude,
      }}
      onPress={() => handleSchoolPress(school)}
    >
      <View style={styles.schoolMarker}>
        <Icon name="school" size={28} color="#7c3aed" />
      </View>
    </Marker>
  ))}

  // 5. Render green zones markers
  {greenZones.map((zone) => (
    <Marker
      key={zone.id}
      coordinate={{
        latitude: zone.latitude,
        longitude: zone.longitude,
      }}
      onPress={() => handleGreenZonePress(zone)}
    >
      <View style={styles.greenZoneMarker}>
        <Icon name="tree" size={28} color="#16a34a" />
      </View>
    </Marker>
  ))}

  // 6. Render AQI markers with circles
  {aqiData.map((aqi, index) => (
    <React.Fragment key={index}>
      <Marker
        coordinate={{
          latitude: aqi.latitude,
          longitude: aqi.longitude,
        }}
        onPress={() => handleAQIPress(aqi)}
      >
        <View style={[styles.aqiMarker, { backgroundColor: getAQIColor(aqi.aqi) }]}>
          <Text style={styles.aqiText}>{aqi.aqi}</Text>
        </View>
      </Marker>
      <Circle
        center={{ latitude: aqi.latitude, longitude: aqi.longitude }}
        radius={2000}
        fillColor={hexToRgba(getAQIColor(aqi.aqi), 0.25)}
        strokeColor={getAQIColor(aqi.aqi)}
        strokeWidth={2}
      />
    </React.Fragment>
  ))}
};
```

**Helper Functions:**

```typescript
const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#4CAF50'; // Good
  if (aqi <= 100) return '#FFEB3B'; // Moderate
  if (aqi <= 150) return '#FF9800'; // Unhealthy for sensitive
  if (aqi <= 200) return '#F44336'; // Unhealthy
  return '#9C27B0'; // Very unhealthy
};

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
```

---

### 6. **ProfileScreen** - Cần cập nhật

**Mục tiêu:**
- Hiển thị user stats từ API
- Load user's enrolled courses

**Cách triển khai:**

```typescript
// src/screens/ProfileScreen.tsx

import { useGreenCourses, useCourseProgress } from '../hooks/useSchools';

const ProfileScreen = () => {
  const { user } = useAuth();

  // Load user's courses (enrolled courses)
  const { data: enrolledCourses } = useGreenCourses({
    skip: 0,
    limit: 10,
  });

  // Display stats from user object
  const stats = [
    {
      id: 'carbon',
      title: 'CO₂ Tiết kiệm',
      value: `${user?.carbon_saved || 0}kg`,
      icon: 'molecule-co2',
      color: theme.colors.success,
    },
    {
      id: 'points',
      title: 'Điểm Xanh',
      value: user?.points?.toString() || '0',
      icon: 'star-circle',
      color: theme.colors.environmental,
    },
    {
      id: 'badge',
      title: 'Cấp độ',
      value: user?.badge_level_text || 'Đồng',
      icon: 'medal',
      color: theme.colors.warning,
    },
  ];

  return (
    // ... render stats cards
    {stats.map((stat) => (
      <View key={stat.id} style={styles.statCard}>
        <Icon name={stat.icon} size={32} color={stat.color} />
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statTitle}>{stat.title}</Text>
      </View>
    ))}

    // ... render enrolled courses
    {enrolledCourses.map((course) => (
      <TouchableOpacity key={course.id} style={styles.courseItem}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        {course.progress && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
          </View>
        )}
      </TouchableOpacity>
    ))}
  );
};
```

---

## 📚 Cách sử dụng Services & Hooks

### Ví dụ 1: Lấy AQI mới nhất
```typescript
import { useLatestAirQuality } from '../hooks/useEnvironment';

const MyComponent = () => {
  const { data, loading, error, refetch } = useLatestAirQuality(10);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <View>
      {data.map((aqi) => (
        <Text key={aqi.id}>
          {aqi.location}: AQI {aqi.aqi}
        </Text>
      ))}
    </View>
  );
};
```

### Ví dụ 2: Tìm trường học gần đây
```typescript
import { useNearbySchools } from '../hooks/useSchools';

const MyComponent = () => {
  const [location, setLocation] = useState({ latitude: 16.068882, longitude: 108.245350 });

  const { data: schools, loading } = useNearbySchools({
    latitude: location.latitude,
    longitude: location.longitude,
    radius: 5, // 5km
    limit: 10,
  });

  return (
    <View>
      {schools.map((school) => (
        <Text key={school.id}>
          {school.name} - {school.distance}km
        </Text>
      ))}
    </View>
  );
};
```

### Ví dụ 3: Load khóa học với filter
```typescript
import { useGreenCourses } from '../hooks/useSchools';

const MyComponent = () => {
  const [category, setCategory] = useState<'climate_change' | 'all'>('all');

  const { data: courses, loading, refetch } = useGreenCourses({
    skip: 0,
    limit: 20,
    category: category !== 'all' ? category : undefined,
  });

  return (
    <View>
      <Button title="Filter Climate" onPress={() => setCategory('climate_change')} />
      <Button title="Show All" onPress={() => setCategory('all')} />
      
      {courses.map((course) => (
        <Text key={course.id}>{course.title}</Text>
      ))}
    </View>
  );
};
```

---

## 🎯 Best Practices

### 1. Error Handling
```typescript
const { data, loading, error, refetch } = useLatestAirQuality();

if (error) {
  return (
    <View style={styles.errorContainer}>
      <Icon name="alert-circle" size={48} color={theme.colors.error} />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={refetch}>
        <Text>Thử lại</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 2. Loading States
```typescript
if (loading && data.length === 0) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text>Đang tải dữ liệu...</Text>
    </View>
  );
}
```

### 3. Pull-to-Refresh
```typescript
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
};

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
  {/* Content */}
</ScrollView>
```

### 4. Empty States
```typescript
if (!loading && data.length === 0) {
  return (
    <View style={styles.emptyContainer}>
      <Icon name="inbox" size={48} color={theme.colors.textLight} />
      <Text>Chưa có dữ liệu</Text>
    </View>
  );
}
```

---

## 🔄 Migration từ Mock Data

### Trước (Mock Data):
```typescript
const MOCK_COURSES = [
  { id: '1', title: 'Course 1', ... },
  { id: '2', title: 'Course 2', ... },
];

const filteredCourses = MOCK_COURSES.filter(...);
```

### Sau (Real API):
```typescript
import { useGreenCourses } from '../hooks/useSchools';

const { data: courses, loading, error, refetch } = useGreenCourses({
  skip: 0,
  limit: 20,
});
```

---

## ⚡ Performance Tips

1. **Pagination**: Sử dụng `skip` và `limit` để load data từng trang
2. **Caching**: Hooks tự động cache data, không cần fetch lại khi component re-render
3. **Conditional Fetch**: Chỉ fetch khi có location/params cần thiết
4. **Debounce**: Sử dụng debounce cho search/filter

---

## 🐛 Debugging

### Check API Response:
```typescript
const { data, loading, error } = useLatestAirQuality();

useEffect(() => {
  console.log('AQI Data:', data);
  console.log('Loading:', loading);
  console.log('Error:', error);
}, [data, loading, error]);
```

### Check Network Requests:
```bash
# In React Native Debugger or Chrome DevTools
# Check Network tab for API calls
```

---

## 📦 Dependencies

Đảm bảo đã cài đặt:
```json
{
  "dependencies": {
    "react-native-geolocation-service": "^5.3.1",
    "react-native-maps": "^1.7.1",
    "@react-navigation/native": "^6.x",
    "axios": "^1.4.0"
  }
}
```

---

## ✨ Tổng kết

### Đã triển khai:
- ✅ 4 Service files mới (environment, school, greenResource, health, aiTask)
- ✅ 3 Custom hooks files (useEnvironment, useSchools, useGreenResources)
- ✅ Types đầy đủ (environment.ts)
- ✅ HomeScreen với real AQI & Weather data
- ✅ LearnScreen với real Courses data
- ✅ Pull-to-refresh, Loading, Error handling

### Cần làm tiếp:
- ⏳ MapScreen: Add schools, green zones, AQI markers
- ⏳ ProfileScreen: Display user stats từ API
- ⏳ ActionsScreen: Integrate với API (nếu có endpoints)

### Hướng dẫn sau:
1. Cập nhật MapScreen theo hướng dẫn ở trên
2. Cập nhật ProfileScreen với user stats
3. Test thoroughly với real API
4. Add error boundaries & retry logic
5. Optimize performance với useMemo/useCallback nếu cần

---

**Tài liệu này được tạo tự động - Last updated: 2025-01-06**
