# 📚 Hướng dẫn Generate API Documentation với Real Responses

## 🎯 2 Cách để Generate Documentation

---

## 🚀 CÁCH 1: Dùng Node.js Script (Recommended - Nhanh nhất)

### ✨ Ưu điểm:
- ✅ Chạy ngoài app
- ✅ Không cần build React Native
- ✅ Tự động test tất cả endpoints
- ✅ Generate file markdown đẹp
- ✅ Nhanh (<1 phút)

### 📝 Các bước:

#### 1. Install dependencies
```bash
cd scripts
npm install
```

#### 2. Run script
```bash
npm run generate-docs
```

Hoặc:
```bash
ts-node generateApiDocs.ts
```

#### 3. Check results
```bash
# Documentation file
cat ../docs/API_DOCUMENTATION.md

# Raw JSON results
cat ../docs/api-test-results.json
```

### 📊 Output:

```
🚀 Starting API Documentation Generation...

📍 Base URL: https://api.greenedumap.io.vn

Testing Health Check...
✅ Success

Testing Public Endpoints...
✅ Public Weather
✅ Weather Forecast  
✅ Green Zones
✅ Data Catalog

Testing Authentication...
✅ Login successful

✅ Authentication successful! Testing authenticated endpoints...
✅ Latest AQI
✅ Green Courses
✅ Nearby Schools

📝 Generating documentation...

✅ Documentation generated successfully!

📄 Markdown: /docs/API_DOCUMENTATION.md
📄 JSON: /docs/api-test-results.json

📊 Summary:
   Total Endpoints: 10
   ✅ Success: 10
   ❌ Errors: 0
```

---

## 🚀 CÁCH 2: Trong React Native App

### ✨ Ưu điểm:
- ✅ Test ngay trong app
- ✅ Sử dụng existing auth tokens
- ✅ Dùng services đã có
- ✅ Copy documentation từ console

### 📝 Các bước:

#### 1. Thêm vào screen bất kỳ (ví dụ ProfileScreen)

```typescript
import { runAllTestsAndGenerateDocs } from '../utils/testAndGenerateDocs';
import { Alert } from 'react-native';

// Trong component:
const handleGenerateDocs = async () => {
  console.log('Starting API documentation generation...');
  
  const result = await runAllTestsAndGenerateDocs();
  
  Alert.alert(
    'Hoàn tất!',
    `Generated docs for ${result.summary.total} endpoints.\nSuccess: ${result.summary.success}\nErrors: ${result.summary.errors}\n\nCheck Metro console for full documentation.`,
  );
};

// Thêm button:
<TouchableOpacity onPress={handleGenerateDocs}>
  <Text>📚 Generate API Docs</Text>
</TouchableOpacity>
```

#### 2. Run app và tap button

```bash
npx react-native run-ios
```

#### 3. Xem console và copy documentation

Metro console sẽ show:

```
🚀 ===== STARTING API DOCUMENTATION GENERATION =====

📡 Testing Public Endpoints...

📝 Testing: Health Check
✅ Success: { status: "healthy" }

📝 Testing: Public Current Weather
✅ Success: { temperature: 28, ... }

...

📄 ===== DOCUMENTATION (Copy này) =====

# 📚 GreenEduMap API Documentation

**Base URL:** `https://api.greenedumap.io.vn`

...

===== END OF DOCUMENTATION =====
```

#### 4. Copy và save

- Select toàn bộ text từ "# 📚 GreenEduMap..." đến "===== END..."
- Paste vào file `docs/API_DOCUMENTATION.md`

---

## 📋 Format Documentation như Hình Mẫu

Generated documentation sẽ có format:

```markdown
### POST /auth/register

**Register**

Đăng ký tài khoản người dùng mới.

🌐 **Public Endpoint**

#### Request:

**Body:**

\`\`\`json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "Nguyễn Văn A",
  "phone": "+84901234567"
}
\`\`\`

#### Response (201 Created):

\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "created_at": "2025-12-05T12:00:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
\`\`\`

---
```

**Giống hệt format trong hình!** ✨

---

