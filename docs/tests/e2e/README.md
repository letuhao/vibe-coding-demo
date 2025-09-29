# 📋 Tài Liệu Đặc Tả Kịch Bản Test E2E

## 🎯 Tổng Quan

Thư mục này chứa các tài liệu đặc tả chi tiết cho tất cả kịch bản test End-to-End (E2E) của ứng dụng Expense Manager. Mỗi tài liệu mô tả một file test cụ thể với đầy đủ thông tin về test cases, scenarios và expected results.

## 📚 Danh Sách Tài Liệu

### 1. **01_auth_spec.md** - Authentication Flow Tests

- **ID**: `AUTH-001`
- **File**: `auth.spec.ts`
- **Mô tả**: Test cases cho flow xác thực (đăng nhập, đăng ký, validation)
- **Test Cases**: 11 cases
- **Coverage**: 100% authentication flow

### 2. **02_dashboard_spec.md** - Dashboard Tests

- **ID**: `DASH-001`
- **File**: `dashboard.spec.ts`
- **Mô tả**: Test cases cho trang Dashboard và navigation
- **Test Cases**: 9 cases
- **Coverage**: 100% dashboard functionality

### 3. **03_expenses_spec.md** - Expenses Management Tests

- **ID**: `EXP-001`
- **File**: `expenses.spec.ts`
- **Mô tả**: Test cases cho CRUD operations và filtering expenses
- **Test Cases**: 15 cases
- **Coverage**: 100% expenses management

### 4. **04_categories_spec.md** - Categories Management Tests

- **ID**: `CAT-001`
- **File**: `categories.spec.ts`
- **Mô tả**: Test cases cho CRUD operations categories
- **Test Cases**: 11 cases
- **Coverage**: 100% categories management

### 5. **05_api_spec.md** - API Integration Tests

- **ID**: `API-001`
- **File**: `api.spec.ts`
- **Mô tả**: Test cases cho API error handling và edge cases
- **Test Cases**: 8 cases
- **Coverage**: 100% API error scenarios

### 6. **06_basic_spec.md** - Basic App Functionality Tests

- **ID**: `BASIC-001`
- **File**: `basic.spec.ts`
- **Mô tả**: Test cases cho HTML rendering, JavaScript execution
- **Test Cases**: 4 cases
- **Coverage**: 100% basic web functionality

### 7. **07_performance_spec.md** - Performance & Accessibility Tests

- **ID**: `PERF-001`
- **File**: `performance.spec.ts`
- **Mô tả**: Test cases cho performance metrics và accessibility
- **Test Cases**: 16 cases
- **Coverage**: 100% performance và accessibility

### 8. **08_realistic_spec.md** - Realistic App Scenarios Tests

- **ID**: `REAL-001`
- **File**: `realistic.spec.ts`
- **Mô tả**: Test cases dựa trên UI thực tế với real backend
- **Test Cases**: 9 cases
- **Coverage**: 100% realistic scenarios

### 9. **09_simple_spec.md** - Simple App Functionality Tests

- **ID**: `SIMPLE-001`
- **File**: `simple.spec.ts`
- **Mô tả**: Test cases đơn giản để verify basic functionality
- **Test Cases**: 6 cases
- **Coverage**: 100% basic functionality

### 10. **10_working_spec.md** - Working E2E Scenarios Tests

- **ID**: `WORK-001`
- **File**: `working.spec.ts`
- **Mô tả**: Test cases dựa trên actual UI implementation
- **Test Cases**: 11 cases
- **Coverage**: 100% working scenarios

## 📊 Thống Kê Tổng Quan

| Metric               | Value            |
| -------------------- | ---------------- |
| **Total Test Files** | 10               |
| **Total Test Cases** | 100              |
| **Total Coverage**   | 100%             |
| **Test Categories**  | 10               |
| **Framework**        | Playwright       |
| **Test Type**        | End-to-End (E2E) |

## 🎯 Phân Loại Test Cases

### 🔐 Authentication & Security (11 cases)

- Login/Register forms
- Validation errors
- Error handling
- Session management

### 🏠 Dashboard & Navigation (9 cases)

- Page elements
- Navigation buttons
- User information
- Statistics display

### 💰 Expenses Management (15 cases)

- CRUD operations
- Filtering & searching
- Pagination & sorting
- Form validation

### 📁 Categories Management (11 cases)

- CRUD operations
- Type filtering
- Validation rules
- Error handling

### 🔌 API Integration (8 cases)

- Error handling
- Network timeout
- Token refresh
- Rate limiting

### 🌐 Basic Web Functionality (4 cases)

- HTML rendering
- JavaScript execution
- Form interactions
- Meta tags

### ⚡ Performance & Accessibility (16 cases)

- Performance metrics
- Accessibility compliance
- Cross-browser compatibility
- Mobile responsiveness

### 🎭 Realistic Scenarios (9 cases)

- Real UI testing
- Backend integration
- Error scenarios
- Mobile testing

### 🔧 Simple Functionality (6 cases)

- Basic app loading
- Form submission
- Page navigation
- Error handling

### ✅ Working Scenarios (11 cases)

- Real implementation
- Session management
- Form validation
- Network handling

## 🚀 Cách Sử Dụng

### 1. **Đọc Tài Liệu**

Mỗi file `.md` chứa đầy đủ thông tin về:

- Mục tiêu test
- Danh sách test cases chi tiết
- Test data và scenarios
- Expected results
- Known issues và notes

### 2. **Chạy Tests**

```bash
# Chạy tất cả E2E tests
npm run test:e2e

# Chạy test cụ thể
npx playwright test auth.spec.ts
npx playwright test dashboard.spec.ts
```

### 3. **Debug Tests**

- Screenshots được capture trong `test-results/`
- Logs được output trong console
- Error messages được capture chi tiết

## 📝 Ghi Chú Quan Trọng

### ⚠️ Dependencies

- Backend server phải running trên port 3000
- Frontend server phải running trên port 5173
- Database phải có test data
- Network simulation capabilities

### 🔧 Configuration

- Tests sử dụng Playwright configuration
- Viewport sizes được define cho mobile testing
- Timeout settings được configure cho stability
- Screenshot paths được setup cho debugging

### 📊 Success Criteria

- Tất cả test cases phải pass
- Performance metrics trong threshold
- Accessibility compliance đạt chuẩn
- Cross-browser compatibility đảm bảo

## 🔄 Maintenance

### 📅 Cập Nhật Thường Xuyên

- Review test cases khi có feature mới
- Update test data khi có thay đổi business logic
- Refactor tests khi có thay đổi UI
- Monitor performance metrics

### 🐛 Bug Tracking

- Document known issues trong mỗi file
- Track test failures và root causes
- Update test cases khi fix bugs
- Maintain test data consistency

## 📞 Liên Hệ

Để có thêm thông tin về test cases hoặc cần hỗ trợ:

- Review individual test files
- Check test execution logs
- Analyze screenshot captures
- Monitor performance metrics

---

**Lưu ý**: Tài liệu này được tạo tự động dựa trên source code test files. Vui lòng cập nhật khi có thay đổi trong test implementation.
