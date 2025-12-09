# GreenEduMap Services

Thư mục này chứa tất cả các API services của ứng dụng GreenEduMapApp, được đồng bộ với API collection v1.

## 📁 Cấu trúc Services

### 1. **authService.ts** - Xác thực & Quản lý người dùng
Authentication và quản lý tài khoản người dùng.

**Endpoints:**
- `POST /api/v1/auth/register` - Đăng ký tài khoản mới
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/refresh` - Làm mới access token
- `GET /api/v1/auth/validate-token` - Kiểm tra token hợp lệ
- `GET /api/v1/auth/me` - Lấy thông tin người dùng hiện tại
- `PATCH /api/v1/auth/profile` - Cập nhật thông tin hồ sơ
- `POST /api/v1/auth/change-password` - Đổi mật khẩu
- `POST /api/v1/auth/forgot-password` - Quên mật khẩu
- `POST /api/v1/auth/verify-email` - Xác thực email
- `POST /api/v1/auth/update-fcm-token` - Cập nhật FCM token

**Ví dụ sử dụng:**
```typescript
import { authService } from '@/services';

// Đăng nhập
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Lấy thông tin người dùng
const user = await authService.getProfile();

// Cập nhật profile
const updatedUser = await authService.updateProfile({
  full_name: 'Nguyễn Văn A',
  phone: '+84901234567'
});
```

---

### 2. **environmentService.ts** - Dữ liệu môi trường
Quản lý dữ liệu chất lượng không khí và thời tiết.

**Endpoints:**

**Air Quality:**
- `GET /api/v1/air-quality` - Lấy danh sách dữ liệu AQI với phân trang
- `GET /api/v1/air-quality/latest` - Lấy dữ liệu AQI mới nhất (24h)
- `GET /api/v1/air-quality/{id}` - Lấy bản ghi AQI theo ID

**Weather:**
- `GET /api/v1/weather` - Lấy dữ liệu thời tiết với phân trang
- `GET /api/v1/weather/current` - Lấy thời tiết hiện tại theo toạ độ

**Public Endpoints (không cần auth):**
- `GET /api/open-data/air-quality` - Dữ liệu AQI công khai
- `GET /api/open-data/air-quality/location` - Lấy AQI gần vị trí cụ thể
- `GET /api/open-data/weather/current` - Thời tiết hiện tại công khai
- `GET /api/open-data/weather/forecast` - Dự báo thời tiết 7 ngày

**Ví dụ sử dụng:**
```typescript
import { environmentService } from '@/services';

// Lấy AQI mới nhất
const latestAQI = await environmentService.getLatestAirQuality(10);

// Lấy thời tiết hiện tại
const weather = await environmentService.getCurrentWeather({
  lat: 10.7769,
  lon: 106.7009,
  fetch_new: true
});

// Lấy dự báo thời tiết công khai
const forecast = await environmentService.getWeatherForecast(10.7769, 106.7009);
```

---

### 3. **schoolService.ts** - Dữ liệu giáo dục
Quản lý thông tin trường học và khóa học môi trường.

**Endpoints:**

**Schools:**
- `GET /api/v1/schools` - Lấy danh sách trường học với phân trang
- `GET /api/v1/schools/nearby` - Tìm trường học gần vị trí
- `GET /api/v1/schools/{id}` - Lấy thông tin chi tiết trường học

**Green Courses:**
- `GET /api/v1/green-courses` - Lấy danh sách khóa học môi trường
- `GET /api/v1/green-courses/{id}` - Lấy chi tiết khóa học
- `POST /api/v1/green-courses/{id}/enroll` - Đăng ký khóa học
- `GET /api/v1/green-courses/{id}/progress` - Lấy tiến độ học tập

**Ví dụ sử dụng:**
```typescript
import { schoolService } from '@/services';

// Tìm trường học gần đây
const nearbySchools = await schoolService.getNearbySchools({
  latitude: 10.7769,
  longitude: 106.7009,
  radius: 5, // API uses radius_km parameter
  limit: 10
});

