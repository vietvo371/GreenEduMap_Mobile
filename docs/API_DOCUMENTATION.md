# 📚 GreenEduMap API Documentation

**Base URL:** `https://api.greenedumap.io.vn`

**Generated:** 16:38:50 9/12/2025

---

## 📖 Table of Contents

- [Authentication](#authentication)
- [User Data](#user-data)
- [FCM & Notifications](#fcm--notifications)
- [Environment Data](#environment-data)
- [Education Data](#education-data)
- [Green Resources](#green-resources)
- [Public Endpoints](#public-endpoints)
- [AI Tasks](#ai-tasks)
- [System](#system)

---

## Authentication

### POST /api/v1/auth/login

**Login**

Đăng nhập vào tài khoản.

🌐 **Public Endpoint**

#### Request:

**Body:**

```json
{
  "email": "citizen1@gmail.com",
  "password": "password123"
}
```

#### Response (200 OK):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODkzZWI4Zi1mNGMyLTRjMWUtOTAzMS1iMzZhOTRiOTBkZDkiLCJlbWFpbCI6ImNpdGl6ZW4xQGdtYWlsLmNvbSIsInJvbGUiOiJjaXRpemVuIiwiZXhwIjoxNzY1Mjc0OTI1LCJpYXQiOjE3NjUyNzMxMjUsInR5cGUiOiJhY2Nlc3MifQ.tahg3M1QIVjsiISatveEiOKoyMS47bwFywEMG5_XDnA",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODkzZWI4Zi1mNGMyLTRjMWUtOTAzMS1iMzZhOTRiOTBkZDkiLCJlbWFpbCI6ImNpdGl6ZW4xQGdtYWlsLmNvbSIsInJvbGUiOiJjaXRpemVuIiwiZXhwIjoxNzY1ODc3OTI1LCJpYXQiOjE3NjUyNzMxMjUsInR5cGUiOiJyZWZyZXNoIn0.HaufnW_33MbnmzdsYJTOckKqkwo5ARKi4lypl0a8MhY",
  "token_type": "bearer",
  "expires_in": 1800
}
```

---

### GET /api/v1/auth/validate-token

**Validate Token**

Kiểm tra tính hợp lệ của access token.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODkzZWI4Zi1mNGMyLTRjMWUtOTAzMS1iMzZhOTRiOTBkZDkiLCJlbWFpbCI6ImNpdGl6ZW4xQGdtYWlsLmNvbSIsInJvbGUiOiJjaXRpemVuIiwiZXhwIjoxNzY1Mjc0OTI1LCJpYXQiOjE3NjUyNzMxMjUsInR5cGUiOiJhY2Nlc3MifQ.tahg3M1QIVjsiISatveEiOKoyMS47bwFywEMG5_XDnA"
}
```

#### Response (200 OK):

```json
{
  "valid": true,
  "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
  "email": "citizen1@gmail.com",
  "username": "nguyen_van_a",
  "role": "citizen",
  "is_active": true,
  "checked_at": "2025-12-09T09:38:46.323805"
}
```

---

### GET /api/v1/auth/me

**Get Current User**

Lấy thông tin người dùng hiện tại.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Headers:**

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxODkzZWI4Zi1mNGMyLTRjMWUtOTAzMS1iMzZhOTRiOTBkZDkiLCJlbWFpbCI6ImNpdGl6ZW4xQGdtYWlsLmNvbSIsInJvbGUiOiJjaXRpemVuIiwiZXhwIjoxNzY1Mjc0OTI1LCJpYXQiOjE3NjUyNzMxMjUsInR5cGUiOiJhY2Nlc3MifQ.tahg3M1QIVjsiISatveEiOKoyMS47bwFywEMG5_XDnA"
}
```

#### Response (200 OK):

```json
{
  "email": "citizen1@gmail.com",
  "username": "nguyen_van_a",
  "full_name": "Test Citizen Updated",
  "phone": "0909876543",
  "id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
  "role": "citizen",
  "is_active": true,
  "is_verified": true,
  "is_public": false,
  "created_at": "2025-12-09T14:42:25.793139",
  "updated_at": "2025-12-09T09:38:45.401878",
  "last_login": "2025-12-09T09:38:45.401309"
}
```

---

### GET /api/v1/users

**List Users (Admin)**

Lấy danh sách người dùng (Admin only).

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 100
}
```

#### Error Response (404):

```json
{
  "detail": "Not Found"
}
```

---

### GET /api/v1/users/{user_id}

**Get User by ID**

Lấy thông tin người dùng theo ID.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Error Response (404):

```json
{
  "detail": "Not Found"
}
```

---

## User Data

### GET /api/v1/user-data/favorites

**Get Favorites**

Lấy danh sách địa điểm yêu thích của người dùng.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Response (200 OK):

```json
{
  "total": 3,
  "items": [
    {
      "target_type": "green_zone",
      "target_id": "4553cbf1-6b86-456e-bc5f-04f01000a998",
      "note": "Công viên gần nhà - hay đi dạo",
      "is_public": true,
      "id": "e5d9cff1-427b-48e5-96a6-4f07db0e437b",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "created_at": "2025-12-09T07:42:27.081002Z",
      "updated_at": "2025-12-09T07:42:27.081002Z"
    },
    {
      "target_type": "green_zone",
      "target_id": "f0bc81e6-ae86-4a72-926a-3e6c8571f40b",
      "note": "Công viên gần nhà - hay đi dạo",
      "is_public": true,
      "id": "1af23b9e-c4d3-4c34-a269-68691ce56275",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "created_at": "2025-12-09T07:42:27.081002Z",
      "updated_at": "2025-12-09T07:42:27.081002Z"
    },
    {
      "target_type": "school",
      "target_id": "06af694a-d894-443c-8954-350023071f7e",
      "note": "Trường con đang học",
      "is_public": false,
      "id": "d6b657c2-55d7-41bb-8d12-10db19dd18fe",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "created_at": "2025-12-09T07:42:27.079395Z",
      "updated_at": "2025-12-09T07:42:27.079395Z"
    }
  ]
}
```

---

### GET /api/v1/user-data/contributions

**Get Contributions**

Lấy danh sách đóng góp của người dùng.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Response (200 OK):

```json
{
  "total": 2,
  "items": [
    {
      "type": "issue",
      "title": "Rác thải bừa bãi",
      "description": "Phát hiện điểm đổ rác trái phép ở góc phố. Cần dọn dẹp và lắp camera.",
      "latitude": 10.7701,
      "longitude": 106.6934,
      "address": "Góc đường Nguyễn Huệ - Lê Lợi, Quận 1",
      "is_public": true,
      "data": {
        "photos": 3,
        "category": "waste",
        "severity": "high"
      },
      "id": "4ae80367-349d-4c5c-b4d2-ad178e50b23f",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "status": "pending",
      "reviewed_by": null,
      "reviewed_at": null,
      "created_at": "2025-12-09T07:42:27.089470Z",
      "updated_at": "2025-12-09T07:42:27.089470Z"
    },
    {
      "type": "feedback",
      "title": "Góp ý cải thiện công viên",
      "description": "Công viên 30/4 rất đẹp nhưng thiếu thùng rác phân loại. Đề xuất lắp thêm thùng rác tái chế.",
      "latitude": 10.7712,
      "longitude": 106.6978,
      "address": "Công viên 30/4, Quận 1",
      "is_public": true,
      "data": {
        "category": "infrastructure",
        "priority": "medium"
      },
      "id": "b947b6f9-3e1b-4f53-a3fb-b383d1c1260c",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "status": "approved",
      "reviewed_by": null,
      "reviewed_at": null,
      "created_at": "2025-12-09T07:42:27.088098Z",
      "updated_at": "2025-12-09T07:42:27.088098Z"
    }
  ]
}
```

---

### GET /api/v1/user-data/contributions/public

**Get Public Contributions**

Lấy danh sách đóng góp công khai đã được duyệt.

🌐 **Public Endpoint**

#### Request:

#### Response (200 OK):

```json
{
  "total": 4,
  "items": [
    {
      "type": "feedback",
      "title": "API Enhancement Suggestion",
      "description": "Đề xuất thêm endpoint /api/v1/analytics để truy vấn thống kê theo thời gian.",
      "latitude": null,
      "longitude": null,
      "address": null,
      "is_public": true,
      "data": {
        "category": "api",
        "endpoint": "/api/v1/analytics",
        "priority": "high"
      },
      "id": "2b6bceb0-e83b-4d39-897a-0301458e0417",
      "user_id": "4efab903-bbaa-4ee3-bc76-da63f6da4f5a",
      "status": "approved",
      "reviewed_by": null,
      "reviewed_at": null,
      "created_at": "2025-12-09T07:42:27.090840Z",
      "updated_at": "2025-12-09T07:42:27.090840Z"
    },
    {
      "type": "feedback",
      "title": "Góp ý cải thiện công viên",
      "description": "Công viên 30/4 rất đẹp nhưng thiếu thùng rác phân loại. Đề xuất lắp thêm thùng rác tái chế.",
      "latitude": 10.7712,
      "longitude": 106.6978,
      "address": "Công viên 30/4, Quận 1",
      "is_public": true,
      "data": {
        "category": "infrastructure",
        "priority": "medium"
      },
      "id": "b947b6f9-3e1b-4f53-a3fb-b383d1c1260c",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "status": "approved",
      "reviewed_by": null,
      "reviewed_at": null,
      "created_at": "2025-12-09T07:42:27.088098Z",
      "updated_at": "2025-12-09T07:42:27.088098Z"
    },
    {
      "type": "green_spot",
      "title": "Phát hiện vườn cộng đồng mới",
      "description": "Khu dân cư tự tổ chức trồng rau sạch, có khoảng 50 gia đình tham gia. Rất đẹp và xanh.",
      "latitude": 10.8089,
      "longitude": 106.7123,
      "address": "Hẻm 475 Điện Biên Phủ, Bình Thạnh",
      "is_public": true,
      "data": {
        "plants": [
          "vegetables",
          "herbs"
        ],
        "area_sqm": 200,
        "community_size": 50
      },
      "id": "0543719c-65ed-4282-9518-9e95e8801d23",
      "user_id": "d91a939f-221f-4af0-9a1b-4aa26e3a4189",
      "status": "approved",
      "reviewed_by": null,
      "reviewed_at": null,
      "created_at": "2025-12-09T07:42:27.086378Z",
      "updated_at": "2025-12-09T07:42:27.086378Z"
    },
    {
      "type": "aqi_report",
      "title": "Báo cáo chất lượng không khí Q3",
      "description": "Đo lường AQI thực tế tại Công viên Lê Thị Riêng. Không khí trong lành, phù hợp tập thể dục buổi sáng.",
      "latitude": 10.7834,
      "longitude": 106.6867,
      "address": "Công viên Lê Thị Riêng, Quận 3, TP.HCM",
      "is_public": true,
      "data": {
        "pm25": 15.2,
        "weather": "sunny",
        "aqi_value": 45,
        "measurement_method": "portable_sensor"
      },
      "id": "d35ebb8c-a744-42a4-897a-4097f2c6a16f",
      "user_id": "d91a939f-221f-4af0-9a1b-4aa26e3a4189",
      "status": "approved",
      "reviewed_by": null,
      "reviewed_at": null,
      "created_at": "2025-12-09T07:42:27.082527Z",
      "updated_at": "2025-12-09T07:42:27.082527Z"
    }
  ]
}
```

---

### GET /api/v1/user-data/activities

**Get Activities**

Lấy lịch sử hoạt động của người dùng.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Response (200 OK):

```json
{
  "total": 3,
  "items": [
    {
      "action": "create",
      "target_type": "contribution",
      "target_id": "b947b6f9-3e1b-4f53-a3fb-b383d1c1260c",
      "description": "Góp ý cải thiện công viên",
      "extra_data": null,
      "is_public": true,
      "id": "b559197c-8f9a-4a49-8081-c01256725631",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "created_at": "2025-12-09T07:42:27.108470Z"
    },
    {
      "action": "search",
      "target_type": "school",
      "target_id": null,
      "description": "Tìm kiếm trường tiểu học gần nhà",
      "extra_data": null,
      "is_public": false,
      "id": "d38bf0d2-c2f3-41ee-b80e-a66afe07c0fd",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "created_at": "2025-12-09T07:42:27.107166Z"
    },
    {
      "action": "view",
      "target_type": "map",
      "target_id": null,
      "description": "Xem bản đồ chất lượng không khí",
      "extra_data": null,
      "is_public": false,
      "id": "5dd26ab6-fc69-4270-8153-d74af650a82a",
      "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
      "created_at": "2025-12-09T07:42:27.106098Z"
    }
  ]
}
```

---

### GET /api/v1/user-data/settings

**Get Settings**

Lấy cài đặt cá nhân của người dùng.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Response (200 OK):

```json
{
  "notification_enabled": true,
  "email_notifications": false,
  "push_notifications": true,
  "language": "vi",
  "theme": "dark",
  "default_city": "TP. Hồ Chí Minh",
  "default_latitude": 10.7769,
  "default_longitude": 106.7009,
  "privacy_level": "friends",
  "data": {
    "first_login": false
  },
  "id": "182921aa-faef-48df-83d9-19d6561a916e",
  "user_id": "1893eb8f-f4c2-4c1e-9031-b36a94b90dd9",
  "created_at": "2025-12-09T07:42:27.069368Z",
  "updated_at": "2025-12-09T01:21:00.104098Z"
}
```

---

## FCM & Notifications

### GET /api/v1/fcm-tokens

**List FCM Tokens**

Lấy danh sách FCM tokens của user hiện tại.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Error Response (404):

```json
{
  "detail": "Not Found"
}
```

---

## Environment Data

### GET /api/v1/air-quality

**Get Air Quality Data**

Lấy dữ liệu chất lượng không khí với phân trang.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
{
  "total": 10,
  "skip": 0,
  "limit": 10,
  "data": [
    {
      "id": "9a3c9e81-0b1f-4c4d-9558-043087b5ac53",
      "latitude": 16.0543,
      "longitude": 108.243,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Biển Đông",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:47+00:00",
      "created_at": "2025-12-09T09:37:47.370697+00:00"
    },
    {
      "id": "ae00a4e1-46a0-4067-b02c-d6741bb3c22a",
      "latitude": 16.0311,
      "longitude": 108.2508,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Công viên APEC",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:46+00:00",
      "created_at": "2025-12-09T09:37:46.687832+00:00"
    },
    {
      "id": "d66ed2e8-c3ef-4d77-8215-e34482cb60d9",
      "latitude": 15.9964,
      "longitude": 108.0075,
      "aqi": 27,
      "pm25": 13.73,
      "pm10": 15.3,
      "co": 203.16,
      "no2": 1.74,
      "o3": 73.04,
      "so2": 1.02,
      "source": "OpenWeatherMap",
      "station_name": "Rừng Nguyên Sinh Bà Nà",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:45+00:00",
      "created_at": "2025-12-09T09:37:45.302591+00:00"
    },
    {
      "id": "b0a2b34a-01b4-4b14-b069-bf9bd8a9e739",
      "latitude": 16.1083,
      "longitude": 108.2717,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Bán đảo Sơn Trà",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:45+00:00",
      "created_at": "2025-12-09T09:37:45.995577+00:00"
    },
    {
      "id": "cf7b3a03-d3f3-4149-b490-64501f74c5e7",
      "latitude": 16.0612,
      "longitude": 108.2235,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Vườn Hoa Châu Á",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:44+00:00",
      "created_at": "2025-12-09T09:37:44.599009+00:00"
    },
    {
      "id": "0430e9b0-7d08-48df-9df8-e3f961cbe16b",
      "latitude": 10.7801,
      "longitude": 106.6845,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Văn hóa Quận 3",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.225414+00:00"
    },
    {
      "id": "d4bc145c-46ee-480c-92d9-b3adf080c7d4",
      "latitude": 10.8156,
      "longitude": 106.7089,
      "aqi": 57,
      "pm25": 28.98,
      "pm10": 34.67,
      "co": 387.36,
      "no2": 7.79,
      "o3": 78.98,
      "so2": 5.09,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Gia Định",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.913300+00:00"
    },
    {
      "id": "5148c0b3-51be-4c43-8bf7-03d47a45252c",
      "latitude": 10.7656,
      "longitude": 106.6378,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Đầm Sen",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:42+00:00",
      "created_at": "2025-12-09T09:37:42.528442+00:00"
    },
    {
      "id": "4a4f1f55-d5f2-425f-be02-d88f637f5d5d",
      "latitude": 10.7712,
      "longitude": 106.7123,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Bến Bạch Đằng",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:41+00:00",
      "created_at": "2025-12-09T09:37:41.841582+00:00"
    },
    {
      "id": "cfee2b7b-74f3-4792-a456-7bc24b62a1f2",
      "latitude": 16.0567,
      "longitude": 108.2012,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Tiểu học Nguyễn Du",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:40+00:00",
      "created_at": "2025-12-09T09:37:40.461866+00:00"
    }
  ]
}
```

---

### GET /api/v1/air-quality/latest

**Get Latest Air Quality**

Lấy dữ liệu AQI mới nhất (24 giờ qua).

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "limit": 10
}
```

#### Response (200 OK):

```json
{
  "total": 10,
  "data": [
    {
      "id": "9a3c9e81-0b1f-4c4d-9558-043087b5ac53",
      "latitude": 16.0543,
      "longitude": 108.243,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Biển Đông",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:47+00:00",
      "created_at": "2025-12-09T09:37:47.370697+00:00"
    },
    {
      "id": "ae00a4e1-46a0-4067-b02c-d6741bb3c22a",
      "latitude": 16.0311,
      "longitude": 108.2508,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Công viên APEC",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:46+00:00",
      "created_at": "2025-12-09T09:37:46.687832+00:00"
    },
    {
      "id": "d66ed2e8-c3ef-4d77-8215-e34482cb60d9",
      "latitude": 15.9964,
      "longitude": 108.0075,
      "aqi": 27,
      "pm25": 13.73,
      "pm10": 15.3,
      "co": 203.16,
      "no2": 1.74,
      "o3": 73.04,
      "so2": 1.02,
      "source": "OpenWeatherMap",
      "station_name": "Rừng Nguyên Sinh Bà Nà",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:45+00:00",
      "created_at": "2025-12-09T09:37:45.302591+00:00"
    },
    {
      "id": "b0a2b34a-01b4-4b14-b069-bf9bd8a9e739",
      "latitude": 16.1083,
      "longitude": 108.2717,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Bán đảo Sơn Trà",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:45+00:00",
      "created_at": "2025-12-09T09:37:45.995577+00:00"
    },
    {
      "id": "cf7b3a03-d3f3-4149-b490-64501f74c5e7",
      "latitude": 16.0612,
      "longitude": 108.2235,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Vườn Hoa Châu Á",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:44+00:00",
      "created_at": "2025-12-09T09:37:44.599009+00:00"
    },
    {
      "id": "0430e9b0-7d08-48df-9df8-e3f961cbe16b",
      "latitude": 10.7801,
      "longitude": 106.6845,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Văn hóa Quận 3",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.225414+00:00"
    },
    {
      "id": "d4bc145c-46ee-480c-92d9-b3adf080c7d4",
      "latitude": 10.8156,
      "longitude": 106.7089,
      "aqi": 57,
      "pm25": 28.98,
      "pm10": 34.67,
      "co": 387.36,
      "no2": 7.79,
      "o3": 78.98,
      "so2": 5.09,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Gia Định",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.913300+00:00"
    },
    {
      "id": "5148c0b3-51be-4c43-8bf7-03d47a45252c",
      "latitude": 10.7656,
      "longitude": 106.6378,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Đầm Sen",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:42+00:00",
      "created_at": "2025-12-09T09:37:42.528442+00:00"
    },
    {
      "id": "4a4f1f55-d5f2-425f-be02-d88f637f5d5d",
      "latitude": 10.7712,
      "longitude": 106.7123,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Bến Bạch Đằng",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:41+00:00",
      "created_at": "2025-12-09T09:37:41.841582+00:00"
    },
    {
      "id": "cfee2b7b-74f3-4792-a456-7bc24b62a1f2",
      "latitude": 16.0567,
      "longitude": 108.2012,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Tiểu học Nguyễn Du",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:40+00:00",
      "created_at": "2025-12-09T09:37:40.461866+00:00"
    }
  ]
}
```

---

### GET /api/v1/air-quality/1

**Get Air Quality by ID**

Lấy bản ghi chất lượng không khí theo ID.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Error Response (500):

```json
{
  "detail": "Internal server error"
}
```

---

### GET /api/v1/air-quality/location

**Get Air Quality by Location**

Tìm dữ liệu AQI gần vị trí.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "lat": 10.7769,
  "lon": 106.7009,
  "radius": 50,
  "limit": 10
}
```

#### Error Response (422):

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "query",
        "lat"
      ],
      "msg": "Field required",
      "input": null,
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    },
    {
      "type": "missing",
      "loc": [
        "query",
        "lon"
      ],
      "msg": "Field required",
      "input": null,
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    }
  ]
}
```

---

### GET /api/v1/air-quality/history

**Get Air Quality History**

Lấy dữ liệu AQI lịch sử cho một vị trí.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "lat": 10.7769,
  "lon": 106.7009,
  "days": 7,
  "radius": 10
}
```

#### Error Response (422):

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "query",
        "lat"
      ],
      "msg": "Field required",
      "input": null,
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    },
    {
      "type": "missing",
      "loc": [
        "query",
        "lon"
      ],
      "msg": "Field required",
      "input": null,
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    }
  ]
}
```

---

### GET /api/v1/weather

**Get Weather Data**

Lấy dữ liệu thời tiết với phân trang.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
{
  "total": 10,
  "skip": 0,
  "limit": 10,
  "data": [
    {
      "id": "aa9ac205-5bee-4e15-bb12-33611fc35afb",
      "latitude": 10.7769,
      "longitude": 106.7009,
      "city_name": "Ho Chi Minh City",
      "temperature": 29.97,
      "feels_like": 33.39,
      "humidity": 63,
      "pressure": 1009,
      "wind_speed": 3.6,
      "wind_direction": 330,
      "clouds": 20,
      "visibility": 10000,
      "weather_main": "Clouds",
      "weather_description": "few clouds",
      "source": "openweather",
      "observation_time": "2025-12-09T09:38:43.079588+00:00",
      "created_at": "2025-12-09T09:38:43.081496+00:00"
    },
    {
      "id": "a3827886-31d5-40dd-94e1-9c19091133a0",
      "latitude": 37.785834,
      "longitude": -122.406417,
      "city_name": "San Francisco",
      "temperature": 7.59,
      "feels_like": 5.27,
      "humidity": 90,
      "pressure": 1025,
      "wind_speed": 3.58,
      "wind_direction": 56,
      "clouds": 40,
      "visibility": 10000,
      "weather_main": "Clouds",
      "weather_description": "scattered clouds",
      "source": "openweather",
      "observation_time": "2025-12-09T09:38:30.067687+00:00",
      "created_at": "2025-12-09T09:38:30.068928+00:00"
    },
    {
      "id": "42dccf0f-3150-4947-885f-6677e4045ac1",
      "latitude": 37.785834,
      "longitude": -122.406417,
      "city_name": "San Francisco",
      "temperature": 7.59,
      "feels_like": 5.27,
      "humidity": 90,
      "pressure": 1025,
      "wind_speed": 3.58,
      "wind_direction": 56,
      "clouds": 40,
      "visibility": 10000,
      "weather_main": "Clouds",
      "weather_description": "scattered clouds",
      "source": "openweather",
      "observation_time": "2025-12-09T09:38:23.286605+00:00",
      "created_at": "2025-12-09T09:38:23.289984+00:00"
    },
    {
      "id": "df12ca58-26d2-47c2-a9a4-bdd194b74a26",
      "latitude": 37.785834,
      "longitude": -122.406417,
      "city_name": "San Francisco",
      "temperature": 7.59,
      "feels_like": 5.27,
      "humidity": 90,
      "pressure": 1025,
      "wind_speed": 3.58,
      "wind_direction": 56,
      "clouds": 40,
      "visibility": 10000,
      "weather_main": "Clouds",
      "weather_description": "scattered clouds",
      "source": "openweather",
      "observation_time": "2025-12-09T09:38:19.641429+00:00",
      "created_at": "2025-12-09T09:38:19.642548+00:00"
    },
    {
      "id": "c5ff039f-8795-44da-90c0-51136efe8d47",
      "latitude": 16.0543,
      "longitude": 108.243,
      "city_name": "Công viên Biển Đông",
      "temperature": 24.99,
      "feels_like": 25.35,
      "humidity": 69,
      "pressure": 1015,
      "wind_speed": 3.09,
      "wind_direction": 40,
      "clouds": 75,
      "visibility": null,
      "weather_main": null,
      "weather_description": "broken clouds",
      "source": "OpenWeatherMap",
      "observation_time": "2025-12-09T09:37:47+00:00",
      "created_at": "2025-12-09T09:37:47.199550+00:00"
    },
    {
      "id": "8b931203-924e-4905-b4c9-7865674b0c05",
      "latitude": 16.0311,
      "longitude": 108.2508,
      "city_name": "Công viên APEC",
      "temperature": 24.99,
      "feels_like": 25.35,
      "humidity": 69,
      "pressure": 1015,
      "wind_speed": 3.09,
      "wind_direction": 40,
      "clouds": 75,
      "visibility": null,
      "weather_main": null,
      "weather_description": "broken clouds",
      "source": "OpenWeatherMap",
      "observation_time": "2025-12-09T09:37:46+00:00",
      "created_at": "2025-12-09T09:37:46.509731+00:00"
    },
    {
      "id": "70b239ac-f457-4991-a38b-626ae292c533",
      "latitude": 15.9964,
      "longitude": 108.0075,
      "city_name": "Rừng Nguyên Sinh Bà Nà",
      "temperature": 17.54,
      "feels_like": 17.52,
      "humidity": 83,
      "pressure": 1016,
      "wind_speed": 0.5,
      "wind_direction": 1,
      "clouds": 100,
      "visibility": null,
      "weather_main": null,
      "weather_description": "overcast clouds",
      "source": "OpenWeatherMap",
      "observation_time": "2025-12-09T09:37:45+00:00",
      "created_at": "2025-12-09T09:37:45.114862+00:00"
    },
    {
      "id": "3532e3c2-4dba-4b5b-9547-adebee62a184",
      "latitude": 16.1083,
      "longitude": 108.2717,
      "city_name": "Bán đảo Sơn Trà",
      "temperature": 23.39,
      "feels_like": 23.59,
      "humidity": 69,
      "pressure": 1015,
      "wind_speed": 3.09,
      "wind_direction": 40,
      "clouds": 75,
      "visibility": null,
      "weather_main": null,
      "weather_description": "broken clouds",
      "source": "OpenWeatherMap",
      "observation_time": "2025-12-09T09:37:45+00:00",
      "created_at": "2025-12-09T09:37:45.820420+00:00"
    },
    {
      "id": "f8a84f52-fe53-4c76-89de-54a4d364a0f0",
      "latitude": 16.0612,
      "longitude": 108.2235,
      "city_name": "Vườn Hoa Châu Á",
      "temperature": 25.04,
      "feels_like": 25.4,
      "humidity": 69,
      "pressure": 1015,
      "wind_speed": 3.09,
      "wind_direction": 40,
      "clouds": 75,
      "visibility": null,
      "weather_main": null,
      "weather_description": "broken clouds",
      "source": "OpenWeatherMap",
      "observation_time": "2025-12-09T09:37:44+00:00",
      "created_at": "2025-12-09T09:37:44.424121+00:00"
    },
    {
      "id": "99dba591-f302-46f0-834f-f739297ee0dc",
      "latitude": 10.7801,
      "longitude": 106.6845,
      "city_name": "Công viên Văn hóa Quận 3",
      "temperature": 30.01,
      "feels_like": 33.47,
      "humidity": 63,
      "pressure": 1009,
      "wind_speed": 3.6,
      "wind_direction": 330,
      "clouds": 20,
      "visibility": null,
      "weather_main": null,
      "weather_description": "few clouds",
      "source": "OpenWeatherMap",
      "observation_time": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.039125+00:00"
    }
  ]
}
```

---

### GET /api/v1/weather/current

**Get Current Weather**

Lấy dữ liệu thời tiết hiện tại theo toạ độ.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "lat": 10.7769,
  "lon": 106.7009,
  "fetch_new": true
}
```

#### Response (200 OK):

```json
{
  "id": "4f981e7d-cad6-49f5-a83d-b73d78d7c56c",
  "location": {
    "type": "Point",
    "coordinates": [
      106.7009,
      10.7769
    ]
  },
  "city_name": "Ho Chi Minh City",
  "temperature": 29.97,
  "feels_like": 33.39,
  "humidity": 63,
  "pressure": 1009,
  "wind": {
    "speed": 3.6,
    "direction": 330
  },
  "weather": {
    "main": "Clouds",
    "description": "few clouds",
    "icon": "02d"
  },
  "observation_time": "2025-12-09T09:38:48.178417",
  "source": "openweather"
}
```

---

### GET /api/v1/weather/location

**Get Weather by Location**

Lấy dữ liệu thời tiết gần vị trí.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "lat": 10.7769,
  "lon": 106.7009,
  "radius": 50,
  "hours": 24
}
```

#### Error Response (422):

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "query",
        "lat"
      ],
      "msg": "Field required",
      "input": null,
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    },
    {
      "type": "missing",
      "loc": [
        "query",
        "lon"
      ],
      "msg": "Field required",
      "input": null,
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    }
  ]
}
```

---

## Education Data

### GET /api/v1/schools

**Get Schools**

Lấy danh sách trường học với phân trang.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
[
  {
    "name": "Trường Quốc tế Anh Việt (BVIS)",
    "code": "BVIS-001",
    "address": "225 Nguyễn Văn Hưởng, Thảo Điền",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 2",
    "type": "international",
    "total_students": 1200,
    "total_teachers": 120,
    "total_trees": 300,
    "green_area": 5000,
    "phone": "028 3744 2335",
    "email": "info@bvis.edu.vn",
    "website": "https://bvis.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "ac044148-3f09-4829-86e8-abb57eca2c9b",
    "green_score": 93,
    "ngsi_ld_uri": null,
    "latitude": 10.8234,
    "longitude": 106.7234,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Công Nghệ TP.HCM (HUTECH)",
    "code": "HUTECH-001",
    "address": "475A Điện Biên Phủ, Phường 25",
    "city": "TP. Hồ Chí Minh",
    "district": "Bình Thạnh",
    "type": "university",
    "total_students": 25000,
    "total_teachers": 1200,
    "total_trees": 800,
    "green_area": 15000,
    "phone": "028 5445 7777",
    "email": "info@hutech.edu.vn",
    "website": "https://hutech.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "fd4905dc-8aab-4268-b586-287fc579a4b5",
    "green_score": 92.5,
    "ngsi_ld_uri": null,
    "latitude": 10.8508,
    "longitude": 106.8067,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Bách Khoa",
    "code": "BK-HCM-001",
    "address": "268 Lý Thường Kiệt, Phường 14",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 10",
    "type": "university",
    "total_students": 30000,
    "total_teachers": 1500,
    "total_trees": 1000,
    "green_area": 20000,
    "phone": "028 3865 4433",
    "email": "dhbk@hcmut.edu.vn",
    "website": "https://hcmut.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "2c9d44c6-07de-4c25-bd65-409abcb7ab03",
    "green_score": 90,
    "ngsi_ld_uri": null,
    "latitude": 10.7722,
    "longitude": 106.6602,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Kinh tế TP.HCM",
    "code": "UEH-001",
    "address": "59C Nguyễn Đình Chiểu, Phường 6",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "university",
    "total_students": 22000,
    "total_teachers": 1100,
    "total_trees": 700,
    "green_area": 14000,
    "phone": "028 3930 5588",
    "email": "info@ueh.edu.vn",
    "website": "https://ueh.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "0c18f44a-1929-46e5-ac3a-28613bdef9d4",
    "green_score": 89.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7623,
    "longitude": 106.6889,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Khoa học Tự nhiên",
    "code": "KHTN-001",
    "address": "227 Nguyễn Văn Cừ, Phường 4",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 5",
    "type": "university",
    "total_students": 18000,
    "total_teachers": 950,
    "total_trees": 600,
    "green_area": 12000,
    "phone": "028 3835 1271",
    "email": "khtn@hcmus.edu.vn",
    "website": "https://hcmus.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "ae103fc5-c524-4199-823e-bd12edb4ddf7",
    "green_score": 88,
    "ngsi_ld_uri": null,
    "latitude": 10.7626,
    "longitude": 106.7017,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Sư phạm TP.HCM",
    "code": "HCMUE-001",
    "address": "280 An Dương Vương, Phường 4",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 5",
    "type": "university",
    "total_students": 20000,
    "total_teachers": 1050,
    "total_trees": 650,
    "green_area": 13000,
    "phone": "028 3835 5271",
    "email": "dhsp@hcmue.edu.vn",
    "website": "https://hcmue.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "35e16cde-f517-4f6b-a893-4091f4960692",
    "green_score": 87.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7623,
    "longitude": 106.6756,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THPT Trần Đại Nghĩa",
    "code": "TDN-001",
    "address": "20 Lý Tự Trọng, Phường Bến Nghé",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "type": "high",
    "total_students": 1800,
    "total_teachers": 95,
    "total_trees": 250,
    "green_area": 3500,
    "phone": "028 3822 5124",
    "email": "tdn@q1.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "9106fc28-a513-4200-8233-ad5ac7af0384",
    "green_score": 87,
    "ngsi_ld_uri": null,
    "latitude": 10.7828,
    "longitude": 106.6924,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Y Dược TP.HCM",
    "code": "UMP-001",
    "address": "217 Hồng Bàng, Phường 11",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 5",
    "type": "university",
    "total_students": 15000,
    "total_teachers": 850,
    "total_trees": 500,
    "green_area": 10000,
    "phone": "028 3855 4269",
    "email": "dhyd@ump.edu.vn",
    "website": "https://ump.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "39cd9aef-d072-4d97-80d3-078e4c9bd990",
    "green_score": 86,
    "ngsi_ld_uri": null,
    "latitude": 10.7556,
    "longitude": 106.6845,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Đại học Duy Tân",
    "code": "DTU-DN-001",
    "address": "Quang Trung, Hải Châu",
    "city": "Đà Nẵng",
    "district": "Hải Châu",
    "type": "university",
    "total_students": 15000,
    "total_teachers": 800,
    "total_trees": 500,
    "green_area": 10000,
    "phone": "0236 3650 403",
    "email": "contact@duytan.edu.vn",
    "website": "https://duytan.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "fccd5058-460f-4022-a0fd-8ec407b6b7fe",
    "green_score": 85.5,
    "ngsi_ld_uri": null,
    "latitude": 16.0544,
    "longitude": 108.2022,
    "created_at": "2025-12-09T07:42:26.729724Z",
    "updated_at": "2025-12-09T07:42:26.729724Z"
  },
  {
    "name": "THPT Lê Hồng Phong",
    "code": "LHP-001",
    "address": "240 Nguyễn Thị Minh Khai, Phường 6",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "high",
    "total_students": 1500,
    "total_teachers": 85,
    "total_trees": 200,
    "green_area": 3000,
    "phone": "028 3930 3611",
    "email": "lhp@q3.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "2369a362-9b0e-4351-981b-c1de53440cf0",
    "green_score": 85.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7769,
    "longitude": 106.6978,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  }
]
```

---

### GET /api/v1/schools/nearby

**Get Nearby Schools**

Tìm trường học gần vị trí.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "latitude": 10.7769,
  "longitude": 106.7009,
  "radius_km": 5,
  "limit": 10
}
```

#### Response (200 OK):

```json
[
  {
    "name": "Trường Đại học Bách Khoa",
    "code": "BK-HCM-001",
    "address": "268 Lý Thường Kiệt, Phường 14",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 10",
    "type": "university",
    "total_students": 30000,
    "total_teachers": 1500,
    "total_trees": 1000,
    "green_area": 20000,
    "phone": "028 3865 4433",
    "email": "dhbk@hcmut.edu.vn",
    "website": "https://hcmut.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "2c9d44c6-07de-4c25-bd65-409abcb7ab03",
    "green_score": 90,
    "ngsi_ld_uri": null,
    "latitude": 10.7722,
    "longitude": 106.6602,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Kinh tế TP.HCM",
    "code": "UEH-001",
    "address": "59C Nguyễn Đình Chiểu, Phường 6",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "university",
    "total_students": 22000,
    "total_teachers": 1100,
    "total_trees": 700,
    "green_area": 14000,
    "phone": "028 3930 5588",
    "email": "info@ueh.edu.vn",
    "website": "https://ueh.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "0c18f44a-1929-46e5-ac3a-28613bdef9d4",
    "green_score": 89.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7623,
    "longitude": 106.6889,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Khoa học Tự nhiên",
    "code": "KHTN-001",
    "address": "227 Nguyễn Văn Cừ, Phường 4",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 5",
    "type": "university",
    "total_students": 18000,
    "total_teachers": 950,
    "total_trees": 600,
    "green_area": 12000,
    "phone": "028 3835 1271",
    "email": "khtn@hcmus.edu.vn",
    "website": "https://hcmus.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "ae103fc5-c524-4199-823e-bd12edb4ddf7",
    "green_score": 88,
    "ngsi_ld_uri": null,
    "latitude": 10.7626,
    "longitude": 106.7017,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Sư phạm TP.HCM",
    "code": "HCMUE-001",
    "address": "280 An Dương Vương, Phường 4",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 5",
    "type": "university",
    "total_students": 20000,
    "total_teachers": 1050,
    "total_trees": 650,
    "green_area": 13000,
    "phone": "028 3835 5271",
    "email": "dhsp@hcmue.edu.vn",
    "website": "https://hcmue.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "35e16cde-f517-4f6b-a893-4091f4960692",
    "green_score": 87.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7623,
    "longitude": 106.6756,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THPT Trần Đại Nghĩa",
    "code": "TDN-001",
    "address": "20 Lý Tự Trọng, Phường Bến Nghé",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "type": "high",
    "total_students": 1800,
    "total_teachers": 95,
    "total_trees": 250,
    "green_area": 3500,
    "phone": "028 3822 5124",
    "email": "tdn@q1.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "9106fc28-a513-4200-8233-ad5ac7af0384",
    "green_score": 87,
    "ngsi_ld_uri": null,
    "latitude": 10.7828,
    "longitude": 106.6924,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Trường Đại học Y Dược TP.HCM",
    "code": "UMP-001",
    "address": "217 Hồng Bàng, Phường 11",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 5",
    "type": "university",
    "total_students": 15000,
    "total_teachers": 850,
    "total_trees": 500,
    "green_area": 10000,
    "phone": "028 3855 4269",
    "email": "dhyd@ump.edu.vn",
    "website": "https://ump.edu.vn",
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "39cd9aef-d072-4d97-80d3-078e4c9bd990",
    "green_score": 86,
    "ngsi_ld_uri": null,
    "latitude": 10.7556,
    "longitude": 106.6845,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THPT Lê Hồng Phong",
    "code": "LHP-001",
    "address": "240 Nguyễn Thị Minh Khai, Phường 6",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "high",
    "total_students": 1500,
    "total_teachers": 85,
    "total_trees": 200,
    "green_area": 3000,
    "phone": "028 3930 3611",
    "email": "lhp@q3.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "2369a362-9b0e-4351-981b-c1de53440cf0",
    "green_score": 85.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7769,
    "longitude": 106.6978,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THPT Gia Định",
    "code": "GD-001",
    "address": "42 Trần Hưng Đạo, Phường 2",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "high",
    "total_students": 1600,
    "total_teachers": 88,
    "total_trees": 220,
    "green_area": 3200,
    "phone": "028 3930 4521",
    "email": "gd@q3.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "d41fec8c-e183-4932-8d62-11646a46d7ce",
    "green_score": 84.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7889,
    "longitude": 106.6845,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THPT Nguyễn Thị Minh Khai",
    "code": "NTMK-001",
    "address": "2 Nguyễn Thị Minh Khai, Phường Bến Nghé",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "type": "high",
    "total_students": 1400,
    "total_teachers": 78,
    "total_trees": 180,
    "green_area": 2800,
    "phone": "028 3829 7271",
    "email": "ntmk@q1.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "0dbb7961-719b-45d7-b82a-4d6b6f169295",
    "green_score": 83,
    "ngsi_ld_uri": null,
    "latitude": 10.7756,
    "longitude": 106.6889,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THPT Nguyễn Thượng Hiền",
    "code": "NTH-001",
    "address": "18 Võ Văn Tần, Phường 6",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "high",
    "total_students": 1350,
    "total_teachers": 75,
    "total_trees": 170,
    "green_area": 2600,
    "phone": "028 3930 2145",
    "email": "nth@q3.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "8cbbc22f-1a26-4d38-a066-ce9627232d42",
    "green_score": 82,
    "ngsi_ld_uri": null,
    "latitude": 10.7845,
    "longitude": 106.6912,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THPT Bình Thạnh",
    "code": "BT-001",
    "address": "123 Điện Biên Phủ, Phường 15",
    "city": "TP. Hồ Chí Minh",
    "district": "Bình Thạnh",
    "type": "high",
    "total_students": 1450,
    "total_teachers": 80,
    "total_trees": 190,
    "green_area": 2900,
    "phone": "028 3899 1234",
    "email": "bt@binhth anh.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "7f99bd96-1bf8-4fca-872a-099b2b3d0cfd",
    "green_score": 81,
    "ngsi_ld_uri": null,
    "latitude": 10.8123,
    "longitude": 106.7123,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THCS Lê Quý Đôn",
    "code": "LQD-001",
    "address": "12 Lê Quý Đôn, Phường 7",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "middle",
    "total_students": 1100,
    "total_teachers": 62,
    "total_trees": 140,
    "green_area": 2000,
    "phone": "028 3930 5678",
    "email": "lqd@q3.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "2c6172eb-e9f2-4bee-afa0-e37e3e2639ae",
    "green_score": 79.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7801,
    "longitude": 106.6867,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THCS Nguyễn Du",
    "code": "ND-HCM-001",
    "address": "15 Nguyễn Du, Phường Bến Nghé",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "type": "middle",
    "total_students": 1050,
    "total_teachers": 60,
    "total_trees": 135,
    "green_area": 1900,
    "phone": "028 3822 4567",
    "email": "nd@q1.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "c59dc938-6c17-4ac7-9a93-0e365658ea13",
    "green_score": 78.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7734,
    "longitude": 106.6956,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THCS Bình Thạnh",
    "code": "BT-TH-001",
    "address": "89 Xô Viết Nghệ Tĩnh, Phường 17",
    "city": "TP. Hồ Chí Minh",
    "district": "Bình Thạnh",
    "type": "middle",
    "total_students": 980,
    "total_teachers": 56,
    "total_trees": 125,
    "green_area": 1750,
    "phone": "028 3899 2345",
    "email": "bt-th@binhth anh.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "179322d5-0b3a-442d-9716-6ee5b2aaa596",
    "green_score": 77.5,
    "ngsi_ld_uri": null,
    "latitude": 10.8089,
    "longitude": 106.7089,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "THCS Trần Hưng Đạo",
    "code": "THD-001",
    "address": "28 Trần Hưng Đạo, Phường 1",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "middle",
    "total_students": 950,
    "total_teachers": 58,
    "total_trees": 120,
    "green_area": 1800,
    "phone": "028 3930 6789",
    "email": "thd@q3.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "b238f366-2be3-48bb-8e27-020e9ec3d0e6",
    "green_score": 77,
    "ngsi_ld_uri": null,
    "latitude": 10.7867,
    "longitude": 106.6923,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Tiểu học Võ Thị Sáu",
    "code": "VTS-001",
    "address": "35 Võ Thị Sáu, Phường 8",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "elementary",
    "total_students": 820,
    "total_teachers": 46,
    "total_trees": 105,
    "green_area": 1450,
    "phone": "028 3930 1234",
    "email": "vts@q3.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "3c690dd5-f18c-45ec-8dc5-7e6c5fc94318",
    "green_score": 76,
    "ngsi_ld_uri": null,
    "latitude": 10.7823,
    "longitude": 106.6878,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Tiểu học Lý Thường Kiệt",
    "code": "LTK-001",
    "address": "42 Lý Thường Kiệt, Phường 9",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 3",
    "type": "elementary",
    "total_students": 780,
    "total_teachers": 44,
    "total_trees": 98,
    "green_area": 1380,
    "phone": "028 3930 2345",
    "email": "ltk@q3.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "3a9860d4-bb04-4a86-99df-3d1233fb017d",
    "green_score": 75.5,
    "ngsi_ld_uri": null,
    "latitude": 10.7856,
    "longitude": 106.6845,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Tiểu học Lê Văn Tám",
    "code": "LVT-001",
    "address": "8 Lê Văn Tám, Phường Bến Thành",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "type": "elementary",
    "total_students": 800,
    "total_teachers": 45,
    "total_trees": 100,
    "green_area": 1400,
    "phone": "028 3822 3456",
    "email": "lvt@q1.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "b88ec8ac-df92-4618-ae9b-783023bbfaec",
    "green_score": 75,
    "ngsi_ld_uri": null,
    "latitude": 10.7712,
    "longitude": 106.6934,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  },
  {
    "name": "Tiểu học Trần Hưng Đạo",
    "code": "THD-TH-001",
    "address": "22 Trần Hưng Đạo, Phường Cầu Ông Lãnh",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "type": "elementary",
    "total_students": 750,
    "total_teachers": 42,
    "total_trees": 95,
    "green_area": 1300,
    "phone": "028 3836 2345",
    "email": "thd-th@q1.edu.vn",
    "website": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "b907a1be-f072-4212-a5b9-8c24e046bc54",
    "green_score": 74,
    "ngsi_ld_uri": null,
    "latitude": 10.7689,
    "longitude": 106.6901,
    "created_at": "2025-12-09T07:42:26.856825Z",
    "updated_at": "2025-12-09T07:42:26.856825Z"
  }
]
```

---

### GET /api/v1/schools/1

**Get School by ID**

Lấy thông tin chi tiết trường học.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Error Response (422):

```json
{
  "detail": [
    {
      "type": "uuid_parsing",
      "loc": [
        "path",
        "school_id"
      ],
      "msg": "Input should be a valid UUID, invalid length: expected length 32 for simple format, found 1",
      "input": "1",
      "ctx": {
        "error": "invalid length: expected length 32 for simple format, found 1"
      },
      "url": "https://errors.pydantic.dev/2.5/v/uuid_parsing"
    }
  ]
}
```

---

### GET /api/v1/green-courses

**Get Green Courses**

Lấy danh sách khóa học môi trường.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
[
  {
    "title": "Environmental Science Basics",
    "description": "Introduction to environmental protection and sustainability",
    "category": "environment",
    "duration_weeks": 10,
    "max_students": 30,
    "syllabus": null,
    "meta_data": null,
    "is_public": true,
    "id": "b5ddf02b-d4f5-4622-b882-2ad23dc838ff",
    "school_id": "fccd5058-460f-4022-a0fd-8ec407b6b7fe",
    "created_at": "2025-12-09T07:42:26.732327Z",
    "updated_at": null
  },
  {
    "title": "Renewable Energy Workshop",
    "description": "Hands-on workshop about solar and wind energy",
    "category": "energy",
    "duration_weeks": 8,
    "max_students": 25,
    "syllabus": null,
    "meta_data": null,
    "is_public": true,
    "id": "1cc651d5-8bcf-4422-8eda-ee0b3758c9d3",
    "school_id": "b9100ef4-3221-4fad-9ce3-c91ff490485b",
    "created_at": "2025-12-09T07:42:26.735903Z",
    "updated_at": null
  },
  {
    "title": "Climate Change and Sustainability",
    "description": "Understanding climate change impacts and sustainable solutions",
    "category": "climate",
    "duration_weeks": 12,
    "max_students": 40,
    "syllabus": null,
    "meta_data": null,
    "is_public": true,
    "id": "447cea1f-f493-4e2e-a695-c933c4214690",
    "school_id": "abb6174e-ef3e-4ca5-b11a-b97205fd8fcf",
    "created_at": "2025-12-09T07:42:26.737802Z",
    "updated_at": null
  },
  {
    "title": "Công nghệ Xanh và Phát triển Bền vững",
    "description": "Khóa học về công nghệ xanh, năng lượng tái tạo và phát triển bền vững tại đô thị",
    "category": "environment",
    "duration_weeks": 12,
    "max_students": 50,
    "syllabus": null,
    "meta_data": null,
    "is_public": true,
    "id": "641d9429-2e9e-4f00-9520-39095b359de5",
    "school_id": "fd4905dc-8aab-4268-b586-287fc579a4b5",
    "created_at": "2025-12-09T07:42:26.867326Z",
    "updated_at": null
  },
  {
    "title": "Năng lượng Tái tạo và Ứng dụng",
    "description": "Workshop thực hành về năng lượng mặt trời, gió và các nguồn năng lượng sạch",
    "category": "energy",
    "duration_weeks": 10,
    "max_students": 40,
    "syllabus": null,
    "meta_data": null,
    "is_public": true,
    "id": "85d5be65-8c92-4bc2-8f7e-89deb01b3f16",
    "school_id": "2c9d44c6-07de-4c25-bd65-409abcb7ab03",
    "created_at": "2025-12-09T07:42:26.869709Z",
    "updated_at": null
  },
  {
    "title": "Biến đổi Khí hậu và Giải pháp Xanh",
    "description": "Nghiên cứu về biến đổi khí hậu và các giải pháp xanh cho thành phố",
    "category": "climate",
    "duration_weeks": 14,
    "max_students": 45,
    "syllabus": null,
    "meta_data": null,
    "is_public": true,
    "id": "66ebd4ab-425d-4130-a612-1777c1abf8f3",
    "school_id": "ae103fc5-c524-4199-823e-bd12edb4ddf7",
    "created_at": "2025-12-09T07:42:26.871001Z",
    "updated_at": null
  },
  {
    "title": "Kinh tế Xanh và Phát triển Bền vững",
    "description": "Khóa học về kinh tế xanh, doanh nghiệp bền vững và trách nhiệm xã hội",
    "category": "sustainability",
    "duration_weeks": 12,
    "max_students": 60,
    "syllabus": null,
    "meta_data": null,
    "is_public": true,
    "id": "1a47085c-30df-4b6f-9e4b-bb6c34071600",
    "school_id": "0c18f44a-1929-46e5-ac3a-28613bdef9d4",
    "created_at": "2025-12-09T07:42:26.872434Z",
    "updated_at": null
  },
  {
    "title": "Giáo dục Môi trường cho Học sinh",
    "description": "Chương trình giáo dục môi trường và ý thức bảo vệ thiên nhiên",
    "category": "environment",
    "duration_weeks": 8,
    "max_students": 35,
    "syllabus": null,
    "meta_data": null,
    "is_public": true,
    "id": "7c7a090c-cc5a-4929-827d-3f636be12048",
    "school_id": "2369a362-9b0e-4351-981b-c1de53440cf0",
    "created_at": "2025-12-09T07:42:26.873935Z",
    "updated_at": null
  }
]
```

---

## Green Resources

### GET /api/v1/green-zones

**Get Green Zones (Auth)**

Lấy danh sách khu vực xanh (authenticated endpoint).

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
[
  {
    "name": "Công viên Gia Định",
    "code": "CV-BT-001",
    "latitude": 10.8156,
    "longitude": 106.7089,
    "address": "Phường 15, Bình Thạnh, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 89000,
    "tree_count": 1600,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "f0f5bb20-7ce3-4822-b9b4-a8647e7ce847",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Đầm Sen",
    "code": "CV-Q11-001",
    "latitude": 10.7656,
    "longitude": 106.6378,
    "address": "Phường 4, Quận 11, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 500000,
    "tree_count": 8000,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "1c1bdab7-fa9d-4ef6-91f0-df6b9725ff3c",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Hoàng Văn Thụ",
    "code": "CV-Q3-002",
    "latitude": 10.7867,
    "longitude": 106.6889,
    "address": "Phường 4, Quận 3, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 52000,
    "tree_count": 950,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "8dfaba46-87b1-4b21-ab4b-7008d81ec099",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Văn hóa Quận 3",
    "code": "CV-Q3-003",
    "latitude": 10.7801,
    "longitude": 106.6845,
    "address": "Phường 7, Quận 3, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 68000,
    "tree_count": 1200,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "527ba7af-fd9c-4310-9ff0-f6dfb2a0caac",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Lê Thị Riêng",
    "code": "CV-BT-002",
    "latitude": 10.8089,
    "longitude": 106.7123,
    "address": "Phường 17, Bình Thạnh, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 42000,
    "tree_count": 780,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "0e6f8b52-597e-48ef-a94a-1eee8b4bd500",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên 30 Tháng 4",
    "code": "CV-Q1-001",
    "latitude": 10.7712,
    "longitude": 106.6978,
    "address": "Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 125000,
    "tree_count": 2500,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "cd1aef8d-58c4-405c-804d-8277c3e4d3e9",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Tao Đàn",
    "code": "CV-Q1-002",
    "latitude": 10.7789,
    "longitude": 106.6923,
    "address": "Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 102000,
    "tree_count": 1800,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "5bbb2070-cb66-4245-aa81-04d799b455f1",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Lê Văn Tám",
    "code": "CV-Q1-003",
    "latitude": 10.7701,
    "longitude": 106.6934,
    "address": "Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 38000,
    "tree_count": 650,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "b903cac9-1803-42e5-86b8-82a9fd63f4fb",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Lê Thị Riêng",
    "code": "CV-Q3-001",
    "latitude": 10.7834,
    "longitude": 106.6867,
    "address": "Phường 8, Quận 3, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 45000,
    "tree_count": 850,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "8935134e-ff7c-4bb5-860e-fc1f95f3f1eb",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Đại lộ Nguyễn Huệ",
    "code": "GC-Q1-001",
    "latitude": 10.7745,
    "longitude": 106.7006,
    "address": "Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "zone_type": "street",
    "area_sqm": 25000,
    "tree_count": 450,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "f968b323-e70c-4c08-8f9a-9a18624244ba",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  }
]
```

---

### GET /api/v1/green-zones/1

**Get Green Zone by ID**

Lấy thông tin chi tiết khu vực xanh theo ID.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Error Response (503):

```json
{
  "detail": "Service unavailable"
}
```

---

### GET /api/v1/green-resources

**Get Green Resources (Auth)**

Lấy danh sách tài nguyên xanh (authenticated endpoint).

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
[
  {
    "id": "434feb2e-a03d-492a-95f1-2528afb86aa9",
    "name": "Cây xanh Công viên Biển Đông",
    "type": "trees",
    "quantity": 250,
    "available_quantity": 250,
    "unit": "cây",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "species": [
        "phượng",
        "dừa",
        "xanh"
      ],
      "planted_year": 2015
    },
    "zone_id": "4553cbf1-6b86-456e-bc5f-04f01000a998",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  },
  {
    "id": "b5aff842-7e6b-48aa-b9f1-4859a5952063",
    "name": "Ghế công cộng CV 29/3",
    "type": "bench",
    "quantity": 50,
    "available_quantity": 48,
    "unit": "cái",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "material": "gỗ",
      "condition": "good"
    },
    "zone_id": "f0bc81e6-ae86-4a72-926a-3e6c8571f40b",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  },
  {
    "id": "a99979d7-6069-401f-9d80-be98df8b322c",
    "name": "Thùng rác thải phân loại",
    "type": "bin",
    "quantity": 30,
    "available_quantity": 30,
    "unit": "cái",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "types": [
        "recyclable",
        "organic",
        "general"
      ],
      "capacity_liters": 120
    },
    "zone_id": "0fa5e48b-ba2f-44f9-82d7-0060f8fd536a",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  },
  {
    "id": "c5d2a8d7-07c5-4cf0-95b3-d43796a42b59",
    "name": "Đèn LED chiếu sáng",
    "type": "lighting",
    "quantity": 80,
    "available_quantity": 75,
    "unit": "bộ",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "power_watts": 50,
      "solar_powered": true
    },
    "zone_id": "74810265-6891-4b2d-b450-01200d50d057",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  },
  {
    "id": "691925ce-76da-460c-8ca7-67c2874b64b7",
    "name": "Hệ thống tưới tự động",
    "type": "irrigation",
    "quantity": 5,
    "available_quantity": 5,
    "unit": "hệ thống",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "coverage_sqm": 10000,
      "water_source": "recycled"
    },
    "zone_id": "4553cbf1-6b86-456e-bc5f-04f01000a998",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  }
]
```

---

### GET /api/v1/green-resources/1

**Get Green Resource by ID**

Lấy thông tin chi tiết tài nguyên xanh theo ID.

🔐 **Authentication Required:** Bearer Token

#### Request:

#### Error Response (503):

```json
{
  "detail": "Service unavailable"
}
```

---

### GET /api/v1/centers

**Get Recycling Centers (Auth)**

Lấy danh sách trung tâm tái chế (authenticated endpoint).

🔐 **Authentication Required:** Bearer Token

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
[]
```

