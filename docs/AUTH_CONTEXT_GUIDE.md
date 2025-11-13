# GreenEduMap AuthContext - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

`AuthContext` là trung tâm quản lý trạng thái người dùng và dữ liệu môi trường trong ứng dụng **GreenEduMap**. Context này cung cấp các tính năng:

- ✅ **Xác thực người dùng** (Sign In/Sign Up/Sign Out)
- 🌍 **Theo dõi tác động môi trường** (Carbon footprint, green actions)
- 📚 **Tiến độ học tập** (Courses, quizzes, achievements)
- 🤖 **AI Insights & Recommendations** (Personalized green actions)
- ⚙️ **Preferences môi trường** (Air quality alerts, weather monitoring)

---

## 🎯 User Roles (Vai Trò Người Dùng)

```typescript
type UserRole = 
  | 'citizen'        // Công dân quan sát môi trường
  | 'student'        // Học sinh học về môi trường
  | 'teacher'        // Giáo viên tạo nội dung
  | 'urban_manager'  // Quản lý đô thị
  | 'researcher'     // Nhà nghiên cứu
  | 'business'       // Doanh nghiệp xanh
  | 'verifier'       // Người xác thực dữ liệu
  | 'government';    // Chính phủ
```

---

## 🚀 Cách Sử Dụng

### 1. Import Hook

```typescript
import { useAuth } from '../contexts/AuthContext';
```

### 2. Sử Dụng trong Component

```typescript
const MyComponent = () => {
  const {
    // Authentication
    isAuthenticated,
    user,
    signIn,
    signOut,
    
    // Environmental Impact
    environmentalImpact,
    addGreenAction,
    
    // Preferences
    environmentalPreferences,
    updateEnvironmentalPreferences,
    
    // AI Insights
    aiInsights,
    refreshAIInsights,
  } = useAuth();

  // Your component logic here
};
```

---

## 📊 Các Tính Năng Chính

### 1. Authentication (Xác thực)

#### Sign In (Đăng nhập)
```typescript
const handleSignIn = async () => {
  try {
    await signIn({
      identifier: 'user@example.com',
      type: 'email'
    });
    console.log('Signed in successfully!');
  } catch (error) {
    console.error('Sign in failed:', error);
  }
};
```

#### Sign Up (Đăng ký)
```typescript
const handleSignUp = async () => {
  try {
    await signUp({
      email: 'user@example.com',
      password: 'securePassword123',
      fullName: 'Nguyễn Văn A',
      role: 'citizen',
    });
    console.log('Signed up successfully!');
  } catch (error) {
    console.error('Sign up failed:', error);
  }
};
```

#### Sign Out (Đăng xuất)
```typescript
const handleSignOut = async () => {
  try {
    await signOut();
    console.log('Signed out successfully!');
  } catch (error) {
    console.error('Sign out failed:', error);
  }
};
```

---

### 2. Environmental Impact Tracking (Theo dõi Tác động Môi trường)

#### Xem Tác động của Người dùng
```typescript
const EnvironmentalDashboard = () => {
  const { environmentalImpact } = useAuth();

  return (
    <View>
      <Text>Total CO2 Saved: {environmentalImpact?.totalCarbonSaved} kg</Text>
      <Text>Current Streak: {environmentalImpact?.currentStreak} days</Text>
      <Text>Total Actions: {environmentalImpact?.totalActionsCount}</Text>
      <Text>Community Rank: #{environmentalImpact?.communityRank}</Text>
    </View>
  );
};
```

#### Thêm Green Action
```typescript
const handleAddGreenAction = async () => {
  try {
    await addGreenAction({
      type: 'transport',
      title: 'Đi xe buýt thay vì lái xe',
      description: 'Sử dụng phương tiện công cộng hôm nay',
      carbonSaved: 2.3, // kg CO2
      verificationMethod: 'self',
    });
    console.log('Green action added!');
  } catch (error) {
    console.error('Failed to add green action:', error);
  }
};
```

#### Các loại Green Action
```typescript
type GreenActionType = 
  | 'transport'   // Phương tiện (xe buýt, đi bộ, xe đạp)
  | 'energy'      // Năng lượng (tắt đèn, dùng năng lượng tái tạo)
  | 'waste'       // Rác thải (tái chế, giảm rác)
  | 'water'       // Nước (tiết kiệm nước)
  | 'food'        // Thực phẩm (ăn chay, giảm lãng phí)
  | 'education'   // Giáo dục (học về môi trường)
  | 'community';  // Cộng đồng (tham gia hoạt động xanh)
```