// Lấy danh sách khóa học
const courses = await schoolService.getGreenCourses({
  skip: 0,
  limit: 10,
  category: 'climate_change',
  difficulty: 'beginner'
});

// Đăng ký khóa học
await schoolService.enrollCourse(1);
```

---

### 4. **greenResourceService.ts** - Tài nguyên xanh
Quản lý thông tin về khu vực xanh và tài nguyên môi trường.

**Public Endpoints (không cần auth):**

**Green Zones:**
- `GET /api/open-data/green-zones` - Lấy danh sách khu vực xanh công khai
- `GET /api/open-data/green-zones/nearby` - Tìm khu vực xanh gần đây
- `GET /api/open-data/green-zones/{id}` - Lấy chi tiết khu vực xanh công khai

**Green Resources:**
- `GET /api/open-data/green-resources` - Lấy danh sách tài nguyên xanh công khai
- `GET /api/open-data/green-resources/{id}` - Lấy chi tiết tài nguyên xanh công khai

**Recycling Centers:**
- `GET /api/open-data/centers` - Lấy danh sách trung tâm tái chế công khai
- `GET /api/open-data/centers/nearby` - Tìm trung tâm tái chế gần vị trí

**Catalog & Export:**
- `GET /api/open-data/catalog` - Lấy danh mục dữ liệu mở
- `GET /api/open-data/export/air-quality` - Xuất dữ liệu AQI

**Authenticated Endpoints (cần auth):**

**Green Zones:**
- `GET /api/v1/green-zones` - Lấy danh sách khu vực xanh
- `GET /api/v1/green-zones/{id}` - Lấy chi tiết khu vực xanh theo ID

**Green Resources:**
- `GET /api/v1/green-resources` - Lấy danh sách tài nguyên xanh
- `GET /api/v1/green-resources/{id}` - Lấy chi tiết tài nguyên xanh theo ID

**Recycling Centers:**
- `GET /api/v1/centers` - Lấy danh sách trung tâm tái chế

**Ví dụ sử dụng:**
```typescript
import { greenResourceService } from '@/services';

// Tìm công viên gần đây (Public)
const nearbyParks = await greenResourceService.getPublicNearbyGreenZones({
  latitude: 10.7769,
  longitude: 106.7009,
  radius: 5,
  limit: 10
});

// Lấy danh sách khu vực xanh (Authenticated)
const greenZones = await greenResourceService.getGreenZones({
  skip: 0,
  limit: 10,
  zone_type: 'park'
});

// Lấy danh sách trung tâm tái chế công khai
const centers = await greenResourceService.getPublicCenters({
  skip: 0,
  limit: 10
});

// Lấy danh mục dữ liệu mở
const catalog = await greenResourceService.getCatalog();

// Xuất dữ liệu AQI
const exportData = await greenResourceService.exportAirQuality('json');
```

---

### 5. **aiTaskService.ts** - Tác vụ AI
Quản lý các tác vụ xử lý AI (phân cụm, dự đoán, phân tích).

**Endpoints:**

**AI Tasks:**
- `POST /api/v1/tasks/ai/clustering` - Tạo tác vụ phân cụm AI
- `POST /api/v1/tasks/ai/prediction` - Tạo tác vụ dự đoán AI
- `POST /api/v1/tasks/ai/correlation` - Tạo tác vụ phân tích tương quan
- `POST /api/v1/tasks/export` - Tạo tác vụ xuất dữ liệu
- `GET /api/v1/tasks/{taskId}` - Kiểm tra trạng thái tác vụ
- `GET /api/v1/tasks/{taskId}/result` - Lấy kết quả tác vụ
- `DELETE /api/v1/tasks/{taskId}` - Hủy tác vụ
- `GET /api/v1/tasks` - Lấy danh sách tác vụ

**Ví dụ sử dụng:**
```typescript
import { aiTaskService } from '@/services';

// Tạo tác vụ phân cụm
const task = await aiTaskService.queueClusteringTask({
  data_type: 'environment',
  n_clusters: 3,
  method: 'kmeans'
});

// Kiểm tra trạng thái
const status = await aiTaskService.getTaskStatus(task.task_id);