---

## Public Endpoints

### GET /api/open-data/weather/current

**Public Current Weather**

Thời tiết hiện tại công khai.

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "lat": 10.7769,
  "lon": 106.7009
}
```

#### Response (200 OK):

```json
{
  "id": "aa9ac205-5bee-4e15-bb12-33611fc35afb",
  "location": {
    "type": "Point",
    "coordinates": [
      106.7009,
      10.7769
    ]
  },
  "city_name": "Ho Chi Minh City",
  "temperature": 29.97,
  "feels_like": 33.39,
  "humidity": 63,
  "pressure": 1009,
  "wind": {
    "speed": 3.6,
    "direction": 330
  },
  "weather": {
    "main": "Clouds",
    "description": "few clouds",
    "icon": "02d"
  },
  "observation_time": "2025-12-09T09:38:43.079588",
  "source": "openweather"
}
```

---

### GET /api/open-data/weather/forecast

**Public Weather Forecast**

Dự báo thời tiết 7 ngày.

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "lat": 10.7769,
  "lon": 106.7009
}
```

#### Response (200 OK):

```json
{
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
    {
      "dt": 1765281600,
      "main": {
        "temp": 29.74,
        "feels_like": 32.73,
        "temp_min": 29.23,
        "temp_max": 29.74,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1010,
        "humidity": 62,
        "temp_kf": 0.51
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "clouds": {
        "all": 47
      },
      "wind": {
        "speed": 2.1,
        "deg": 278,
        "gust": 3.04
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-09 12:00:00"
    },
    {
      "dt": 1765292400,
      "main": {
        "temp": 27.87,
        "feels_like": 30.42,
        "temp_min": 26.81,
        "temp_max": 27.87,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 70,
        "temp_kf": 1.06
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 73
      },
      "wind": {
        "speed": 1.12,
        "deg": 12,
        "gust": 2.71
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-09 15:00:00"
    },
    {
      "dt": 1765303200,
      "main": {
        "temp": 25.52,
        "feels_like": 26.16,
        "temp_min": 25.52,
        "temp_max": 25.52,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1009,
        "humidity": 78,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 99
      },
      "wind": {
        "speed": 2.34,
        "deg": 6,
        "gust": 3.91
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-09 18:00:00"
    },
    {
      "dt": 1765314000,
      "main": {
        "temp": 25.64,
        "feels_like": 26.24,
        "temp_min": 25.64,
        "temp_max": 25.64,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1008,
        "humidity": 76,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 97
      },
      "wind": {
        "speed": 2.02,
        "deg": 6,
        "gust": 3.88
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-09 21:00:00"
    },
    {
      "dt": 1765324800,
      "main": {
        "temp": 24.45,
        "feels_like": 24.99,
        "temp_min": 24.45,
        "temp_max": 24.45,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1010,
        "humidity": 78,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 99
      },
      "wind": {
        "speed": 2.02,
        "deg": 46,
        "gust": 3.64
      },
      "visibility": 10000,
      "pop": 0.2,
      "rain": {
        "3h": 0.1
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-10 00:00:00"
    },
    {
      "dt": 1765335600,
      "main": {
        "temp": 24.98,
        "feels_like": 25.49,
        "temp_min": 24.98,
        "temp_max": 24.98,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1011,
        "humidity": 75,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 1.25,
        "deg": 33,
        "gust": 1.67
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-10 03:00:00"
    },
    {
      "dt": 1765346400,
      "main": {
        "temp": 25.49,
        "feels_like": 26.05,
        "temp_min": 25.49,
        "temp_max": 25.49,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 75,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 0.96,
        "deg": 318,
        "gust": 1.51
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-10 06:00:00"
    },
    {
      "dt": 1765357200,
      "main": {
        "temp": 25.45,
        "feels_like": 26.04,
        "temp_min": 25.45,
        "temp_max": 25.45,
        "pressure": 1008,
        "sea_level": 1008,
        "grnd_level": 1008,
        "humidity": 76,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 0.3,
        "deg": 266,
        "gust": 0.58
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-10 09:00:00"
    },
    {
      "dt": 1765368000,
      "main": {
        "temp": 24.07,
        "feels_like": 24.75,
        "temp_min": 24.07,
        "temp_max": 24.07,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 85,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 1.07,
        "deg": 291,
        "gust": 1.47
      },
      "visibility": 10000,
      "pop": 0.27,
      "rain": {
        "3h": 0.36
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-10 12:00:00"
    },
    {
      "dt": 1765378800,
      "main": {
        "temp": 23.73,
        "feels_like": 24.51,
        "temp_min": 23.73,
        "temp_max": 23.73,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 90,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 1.36,
        "deg": 303,
        "gust": 1.89
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-10 15:00:00"
    },
    {
      "dt": 1765389600,
      "main": {
        "temp": 23.4,
        "feels_like": 24.2,
        "temp_min": 23.4,
        "temp_max": 23.4,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 92,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 1.46,
        "deg": 336,
        "gust": 2
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-10 18:00:00"
    },
    {
      "dt": 1765400400,
      "main": {
        "temp": 22.81,
        "feels_like": 23.6,
        "temp_min": 22.81,
        "temp_max": 22.81,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 94,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 96
      },
      "wind": {
        "speed": 1.4,
        "deg": 352,
        "gust": 1.79
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-10 21:00:00"
    },
    {
      "dt": 1765411200,
      "main": {
        "temp": 23.79,
        "feels_like": 24.57,
        "temp_min": 23.79,
        "temp_max": 23.79,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 90,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 95
      },
      "wind": {
        "speed": 1.13,
        "deg": 1,
        "gust": 1.74
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-11 00:00:00"
    },
    {
      "dt": 1765422000,
      "main": {
        "temp": 27.13,
        "feels_like": 29.63,
        "temp_min": 27.13,
        "temp_max": 27.13,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1012,
        "humidity": 76,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 98
      },
      "wind": {
        "speed": 1.53,
        "deg": 21,
        "gust": 1.33
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-11 03:00:00"
    },
    {
      "dt": 1765432800,
      "main": {
        "temp": 30.65,
        "feels_like": 33.44,
        "temp_min": 30.65,
        "temp_max": 30.65,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1008,
        "humidity": 57,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 95
      },
      "wind": {
        "speed": 2.08,
        "deg": 42,
        "gust": 4.57
      },
      "visibility": 10000,
      "pop": 0.2,
      "rain": {
        "3h": 0.16
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-11 06:00:00"
    },
    {
      "dt": 1765443600,
      "main": {
        "temp": 30.44,
        "feels_like": 33.47,
        "temp_min": 30.44,
        "temp_max": 30.44,
        "pressure": 1007,
        "sea_level": 1007,
        "grnd_level": 1007,
        "humidity": 59,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 93
      },
      "wind": {
        "speed": 2.23,
        "deg": 95,
        "gust": 3.52
      },
      "visibility": 10000,
      "pop": 0.52,
      "rain": {
        "3h": 0.27
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-11 09:00:00"
    },
    {
      "dt": 1765454400,
      "main": {
        "temp": 25.6,
        "feels_like": 26.28,
        "temp_min": 25.6,
        "temp_max": 25.6,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 79,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": {
        "all": 55
      },
      "wind": {
        "speed": 1.37,
        "deg": 131,
        "gust": 2.9
      },
      "visibility": 10000,
      "pop": 0.29,
      "rain": {
        "3h": 0.13
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-11 12:00:00"
    },
    {
      "dt": 1765465200,
      "main": {
        "temp": 24.8,
        "feels_like": 25.53,
        "temp_min": 24.8,
        "temp_max": 24.8,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1010,
        "humidity": 84,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 65
      },
      "wind": {
        "speed": 1.23,
        "deg": 173,
        "gust": 1.28
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-11 15:00:00"
    },
    {
      "dt": 1765476000,
      "main": {
        "temp": 24.2,
        "feels_like": 24.95,
        "temp_min": 24.2,
        "temp_max": 24.2,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 87,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 71
      },
      "wind": {
        "speed": 0.75,
        "deg": 304,
        "gust": 1.1
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-11 18:00:00"
    },
    {
      "dt": 1765486800,
      "main": {
        "temp": 23.58,
        "feels_like": 24.29,
        "temp_min": 23.58,
        "temp_max": 23.58,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1009,
        "humidity": 88,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 90
      },
      "wind": {
        "speed": 1.75,
        "deg": 316,
        "gust": 2.35
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-11 21:00:00"
    },
    {
      "dt": 1765497600,
      "main": {
        "temp": 24.06,
        "feels_like": 24.69,
        "temp_min": 24.06,
        "temp_max": 24.06,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1010,
        "humidity": 83,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 78
      },
      "wind": {
        "speed": 1.64,
        "deg": 337,
        "gust": 2.57
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-12 00:00:00"
    },
    {
      "dt": 1765508400,
      "main": {
        "temp": 28.89,
        "feels_like": 31.47,
        "temp_min": 28.89,
        "temp_max": 28.89,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1010,
        "humidity": 64,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 1.16,
        "deg": 343,
        "gust": 1
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-12 03:00:00"
    },
    {
      "dt": 1765519200,
      "main": {
        "temp": 32.14,
        "feels_like": 35.13,
        "temp_min": 32.14,
        "temp_max": 32.14,
        "pressure": 1008,
        "sea_level": 1008,
        "grnd_level": 1007,
        "humidity": 52,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 0.84,
        "deg": 96,
        "gust": 2.9
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-12 06:00:00"
    },
    {
      "dt": 1765530000,
      "main": {
        "temp": 30.11,
        "feels_like": 33.25,
        "temp_min": 30.11,
        "temp_max": 30.11,
        "pressure": 1007,
        "sea_level": 1007,
        "grnd_level": 1006,
        "humidity": 61,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 95
      },
      "wind": {
        "speed": 2.21,
        "deg": 170,
        "gust": 2.29
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-12 09:00:00"
    },
    {
      "dt": 1765540800,
      "main": {
        "temp": 25.86,
        "feels_like": 26.54,
        "temp_min": 25.86,
        "temp_max": 25.86,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1009,
        "humidity": 78,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 98
      },
      "wind": {
        "speed": 2.95,
        "deg": 159,
        "gust": 5.07
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-12 12:00:00"
    },
    {
      "dt": 1765551600,
      "main": {
        "temp": 25.25,
        "feels_like": 26.02,
        "temp_min": 25.25,
        "temp_max": 25.25,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 84,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": {
        "all": 74
      },
      "wind": {
        "speed": 0.74,
        "deg": 150,
        "gust": 0.98
      },
      "visibility": 10000,
      "pop": 0.2,
      "rain": {
        "3h": 0.22
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-12 15:00:00"
    },
    {
      "dt": 1765562400,
      "main": {
        "temp": 24.8,
        "feels_like": 25.56,
        "temp_min": 24.8,
        "temp_max": 24.8,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1008,
        "humidity": 85,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": {
        "all": 83
      },
      "wind": {
        "speed": 0.97,
        "deg": 335,
        "gust": 1.31
      },
      "visibility": 10000,
      "pop": 0.42,
      "rain": {
        "3h": 0.48
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-12 18:00:00"
    },
    {
      "dt": 1765573200,
      "main": {
        "temp": 23.97,
        "feels_like": 24.75,
        "temp_min": 23.97,
        "temp_max": 23.97,
        "pressure": 1008,
        "sea_level": 1008,
        "grnd_level": 1008,
        "humidity": 89,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "clouds": {
        "all": 26
      },
      "wind": {
        "speed": 1.85,
        "deg": 348,
        "gust": 2.44
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-12 21:00:00"
    },
    {
      "dt": 1765584000,
      "main": {
        "temp": 24.31,
        "feels_like": 25.04,
        "temp_min": 24.31,
        "temp_max": 24.31,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 86,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 59
      },
      "wind": {
        "speed": 1.29,
        "deg": 319,
        "gust": 1.79
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-13 00:00:00"
    },
    {
      "dt": 1765594800,
      "main": {
        "temp": 29.48,
        "feels_like": 32.79,
        "temp_min": 29.48,
        "temp_max": 29.48,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 65,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "clouds": {
        "all": 42
      },
      "wind": {
        "speed": 1.19,
        "deg": 326,
        "gust": 0.88
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-13 03:00:00"
    },
    {
      "dt": 1765605600,
      "main": {
        "temp": 33.12,
        "feels_like": 36.83,
        "temp_min": 33.12,
        "temp_max": 33.12,
        "pressure": 1007,
        "sea_level": 1007,
        "grnd_level": 1006,
        "humidity": 51,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "clouds": {
        "all": 50
      },
      "wind": {
        "speed": 0.91,
        "deg": 61,
        "gust": 2.25
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-13 06:00:00"
    },
    {
      "dt": 1765616400,
      "main": {
        "temp": 30.8,
        "feels_like": 34.67,
        "temp_min": 30.8,
        "temp_max": 30.8,
        "pressure": 1006,
        "sea_level": 1006,
        "grnd_level": 1005,
        "humidity": 61,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 87
      },
      "wind": {
        "speed": 1.44,
        "deg": 118,
        "gust": 2.23
      },
      "visibility": 10000,
      "pop": 0.25,
      "rain": {
        "3h": 0.25
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-13 09:00:00"
    },
    {
      "dt": 1765627200,
      "main": {
        "temp": 24.45,
        "feels_like": 25.3,
        "temp_min": 24.45,
        "temp_max": 24.45,
        "pressure": 1008,
        "sea_level": 1008,
        "grnd_level": 1008,
        "humidity": 90,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 501,
          "main": "Rain",
          "description": "moderate rain",
          "icon": "10n"
        }
      ],
      "clouds": {
        "all": 94
      },
      "wind": {
        "speed": 3.17,
        "deg": 148,
        "gust": 5.05
      },
      "visibility": 5200,
      "pop": 1,
      "rain": {
        "3h": 3.42
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-13 12:00:00"
    },
    {
      "dt": 1765638000,
      "main": {
        "temp": 24.63,
        "feels_like": 25.5,
        "temp_min": 24.63,
        "temp_max": 24.63,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1009,
        "humidity": 90,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 0.47,
        "deg": 207,
        "gust": 0.69
      },
      "visibility": 10000,
      "pop": 0.96,
      "rain": {
        "3h": 2.28
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-13 15:00:00"
    },
    {
      "dt": 1765648800,
      "main": {
        "temp": 24.3,
        "feels_like": 25.16,
        "temp_min": 24.3,
        "temp_max": 24.3,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1008,
        "humidity": 91,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 1.39,
        "deg": 325,
        "gust": 1.68
      },
      "visibility": 10000,
      "pop": 1,
      "rain": {
        "3h": 0.44
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-13 18:00:00"
    },
    {
      "dt": 1765659600,
      "main": {
        "temp": 23.12,
        "feels_like": 23.97,
        "temp_min": 23.12,
        "temp_max": 23.12,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1008,
        "humidity": 95,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      "clouds": {
        "all": 78
      },
      "wind": {
        "speed": 2.27,
        "deg": 4,
        "gust": 3.89
      },
      "visibility": 10000,
      "pop": 1,
      "rain": {
        "3h": 1.61
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-13 21:00:00"
    },
    {
      "dt": 1765670400,
      "main": {
        "temp": 23.62,
        "feels_like": 24.34,
        "temp_min": 23.62,
        "temp_max": 23.62,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 88,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 73
      },
      "wind": {
        "speed": 1.83,
        "deg": 32,
        "gust": 3.44
      },
      "visibility": 10000,
      "pop": 1,
      "rain": {
        "3h": 1.63
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-14 00:00:00"
    },
    {
      "dt": 1765681200,
      "main": {
        "temp": 28.16,
        "feels_like": 30.7,
        "temp_min": 28.16,
        "temp_max": 28.16,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 68,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": {
        "all": 100
      },
      "wind": {
        "speed": 2.79,
        "deg": 51,
        "gust": 3.45
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-14 03:00:00"
    },
    {
      "dt": 1765692000,
      "main": {
        "temp": 31.28,
        "feels_like": 34.68,
        "temp_min": 31.28,
        "temp_max": 31.28,
        "pressure": 1008,
        "sea_level": 1008,
        "grnd_level": 1007,
        "humidity": 57,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 99
      },
      "wind": {
        "speed": 2.08,
        "deg": 55,
        "gust": 3.43
      },
      "visibility": 10000,
      "pop": 0.34,
      "rain": {
        "3h": 0.39
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-14 06:00:00"
    },
    {
      "dt": 1765702800,
      "main": {
        "temp": 27.53,
        "feels_like": 30.71,
        "temp_min": 27.53,
        "temp_max": 27.53,
        "pressure": 1007,
        "sea_level": 1007,
        "grnd_level": 1007,
        "humidity": 78,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": {
        "all": 93
      },
      "wind": {
        "speed": 2.57,
        "deg": 50,
        "gust": 4.12
      },
      "visibility": 10000,
      "pop": 1,
      "rain": {
        "3h": 2.82
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-14 09:00:00"
    }
  ],
  "city": {
    "id": 1566083,
    "name": "Ho Chi Minh City",
    "coord": {
      "lat": 10.7769,
      "lon": 106.7009
    },
    "country": "VN",
    "population": 1000000,
    "timezone": 25200,
    "sunrise": 1765234816,
    "sunset": 1765276254
  }
}
```

