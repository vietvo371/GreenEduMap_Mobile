/**
 * Test API và Generate Documentation trong React Native App
 * Capture real responses để tạo documentation
 */

import api from './Api';
import { environmentService } from '../services/environmentService';
import { schoolService } from '../services/schoolService';
import { greenResourceService } from '../services/greenResourceService';
import { healthService } from '../services/healthService';
import { authService } from '../services/authService';

interface ApiTest {
  endpoint: string;
  method: string;
  title: string;
  description: string;
  request?: {
    body?: any;
    params?: any;
  };
  response?: {
    status: number;
    data: any;
  };
  error?: any;
  requiresAuth: boolean;
}

const allTests: ApiTest[] = [];

/**
 * Helper to format test result as markdown
 */
function formatAsMarkdown(test: ApiTest): string {
  let md = `### ${test.method} ${test.endpoint}\n\n`;
  md += `**${test.title}**\n\n`;
  md += `${test.description}\n\n`;
  
  if (test.requiresAuth) {
    md += `🔐 **Authentication Required**\n\n`;
  } else {
    md += `🌐 **Public Endpoint**\n\n`;
  }

  // Request
  if (test.request) {
    md += `#### Request:\n\n`;
    
    if (test.request.params) {
      md += `**Query Parameters:**\n\n\`\`\`json\n${JSON.stringify(test.request.params, null, 2)}\n\`\`\`\n\n`;
    }
    
    if (test.request.body) {
      md += `**Body:**\n\n\`\`\`json\n${JSON.stringify(test.request.body, null, 2)}\n\`\`\`\n\n`;
    }
  }

  // Response
  if (test.response) {
    md += `#### Response (${test.response.status}):\n\n`;
    md += `\`\`\`json\n${JSON.stringify(test.response.data, null, 2)}\n\`\`\`\n\n`;
  } else if (test.error) {
    md += `#### Error:\n\n\`\`\`json\n${JSON.stringify(test.error, null, 2)}\n\`\`\`\n\n`;
  }

  md += `---\n\n`;
  return md;
}

/**
 * Test Health Check
 */