---

### 3. Environmental Preferences (Cài đặt Môi trường)

#### Xem Preferences hiện tại
```typescript
const SettingsScreen = () => {
  const { environmentalPreferences } = useAuth();

  return (
    <View>
      <Text>Air Quality Alerts: {environmentalPreferences.airQualityAlerts ? 'On' : 'Off'}</Text>
      <Text>Weather Alerts: {environmentalPreferences.weatherAlerts ? 'On' : 'Off'}</Text>
      <Text>Temperature Unit: {environmentalPreferences.temperatureUnit}</Text>
    </View>
  );
};
```

#### Cập nhật Preferences
```typescript
const handleUpdatePreferences = async () => {
  try {
    await updateEnvironmentalPreferences({
      airQualityAlerts: true,
      airQualityThreshold: 'moderate',
      weatherAlerts: true,
      temperatureUnit: 'celsius',
      enabledDataSources: {
        openAQ: true,
        openWeather: true,
        nasaPower: true,
        openStreetMap: true,
      },
      notifyOnPoorAirQuality: true,
    });
    console.log('Preferences updated!');
  } catch (error) {
    console.error('Failed to update preferences:', error);
  }
};
```

#### Thêm Monitoring Location
```typescript
const handleAddMonitoringLocation = async () => {
  const newLocation = {
    id: Date.now().toString(),
    name: 'Nhà riêng',
    latitude: 16.068882,
    longitude: 108.245350,
    isPrimary: true,
  };

  await updateEnvironmentalPreferences({
    monitoringLocations: [
      ...environmentalPreferences.monitoringLocations,
      newLocation,
    ],
  });
};
```

---

### 4. Educational Progress (Tiến độ Học tập)

#### Hiển thị Tiến độ
```typescript
const EducationScreen = () => {
  const { educationalProgress } = useAuth();

  return (
    <View>
      <Text>Level: {educationalProgress?.currentLevel}</Text>
      <Text>XP: {educationalProgress?.experiencePoints}</Text>
      <Text>Learning Hours: {educationalProgress?.totalLearningHours}</Text>
      <Text>Completed Courses: {educationalProgress?.completedCourses.length}</Text>
    </View>
  );
};
```

#### Thêm Quiz Result (Sẽ được implement trong backend)
```typescript
// TODO: Implement in backend API
// await authApi.addQuizResult({
//   title: 'Climate Change Basics',
//   score: 85,
// });
```

---

### 5. AI Insights & Recommendations

#### Hiển thị AI Recommendations
```typescript
const AIRecommendationsScreen = () => {
  const { aiInsights, refreshAIInsights } = useAuth();

  useEffect(() => {
    refreshAIInsights();
  }, []);

  return (
    <ScrollView>
      <Text style={styles.title}>Recommended Actions</Text>
      {aiInsights?.recommendedActions.map((action) => (
        <View key={action.id} style={styles.actionCard}>
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text>{action.description}</Text>
          <Text>💚 Saves {action.potentialCarbonSavings} kg CO2</Text>
          <Text>Difficulty: {action.difficulty}</Text>
        </View>
      ))}

      <Text style={styles.title}>Local Trends</Text>
      <Text>Air Quality: {aiInsights?.localTrends.airQualityTrend}</Text>
      <Text>Weather: {aiInsights?.localTrends.weatherPattern}</Text>
      <Text>Risk Level: {aiInsights?.localTrends.environmentalRisk}</Text>

      <Text style={styles.title}>Community Highlights</Text>
      {aiInsights?.communityHighlights.map((highlight, index) => (
        <View key={index} style={styles.highlightCard}>
          <Text>{highlight.message}</Text>
          <Text>Type: {highlight.type}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
```

#### Refresh AI Insights
```typescript
const handleRefresh = async () => {
  try {
    await refreshAIInsights();
    console.log('AI insights refreshed!');
  } catch (error) {
    console.error('Failed to refresh insights:', error);
  }
};
```

---

## 🔄 Data Flow (Luồng Dữ liệu)

```
┌─────────────────┐
│   User Action   │
│  (UI Component) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AuthContext   │
│   (useAuth)     │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌─────────────┐   ┌──────────────┐
│ AsyncStorage│   │  Backend API │
│   (Local)   │   │   (Remote)   │
└─────────────┘   └──────────────┘
```