---

### GET /api/open-data/air-quality

**Public Air Quality**

Dữ liệu AQI công khai (không cần xác thực).

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "limit": 10
}
```

#### Response (200 OK):

```json
{
  "total": 10,
  "data": [
    {
      "id": "9a3c9e81-0b1f-4c4d-9558-043087b5ac53",
      "latitude": 16.0543,
      "longitude": 108.243,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Biển Đông",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:47+00:00",
      "created_at": "2025-12-09T09:37:47.370697+00:00"
    },
    {
      "id": "ae00a4e1-46a0-4067-b02c-d6741bb3c22a",
      "latitude": 16.0311,
      "longitude": 108.2508,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Công viên APEC",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:46+00:00",
      "created_at": "2025-12-09T09:37:46.687832+00:00"
    },
    {
      "id": "d66ed2e8-c3ef-4d77-8215-e34482cb60d9",
      "latitude": 15.9964,
      "longitude": 108.0075,
      "aqi": 27,
      "pm25": 13.73,
      "pm10": 15.3,
      "co": 203.16,
      "no2": 1.74,
      "o3": 73.04,
      "so2": 1.02,
      "source": "OpenWeatherMap",
      "station_name": "Rừng Nguyên Sinh Bà Nà",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:45+00:00",
      "created_at": "2025-12-09T09:37:45.302591+00:00"
    },
    {
      "id": "b0a2b34a-01b4-4b14-b069-bf9bd8a9e739",
      "latitude": 16.1083,
      "longitude": 108.2717,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Bán đảo Sơn Trà",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:45+00:00",
      "created_at": "2025-12-09T09:37:45.995577+00:00"
    },
    {
      "id": "cf7b3a03-d3f3-4149-b490-64501f74c5e7",
      "latitude": 16.0612,
      "longitude": 108.2235,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Vườn Hoa Châu Á",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:44+00:00",
      "created_at": "2025-12-09T09:37:44.599009+00:00"
    },
    {
      "id": "0430e9b0-7d08-48df-9df8-e3f961cbe16b",
      "latitude": 10.7801,
      "longitude": 106.6845,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Văn hóa Quận 3",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.225414+00:00"
    },
    {
      "id": "d4bc145c-46ee-480c-92d9-b3adf080c7d4",
      "latitude": 10.8156,
      "longitude": 106.7089,
      "aqi": 57,
      "pm25": 28.98,
      "pm10": 34.67,
      "co": 387.36,
      "no2": 7.79,
      "o3": 78.98,
      "so2": 5.09,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Gia Định",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.913300+00:00"
    },
    {
      "id": "5148c0b3-51be-4c43-8bf7-03d47a45252c",
      "latitude": 10.7656,
      "longitude": 106.6378,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Đầm Sen",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:42+00:00",
      "created_at": "2025-12-09T09:37:42.528442+00:00"
    },
    {
      "id": "4a4f1f55-d5f2-425f-be02-d88f637f5d5d",
      "latitude": 10.7712,
      "longitude": 106.7123,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Bến Bạch Đằng",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:41+00:00",
      "created_at": "2025-12-09T09:37:41.841582+00:00"
    },
    {
      "id": "cfee2b7b-74f3-4792-a456-7bc24b62a1f2",
      "latitude": 16.0567,
      "longitude": 108.2012,
      "aqi": 30,
      "pm25": 15.11,
      "pm10": 17.11,
      "co": 203.58,
      "no2": 1.9,
      "o3": 66.7,
      "so2": 1.14,
      "source": "OpenWeatherMap",
      "station_name": "Tiểu học Nguyễn Du",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:40+00:00",
      "created_at": "2025-12-09T09:37:40.461866+00:00"
    }
  ]
}
```

---

### GET /api/open-data/air-quality/location

**Public Air Quality by Location**

Lấy dữ liệu AQI gần vị trí cụ thể.

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "lat": 10.7769,
  "lon": 106.7009,
  "radius": 50
}
```

