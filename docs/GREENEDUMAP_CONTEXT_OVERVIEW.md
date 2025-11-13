# 🌍 GreenEduMap AuthContext - Tổng Quan

## 📌 Giới Thiệu

**GreenEduMap Mobile App** là nền tảng di động dành cho công dân, học sinh và nhà quản lý đô thị, giúp:
- 🔍 **Quan sát** dữ liệu môi trường thời gian thực
- 📊 **Phân tích** chất lượng không khí, thời tiết, năng lượng
- 🌱 **Hành động** với các đề xuất xanh từ AI

### Nguồn Dữ Liệu Mở (Open Data)
- **OpenAQ** - Dữ liệu chất lượng không khí toàn cầu
- **OpenWeather** - Dữ liệu thời tiết và dự báo
- **NASA POWER** - Dữ liệu năng lượng mặt trời và khí hậu
- **OpenStreetMap** - Bản đồ và dữ liệu địa lý

---

## 🎯 Các Thay Đổi Chính

### 1. AuthContext.tsx - Cấu Trúc Mới

File `src/contexts/AuthContext.tsx` đã được nâng cấp với các tính năng:

#### 🔐 Authentication (Giữ nguyên)
- Sign In / Sign Up / Sign Out
- eKYC Verification
- Token Management

#### 🆕 GreenEduMap Features (Mới)

**A. Environmental Preferences**
```typescript
interface EnvironmentalPreferences {
  airQualityAlerts: boolean;
  airQualityThreshold: 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy';
  weatherAlerts: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  enabledDataSources: {
    openAQ: boolean;
    openWeather: boolean;
    nasaPower: boolean;
    openStreetMap: boolean;
  };
  monitoringLocations: Array<Location>;
}
```

**B. Environmental Impact Tracking**
```typescript
interface EnvironmentalImpact {
  totalCarbonSaved: number;
  monthlyCarbon: number;
  dailyCarbon: number;
  completedActions: GreenAction[];
  totalActionsCount: number;
  communityRank: number;
  totalPoints: number;
  badges: Badge[];
  currentStreak: number;
  longestStreak: number;
}
```

**C. Educational Progress**
```typescript
interface EducationalProgress {
  completedCourses: Course[];
  quizResults: QuizResult[];
  totalLearningHours: number;
  currentLevel: number;
  experiencePoints: number;
}
```

**D. AI Insights & Recommendations**
```typescript
interface AIInsights {
  recommendedActions: RecommendedAction[];
  localTrends: {
    airQualityTrend: 'improving' | 'stable' | 'worsening';
    weatherPattern: string;
    environmentalRisk: 'low' | 'medium' | 'high';
  };
  communityHighlights: CommunityUpdate[];
}
```

---

## 🚀 Cách Sử Dụng

### Setup trong App.tsx

```typescript
import { AuthProvider } from './src/contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      {/* Your app components */}
    </AuthProvider>
  );
};
```

### Sử dụng trong Component

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyScreen = () => {
  const { 
    environmentalImpact, 
    addGreenAction,
    aiInsights 
  } = useAuth();

  const handleAction = async () => {
    await addGreenAction({
      type: 'transport',
      title: 'Used Public Transport',
      description: 'Took bus instead of driving',
      carbonSaved: 2.3,
    });
  };

  return (
    <View>
      <Text>CO2 Saved: {environmentalImpact?.totalCarbonSaved} kg</Text>
      <Button title="Log Action" onPress={handleAction} />
    </View>
  );
};
```

---

## 📁 Cấu Trúc Files

```
GreenEduMapApp/
├── App.tsx                              # ✅ Đã cập nhật (wrap với AuthProvider)
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx             # ✅ Đã nâng cấp (GreenEduMap features)
│   ├── utils/
│   │   └── authApi.ts                  # ✅ Đã tạo mới (Auth service layer)
│   └── ...
├── docs/                                # 📚 Thư mục tài liệu (mới)
│   ├── AUTH_CONTEXT_GUIDE.md           # ✅ Hướng dẫn chi tiết
│   ├── EXAMPLE_USAGE.tsx               # ✅ Ví dụ screens
│   └── GREENEDUMAP_CONTEXT_OVERVIEW.md # ✅ Tổng quan (file này)
└── ...
```

---

## 🎨 Example Screens

Trong file `docs/EXAMPLE_USAGE.tsx`, có 4 example screens:

### 1. EnvironmentalDashboardScreen
- Hiển thị carbon footprint
- Achievements và badges
- Recent green actions
- Streaks và rankings

### 2. AddGreenActionScreen
- Log green actions
- Pre-defined action templates
- Real-time carbon savings

### 3. EnvironmentalSettingsScreen
- Air quality alerts settings
- Weather alerts settings
- Temperature unit preference
- Data sources toggle

### 4. AIRecommendationsScreen
- AI-suggested green actions
- Local environmental trends
- Community highlights

---

## 🔄 Data Flow Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      React Component                      │
│                    (useAuth hook)                         │
└─────────────────────┬────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────────┐
│                     AuthContext                           │
│  • Environmental Preferences                              │
│  • Environmental Impact                                   │
│  • Educational Progress                                   │
│  • AI Insights                                            │
└─────────────────────┬────────────────────────────────────┘
                      │
           ┌──────────┴──────────┐
           │                     │
           ▼                     ▼
┌─────────────────┐   ┌──────────────────┐
│  AsyncStorage   │   │   Backend API    │
│   (Local Data)  │   │   (authApi.ts)   │
└─────────────────┘   └────────┬─────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
          ┌─────────────────┐   ┌─────────────────┐
          │  External APIs  │   │   Database      │
          │  • OpenAQ       │   │   • User Data   │
          │  • OpenWeather  │   │   • Actions     │
          │  • NASA POWER   │   │   • Progress    │
          └─────────────────┘   └─────────────────┘
```

