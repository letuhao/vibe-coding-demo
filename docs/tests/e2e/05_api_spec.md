# 05_API_Spec.md - Đặc Tả Kịch Bản Test API Integration

## 📋 Thông Tin Cơ Bản

- **ID**: `API-001`
- **Tên File**: `api.spec.ts`
- **Mô Tả**: Kịch bản test cho API Integration và Error Handling
- **Mục Tiêu**: Kiểm tra xử lý lỗi API và các tình huống edge cases
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra khả năng xử lý các tình huống API không mong muốn:

- API errors và error handling
- Network timeout
- Authentication token refresh
- Unauthorized access
- Validation errors từ API
- Rate limiting
- Maintenance mode
- Successful API responses

## 📝 Danh Sách Test Cases

### 1. **API-TC-001**: API Error Handling

- **Mô tả**: Kiểm tra xử lý lỗi API (500 Internal Server Error)
- **Steps**:
  1. Mock API endpoint trả về 500 error
  2. Truy cập `/login`
  3. Fill form với valid data
  4. Submit form
  5. Kiểm tra error message hiển thị
- **Expected**: Hiển thị message "Something went wrong"

### 2. **API-TC-002**: Network Timeout

- **Mô tả**: Kiểm tra xử lý network timeout
- **Steps**:
  1. Mock API endpoint với response chậm (10s)
  2. Truy cập `/login`
  3. Fill form với valid data
  4. Submit form
  5. Kiểm tra loading state hiển thị
- **Expected**: Hiển thị loading indicator

### 3. **API-TC-003**: Token Refresh

- **Mô tả**: Kiểm tra refresh authentication token
- **Steps**:
  1. Mock token refresh endpoint trả về new tokens
  2. Truy cập `/dashboard`
  3. Kiểm tra page load thành công sau khi refresh token
- **Expected**: Dashboard load thành công với new token

### 4. **API-TC-004**: Unauthorized Access

- **Mô tả**: Kiểm tra xử lý unauthorized access (401)
- **Steps**:
  1. Mock API endpoint trả về 401 Unauthorized
  2. Truy cập `/dashboard`
  3. Kiểm tra redirect về login page
- **Expected**: Redirect về login page

### 5. **API-TC-005**: API Validation Errors

- **Mô tả**: Kiểm tra xử lý validation errors từ API
- **Steps**:
  1. Mock login API trả về 400 với validation errors
  2. Truy cập `/login`
  3. Fill form với invalid data
  4. Submit form
  5. Kiểm tra validation errors hiển thị
- **Expected**: Hiển thị specific validation errors:
  - "Invalid email format"
  - "Password is too short"

### 6. **API-TC-006**: Successful API Response

- **Mô tả**: Kiểm tra xử lý successful API response
- **Steps**:
  1. Mock login API trả về 200 với success data
  2. Truy cập `/login`
  3. Fill form với valid data
  4. Submit form
  5. Kiểm tra redirect đến dashboard
- **Expected**: Redirect thành công đến dashboard

### 7. **API-TC-007**: Rate Limiting

- **Mô tả**: Kiểm tra xử lý rate limiting (429)
- **Steps**:
  1. Mock API endpoint trả về 429 Too Many Requests
  2. Truy cập `/login`
  3. Submit form multiple times (3 lần)
  4. Kiểm tra rate limit error hiển thị
- **Expected**: Hiển thị message "Too many requests"

### 8. **API-TC-008**: Maintenance Mode

- **Mô tả**: Kiểm tra xử lý maintenance mode (503)
- **Steps**:
  1. Mock API endpoint trả về 503 Service Unavailable
  2. Truy cập `/login`
  3. Fill form với valid data
  4. Submit form
  5. Kiểm tra maintenance message hiển thị
- **Expected**: Hiển thị message "Service temporarily unavailable"

## 🔧 Test Data

### Mock API Responses

```javascript
const mockResponses = {
  serverError: {
    status: 500,
    body: { message: "Internal Server Error" },
  },
  timeout: {
    status: 200,
    delay: 10000,
    body: { message: "Success" },
  },
  unauthorized: {
    status: 401,
    body: { message: "Unauthorized" },
  },
  validationError: {
    status: 400,
    body: {
      message: "Validation failed",
      errors: {
        email: "Invalid email format",
        password: "Password is too short",
      },
    },
  },
  success: {
    status: 200,
    body: {
      user: { id: "1", email: "test@example.com" },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    },
  },
  rateLimit: {
    status: 429,
    body: {
      message: "Too Many Requests",
      retryAfter: 60,
    },
  },
  maintenance: {
    status: 503,
    body: {
      message: "Service temporarily unavailable",
      maintenance: true,
    },
  },
};
```

### Test Credentials

```javascript
const testCredentials = {
  valid: {
    email: "test@example.com",
    password: "password123",
  },
  invalid: {
    email: "invalid-email",
    password: "123",
  },
};
```

## 🎭 Test Scenarios

### Error Handling Scenarios

1. **Server Error**: API trả về 500 → Show generic error message
2. **Network Timeout**: API response chậm → Show loading state
3. **Unauthorized**: API trả về 401 → Redirect to login
4. **Validation Error**: API trả về 400 → Show specific errors
5. **Rate Limiting**: API trả về 429 → Show rate limit message
6. **Maintenance**: API trả về 503 → Show maintenance message

### Success Scenarios

1. **Valid Login**: API trả về 200 → Redirect to dashboard
2. **Token Refresh**: Refresh token thành công → Continue session

## 📊 Expected Results

- **Total Test Cases**: 8
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% API error handling scenarios
- **Performance**: Error handling hoàn thành trong < 5 giây

## 🚨 Known Issues

- Mock API responses có thể không chính xác với real API
- Network timeout test có thể không stable
- Rate limiting test có thể không trigger đúng cách
- Token refresh test phụ thuộc vào authentication flow

## 📝 Notes

- Tests sử dụng Playwright route mocking
- Screenshots có thể được capture cho debugging
- Tests có thể chạy parallel
- Cần hiểu rõ API contract để mock đúng

## 🔗 Dependencies

- API endpoints phải được implement
- Error handling middleware phải hoạt động
- Authentication system phải hoạt động
- Frontend error handling phải được implement

## 🛠️ Technical Implementation

### Mock API Routes

```javascript
// Mock server error
await page.route("**/api/**", (route) => {
  route.fulfill({
    status: 500,
    contentType: "application/json",
    body: JSON.stringify({ message: "Internal Server Error" }),
  });
});

// Mock timeout
await page.route("**/api/**", (route) => {
  setTimeout(() => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message: "Success" }),
    });
  }, 10000);
});
```

### Error Message Patterns

- **Generic Error**: "Something went wrong"
- **Network Error**: "Network error occurred"
- **Validation Error**: Specific field errors
- **Rate Limit**: "Too many requests"
- **Maintenance**: "Service temporarily unavailable"

## 🎯 Business Rules

### Error Handling Rules

1. Tất cả API errors phải được handle gracefully
2. User không bao giờ thấy raw error messages
3. Loading states phải được hiển thị cho async operations
4. Network errors phải có retry mechanism
5. Authentication errors phải redirect về login

### API Response Standards

- Success responses: 200-299
- Client errors: 400-499
- Server errors: 500-599
- All responses phải có consistent format
- Error responses phải có error codes và messages