#### Response (200 OK):

```json
{
  "location": {
    "lat": 10.7769,
    "lon": 106.7009
  },
  "radius_km": 50,
  "total": 10,
  "data": [
    {
      "id": "0430e9b0-7d08-48df-9df8-e3f961cbe16b",
      "latitude": 10.7801,
      "longitude": 106.6845,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Văn hóa Quận 3",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.225414+00:00"
    },
    {
      "id": "d4bc145c-46ee-480c-92d9-b3adf080c7d4",
      "latitude": 10.8156,
      "longitude": 106.7089,
      "aqi": 57,
      "pm25": 28.98,
      "pm10": 34.67,
      "co": 387.36,
      "no2": 7.79,
      "o3": 78.98,
      "so2": 5.09,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Gia Định",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:43+00:00",
      "created_at": "2025-12-09T09:37:43.913300+00:00"
    },
    {
      "id": "5148c0b3-51be-4c43-8bf7-03d47a45252c",
      "latitude": 10.7656,
      "longitude": 106.6378,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Đầm Sen",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:42+00:00",
      "created_at": "2025-12-09T09:37:42.528442+00:00"
    },
    {
      "id": "4a4f1f55-d5f2-425f-be02-d88f637f5d5d",
      "latitude": 10.7712,
      "longitude": 106.7123,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Công viên Bến Bạch Đằng",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:41+00:00",
      "created_at": "2025-12-09T09:37:41.841582+00:00"
    },
    {
      "id": "d50e8a35-7840-43ca-a065-ad219f0b940f",
      "latitude": 10.7712,
      "longitude": 106.6934,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "Tiểu học Lê Văn Tám",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:38+00:00",
      "created_at": "2025-12-09T09:37:38.582215+00:00"
    },
    {
      "id": "0e5d360b-fc0e-4f73-a370-667909f62af9",
      "latitude": 10.7867,
      "longitude": 106.6923,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "THCS Trần Hưng Đạo",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:37+00:00",
      "created_at": "2025-12-09T09:37:37.195521+00:00"
    },
    {
      "id": "264a66f4-f972-4f5f-8daa-9bfd72592b9f",
      "latitude": 10.7734,
      "longitude": 106.6956,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "THCS Nguyễn Du",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:37+00:00",
      "created_at": "2025-12-09T09:37:37.884482+00:00"
    },
    {
      "id": "f2652bb4-4d51-4c3b-a82a-d5f1d2bf2b57",
      "latitude": 10.7889,
      "longitude": 106.6845,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "THPT Gia Định",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:36+00:00",
      "created_at": "2025-12-09T09:37:36.513891+00:00"
    },
    {
      "id": "4e18729d-9893-4655-b51a-2c44b5d806e5",
      "latitude": 10.7828,
      "longitude": 106.6924,
      "aqi": 58,
      "pm25": 29.32,
      "pm10": 34.03,
      "co": 371.96,
      "no2": 6.38,
      "o3": 81.96,
      "so2": 4.43,
      "source": "OpenWeatherMap",
      "station_name": "THPT Trần Đại Nghĩa",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:35+00:00",
      "created_at": "2025-12-09T09:37:35.824426+00:00"
    },
    {
      "id": "db95f69a-67db-4a08-b637-eea7ff0a5f1c",
      "latitude": 10.8508,
      "longitude": 106.8067,
      "aqi": 69,
      "pm25": 34.6,
      "pm10": 40.85,
      "co": 421.7,
      "no2": 8.37,
      "o3": 79.42,
      "so2": 5.19,
      "source": "OpenWeatherMap",
      "station_name": "Trường Đại học Công Nghệ TP.HCM (HUTECH)",
      "station_id": null,
      "measurement_date": "2025-12-09T09:37:33+00:00",
      "created_at": "2025-12-09T09:37:33.413170+00:00"
    }
  ]
}
```