---

## 👥 User Roles

### Các vai trò trong GreenEduMap:

| Role | Mô tả | Tính năng chính |
|------|-------|-----------------|
| **citizen** | Công dân | Theo dõi môi trường cá nhân, log green actions |
| **student** | Học sinh | Học về môi trường, hoàn thành courses |
| **teacher** | Giáo viên | Tạo educational content, quản lý học sinh |
| **urban_manager** | Quản lý đô thị | Xem analytics, quản lý dữ liệu thành phố |
| **researcher** | Nhà nghiên cứu | Truy cập raw data, phân tích chuyên sâu |
| **business** | Doanh nghiệp | Green business initiatives, CSR tracking |
| **verifier** | Xác thực viên | Xác thực green actions, kiểm tra dữ liệu |
| **government** | Chính phủ | Policy making, city-wide analytics |

---

## 🌱 Green Action Types

### 7 loại hành động xanh:

1. **🚌 Transport** (Phương tiện)
   - Đi xe buýt/metro
   - Đi bộ/xe đạp
   - Carpool
   - Xe điện

2. **⚡ Energy** (Năng lượng)
   - Tắt đèn
   - Dùng năng lượng tái tạo
   - Tiết kiệm điện
   - Sử dụng thiết bị tiết kiệm năng lượng

3. **♻️ Waste** (Rác thải)
   - Tái chế
   - Giảm rác thải
   - Composting
   - Zero waste lifestyle

4. **💧 Water** (Nước)
   - Tiết kiệm nước
   - Sửa rò rỉ
   - Thu gom nước mưa
   - Sử dụng nước tái chế

5. **🍃 Food** (Thực phẩm)
   - Ăn chay/thuần chay
   - Giảm lãng phí thực phẩm
   - Mua thực phẩm địa phương
   - Organic food

6. **📚 Education** (Giáo dục)
   - Học về môi trường
   - Hoàn thành courses
   - Chia sẻ kiến thức
   - Tham gia workshops

7. **👥 Community** (Cộng đồng)
   - Trồng cây
   - Dọn dẹp công viên
   - Tham gia events xanh
   - Tình nguyện môi trường

---

## 📊 Data Sources Integration

### OpenAQ Integration (Air Quality)

```typescript
// TODO: Backend implementation needed
// GET /api/environmental/air-quality?lat={lat}&lon={lon}

interface AirQualityData {
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  aqi: number;
  location: string;
  timestamp: string;
}
```

### OpenWeather Integration

```typescript
// TODO: Backend implementation needed
// GET /api/environmental/weather?lat={lat}&lon={lon}

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: WeatherForecast[];
}
```

### NASA POWER Integration

```typescript
// TODO: Backend implementation needed
// GET /api/environmental/solar?lat={lat}&lon={lon}

interface SolarData {
  solarRadiation: number;
  uvIndex: number;
  sunriseTime: string;
  sunsetTime: string;
  solarPotential: number;
}
```

---

## 🔧 Backend API Endpoints (TODO)

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `POST /api/auth/refresh-token`

### Environmental Data
- `GET /api/environmental/impact`
- `POST /api/environmental/actions`
- `GET /api/environmental/preferences`
- `PUT /api/environmental/preferences`
- `GET /api/environmental/air-quality`
- `GET /api/environmental/weather`
- `GET /api/environmental/solar`

