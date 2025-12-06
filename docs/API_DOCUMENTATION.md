# 📚 GreenEduMap API Documentation

**Base URL:** `https://api.greenedumap.io.vn`

**Generated:** 14:48:51 6/12/2025

---

## 📖 Table of Contents

- [Authentication](#authentication)
- [Environment Data](#environment-data)
- [Education Data](#education-data)
- [Green Resources](#green-resources)
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
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODg1ZGE1Zi1iNWZlLTQ4ZDQtYmNmOS0yMjQyNmU2ZjRmM2MiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiY2l0aXplbiIsImV4cCI6MTc2NTAwOTEzMCwiaWF0IjoxNzY1MDA3MzMwLCJ0eXBlIjoiYWNjZXNzIn0.RShYcClwCqUmCUI8LjHC0ho0yVaDOOxKJBtHbbtwb7I",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODg1ZGE1Zi1iNWZlLTQ4ZDQtYmNmOS0yMjQyNmU2ZjRmM2MiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiY2l0aXplbiIsImV4cCI6MTc2NTYxMjEzMCwiaWF0IjoxNzY1MDA3MzMwLCJ0eXBlIjoicmVmcmVzaCJ9.v3PNST0EgkYHvgx9Rn1cfyW_1UvSuvJg9WCd5_eK-Jw",
  "token_type": "bearer",
  "expires_in": 1800
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
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODg1ZGE1Zi1iNWZlLTQ4ZDQtYmNmOS0yMjQyNmU2ZjRmM2MiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiY2l0aXplbiIsImV4cCI6MTc2NTAwOTEzMCwiaWF0IjoxNzY1MDA3MzMwLCJ0eXBlIjoiYWNjZXNzIn0.RShYcClwCqUmCUI8LjHC0ho0yVaDOOxKJBtHbbtwb7I"
}
```

#### Response (200 OK):

```json
{
  "email": "user@example.com",
  "username": "testuser",
  "full_name": "Nguyễn Văn B",
  "phone": "+84909999999",
  "id": "6885da5f-b5fe-48d4-bcf9-22426e6f4f3c",
  "role": "citizen",
  "is_active": true,
  "is_verified": false,
  "is_public": false,
  "created_at": "2025-12-05T10:03:10.517465",
  "updated_at": "2025-12-06T07:48:50.474812",
  "last_login": "2025-12-06T07:48:50.474265"
}
```

---

## Environment Data

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
  "id": "2d444b05-6d84-41d1-8106-26081cb01b69",
  "location": {
    "type": "Point",
    "coordinates": [
      106.7009,
      10.7769
    ]
  },
  "city_name": "Ho Chi Minh City",
  "temperature": 30.51,
  "feels_like": 35.01,
  "humidity": 65,
  "pressure": 1010,
  "wind": {
    "speed": 2.57,
    "direction": 360
  },
  "weather": {
    "main": "Clouds",
    "description": "scattered clouds",
    "icon": "03d"
  },
  "observation_time": "2025-12-06T07:48:49.617045",
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
      "dt": 1765011600,
      "main": {
        "temp": 30.55,
        "feels_like": 35.1,
        "temp_min": 29.96,
        "temp_max": 30.55,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 65,
        "temp_kf": 0.59
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
        "all": 40
      },
      "wind": {
        "speed": 2.25,
        "deg": 314,
        "gust": 2.56
      },
      "visibility": 10000,
      "pop": 0.25,
      "rain": {
        "3h": 0.23
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-06 09:00:00"
    },
    {
      "dt": 1765022400,
      "main": {
        "temp": 29.79,
        "feels_like": 34.53,
        "temp_min": 28.27,
        "temp_max": 29.79,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 70,
        "temp_kf": 1.52
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
        "all": 59
      },
      "wind": {
        "speed": 2.92,
        "deg": 190,
        "gust": 4.9
      },
      "visibility": 10000,
      "pop": 0.2,
      "rain": {
        "3h": 0.1
      },
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-06 12:00:00"
    },
    {
      "dt": 1765033200,
      "main": {
        "temp": 26.92,
        "feels_like": 29.56,
        "temp_min": 25.11,
        "temp_max": 26.92,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1012,
        "humidity": 80,
        "temp_kf": 1.81
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
        "all": 52
      },
      "wind": {
        "speed": 1.6,
        "deg": 154,
        "gust": 2.25
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-06 15:00:00"
    },
    {
      "dt": 1765044000,
      "main": {
        "temp": 24.31,
        "feels_like": 25.12,
        "temp_min": 24.31,
        "temp_max": 24.31,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1012,
        "humidity": 89,
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
        "speed": 0.14,
        "deg": 249,
        "gust": 0.82
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-06 18:00:00"
    },
    {
      "dt": 1765054800,
      "main": {
        "temp": 23.18,
        "feels_like": 23.93,
        "temp_min": 23.18,
        "temp_max": 23.18,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 91,
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
        "speed": 1.76,
        "deg": 323,
        "gust": 2.59
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-06 21:00:00"
    },
    {
      "dt": 1765065600,
      "main": {
        "temp": 24.62,
        "feels_like": 25.38,
        "temp_min": 24.62,
        "temp_max": 24.62,
        "pressure": 1013,
        "sea_level": 1013,
        "grnd_level": 1012,
        "humidity": 86,
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
        "all": 94
      },
      "wind": {
        "speed": 1.3,
        "deg": 326,
        "gust": 1.57
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-07 00:00:00"
    },
    {
      "dt": 1765076400,
      "main": {
        "temp": 27.27,
        "feels_like": 29.13,
        "temp_min": 27.27,
        "temp_max": 27.27,
        "pressure": 1014,
        "sea_level": 1014,
        "grnd_level": 1013,
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
        "all": 90
      },
      "wind": {
        "speed": 1.4,
        "deg": 241,
        "gust": 1.33
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-07 03:00:00"
    },
    {
      "dt": 1765087200,
      "main": {
        "temp": 29.76,
        "feels_like": 31.49,
        "temp_min": 29.76,
        "temp_max": 29.76,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1010,
        "humidity": 55,
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
        "all": 88
      },
      "wind": {
        "speed": 1.79,
        "deg": 283,
        "gust": 1.58
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-07 06:00:00"
    },
    {
      "dt": 1765098000,
      "main": {
        "temp": 28.98,
        "feels_like": 31,
        "temp_min": 28.98,
        "temp_max": 28.98,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 60,
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
        "speed": 1.02,
        "deg": 28,
        "gust": 1.09
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-07 09:00:00"
    },
    {
      "dt": 1765108800,
      "main": {
        "temp": 24.8,
        "feels_like": 25.37,
        "temp_min": 24.8,
        "temp_max": 24.8,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
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
        "all": 97
      },
      "wind": {
        "speed": 2.18,
        "deg": 155,
        "gust": 2.81
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-07 12:00:00"
    },
    {
      "dt": 1765119600,
      "main": {
        "temp": 23.48,
        "feels_like": 24.1,
        "temp_min": 23.48,
        "temp_max": 23.48,
        "pressure": 1013,
        "sea_level": 1013,
        "grnd_level": 1012,
        "humidity": 85,
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
        "speed": 1.1,
        "deg": 176,
        "gust": 1.48
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-07 15:00:00"
    },
    {
      "dt": 1765130400,
      "main": {
        "temp": 22.61,
        "feels_like": 23.22,
        "temp_min": 22.61,
        "temp_max": 22.61,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1011,
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
        "all": 100
      },
      "wind": {
        "speed": 1.07,
        "deg": 249,
        "gust": 1.69
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-07 18:00:00"
    },
    {
      "dt": 1765141200,
      "main": {
        "temp": 22.85,
        "feels_like": 23.44,
        "temp_min": 22.85,
        "temp_max": 22.85,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 86,
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
        "speed": 0.78,
        "deg": 274,
        "gust": 1.11
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-07 21:00:00"
    },
    {
      "dt": 1765152000,
      "main": {
        "temp": 22.66,
        "feels_like": 23.12,
        "temp_min": 22.66,
        "temp_max": 22.66,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1012,
        "humidity": 82,
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
        "speed": 1.47,
        "deg": 353,
        "gust": 1.52
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-08 00:00:00"
    },
    {
      "dt": 1765162800,
      "main": {
        "temp": 26.62,
        "feels_like": 26.62,
        "temp_min": 26.62,
        "temp_max": 26.62,
        "pressure": 1013,
        "sea_level": 1013,
        "grnd_level": 1013,
        "humidity": 67,
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
        "all": 99
      },
      "wind": {
        "speed": 2.38,
        "deg": 20,
        "gust": 2.27
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-08 03:00:00"
    },
    {
      "dt": 1765173600,
      "main": {
        "temp": 29.68,
        "feels_like": 31.36,
        "temp_min": 29.68,
        "temp_max": 29.68,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 55,
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
        "speed": 2.3,
        "deg": 7,
        "gust": 2.05
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-08 06:00:00"
    },
    {
      "dt": 1765184400,
      "main": {
        "temp": 29.29,
        "feels_like": 30.45,
        "temp_min": 29.29,
        "temp_max": 29.29,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1008,
        "humidity": 53,
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
        "all": 81
      },
      "wind": {
        "speed": 2.3,
        "deg": 346,
        "gust": 2.36
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-08 09:00:00"
    },
    {
      "dt": 1765195200,
      "main": {
        "temp": 24.83,
        "feels_like": 25.3,
        "temp_min": 24.83,
        "temp_max": 24.83,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 74,
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
        "all": 80
      },
      "wind": {
        "speed": 1.29,
        "deg": 66,
        "gust": 4.53
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-08 12:00:00"
    },
    {
      "dt": 1765206000,
      "main": {
        "temp": 23.34,
        "feels_like": 23.87,
        "temp_min": 23.34,
        "temp_max": 23.34,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1012,
        "humidity": 82,
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
        "speed": 0.88,
        "deg": 97,
        "gust": 1.6
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-08 15:00:00"
    },
    {
      "dt": 1765216800,
      "main": {
        "temp": 22.58,
        "feels_like": 23.06,
        "temp_min": 22.58,
        "temp_max": 22.58,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 83,
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
        "speed": 1.69,
        "deg": 344,
        "gust": 2.3
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-08 18:00:00"
    },
    {
      "dt": 1765227600,
      "main": {
        "temp": 21.56,
        "feels_like": 21.83,
        "temp_min": 21.56,
        "temp_max": 21.56,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 79,
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
        "speed": 2.62,
        "deg": 342,
        "gust": 4.18
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-08 21:00:00"
    },
    {
      "dt": 1765238400,
      "main": {
        "temp": 21.19,
        "feels_like": 21.4,
        "temp_min": 21.19,
        "temp_max": 21.19,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1011,
        "humidity": 78,
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
        "speed": 2.78,
        "deg": 8,
        "gust": 5.22
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-09 00:00:00"
    },
    {
      "dt": 1765249200,
      "main": {
        "temp": 25.83,
        "feels_like": 26.09,
        "temp_min": 25.83,
        "temp_max": 25.83,
        "pressure": 1012,
        "sea_level": 1012,
        "grnd_level": 1012,
        "humidity": 62,
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
        "all": 84
      },
      "wind": {
        "speed": 2.69,
        "deg": 9,
        "gust": 2.35
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-09 03:00:00"
    },
    {
      "dt": 1765260000,
      "main": {
        "temp": 29.04,
        "feels_like": 30.09,
        "temp_min": 29.04,
        "temp_max": 29.04,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 53,
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
        "all": 94
      },
      "wind": {
        "speed": 2.28,
        "deg": 353,
        "gust": 1.72
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-09 06:00:00"
    },
    {
      "dt": 1765270800,
      "main": {
        "temp": 28.71,
        "feels_like": 30.01,
        "temp_min": 28.71,
        "temp_max": 28.71,
        "pressure": 1008,
        "sea_level": 1008,
        "grnd_level": 1008,
        "humidity": 56,
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
        "all": 97
      },
      "wind": {
        "speed": 2.17,
        "deg": 325,
        "gust": 1.96
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-09 09:00:00"
    },
    {
      "dt": 1765281600,
      "main": {
        "temp": 25.33,
        "feels_like": 25.64,
        "temp_min": 25.33,
        "temp_max": 25.33,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 66,
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
        "speed": 0.82,
        "deg": 294,
        "gust": 1.23
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
        "temp": 23.76,
        "feels_like": 23.99,
        "temp_min": 23.76,
        "temp_max": 23.76,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 69,
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
        "speed": 2.25,
        "deg": 301,
        "gust": 3.03
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
        "temp": 22.32,
        "feels_like": 22.54,
        "temp_min": 22.32,
        "temp_max": 22.32,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 74,
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
        "speed": 2.95,
        "deg": 338,
        "gust": 5.5
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
        "temp": 22.11,
        "feels_like": 22.33,
        "temp_min": 22.11,
        "temp_max": 22.11,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1009,
        "humidity": 75,
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
        "speed": 2.94,
        "deg": 335,
        "gust": 5.95
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
        "temp": 22.37,
        "feels_like": 22.73,
        "temp_min": 22.37,
        "temp_max": 22.37,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1010,
        "humidity": 79,
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
        "speed": 3.24,
        "deg": 349,
        "gust": 6.94
      },
      "visibility": 10000,
      "pop": 0,
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-10 00:00:00"
    },
    {
      "dt": 1765335600,
      "main": {
        "temp": 26.4,
        "feels_like": 26.4,
        "temp_min": 26.4,
        "temp_max": 26.4,
        "pressure": 1011,
        "sea_level": 1011,
        "grnd_level": 1011,
        "humidity": 69,
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
        "all": 70
      },
      "wind": {
        "speed": 3.41,
        "deg": 359,
        "gust": 3.87
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
        "temp": 27.3,
        "feels_like": 29.09,
        "temp_min": 27.3,
        "temp_max": 27.3,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1008,
        "humidity": 67,
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
        "all": 86
      },
      "wind": {
        "speed": 0.98,
        "deg": 5,
        "gust": 0.95
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
        "temp": 28.3,
        "feels_like": 30.28,
        "temp_min": 28.3,
        "temp_max": 28.3,
        "pressure": 1008,
        "sea_level": 1008,
        "grnd_level": 1007,
        "humidity": 63,
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
        "speed": 1.14,
        "deg": 151,
        "gust": 1.39
      },
      "visibility": 10000,
      "pop": 0.26,
      "rain": {
        "3h": 0.1
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-10 09:00:00"
    },
    {
      "dt": 1765368000,
      "main": {
        "temp": 25.62,
        "feels_like": 26.2,
        "temp_min": 25.62,
        "temp_max": 25.62,
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
          "icon": "04n"
        }
      ],
      "clouds": {
        "all": 99
      },
      "wind": {
        "speed": 1.57,
        "deg": 172,
        "gust": 2.4
      },
      "visibility": 10000,
      "pop": 0.25,
      "sys": {
        "pod": "n"
      },
      "dt_txt": "2025-12-10 12:00:00"
    },
    {
      "dt": 1765378800,
      "main": {
        "temp": 24.61,
        "feels_like": 25.19,
        "temp_min": 24.61,
        "temp_max": 24.61,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1009,
        "humidity": 79,
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
        "speed": 1.78,
        "deg": 221,
        "gust": 2.41
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
        "temp": 23.82,
        "feels_like": 24.42,
        "temp_min": 23.82,
        "temp_max": 23.82,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1009,
        "humidity": 83,
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
        "speed": 1.69,
        "deg": 260,
        "gust": 2.5
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
        "temp": 23.2,
        "feels_like": 23.9,
        "temp_min": 23.2,
        "temp_max": 23.2,
        "pressure": 1009,
        "sea_level": 1009,
        "grnd_level": 1008,
        "humidity": 89,
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
        "all": 86
      },
      "wind": {
        "speed": 1.27,
        "deg": 306,
        "gust": 1.46
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
        "temp": 24.09,
        "feels_like": 24.8,
        "temp_min": 24.09,
        "temp_max": 24.09,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
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
        "all": 71
      },
      "wind": {
        "speed": 1.32,
        "deg": 8,
        "gust": 1.84
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
        "temp": 29.28,
        "feels_like": 32.21,
        "temp_min": 29.28,
        "temp_max": 29.28,
        "pressure": 1010,
        "sea_level": 1010,
        "grnd_level": 1010,
        "humidity": 64,
        "temp_kf": 0
      },
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "clouds": {
        "all": 10
      },
      "wind": {
        "speed": 1.69,
        "deg": 56,
        "gust": 2.04
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
        "temp": 29.47,
        "feels_like": 32.77,
        "temp_min": 29.47,
        "temp_max": 29.47,
        "pressure": 1008,
        "sea_level": 1008,
        "grnd_level": 1007,
        "humidity": 65,
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
        "all": 33
      },
      "wind": {
        "speed": 3.15,
        "deg": 98,
        "gust": 4.32
      },
      "visibility": 7783,
      "pop": 1,
      "rain": {
        "3h": 1.68
      },
      "sys": {
        "pod": "d"
      },
      "dt_txt": "2025-12-11 06:00:00"
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
    "sunrise": 1764975522,
    "sunset": 1765016995
  }
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
  "limit": 5
}
```

#### Response (200 OK):

```json
{
  "total": 0,
  "data": []
}
```

---

## Education Data

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
    "id": "9c5feeb0-ab6a-4b77-9459-843d4ab43771",
    "school_id": "1045d3f0-236c-4051-88a3-6ff10e40e09f",
    "created_at": "2025-12-05T09:26:01.728317Z",
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
    "id": "b19e7ab9-326d-45cd-ad43-bc4353fdc2da",
    "school_id": "ebb61d16-6e94-4444-9fed-2cb718a45f4c",
    "created_at": "2025-12-05T09:26:01.731282Z",
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
    "id": "a15648ea-a1fb-451f-8f2f-e862422692ba",
    "school_id": "a73cfd1c-3755-447c-aeb5-361bbc57ef49",
    "created_at": "2025-12-05T09:26:01.733032Z",
    "updated_at": null
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
  "radius": 5,
  "limit": 10
}
```

#### Response (200 OK):

```json
[]
```

---

## Green Resources

### GET /api/open-data/green-zones

**Get Green Zones**

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
    "name": "Công viên Tao Đàn",
    "code": "GZ-001",
    "latitude": 10.7758,
    "longitude": 106.6948,
    "address": "55B Nguyễn Thị Minh Khai, Q.1, TP.HCM",
    "zone_type": "park",
    "area_sqm": 100000,
    "tree_count": 500,
    "vegetation_coverage": 75.5,
    "maintained_by": "Sở Xây dựng TP.HCM",
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "78d3f816-29cb-46ef-95ad-3df562307f27",
    "created_at": "2025-12-05T09:26:01.505232Z",
    "updated_at": "2025-12-05T09:26:01.505232Z"
  },
  {
    "name": "Vườn Bách Thảo",
    "code": "GZ-002",
    "latitude": 10.7685,
    "longitude": 106.7019,
    "address": "1 Nguyễn Bỉnh Khiêm, Q.1, TP.HCM",
    "zone_type": "garden",
    "area_sqm": 50000,
    "tree_count": 200,
    "vegetation_coverage": 60,
    "maintained_by": "Sở Nông nghiệp",
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "14289584-ee52-45c0-b149-81b70ec4265a",
    "created_at": "2025-12-05T09:26:01.505232Z",
    "updated_at": "2025-12-05T09:26:01.505232Z"
  },
  {
    "name": "Công viên 23/9",
    "code": "GZ-003",
    "latitude": 10.7712,
    "longitude": 106.6931,
    "address": "Phạm Ngũ Lão, Q.1, TP.HCM",
    "zone_type": "park",
    "area_sqm": 80000,
    "tree_count": 350,
    "vegetation_coverage": 65,
    "maintained_by": "UBND Quận 1",
    "phone": null,
    "is_public": true,
    "data_uri": null,
    "facilities": null,
    "meta_data": null,
    "id": "dd072829-f747-4cba-8605-d903d96b286c",
    "created_at": "2025-12-05T09:26:01.505232Z",
    "updated_at": "2025-12-05T09:26:01.505232Z"
  }
]
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
    "rabbitmq": "connected"
  }
}
```

---