export async function testHealthCheck(): Promise<ApiTest> {
  console.log('\n📝 Testing: Health Check');
  
  const test: ApiTest = {
    endpoint: '/health',
    method: 'GET',
    title: 'Health Check',
    description: 'Kiểm tra trạng thái API Gateway và các services.',
    requiresAuth: false,
  };

  try {
    const data = await healthService.checkHealth();
    test.response = {
      status: 200,
      data,
    };
    console.log('✅ Success:', data);
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Register
 */
export async function testRegister(): Promise<ApiTest> {
  console.log('\n📝 Testing: Register');
  
  const requestBody = {
    username: `testuser_${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'SecurePassword123!',
    full_name: 'Nguyễn Văn Test',
    phone: '+84901234567',
  };

  const test: ApiTest = {
    endpoint: '/api/v1/auth/register',
    method: 'POST',
    title: 'Register',
    description: 'Đăng ký tài khoản người dùng mới.',
    requiresAuth: false,
    request: {
      body: requestBody,
    },
  };

  try {
    const data = await authService.register(requestBody);
    test.response = {
      status: 201,
      data,
    };
    console.log('✅ Success:', { ...data, access_token: '[truncated]' });
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Login
 */
export async function testLogin(email: string = 'user@example.com', password: string = 'SecurePassword123!'): Promise<ApiTest> {
  console.log('\n📝 Testing: Login');
  
  const requestBody = { email, password };

  const test: ApiTest = {
    endpoint: '/api/v1/auth/login',
    method: 'POST',
    title: 'Login',
    description: 'Đăng nhập vào tài khoản.',
    requiresAuth: false,
    request: {
      body: requestBody,
    },
  };

  try {
    const data = await authService.login(email, password);
    test.response = {
      status: 200,
      data: { ...data, access_token: '[truncated]' },
    };
    console.log('✅ Success');
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Public Weather
 */
export async function testPublicWeather(): Promise<ApiTest> {
  console.log('\n📝 Testing: Public Current Weather');
  
  const params = { lat: 10.7769, lon: 106.7009 };

  const test: ApiTest = {
    endpoint: '/api/open-data/weather/current',
    method: 'GET',
    title: 'Public Current Weather',
    description: 'Thời tiết hiện tại công khai.',
    requiresAuth: false,
    request: { params },
  };

  try {
    const data = await environmentService.getPublicCurrentWeather(params.lat, params.lon);
    test.response = {
      status: 200,
      data,
    };
    console.log('✅ Success:', data);
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Weather Forecast
 */
export async function testWeatherForecast(): Promise<ApiTest> {
  console.log('\n📝 Testing: Weather Forecast');
  
  const params = { lat: 10.7769, lon: 106.7009 };

  const test: ApiTest = {
    endpoint: '/api/open-data/weather/forecast',
    method: 'GET',
    title: 'Public Weather Forecast',
    description: 'Dự báo thời tiết 7 ngày.',
    requiresAuth: false,
    request: { params },
  };

  try {
    const data = await environmentService.getPublicWeatherForecast(params.lat, params.lon);
    test.response = {
      status: 200,
      data,
    };
    console.log('✅ Success:', { count: data.length });
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Latest AQI
 */
export async function testLatestAQI(): Promise<ApiTest> {
  console.log('\n📝 Testing: Latest Air Quality');
  
  const params = { limit: 5 };

  const test: ApiTest = {
    endpoint: '/api/v1/air-quality/latest',
    method: 'GET',
    title: 'Get Latest Air Quality',
    description: 'Lấy dữ liệu AQI mới nhất (24 giờ qua).',
    requiresAuth: true,
    request: { params },
  };

  try {
    const data = await environmentService.getLatestAirQuality(params.limit);
    test.response = {
      status: 200,
      data,
    };
    console.log('✅ Success:', { count: data.length });
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Green Courses
 */
export async function testGreenCourses(): Promise<ApiTest> {
  console.log('\n📝 Testing: Green Courses');
  
  const params = { skip: 0, limit: 10 };

  const test: ApiTest = {
    endpoint: '/api/v1/green-courses',
    method: 'GET',
    title: 'Get Green Courses',
    description: 'Lấy danh sách khóa học môi trường.',
    requiresAuth: true,
    request: { params },
  };

  try {
    const data = await schoolService.getGreenCourses(params);
    test.response = {
      status: 200,
      data,
    };
    console.log('✅ Success:', { total: data.total, items: data.data.length });
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Nearby Schools
 */
export async function testNearbySchools(): Promise<ApiTest> {
  console.log('\n📝 Testing: Nearby Schools');
  
  const params = {
    latitude: 10.7769,
    longitude: 106.7009,
    radius: 5,
    limit: 10,
  };

  const test: ApiTest = {
    endpoint: '/api/v1/schools/nearby',
    method: 'GET',
    title: 'Get Nearby Schools',
    description: 'Tìm trường học gần vị trí.',
    requiresAuth: true,
    request: { params },
  };

  try {
    const data = await schoolService.getNearbySchools(params);
    test.response = {
      status: 200,
      data,
    };
    console.log('✅ Success:', { count: data.length });
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Green Zones
 */
export async function testGreenZones(): Promise<ApiTest> {
  console.log('\n📝 Testing: Green Zones');
  
  const params = { skip: 0, limit: 10 };

  const test: ApiTest = {
    endpoint: '/api/open-data/green-zones',
    method: 'GET',
    title: 'Get Green Zones',
    description: 'Lấy danh sách khu vực xanh (công viên, rừng, vườn).',
    requiresAuth: false,
    request: { params },
  };

  try {
    const data = await greenResourceService.getGreenZones(params);
    test.response = {
      status: 200,
      data,
    };
    console.log('✅ Success:', { total: data.total, items: data.data.length });
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Test Data Catalog
 */
export async function testDataCatalog(): Promise<ApiTest> {
  console.log('\n📝 Testing: Data Catalog');
  
  const test: ApiTest = {
    endpoint: '/api/open-data/catalog',
    method: 'GET',
    title: 'Get Data Catalog',
    description: 'Lấy danh mục dữ liệu mở.',
    requiresAuth: false,
  };

  try {
    const data = await greenResourceService.getCatalog();
    test.response = {
      status: 200,
      data,
    };
    console.log('✅ Success:', data);
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

/**
 * Run All Tests
 */
export async function runAllTestsAndGenerateDocs() {
  console.log('\n\n🚀 ===== STARTING API DOCUMENTATION GENERATION =====\n');
  allTests.length = 0; // Clear previous results

  // Test public endpoints first
  console.log('\n📡 Testing Public Endpoints...');
  await testHealthCheck();
  await testPublicWeather();
  await testWeatherForecast();
  await testGreenZones();
  await testDataCatalog();

  // Test authenticated endpoints
  console.log('\n🔐 Testing Authenticated Endpoints...');
  console.log('⚠️  Make sure you are logged in!');
  
  await testLatestAQI();
  await testGreenCourses();
  await testNearbySchools();

  // Generate documentation
  console.log('\n\n📝 ===== GENERATING DOCUMENTATION =====\n');
  
  let fullDoc = `# 📚 GreenEduMap API Documentation\n\n`;
  fullDoc += `**Base URL:** \`https://api.greenedumap.io.vn\`\n\n`;
  fullDoc += `**Generated:** ${new Date().toLocaleString('vi-VN')}\n\n`;
  fullDoc += `---\n\n`;

  // Group by category
  const publicTests = allTests.filter(t => !t.requiresAuth);
  const authTests = allTests.filter(t => t.requiresAuth);

  if (publicTests.length > 0) {
    fullDoc += `## 🌐 Public Endpoints\n\n`;
    publicTests.forEach(test => {
      fullDoc += formatAsMarkdown(test);
    });
  }

  if (authTests.length > 0) {
    fullDoc += `## 🔐 Authenticated Endpoints\n\n`;
    authTests.forEach(test => {
      fullDoc += formatAsMarkdown(test);
    });
  }

  // Summary
  const successCount = allTests.filter(t => t.response).length;
  const errorCount = allTests.filter(t => t.error).length;
  
  console.log('\n📊 ===== SUMMARY =====');
  console.log(`Total Tests: ${allTests.length}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Failed Tests:');
    allTests.filter(t => t.error).forEach(t => {
      console.log(`   - ${t.method} ${t.endpoint}`);
    });
  }

  console.log('\n\n📄 ===== DOCUMENTATION (Copy này) =====\n');
  console.log(fullDoc);
  console.log('\n===== END OF DOCUMENTATION =====\n');

  return {
    documentation: fullDoc,
    tests: allTests,
    summary: {
      total: allTests.length,
      success: successCount,
      errors: errorCount,
    },
  };
}

/**
 * Get all test results
 */
export function getAllTests() {
  return allTests;
}

/**
 * Export individual tests
 */
export const apiDocTests = {
  testHealthCheck,
  testRegister,
  testLogin,
  testPublicWeather,
  testWeatherForecast,
  testLatestAQI,
  testGreenCourses,
  testNearbySchools,
  testGreenZones,
  testDataCatalog,
  runAllTestsAndGenerateDocs,
  getAllTests,
};