## 🔧 Customize Tests

### Thêm endpoint mới:

**Trong `scripts/generateApiDocs.ts`:**

```typescript
async function testYourEndpoint(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/your-endpoint',
    method: 'GET',
    title: 'Your Endpoint',
    description: 'Mô tả endpoint của bạn',
    requiresAuth: true,
    requestParams: { param1: 'value1' },
  };

  try {
    const response = await api.get('/api/v1/your-endpoint', {
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

// Add to main():
await testYourEndpoint();
```

**Trong React Native app:**

```typescript
// src/utils/testAndGenerateDocs.ts
export async function testYourEndpoint(): Promise<ApiTest> {
  console.log('\n📝 Testing: Your Endpoint');
  
  const test: ApiTest = {
    endpoint: '/api/v1/your-endpoint',
    method: 'GET',
    title: 'Your Endpoint',
    description: 'Mô tả endpoint',
    requiresAuth: true,
  };

  try {
    const data = await yourService.yourMethod();
    test.response = { status: 200, data };
    console.log('✅ Success:', data);
  } catch (error: any) {
    test.error = {
      message: error.message,
      status: error.response?.status,
    };
    console.log('❌ Error:', test.error);
  }

  allTests.push(test);
  return test;
}

// Add to runAllTestsAndGenerateDocs():
await testYourEndpoint();
```

---

## 📊 So sánh 2 Cách

| Feature | Node.js Script | React Native App |
|---------|----------------|------------------|
| **Tốc độ** | ⚡⚡⚡ Rất nhanh | ⚡⚡ Trung bình |
| **Setup** | Cần install npm packages | Không cần setup thêm |
| **Auto generate file** | ✅ Yes | ❌ No (phải copy manual) |
| **Sử dụng auth** | Tạo account mới | ✅ Dùng existing login |
| **Test độc lập** | ✅ Yes | ❌ Phụ thuộc app |
| **Best for** | CI/CD, automation | Quick testing |

---

## ✅ Checklist

### Sau khi generate:

- [ ] Check tất cả endpoints đã test
- [ ] Verify responses match expected format
- [ ] Check authentication endpoints work
- [ ] Verify public endpoints không cần token
- [ ] Test với nhiều scenarios (success/error)
- [ ] Review documentation format
- [ ] Save to `docs/API_DOCUMENTATION.md`
- [ ] Commit to git repo

---

## 🎯 Kết quả Cuối Cùng

Bạn sẽ có file `docs/API_DOCUMENTATION.md` với:

✅ **Full documentation** cho tất cả endpoints
✅ **Real requests** từ actual API calls
✅ **Real responses** từ server
✅ **Format đẹp** giống hình mẫu
✅ **Easy to read** và maintain

**Example structure:**

```
docs/
├── API_DOCUMENTATION.md          # Full documentation
├── api-test-results.json         # Raw JSON results
└── responses/                    # Individual response files
    ├── register.json
    ├── login.json
    ├── weather.json
    └── ...
```

---

## 🚀 Quick Start

### Cách nhanh nhất (30 giây):

```bash
# 1. Install
cd scripts && npm install

# 2. Run
npm run generate-docs

# 3. Check
cat ../docs/API_DOCUMENTATION.md
```

**Done! 🎉**

---

## 💡 Tips

### 1. Run định kỳ
Generate docs mỗi khi API thay đổi:
```bash
npm run generate-docs
```

### 2. Version docs
```bash
cp docs/API_DOCUMENTATION.md docs/API_DOCUMENTATION_v1.0.md
```

### 3. Test nhiều scenarios
- Test với user mới (register)
- Test với user existing (login)
- Test với invalid data (error cases)

### 4. Auto-generate trong CI/CD
```yaml
# .github/workflows/docs.yml
- name: Generate API Docs
  run: |
    cd scripts
    npm install
    npm run generate-docs
    git add docs/
    git commit -m "Update API documentation"
```

---

**Ready to generate! 🚀**

Choose your method:
- **Fast & Automated:** Use Node.js script
- **Quick & Simple:** Use React Native app

Both work great! ✨
