# 📚 Hướng dẫn Generate API Documentation

## 🎯 Mục đích

Script này sẽ:
1. ✅ **Test tất cả API endpoints**
2. ✅ **Capture real responses**
3. ✅ **Generate documentation đẹp** với format như hình mẫu
4. ✅ **Save JSON results** để analyze sau

---

## 🚀 Cách sử dụng

### Phương pháp 1: Run script trực tiếp (Recommended)

#### Bước 1: Install dependencies

```bash
cd scripts
npm install
```

Dependencies cần thiết:
- `axios` - HTTP client
- `ts-node` - Run TypeScript directly
- `typescript` - TypeScript compiler

#### Bước 2: Run script

```bash
npm run generate-docs
```

Hoặc:

```bash
ts-node generateApiDocs.ts
```

#### Bước 3: Check results

Script sẽ tạo 2 files trong folder `docs/`:

1. **API_DOCUMENTATION.md** - Full documentation với request & response
2. **api-test-results.json** - Raw JSON data

---

## 📊 Output Example

### Console Output:

```
🚀 Starting API Documentation Generation...

📍 Base URL: https://api.greenedumap.io.vn

Testing Health Check...
Testing Public Endpoints...
Testing Public Current Weather...
Testing Weather Forecast...
Testing Green Zones...
Testing Data Catalog...

Testing Authentication...
Login failed, trying register...

✅ Authentication successful! Testing authenticated endpoints...

Testing Get Current User...
Testing Latest Air Quality...
Testing Green Courses...
Testing Nearby Schools...

📝 Generating documentation...

✅ Documentation generated successfully!

📄 Markdown: /docs/API_DOCUMENTATION.md
📄 JSON: /docs/api-test-results.json

📊 Summary:
   Total Endpoints: 10
   ✅ Success: 8
   ❌ Errors: 2

⚠️  Errors encountered:
   - POST /api/v1/auth/login: 401
```

### Generated Markdown Format:

```markdown
# 📚 GreenEduMap API Documentation

**Base URL:** `https://api.greenedumap.io.vn`

**Generated:** 06/01/2025 10:30:00

---

## Authentication

### POST /api/v1/auth/register

**Register**

Đăng ký tài khoản người dùng mới.

🌐 **Public Endpoint**

#### Request:

**Body:**

```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "Nguyễn Văn A",
  "phone": "+84901234567"
}
```

#### Response (201 Created):

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "created_at": "2025-01-06T10:30:00Z"
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

---

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
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A"
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
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
  "id": 1,
  "city": "Ho Chi Minh City",
  "location": "District 1",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "temperature": 28.5,
  "feels_like": 30.2,
  "humidity": 65,
  "pressure": 1013,
  "wind_speed": 5.2,
  "clouds": 40,
  "weather_main": "Clouds",
  "weather_description": "scattered clouds",
  "timestamp": "2025-01-06T10:30:00Z"
}
```

---
```

---

## ⚙️ Script Configuration

### Customize Base URL:

Edit `generateApiDocs.ts`:

```typescript
const BASE_URL = 'https://your-api-url.com';
```

### Add more endpoints:

```typescript
async function testYourEndpoint(): Promise<TestResult> {
  const result: TestResult = {
    endpoint: '/api/v1/your-endpoint',
    method: 'GET',
    title: 'Your Endpoint Title',
    description: 'Description here',
    requiresAuth: true,
    requestParams: { param: 'value' },
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

---

## 🔧 Troubleshooting

### Issue 1: Cannot connect to API

```
❌ Error: connect ECONNREFUSED
```

**Solutions:**
- Check API server đang chạy
- Check BASE_URL đúng không
- Check firewall/network

### Issue 2: All endpoints return 401

```
⚠️  Errors encountered:
   - GET /api/v1/air-quality/latest: 401
```

**Solutions:**
- Login/Register endpoint có hoạt động không?
- Token được save correctly không?
- Check authentication flow trong script

### Issue 3: TypeScript errors

```
❌ Cannot find module 'axios'
```

**Solutions:**
```bash
cd scripts
npm install
```

---

## 📝 Manual Testing (Alternative)

Nếu script không work, bạn có thể test manual với Postman:

### Bước 1: Import Postman Collection
- File: `GreenEduMap_API_v1.postman_collection.json`

### Bước 2: Set base_url variable
```
base_url = https://api.greenedumap.io.vn
```

### Bước 3: Test từng endpoint

Run endpoint và copy response:

1. Click "Send"
2. Copy response body
3. Create file `docs/responses/[endpoint-name].json`
4. Paste response

### Bước 4: Manual documentation

Create `docs/API_DOCUMENTATION_MANUAL.md`:

```markdown
## POST /auth/register

Register a new user account.

### Request:

\`\`\`json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "Nguyễn Văn A",
  "phone": "+84901234567"
}
\`\`\`

### Response (201 Created):

\`\`\`json
[paste response here]
\`\`\`
```

---

## 📤 Share Results

Sau khi generate xong:

1. Check `docs/API_DOCUMENTATION.md`
2. Verify tất cả responses
3. Share file hoặc commit to repo

---

## 🎯 Next Steps

1. **Run script**: `cd scripts && npm run generate-docs`
2. **Check docs folder**: `docs/API_DOCUMENTATION.md`
3. **Review responses**: Make sure they match expected format
4. **Update types if needed**: Based on actual responses
5. **Commit documentation**: Add to git repo

---

## ✨ Tips

### 1. Run periodically
Generate docs mỗi khi API changes:
```bash
npm run generate-docs
```

### 2. Version documentation
```bash
cp docs/API_DOCUMENTATION.md docs/API_DOCUMENTATION_v1.0.md
```

### 3. Compare responses
```bash
diff docs/api-test-results-old.json docs/api-test-results.json
```

### 4. Auto-generate on CI/CD
Add to `.github/workflows/docs.yml`:
```yaml
- name: Generate API Docs
  run: |
    cd scripts
    npm install
    npm run generate-docs
```

---

**Ready to generate! 🚀**

```bash
cd scripts
npm install
npm run generate-docs
```