### Education
- `GET /api/education/progress`
- `GET /api/education/courses`
- `POST /api/education/courses/:id/complete`
- `POST /api/education/quizzes/:id/submit`

### AI & Analytics
- `GET /api/ai/insights`
- `GET /api/ai/recommendations`
- `GET /api/analytics/community`
- `GET /api/analytics/rankings`

---

## 🎯 Gamification System

### Points System
- **Green Action** = 10 points × kg CO2 saved
- **Course Completion** = 100 points
- **Quiz Perfect Score** = 50 points
- **7-day Streak** = 200 bonus points

### Badges
- 🌱 **Beginner** - First green action
- 🌿 **Green Warrior** - 10 actions completed
- 🌳 **Eco Champion** - 100 actions completed
- 🔥 **Streak Master** - 30-day streak
- 🏆 **Carbon Crusher** - 100kg CO2 saved
- 🎓 **Environmental Scholar** - 5 courses completed
- 👥 **Community Leader** - Top 10 in city

### Leaderboards
- **City Rankings** - Top users in same city
- **National Rankings** - Top users in country
- **Global Rankings** - Top users worldwide
- **Weekly Challenges** - Weekly competitions

---

## 📈 Analytics & Insights

### User Analytics
- Carbon footprint over time
- Action frequency analysis
- Most effective actions
- Comparison with community average

### Community Analytics
- City-wide CO2 reduction
- Most active neighborhoods
- Popular green actions
- Environmental improvement trends

### AI-Powered Insights
- Personalized recommendations
- Optimal action timing
- Weather-based suggestions
- Location-specific tips

---

## 🔒 Privacy & Security

### Data Privacy
- ✅ User location data encrypted
- ✅ Personal info anonymized for analytics
- ✅ GDPR compliant
- ✅ User can delete all data

### Security
- ✅ JWT token authentication
- ✅ Secure API endpoints
- ✅ HTTPS only
- ✅ Input validation & sanitization

---

## 🚀 Next Steps

### Phase 1: Foundation ✅
- [x] AuthContext structure
- [x] Types & interfaces
- [x] Local data storage
- [x] Example screens

### Phase 2: Backend Integration 🔄
- [ ] Implement authApi endpoints
- [ ] External API integrations (OpenAQ, OpenWeather, NASA)
- [ ] Database schema
- [ ] API documentation

### Phase 3: UI/UX 📱
- [ ] Implement actual screens
- [ ] Map integration (react-native-maps)
- [ ] Charts & visualizations
- [ ] Animations & micro-interactions

### Phase 4: Advanced Features 🎯
- [ ] Real-time notifications
- [ ] Social features (sharing, friends)
- [ ] Challenges & competitions
- [ ] Offline mode

### Phase 5: AI & ML 🤖
- [ ] ML model for action recommendations
- [ ] Predictive analytics
- [ ] Computer vision for waste sorting
- [ ] Natural language processing for tips

---

## 📚 Documentation Files

1. **AUTH_CONTEXT_GUIDE.md** - Chi tiết về AuthContext API
2. **EXAMPLE_USAGE.tsx** - 4 example screens hoàn chỉnh
3. **GREENEDUMAP_CONTEXT_OVERVIEW.md** - File này (tổng quan)

---

## 💡 Tips for Developers

### Using AuthContext
```typescript
// ✅ Good
const { environmentalImpact, addGreenAction } = useAuth();

// ❌ Bad - Don't destructure everything
const auth = useAuth();
```

### Error Handling
```typescript
try {
  await addGreenAction(action);
  Alert.alert('Success', 'Action logged!');
} catch (error) {
  Alert.alert('Error', error.message);
  // Log to error tracking service
  console.error('Failed to add action:', error);
}
```

### Performance Optimization
```typescript
// Use useMemo for expensive calculations
const carbonSavings = useMemo(() => {
  return environmentalImpact?.completedActions.reduce(
    (sum, action) => sum + action.carbonSaved, 
    0
  );
}, [environmentalImpact?.completedActions]);
```

---

## 🤝 Contributing

Để contribute vào dự án:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support & Contact

- **GitHub Issues**: [Create issue](https://github.com/your-repo/issues)
- **Email**: support@greenedumap.com
- **Discord**: [Join community](https://discord.gg/greenedumap)

---

## 📜 License

This project is licensed under the MIT License.

---

**🌍 Together, we can make a difference! 🌱**

---

*Cập nhật lần cuối: November 8, 2025*
*Version: 1.0.0*