---

### GET /api/open-data/green-zones

**Public Green Zones**

Lấy danh sách khu vực xanh (công viên, rừng, vườn).

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
[
  {
    "name": "Công viên Gia Định",
    "code": "CV-BT-001",
    "latitude": 10.8156,
    "longitude": 106.7089,
    "address": "Phường 15, Bình Thạnh, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 89000,
    "tree_count": 1600,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "f0f5bb20-7ce3-4822-b9b4-a8647e7ce847",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Đầm Sen",
    "code": "CV-Q11-001",
    "latitude": 10.7656,
    "longitude": 106.6378,
    "address": "Phường 4, Quận 11, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 500000,
    "tree_count": 8000,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "1c1bdab7-fa9d-4ef6-91f0-df6b9725ff3c",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Hoàng Văn Thụ",
    "code": "CV-Q3-002",
    "latitude": 10.7867,
    "longitude": 106.6889,
    "address": "Phường 4, Quận 3, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 52000,
    "tree_count": 950,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "8dfaba46-87b1-4b21-ab4b-7008d81ec099",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Văn hóa Quận 3",
    "code": "CV-Q3-003",
    "latitude": 10.7801,
    "longitude": 106.6845,
    "address": "Phường 7, Quận 3, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 68000,
    "tree_count": 1200,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "527ba7af-fd9c-4310-9ff0-f6dfb2a0caac",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Lê Thị Riêng",
    "code": "CV-BT-002",
    "latitude": 10.8089,
    "longitude": 106.7123,
    "address": "Phường 17, Bình Thạnh, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 42000,
    "tree_count": 780,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "0e6f8b52-597e-48ef-a94a-1eee8b4bd500",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên 30 Tháng 4",
    "code": "CV-Q1-001",
    "latitude": 10.7712,
    "longitude": 106.6978,
    "address": "Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 125000,
    "tree_count": 2500,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "cd1aef8d-58c4-405c-804d-8277c3e4d3e9",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Tao Đàn",
    "code": "CV-Q1-002",
    "latitude": 10.7789,
    "longitude": 106.6923,
    "address": "Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 102000,
    "tree_count": 1800,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "5bbb2070-cb66-4245-aa81-04d799b455f1",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Lê Văn Tám",
    "code": "CV-Q1-003",
    "latitude": 10.7701,
    "longitude": 106.6934,
    "address": "Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 38000,
    "tree_count": 650,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "b903cac9-1803-42e5-86b8-82a9fd63f4fb",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Công viên Lê Thị Riêng",
    "code": "CV-Q3-001",
    "latitude": 10.7834,
    "longitude": 106.6867,
    "address": "Phường 8, Quận 3, TP. Hồ Chí Minh",
    "zone_type": "park",
    "area_sqm": 45000,
    "tree_count": 850,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "8935134e-ff7c-4bb5-860e-fc1f95f3f1eb",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  },
  {
    "name": "Đại lộ Nguyễn Huệ",
    "code": "GC-Q1-001",
    "latitude": 10.7745,
    "longitude": 106.7006,
    "address": "Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "zone_type": "street",
    "area_sqm": 25000,
    "tree_count": 450,
    "vegetation_coverage": null,
    "maintained_by": null,
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "f968b323-e70c-4c08-8f9a-9a18624244ba",
    "created_at": "2025-12-09T07:42:26.551162Z",
    "updated_at": "2025-12-09T07:42:26.551162Z"
  }
]
```

---

### GET /api/open-data/green-zones/nearby

**Public Nearby Green Zones**

Tìm khu vực xanh gần vị trí.

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "latitude": 10.7769,
  "longitude": 106.7009,
  "radius": 5
}
```