// Lấy kết quả khi hoàn thành
if (status.status === 'completed') {
  const result = await aiTaskService.getTaskResult(task.task_id);
}

// Tạo tác vụ dự đoán AQI
const predictionTask = await aiTaskService.queuePredictionTask({
  prediction_type: 'air_quality',
  latitude: 10.7769,
  longitude: 106.7009,
  days_ahead: 3
});
```

---

### 6. **healthService.ts** - Kiểm tra sức khỏe hệ thống
Kiểm tra trạng thái API Gateway và các services.

**Endpoints:**
- `GET /health` - Kiểm tra trạng thái hệ thống

**Ví dụ sử dụng:**
```typescript
import { healthService } from '@/services';

// Kiểm tra sức khỏe hệ thống
const health = await healthService.checkHealth();
console.log('API Status:', health.status);
console.log('Services:', health.services);
```

---

## 🔧 Cấu hình

### Base URL
API Base URL được cấu hình trong `/src/config/env.ts`:

```typescript
const env = {
  API_URL: 'https://api.greenedumap.io.vn',
  // ... other configs
};
```

### Authentication
Tất cả các authenticated endpoints sử dụng Bearer Token (JWT):

```typescript
headers: {
  'Authorization': 'Bearer {access_token}'
}
```

Token được tự động thêm vào request headers thông qua axios interceptor trong `Api.tsx`.

---

## 📝 Response Format

### Authenticated Endpoints
```typescript
{
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
```

### Public Endpoints (Auth)
Login & Register trả về trực tiếp:
```typescript
{
  access_token: string;
  refresh_token: string;
  user: User;
}
```

---

## ⚠️ Error Handling

Tất cả services đều có error handling:

```typescript
try {
  const data = await environmentService.getLatestAirQuality();
  // Success
} catch (error) {
  console.error('Error:', error);
  // Handle error
}
```

Error types:
- **Network errors**: Connection timeout, no internet
- **Authentication errors**: 401 (Unauthorized), 403 (Forbidden)
- **Validation errors**: 422 (Unprocessable Entity)
- **Server errors**: 500+ (Internal Server Error)

---

## 🚀 Import & Usage

### Import toàn bộ services
```typescript
import {
  authService,
  environmentService,
  schoolService,
  greenResourceService,
  aiTaskService,
  healthService
} from '@/services';
```

### Import types
```typescript
import type {
  AirQualityData,
  WeatherData,
  School,
  GreenZone,
  AITask,
  HealthStatus
} from '@/services';
```

---

## 📚 Tài liệu tham khảo

- **API Collection**: `/Users/voviet/Documents/GreenEduMap_API_v1.postman_collection.json`
- **API Base URL**: `https://api.greenedumap.io.vn`
- **Swagger Docs** (nếu có): `https://api.greenedumap.io.vn/docs`

---

## 🔄 Phiên bản

- **API Version**: v1
- **Last Updated**: 2025-12-09
- **Maintained by**: GreenEduMap Team

---

## 📌 Ghi chú quan trọng

### Public vs Authenticated Endpoints

**Public Endpoints** (`/api/open-data/*`):
- Không cần authentication
- Truy cập tự do
- Rate limit thấp hơn
- Dữ liệu có thể bị hạn chế

**Authenticated Endpoints** (`/api/v1/*`):
- Cần Bearer Token
- Rate limit cao hơn
- Truy cập đầy đủ dữ liệu
- Có thể thực hiện actions (create, update, delete)

### Health Check Endpoint

Endpoint `/health` nằm ở root level (không có prefix `/api/v1`):
```typescript
// Correct
GET https://api.greenedumap.io.vn/health

// Incorrect
GET https://api.greenedumap.io.vn/api/v1/health
```

### Parameter Names

Một số endpoint sử dụng tên parameters khác nhau:
- Schools nearby: `radius_km` (không phải `radius`)
- Green zones nearby: `lat`, `lon` (không phải `latitude`, `longitude`)
- Centers nearby: `radius_km`

Luôn kiểm tra API documentation để biết tên parameter chính xác.