---

## 🎨 Example: Complete Green Action Flow

```typescript
const GreenActionScreen = () => {
  const { 
    addGreenAction, 
    environmentalImpact,
    refreshAIInsights 
  } = useAuth();
  
  const [selectedAction, setSelectedAction] = useState(null);

  const handleCompleteAction = async () => {
    try {
      // 1. Add green action
      await addGreenAction({
        type: 'transport',
        title: 'Used Public Transport',
        description: 'Took bus instead of driving',
        carbonSaved: 2.3,
        verificationMethod: 'self',
      });

      // 2. Show success message
      Alert.alert(
        '🎉 Green Action Completed!',
        `You saved ${2.3} kg CO2. Total saved: ${environmentalImpact?.totalCarbonSaved} kg`
      );

      // 3. Refresh AI insights for new recommendations
      await refreshAIInsights();

    } catch (error) {
      Alert.alert('Error', 'Failed to save green action');
    }
  };

  return (
    <View>
      <Button title="Complete Action" onPress={handleCompleteAction} />
    </View>
  );
};
```

---

## 🌐 Data Sources Integration (Tích hợp Nguồn Dữ liệu)

### OpenAQ (Air Quality)
```typescript
// TODO: Implement in backend
// Fetch air quality data from OpenAQ API
// https://docs.openaq.org/
```

### OpenWeather (Weather Data)
```typescript
// TODO: Implement in backend
// Fetch weather data from OpenWeather API
// https://openweathermap.org/api
```

### NASA POWER (Solar/Energy Data)
```typescript
// TODO: Implement in backend
// Fetch solar and energy data from NASA POWER
// https://power.larc.nasa.gov/
```

### OpenStreetMap (Map Data)
```typescript
// TODO: Implement with react-native-maps
// Use OpenStreetMap tiles
```

---

## 📝 TODO: Backend Integration

Các chức năng sau cần được implement ở backend:

1. **Authentication API**
   - [ ] POST `/auth/login`
   - [ ] POST `/auth/register`
   - [ ] POST `/auth/logout`
   - [ ] POST `/auth/refresh`

2. **Environmental Data API**
   - [ ] GET `/environmental/impact`
   - [ ] POST `/environmental/actions`
   - [ ] GET `/environmental/preferences`
   - [ ] PUT `/environmental/preferences`

3. **Education API**
   - [ ] GET `/education/progress`
   - [ ] POST `/education/courses/complete`
   - [ ] POST `/education/quizzes/submit`

4. **AI Insights API**
   - [ ] GET `/ai/insights`
   - [ ] GET `/ai/recommendations`
   - [ ] GET `/ai/trends/:location`

5. **External Data Integration**
   - [ ] OpenAQ API integration
   - [ ] OpenWeather API integration
   - [ ] NASA POWER API integration

---

## 🔐 Security Best Practices

1. **Token Management**
   - Access tokens stored securely in AsyncStorage
   - Implement token refresh mechanism
   - Clear tokens on sign out

2. **Data Encryption**
   - Sensitive data should be encrypted before storage
   - Use HTTPS for all API calls

3. **Privacy**
   - User location data handled with care
   - Clear data collection policies
   - GDPR compliance

---

## 🐛 Troubleshooting

### Issue: Context not available
```typescript
// ❌ Wrong - Using useAuth outside AuthProvider
const App = () => {
  const { user } = useAuth(); // Error!
  return <View />;
};

// ✅ Correct - Wrapped in AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth(); // Works!
  return <View />;
};
```

### Issue: Data not persisting
```typescript
// Make sure AsyncStorage permissions are set
// Check if data is being saved properly
const checkStorage = async () => {
  const stored = await AsyncStorage.getItem('@environmental_impact');
  console.log('Stored data:', stored);
};
```

---

## 📚 Additional Resources

- [React Context API](https://react.dev/reference/react/useContext)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [OpenAQ API Docs](https://docs.openaq.org/)
- [OpenWeather API Docs](https://openweathermap.org/api)
- [NASA POWER API Docs](https://power.larc.nasa.gov/docs/)

---

## 📞 Support

Để được hỗ trợ, vui lòng tạo issue trên GitHub repository hoặc liên hệ team phát triển.

---

**Phiên bản:** 1.0.0  
**Cập nhật lần cuối:** November 8, 2025