#### Error Response (422):

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "query",
        "lat"
      ],
      "msg": "Field required",
      "input": null,
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    },
    {
      "type": "missing",
      "loc": [
        "query",
        "lon"
      ],
      "msg": "Field required",
      "input": null,
      "url": "https://errors.pydantic.dev/2.5/v/missing"
    }
  ]
}
```

---

### GET /api/open-data/green-resources

**Public Green Resources**

Lấy danh sách tài nguyên xanh (năng lượng tái tạo, trung tâm tái chế).

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
[
  {
    "id": "434feb2e-a03d-492a-95f1-2528afb86aa9",
    "name": "Cây xanh Công viên Biển Đông",
    "type": "trees",
    "quantity": 250,
    "available_quantity": 250,
    "unit": "cây",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "species": [
        "phượng",
        "dừa",
        "xanh"
      ],
      "planted_year": 2015
    },
    "zone_id": "4553cbf1-6b86-456e-bc5f-04f01000a998",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  },
  {
    "id": "b5aff842-7e6b-48aa-b9f1-4859a5952063",
    "name": "Ghế công cộng CV 29/3",
    "type": "bench",
    "quantity": 50,
    "available_quantity": 48,
    "unit": "cái",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "material": "gỗ",
      "condition": "good"
    },
    "zone_id": "f0bc81e6-ae86-4a72-926a-3e6c8571f40b",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  },
  {
    "id": "a99979d7-6069-401f-9d80-be98df8b322c",
    "name": "Thùng rác thải phân loại",
    "type": "bin",
    "quantity": 30,
    "available_quantity": 30,
    "unit": "cái",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "types": [
        "recyclable",
        "organic",
        "general"
      ],
      "capacity_liters": 120
    },
    "zone_id": "0fa5e48b-ba2f-44f9-82d7-0060f8fd536a",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  },
  {
    "id": "c5d2a8d7-07c5-4cf0-95b3-d43796a42b59",
    "name": "Đèn LED chiếu sáng",
    "type": "lighting",
    "quantity": 80,
    "available_quantity": 75,
    "unit": "bộ",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "power_watts": 50,
      "solar_powered": true
    },
    "zone_id": "74810265-6891-4b2d-b450-01200d50d057",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  },
  {
    "id": "691925ce-76da-460c-8ca7-67c2874b64b7",
    "name": "Hệ thống tưới tự động",
    "type": "irrigation",
    "quantity": 5,
    "available_quantity": 5,
    "unit": "hệ thống",
    "status": "available",
    "expiry_date": null,
    "is_public": true,
    "data_uri": null,
    "meta_data": {
      "coverage_sqm": 10000,
      "water_source": "recycled"
    },
    "zone_id": "4553cbf1-6b86-456e-bc5f-04f01000a998",
    "created_at": "2025-12-09T07:42:26.207896+00:00",
    "updated_at": "2025-12-09T07:42:26.207896+00:00"
  }
]
```

