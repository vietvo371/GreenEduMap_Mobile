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
 * Test Authentication Endpoints
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

    // Save tokens
    if (response.data.access_token) {
      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
      
      // Set default auth header
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
      email: 'user@example.com',
      password: 'SecurePassword123!',
    },
  };

  try {
    const response = await api.post('/api/v1/auth/login', result.requestBody);
    result.response = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };

    // Save tokens
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

/**
 * Test Environment Endpoints
 */
async function testLatestAirQuality(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/air-quality/latest',
    method: 'GET',
    title: 'Get Latest Air Quality',
    description: 'Lấy dữ liệu AQI mới nhất (24 giờ qua).',
    requiresAuth: true,
    requestParams: { limit: 5 },
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
 * Test Education Endpoints
 */
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
      radius: 5,
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

/**
 * Test Green Resources Endpoints
 */
async function testGreenZones(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/open-data/green-zones',
    method: 'GET',
    title: 'Get Green Zones',
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
    const response = await api.get('/api/open-data/catalog');
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

async function testHealthCheck(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/health',
    method: 'GET',
    title: 'Health Check',
    description: 'Kiểm tra trạng thái API Gateway và các services.',
    requiresAuth: false,
  };

  try {
    const response = await api.get('/health');
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
- [Environment Data](#environment-data)
- [Education Data](#education-data)
- [Green Resources](#green-resources)
- [System](#system)

---

`;

  // Group by category
  const categories = {
    'Authentication': testResults.filter(r => r.endpoint.includes('/auth')),
    'Environment Data': testResults.filter(r => 
      r.endpoint.includes('/air-quality') || 
      r.endpoint.includes('/weather')
    ),
    'Education Data': testResults.filter(r => 
      r.endpoint.includes('/schools') || 
      r.endpoint.includes('/green-courses')
    ),
    'Green Resources': testResults.filter(r => 
      r.endpoint.includes('/green-zones') || 
      r.endpoint.includes('/green-resources') ||
      r.endpoint.includes('/catalog')
    ),
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
    console.log('Testing Health Check...');
    await testHealthCheck();

    // Test Public Endpoints (no auth needed)
    console.log('Testing Public Endpoints...');
    await testPublicCurrentWeather();
    await testWeatherForecast();
    await testGreenZones();
    await testDataCatalog();

    // Try to login/register
    console.log('\nTesting Authentication...');
    const loginResult = await testLogin();
    
    if (loginResult.error) {
      console.log('Login failed, trying register...');
      await testRegister();
    }

    // Test Authenticated Endpoints
    if (accessToken) {
      console.log('\n✅ Authentication successful! Testing authenticated endpoints...\n');
      await testGetCurrentUser();
      await testLatestAirQuality();
      await testGreenCourses();
      await testNearbySchools();
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
