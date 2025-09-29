# 01_Auth_Spec.md - Đặc Tả Kịch Bản Test Authentication

## 📋 Thông Tin Cơ Bản

- **ID**: `AUTH-001`
- **Tên File**: `auth.spec.ts`
- **Mô Tả**: Kịch bản test cho flow xác thực (Authentication) của ứng dụng
- **Mục Tiêu**: Kiểm tra các chức năng đăng nhập, đăng ký và validation form
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra toàn bộ flow xác thực người dùng bao gồm:

- Hiển thị form đăng nhập và đăng ký
- Validation dữ liệu đầu vào
- Xử lý lỗi khi đăng nhập/đăng ký
- Navigation giữa các trang
- Loading states

## 📝 Danh Sách Test Cases

### 1. **AUTH-TC-001**: Redirect to Login Page

- **Mô tả**: Kiểm tra khi truy cập root URL sẽ redirect về trang login
- **Steps**:
  1. Truy cập `http://localhost:5173/`
  2. Kiểm tra URL chứa `/login`
  3. Kiểm tra form login hiển thị
- **Expected**: Redirect về login page và hiển thị form

### 2. **AUTH-TC-002**: Login Form Elements

- **Mô tả**: Kiểm tra các elements của form đăng nhập
- **Steps**:
  1. Truy cập `/login`
  2. Kiểm tra email input
  3. Kiểm tra password input
  4. Kiểm tra submit button
  5. Kiểm tra link đăng ký
- **Expected**: Tất cả elements hiển thị đúng

### 3. **AUTH-TC-003**: Register Form Elements

- **Mô tả**: Kiểm tra các elements của form đăng ký
- **Steps**:
  1. Truy cập `/register`
  2. Kiểm tra email input
  3. Kiểm tra password input
  4. Kiểm tra confirm password input
  5. Kiểm tra submit button
  6. Kiểm tra link đăng nhập
- **Expected**: Tất cả elements hiển thị đúng

### 4. **AUTH-TC-004**: Navigation Between Forms

- **Mô tả**: Kiểm tra navigation giữa login và register
- **Steps**:
  1. Từ login page click "Don't have an account"
  2. Kiểm tra chuyển đến register page
  3. Từ register page click "Already have an account"
  4. Kiểm tra chuyển về login page
- **Expected**: Navigation hoạt động đúng

### 5. **AUTH-TC-005**: Empty Form Validation

- **Mô tả**: Kiểm tra validation khi submit form trống
- **Steps**:
  1. Truy cập `/login`
  2. Click submit button với form trống
  3. Kiểm tra error messages
- **Expected**: Hiển thị lỗi "Email is required" và "Password is required"

### 6. **AUTH-TC-006**: Invalid Email Validation

- **Mô tả**: Kiểm tra validation email không hợp lệ
- **Steps**:
  1. Truy cập `/login`
  2. Nhập email không hợp lệ: "invalid-email"
  3. Nhập password hợp lệ
  4. Submit form
- **Expected**: Hiển thị lỗi "Please provide a valid email"

### 7. **AUTH-TC-007**: Short Password Validation

- **Mô tả**: Kiểm tra validation password quá ngắn
- **Steps**:
  1. Truy cập `/register`
  2. Nhập email hợp lệ
  3. Nhập password ngắn: "123"
  4. Nhập confirm password giống nhau
  5. Submit form
- **Expected**: Hiển thị lỗi "Password must be at least 8 characters"

### 8. **AUTH-TC-008**: Password Mismatch Validation

- **Mô tả**: Kiểm tra validation password không khớp
- **Steps**:
  1. Truy cập `/register`
  2. Nhập email hợp lệ
  3. Nhập password: "password123"
  4. Nhập confirm password khác: "different123"
  5. Submit form
- **Expected**: Hiển thị lỗi "Password confirmation does not match"

### 9. **AUTH-TC-009**: Non-existent User Login

- **Mô tả**: Kiểm tra đăng nhập với user không tồn tại
- **Steps**:
  1. Truy cập `/login`
  2. Nhập email không tồn tại: "nonexistent@example.com"
  3. Nhập password bất kỳ
  4. Submit form
- **Expected**: Hiển thị lỗi "Invalid credentials"

### 10. **AUTH-TC-010**: Existing Email Registration

- **Mô tả**: Kiểm tra đăng ký với email đã tồn tại
- **Steps**:
  1. Truy cập `/register`
  2. Nhập email đã tồn tại: "existing@example.com"
  3. Nhập password hợp lệ
  4. Nhập confirm password giống nhau
  5. Submit form
- **Expected**: Hiển thị lỗi "User with this email already exists"

### 11. **AUTH-TC-011**: Loading State

- **Mô tả**: Kiểm tra hiển thị loading state khi submit
- **Steps**:
  1. Truy cập `/login`
  2. Nhập thông tin hợp lệ
  3. Submit form
  4. Kiểm tra loading indicator
- **Expected**: Hiển thị loading state

## 🔧 Test Data

### Valid Test Data

```javascript
const validUser = {
  email: "test@example.com",
  password: "password123",
  confirmPassword: "password123",
};
```

### Invalid Test Data

```javascript
const invalidData = {
  invalidEmail: "invalid-email",
  shortPassword: "123",
  mismatchedPassword: "different123",
  nonexistentEmail: "nonexistent@example.com",
  existingEmail: "existing@example.com",
};
```

## 🎭 Test Scenarios

### Happy Path

1. User truy cập ứng dụng → Redirect to login
2. User click "Don't have an account" → Navigate to register
3. User đăng ký thành công → Redirect to dashboard
4. User logout → Redirect to login

### Error Scenarios

1. Empty form submission → Show validation errors
2. Invalid email format → Show email validation error
3. Short password → Show password length error
4. Password mismatch → Show confirmation error
5. Non-existent user → Show invalid credentials error
6. Existing email → Show user exists error

## 📊 Expected Results

- **Total Test Cases**: 11
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% authentication flow
- **Performance**: Mỗi test case hoàn thành trong < 5 giây

## 🚨 Known Issues

- Test cases giả định backend server đang chạy
- Một số test cases có thể fail nếu backend không response đúng format
- Loading state test có thể không stable trên slow network

## 📝 Notes

- Tests sử dụng Playwright với auto-waiting
- Screenshots được capture cho debugging
- Tests có thể chạy parallel
- Cần setup test database để test registration flow