---

### GET /api/open-data/centers

**Public Centers**

Lấy danh sách trung tâm tái chế công khai.

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "skip": 0,
  "limit": 10
}
```

#### Response (200 OK):

```json
[]
```

---

### GET /api/open-data/centers/nearby

**Public Nearby Centers**

Tìm trung tâm tái chế gần vị trí.

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "latitude": 10.7769,
  "longitude": 106.7009,
  "radius_km": 10
}
```

#### Response (200 OK):

```json
[]
```

---

### GET /api/open-data/catalog

**Get Data Catalog**

Lấy danh mục dữ liệu mở.

🌐 **Public Endpoint**

#### Request:

#### Response (200 OK):

```json
{
  "datasets": [
    {
      "id": "air-quality",
      "title": "Air Quality Data",
      "category": "environment",
      "formats": [
        "json",
        "csv",
        "geojson"
      ],
      "api_endpoint": "/api/open-data/air-quality"
    },
    {
      "id": "weather",
      "title": "Weather Data",
      "category": "environment",
      "formats": [
        "json"
      ],
      "api_endpoint": "/api/open-data/weather/current"
    }
  ]
}
```

---

### GET /api/open-data/export/air-quality

**Export Air Quality**

Xuất dữ liệu AQI (placeholder endpoint).

