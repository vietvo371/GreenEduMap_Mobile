/**
 * API Documentation Generator
 * Test APIs và generate documentation với real responses
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Base URL
const BASE_URL = 'https://api.greenedumap.io.vn';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Store test results
interface TestResult {
  endpoint: string;
  method: string;
  title: string;
  description: string;
  requestBody?: any;
  requestParams?: any;
  requestHeaders?: any;
  response?: {
    status: number;
    statusText: string;
    data: any;
  };
  error?: any;
  requiresAuth: boolean;
}

const testResults: TestResult[] = [];
let accessToken = '';
let refreshToken = '';

/**
 * ==================== AUTHENTICATION ====================
 */

async function testRegister(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/auth/register',
    method: 'POST',
    title: 'Register',
    description: 'Đăng ký tài khoản người dùng mới.',
    requiresAuth: false,
    requestBody: {
      username: `testuser_${Date.now()}`,
      email: `user${Date.now()}@example.com`,
      password: 'SecurePassword123!',
      full_name: 'Nguyễn Văn A',
      phone: '+84901234567',
    },
  };

  try {
    const response = await api.post('/api/v1/auth/register', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };

    if (response.data.access_token) {
      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testLogin(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/auth/login',
    method: 'POST',
    title: 'Login',
    description: 'Đăng nhập vào tài khoản.',
    requiresAuth: false,
    requestBody: {
      email: 'citizen1@gmail.com',
      password: 'password123',
    },
  };

  try {
    const response = await api.post('/api/v1/auth/login', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };

    if (response.data.access_token) {
      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testRefreshToken(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/auth/refresh',
    method: 'POST',
    title: 'Refresh Token',
    description: 'Làm mới access token sử dụng refresh token.',
    requiresAuth: false,
    requestBody: {
      refresh_token: refreshToken,
    },
  };

  try {
    const response = await api.post('/api/v1/auth/refresh', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };

    if (response.data.access_token) {
      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testValidateToken(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/auth/validate-token',
    method: 'GET',
    title: 'Validate Token',
    description: 'Kiểm tra tính hợp lệ của access token.',
    requiresAuth: true,
    requestHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await api.get('/api/v1/auth/validate-token');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetCurrentUser(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/auth/me',
    method: 'GET',
    title: 'Get Current User',
    description: 'Lấy thông tin người dùng hiện tại.',
    requiresAuth: true,
    requestHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await api.get('/api/v1/auth/me');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testUpdateProfile(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/auth/profile',
    method: 'PATCH',
    title: 'Update Profile',
    description: 'Cập nhật thông tin hồ sơ người dùng.',
    requiresAuth: true,
    requestBody: {
      full_name: 'Nguyễn Văn B',
      phone: '+84909999999',
    },
  };

  try {
    const response = await api.patch('/api/v1/auth/profile', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testListUsers(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/users',
    method: 'GET',
    title: 'List Users (Admin)',
    description: 'Lấy danh sách người dùng (Admin only).',
    requiresAuth: true,
    requestParams: {
      skip: 0,
      limit: 100,
    },
  };

  try {
    const response = await api.get('/api/v1/users', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetUserById(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/users/{user_id}',
    method: 'GET',
    title: 'Get User by ID',
    description: 'Lấy thông tin người dùng theo ID.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/users/1'); // Using ID 1 as example
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testDeleteUser(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/users/{user_id}',
    method: 'DELETE',
    title: 'Delete User (Admin)',
    description: 'Xóa người dùng (Admin only, soft delete).',
    requiresAuth: true,
  };

  try {
    const response = await api.delete('/api/v1/users/999'); // Using non-existent ID to avoid actual deletion
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testCreateApiKey(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/api-keys',
    method: 'POST',
    title: 'Create API Key (Developer)',
    description: 'Tạo API key cho developer (Developer/Admin only).',
    requiresAuth: true,
    requestBody: {
      name: 'Production API Key',
      scopes: 'read',
      rate_limit: 1000,
    },
  };

  try {
    const response = await api.post('/api/v1/api-keys', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testRegisterFcmToken(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/fcm-tokens',
    method: 'POST',
    title: 'Register FCM Token',
    description: 'Đăng ký hoặc cập nhật FCM token cho push notifications.',
    requiresAuth: true,
    requestBody: {
      token: 'fcm_token_from_ios_device_example',
      device_type: 'ios',
      device_name: 'iPhone 14 Pro',
      device_id: 'unique-device-identifier',
    },
  };

  try {
    const response = await api.post('/api/v1/fcm-tokens', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testListFcmTokens(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/fcm-tokens',
    method: 'GET',
    title: 'List FCM Tokens',
    description: 'Lấy danh sách FCM tokens của user hiện tại.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/fcm-tokens');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testDeleteFcmToken(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/fcm-tokens/{fcm_token_id}',
    method: 'DELETE',
    title: 'Delete FCM Token',
    description: 'Vô hiệu hóa FCM token.',
    requiresAuth: true,
  };

  try {
    const response = await api.delete('/api/v1/fcm-tokens/1');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testSendPushNotification(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/notifications/send',
    method: 'POST',
    title: 'Send Push Notification',
    description: 'Gửi push notification đến thiết bị của user (Admin có thể gửi cho user khác).',
    requiresAuth: true,
    requestBody: {
      title: 'Cập nhật mới',
      body: 'Dữ liệu chất lượng không khí mới đã được cập nhật',
      data: {
        type: 'air_quality_update',
        resource_id: 'zone_123',
        action: 'open_map',
      },
      image_url: 'https://example.com/image.jpg',
      sound: 'default',
    },
  };

  try {
    const response = await api.post('/api/v1/notifications/send', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

/**
 * ==================== USER DATA ====================
 */

async function testGetFavorites(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/favorites',
    method: 'GET',
    title: 'Get Favorites',
    description: 'Lấy danh sách địa điểm yêu thích của người dùng.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/user-data/favorites');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testAddFavorite(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/favorites',
    method: 'POST',
    title: 'Add Favorite',
    description: 'Thêm địa điểm vào danh sách yêu thích.',
    requiresAuth: true,
    requestBody: {
      item_type: 'green_zone',
      item_id: 'uuid-of-item',
      item_name: 'Công viên 29/3',
      notes: 'Khu vực yêu thích để chạy bộ buổi sáng',
    },
  };

  try {
    const response = await api.post('/api/v1/user-data/favorites', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testDeleteFavorite(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/favorites/{favorite_id}',
    method: 'DELETE',
    title: 'Delete Favorite',
    description: 'Xóa địa điểm khỏi danh sách yêu thích.',
    requiresAuth: true,
  };

  try {
    const response = await api.delete('/api/v1/user-data/favorites/1');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetContributions(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/contributions',
    method: 'GET',
    title: 'Get Contributions',
    description: 'Lấy danh sách đóng góp của người dùng.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/user-data/contributions');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testSubmitContribution(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/contributions',
    method: 'POST',
    title: 'Submit Contribution',
    description: 'Gửi đóng góp mới (báo cáo, đề xuất, dữ liệu).',
    requiresAuth: true,
    requestBody: {
      contribution_type: 'report',
      title: 'Báo cáo ô nhiễm không khí',
      description: 'Phát hiện khói bụi nhiều tại khu vực này',
      location_name: 'Quận 1, TP.HCM',
      latitude: 10.7769,
      longitude: 106.7009,
      extra_data: {
        severity: 'high',
        photo_urls: [],
      },
    },
  };

  try {
    const response = await api.post('/api/v1/user-data/contributions', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetPublicContributions(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/contributions/public',
    method: 'GET',
    title: 'Get Public Contributions',
    description: 'Lấy danh sách đóng góp công khai đã được duyệt.',
    requiresAuth: false,
  };

  try {
    const response = await api.get('/api/v1/user-data/contributions/public', {
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testReviewContribution(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/contributions/{contribution_id}/review',
    method: 'PATCH',
    title: 'Review Contribution (Admin)',
    description: 'Duyệt hoặc từ chối đóng góp (Chỉ Admin).',
    requiresAuth: true,
    requestBody: {
      status: 'approved',
      admin_notes: 'Đã xác minh thông tin',
      points_earned: 50,
    },
  };

  try {
    const response = await api.patch('/api/v1/user-data/contributions/1/review', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetActivities(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/activities',
    method: 'GET',
    title: 'Get Activities',
    description: 'Lấy lịch sử hoạt động của người dùng.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/user-data/activities');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testLogActivity(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/activities',
    method: 'POST',
    title: 'Log Activity',
    description: 'Ghi lại hoạt động của người dùng (tracking).',
    requiresAuth: true,
    requestBody: {
      activity_type: 'view',
      description: 'Xem thông tin công viên',
      resource_type: 'green_zone',
      resource_id: 'uuid-of-resource',
    },
  };

  try {
    const response = await api.post('/api/v1/user-data/activities', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetSettings(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/settings',
    method: 'GET',
    title: 'Get Settings',
    description: 'Lấy cài đặt cá nhân của người dùng.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/user-data/settings');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testUpdateSettings(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/user-data/settings',
    method: 'PUT',
    title: 'Update Settings',
    description: 'Cập nhật cài đặt cá nhân.',
    requiresAuth: true,
    requestBody: {
      theme: 'dark',
      language: 'vi',
      notifications_enabled: true,
      push_notifications: true,
      default_city: 'TP. Hồ Chí Minh',
      aqi_alert_threshold: 100,
      weather_units: 'metric',
      map_style: 'satellite',
    },
  };

  try {
    const response = await api.put('/api/v1/user-data/settings', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

/**
 * ==================== ENVIRONMENT DATA ====================
 */

async function testGetAirQuality(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/air-quality',
    method: 'GET',
    title: 'Get Air Quality Data',
    description: 'Lấy dữ liệu chất lượng không khí với phân trang.',
    requiresAuth: true,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/air-quality', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testLatestAirQuality(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/air-quality/latest',
    method: 'GET',
    title: 'Get Latest Air Quality',
    description: 'Lấy dữ liệu AQI mới nhất (24 giờ qua).',
    requiresAuth: true,
    requestParams: { limit: 10 },
  };

  try {
    const response = await api.get('/api/v1/air-quality/latest', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetAirQualityById(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/air-quality/1',
    method: 'GET',
    title: 'Get Air Quality by ID',
    description: 'Lấy bản ghi chất lượng không khí theo ID.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/air-quality/1');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetWeatherData(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/weather',
    method: 'GET',
    title: 'Get Weather Data',
    description: 'Lấy dữ liệu thời tiết với phân trang.',
    requiresAuth: true,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/weather', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetAirQualityByLocation(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/air-quality/location',
    method: 'GET',
    title: 'Get Air Quality by Location',
    description: 'Tìm dữ liệu AQI gần vị trí.',
    requiresAuth: true,
    requestParams: {
      lat: 10.7769,
      lon: 106.7009,
      radius: 50,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/air-quality/location', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetAirQualityHistory(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/air-quality/history',
    method: 'GET',
    title: 'Get Air Quality History',
    description: 'Lấy dữ liệu AQI lịch sử cho một vị trí.',
    requiresAuth: true,
    requestParams: {
      lat: 10.7769,
      lon: 106.7009,
      days: 7,
      radius: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/air-quality/history', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testFetchAirQualityData(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/air-quality/fetch',
    method: 'POST',
    title: 'Fetch Air Quality Data (Admin)',
    description: 'Kích hoạt fetch dữ liệu từ OpenAQ API (Admin only).',
    requiresAuth: true,
    requestParams: {
      lat: 10.7769,
      lon: 106.7009,
      radius: 50,
    },
  };

  try {
    const response = await api.post('/api/v1/air-quality/fetch', null, {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetCurrentWeather(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/weather/current',
    method: 'GET',
    title: 'Get Current Weather',
    description: 'Lấy dữ liệu thời tiết hiện tại theo toạ độ.',
    requiresAuth: true,
    requestParams: {
      lat: 10.7769,
      lon: 106.7009,
      fetch_new: true,
    },
  };

  try {
    const response = await api.get('/api/v1/weather/current', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetWeatherByLocation(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/weather/location',
    method: 'GET',
    title: 'Get Weather by Location',
    description: 'Lấy dữ liệu thời tiết gần vị trí.',
    requiresAuth: true,
    requestParams: {
      lat: 10.7769,
      lon: 106.7009,
      radius: 50,
      hours: 24,
    },
  };

  try {
    const response = await api.get('/api/v1/weather/location', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

/**
 * ==================== EDUCATION DATA ====================
 */

async function testGetSchools(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/schools',
    method: 'GET',
    title: 'Get Schools',
    description: 'Lấy danh sách trường học với phân trang.',
    requiresAuth: true,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/schools', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testNearbySchools(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/schools/nearby',
    method: 'GET',
    title: 'Get Nearby Schools',
    description: 'Tìm trường học gần vị trí.',
    requiresAuth: true,
    requestParams: {
      latitude: 10.7769,
      longitude: 106.7009,
      radius_km: 5,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/schools/nearby', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetSchoolById(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/schools/1',
    method: 'GET',
    title: 'Get School by ID',
    description: 'Lấy thông tin chi tiết trường học.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/schools/1');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGreenCourses(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/green-courses',
    method: 'GET',
    title: 'Get Green Courses',
    description: 'Lấy danh sách khóa học môi trường.',
    requiresAuth: true,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/green-courses', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

/**
 * ==================== GREEN RESOURCES ====================
 */

async function testGetGreenZones(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/green-zones',
    method: 'GET',
    title: 'Get Green Zones (Auth)',
    description: 'Lấy danh sách khu vực xanh (authenticated endpoint).',
    requiresAuth: true,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/green-zones', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetGreenZoneById(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/green-zones/1',
    method: 'GET',
    title: 'Get Green Zone by ID',
    description: 'Lấy thông tin chi tiết khu vực xanh theo ID.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/green-zones/1');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetGreenResources(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/green-resources',
    method: 'GET',
    title: 'Get Green Resources (Auth)',
    description: 'Lấy danh sách tài nguyên xanh (authenticated endpoint).',
    requiresAuth: true,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/green-resources', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetGreenResourceById(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/green-resources/1',
    method: 'GET',
    title: 'Get Green Resource by ID',
    description: 'Lấy thông tin chi tiết tài nguyên xanh theo ID.',
    requiresAuth: true,
  };

  try {
    const response = await api.get('/api/v1/green-resources/1');
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testGetRecyclingCenters(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/centers',
    method: 'GET',
    title: 'Get Recycling Centers (Auth)',
    description: 'Lấy danh sách trung tâm tái chế (authenticated endpoint).',
    requiresAuth: true,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/v1/centers', {
      params: result.requestParams,
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

/**
 * ==================== PUBLIC ENDPOINTS ====================
 */

async function testPublicAirQuality(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/air-quality',
    method: 'GET',
    title: 'Public Air Quality',
    description: 'Dữ liệu AQI công khai (không cần xác thực).',
    requiresAuth: false,
    requestParams: {
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/open-data/air-quality', {
      params: result.requestParams,
      headers: { Authorization: '' }, // Remove auth
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testPublicAirQualityByLocation(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/air-quality/location',
    method: 'GET',
    title: 'Public Air Quality by Location',
    description: 'Lấy dữ liệu AQI gần vị trí cụ thể.',
    requiresAuth: false,
    requestParams: {
      lat: 10.7769,
      lon: 106.7009,
      radius: 50,
    },
  };

  try {
    const response = await api.get('/api/open-data/air-quality/location', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testPublicCurrentWeather(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/weather/current',
    method: 'GET',
    title: 'Public Current Weather',
    description: 'Thời tiết hiện tại công khai.',
    requiresAuth: false,
    requestParams: {
      lat: 10.7769,
      lon: 106.7009,
    },
  };

  try {
    const response = await api.get('/api/open-data/weather/current', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testWeatherForecast(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/weather/forecast',
    method: 'GET',
    title: 'Public Weather Forecast',
    description: 'Dự báo thời tiết 7 ngày.',
    requiresAuth: false,
    requestParams: {
      lat: 10.7769,
      lon: 106.7009,
    },
  };

  try {
    const response = await api.get('/api/open-data/weather/forecast', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testPublicGreenZones(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/green-zones',
    method: 'GET',
    title: 'Public Green Zones',
    description: 'Lấy danh sách khu vực xanh (công viên, rừng, vườn).',
    requiresAuth: false,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/open-data/green-zones', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testPublicNearbyGreenZones(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/green-zones/nearby',
    method: 'GET',
    title: 'Public Nearby Green Zones',
    description: 'Tìm khu vực xanh gần vị trí.',
    requiresAuth: false,
    requestParams: {
      latitude: 10.7769,
      longitude: 106.7009,
      radius: 5,
    },
  };

  try {
    const response = await api.get('/api/open-data/green-zones/nearby', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testPublicGreenResources(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/green-resources',
    method: 'GET',
    title: 'Public Green Resources',
    description: 'Lấy danh sách tài nguyên xanh (năng lượng tái tạo, trung tâm tái chế).',
    requiresAuth: false,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/open-data/green-resources', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testPublicCenters(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/centers',
    method: 'GET',
    title: 'Public Centers',
    description: 'Lấy danh sách trung tâm tái chế công khai.',
    requiresAuth: false,
    requestParams: {
      skip: 0,
      limit: 10,
    },
  };

  try {
    const response = await api.get('/api/open-data/centers', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testPublicNearbyCenters(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/centers/nearby',
    method: 'GET',
    title: 'Public Nearby Centers',
    description: 'Tìm trung tâm tái chế gần vị trí.',
    requiresAuth: false,
    requestParams: {
      latitude: 10.7769,
      longitude: 106.7009,
      radius_km: 10,
    },
  };

  try {
    const response = await api.get('/api/open-data/centers/nearby', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testDataCatalog(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/catalog',
    method: 'GET',
    title: 'Get Data Catalog',
    description: 'Lấy danh mục dữ liệu mở.',
    requiresAuth: false,
  };

  try {
    const response = await api.get('/api/open-data/catalog', {
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testExportAirQuality(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/export/air-quality',
    method: 'GET',
    title: 'Export Air Quality',
    description: 'Xuất dữ liệu AQI (placeholder endpoint).',
    requiresAuth: false,
    requestParams: {
      format: 'json',
    },
  };

  try {
    const response = await api.get('/api/open-data/export/air-quality', {
      params: result.requestParams,
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

/**
 * ==================== AI TASKS ====================
 */

async function testQueueClusteringTask(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/tasks/ai/clustering',
    method: 'POST',
    title: 'Queue Clustering Task',
    description: 'Tạo tác vụ phân cụm AI.',
    requiresAuth: true,
    requestBody: {
      data_type: 'environment',
      n_clusters: 3,
      method: 'kmeans',
    },
  };

  try {
    const response = await api.post('/api/v1/tasks/ai/clustering', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testQueuePredictionTask(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/tasks/ai/prediction',
    method: 'POST',
    title: 'Queue Prediction Task',
    description: 'Tạo tác vụ dự đoán AI (ví dụ: dự báo AQI).',
    requiresAuth: true,
    requestBody: {
      prediction_type: 'air_quality',
      location_id: 'location_uuid',
    },
  };

  try {
    const response = await api.post('/api/v1/tasks/ai/prediction', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testQueueCorrelationTask(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/tasks/ai/correlation',
    method: 'POST',
    title: 'Queue Correlation Task',
    description: 'Tạo tác vụ phân tích tương quan AI.',
    requiresAuth: true,
    requestBody: {
      analysis_type: 'pearson',
    },
  };

  try {
    const response = await api.post('/api/v1/tasks/ai/correlation', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

async function testQueueExportTask(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/tasks/export',
    method: 'POST',
    title: 'Queue Export Task',
    description: 'Tạo tác vụ xuất dữ liệu.',
    requiresAuth: true,
    requestBody: {
      data_type: 'schools',
      format: 'csv',
    },
  };

  try {
    const response = await api.post('/api/v1/tasks/export', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

/**
 * ==================== SYSTEM ====================
 */

async function testHealthCheck(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/health',
    method: 'GET',
    title: 'Health Check',
    description: 'Kiểm tra trạng thái API Gateway và các services.',
    requiresAuth: false,
  };

  try {
    const response = await api.get('/health', {
      headers: { Authorization: '' },
    });
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  } catch (error: any) {
    result.error = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }

  testResults.push(result);
  return result;
}

/**
 * Generate Markdown Documentation
 */
function generateMarkdown(): string {
  let markdown = `# 📚 GreenEduMap API Documentation

**Base URL:** \`${BASE_URL}\`

**Generated:** ${new Date().toLocaleString('vi-VN')}

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

`;

  // Group by category
  const categories = {
    'Authentication': testResults.filter(r => r.endpoint.includes('/auth') || r.endpoint.includes('/users') || r.endpoint.includes('/api-keys')),
    'User Data': testResults.filter(r => r.endpoint.includes('/user-data')),
    'FCM & Notifications': testResults.filter(r => r.endpoint.includes('/fcm-tokens') || r.endpoint.includes('/notifications')),
    'Environment Data': testResults.filter(r =>
      (r.endpoint.includes('/air-quality') || r.endpoint.includes('/weather')) &&
      !r.endpoint.includes('/open-data')
    ),
    'Education Data': testResults.filter(r =>
      r.endpoint.includes('/schools') ||
      r.endpoint.includes('/green-courses')
    ),
    'Green Resources': testResults.filter(r =>
      (r.endpoint.includes('/green-zones') ||
        r.endpoint.includes('/green-resources') ||
        r.endpoint.includes('/centers')) &&
      !r.endpoint.includes('/open-data')
    ),
    'Public Endpoints': testResults.filter(r =>
      r.endpoint.includes('/open-data') ||
      (r.endpoint.includes('/catalog') && !r.requiresAuth)
    ),
    'AI Tasks': testResults.filter(r => r.endpoint.includes('/tasks')),
    'System': testResults.filter(r => r.endpoint.includes('/health')),
  };

  Object.entries(categories).forEach(([category, results]) => {
    if (results.length === 0) return;

    markdown += `## ${category}\n\n`;

    results.forEach(result => {
      markdown += `### ${result.method} ${result.endpoint}\n\n`;
      markdown += `**${result.title}**\n\n`;
      markdown += `${result.description}\n\n`;

      // Authentication requirement
      if (result.requiresAuth) {
        markdown += `🔐 **Authentication Required:** Bearer Token\n\n`;
      } else {
        markdown += `🌐 **Public Endpoint**\n\n`;
      }

      // Request
      markdown += `#### Request:\n\n`;

      if (result.requestParams) {
        markdown += `**Query Parameters:**\n\n`;
        markdown += '```json\n';
        markdown += JSON.stringify(result.requestParams, null, 2);
        markdown += '\n```\n\n';
      }

      if (result.requestBody) {
        markdown += `**Body:**\n\n`;
        markdown += '```json\n';
        markdown += JSON.stringify(result.requestBody, null, 2);
        markdown += '\n```\n\n';
      }

      if (result.requestHeaders) {
        markdown += `**Headers:**\n\n`;
        markdown += '```json\n';
        markdown += JSON.stringify(result.requestHeaders, null, 2);
        markdown += '\n```\n\n';
      }

      // Response
      if (result.response) {
        markdown += `#### Response (${result.response.status} ${result.response.statusText}):\n\n`;
        markdown += '```json\n';
        markdown += JSON.stringify(result.response.data, null, 2);
        markdown += '\n```\n\n';
      } else if (result.error) {
        markdown += `#### Error Response (${result.error.status}):\n\n`;
        markdown += '```json\n';
        markdown += JSON.stringify(result.error.data || { message: result.error.message }, null, 2);
        markdown += '\n```\n\n';
      }

      markdown += '---\n\n';
    });
  });

  return markdown;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting API Documentation Generation...\n');
  console.log(`📍 Base URL: ${BASE_URL}\n`);

  try {
    // Test Health Check first
    console.log('✓ Testing Health Check...');
    await testHealthCheck();

    // Test Public Endpoints (no auth needed)
    console.log('✓ Testing Public Endpoints...');
    await testPublicCurrentWeather();
    await testWeatherForecast();
    await testPublicAirQuality();
    await testPublicAirQualityByLocation();
    await testPublicGreenZones();
    await testPublicNearbyGreenZones();
    await testPublicGreenResources();
    await testPublicCenters();
    await testPublicNearbyCenters();
    await testDataCatalog();
    await testExportAirQuality();

    // Try to login
    console.log('\n✓ Testing Authentication...');
    const loginResult = await testLogin();

    if (loginResult.error) {
      console.log('  Login failed, trying register...');
      await testRegister();
    }

    // Test Authenticated Endpoints
    if (accessToken) {
      console.log('\n✅ Authentication successful! Testing authenticated endpoints...\n');

      // Auth endpoints
      console.log('✓ Testing Auth Endpoints...');
      await testValidateToken();
      await testGetCurrentUser();
      // await testUpdateProfile(); // Skip to avoid modifying data
      // await testRefreshToken(); // Skip to avoid invalidating current token

      // User Management
      console.log('✓ Testing User Management Endpoints...');
      await testListUsers();
      await testGetUserById();
      // await testDeleteUser(); // Skip to avoid deleting users

      // API Keys & FCM
      console.log('✓ Testing API Keys & FCM Endpoints...');
      // await testCreateApiKey(); // Skip to avoid creating keys
      await testListFcmTokens();
      // await testRegisterFcmToken(); // Skip to avoid registering tokens
      // await testDeleteFcmToken(); // Skip to avoid deleting tokens
      // await testSendPushNotification(); // Skip to avoid sending notifications

      // User Data
      console.log('✓ Testing User Data Endpoints...');
      await testGetFavorites();
      // await testAddFavorite(); // Skip to avoid modifying data
      // await testDeleteFavorite(); // Skip to avoid modifying data
      await testGetContributions();
      // await testSubmitContribution(); // Skip to avoid creating contributions
      await testGetPublicContributions();
      // await testReviewContribution(); // Skip to avoid modifying data
      await testGetActivities();
      // await testLogActivity(); // Skip to avoid creating activities
      await testGetSettings();
      // await testUpdateSettings(); // Skip to avoid modifying settings

      // Environment Data
      console.log('✓ Testing Environment Data Endpoints...');
      await testGetAirQuality();
      await testLatestAirQuality();
      await testGetAirQualityById();
      await testGetAirQualityByLocation();
      await testGetAirQualityHistory();
      // await testFetchAirQualityData(); // Skip to avoid triggering data fetch
      await testGetWeatherData();
      await testGetCurrentWeather();
      await testGetWeatherByLocation();

      // Education Data
      console.log('✓ Testing Education Data Endpoints...');
      await testGetSchools();
      await testNearbySchools();
      await testGetSchoolById();
      await testGreenCourses();

      // Green Resources
      console.log('✓ Testing Green Resources Endpoints...');
      await testGetGreenZones();
      await testGetGreenZoneById();
      await testGetGreenResources();
      await testGetGreenResourceById();
      await testGetRecyclingCenters();

      // AI Tasks
      console.log('✓ Testing AI Tasks Endpoints...');
      await testQueueClusteringTask();
      await testQueuePredictionTask();
      await testQueueCorrelationTask();
      await testQueueExportTask();
    } else {
      console.log('\n⚠️  No access token. Skipping authenticated endpoints.\n');
    }

    // Generate documentation
    console.log('\n📝 Generating documentation...');
    const markdown = generateMarkdown();

    // Save to file
    const outputDir = path.join(__dirname, '../docs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'API_DOCUMENTATION.md');
    fs.writeFileSync(outputPath, markdown, 'utf-8');

    // Also save raw JSON results
    const jsonPath = path.join(outputDir, 'api-test-results.json');
    fs.writeFileSync(jsonPath, JSON.stringify(testResults, null, 2), 'utf-8');

    // Summary
    console.log('\n✅ Documentation generated successfully!\n');
    console.log(`📄 Markdown: ${outputPath}`);
    console.log(`📄 JSON: ${jsonPath}\n`);

    const successCount = testResults.filter(r => r.response).length;
    const errorCount = testResults.filter(r => r.error).length;

    console.log('📊 Summary:');
    console.log(`   Total Endpoints: ${testResults.length}`);
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}\n`);

    if (errorCount > 0) {
      console.log('⚠️  Errors encountered:');
      testResults
        .filter(r => r.error)
        .forEach(r => {
          console.log(`   - ${r.method} ${r.endpoint}: ${r.error.status || 'Network Error'}`);
        });
    }

  } catch (error) {
    console.error('❌ Error generating documentation:', error);
    process.exit(1);
  }
}

// Run
main();