🌐 **Public Endpoint**

#### Request:

**Query Parameters:**

```json
{
  "format": "json"
}
```

#### Response (200 OK):

```json
{
  "message": "Export feature coming soon",
  "format": "json",
  "service": "export-service"
}
```

---

## AI Tasks

### POST /api/v1/tasks/ai/clustering

**Queue Clustering Task**

Tạo tác vụ phân cụm AI.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Body:**

```json
{
  "data_type": "environment",
  "n_clusters": 3,
  "method": "kmeans"
}
```

#### Response (200 OK):

```json
{
  "status": "failed",
  "error": "RabbitMQ not available"
}
```

---

### POST /api/v1/tasks/ai/prediction

**Queue Prediction Task**

Tạo tác vụ dự đoán AI (ví dụ: dự báo AQI).

🔐 **Authentication Required:** Bearer Token

#### Request:

**Body:**

```json
{
  "prediction_type": "air_quality",
  "location_id": "location_uuid"
}
```

#### Response (200 OK):

```json
{
  "status": "failed",
  "error": "RabbitMQ not available"
}
```

---

### POST /api/v1/tasks/ai/correlation

**Queue Correlation Task**

Tạo tác vụ phân tích tương quan AI.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Body:**

```json
{
  "analysis_type": "pearson"
}
```

#### Response (200 OK):

```json
{
  "status": "failed",
  "error": "RabbitMQ not available"
}
```

---

### POST /api/v1/tasks/export

**Queue Export Task**

Tạo tác vụ xuất dữ liệu.

🔐 **Authentication Required:** Bearer Token

#### Request:

**Body:**

```json
{
  "data_type": "schools",
  "format": "csv"
}
```

#### Response (200 OK):

```json
{
  "status": "failed",
  "error": "RabbitMQ not available"
}
```

---

## System

### GET /health

**Health Check**

Kiểm tra trạng thái API Gateway và các services.

🌐 **Public Endpoint**

#### Request:

#### Response (200 OK):

```json
{
  "status": "healthy",
  "gateway": "healthy",
  "services": {
    "environment": "healthy",
    "auth": "healthy",
    "education": "healthy",
    "resource": "healthy"
  },
  "messaging": {
    "rabbitmq": "disconnected"
  }
}
```

---

