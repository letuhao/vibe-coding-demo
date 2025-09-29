# 02_Dashboard_Spec.md - Đặc Tả Kịch Bản Test Dashboard

## 📋 Thông Tin Cơ Bản

- **ID**: `DASH-001`
- **Tên File**: `dashboard.spec.ts`
- **Mô Tả**: Kịch bản test cho trang Dashboard của ứng dụng
- **Mục Tiêu**: Kiểm tra hiển thị dashboard và navigation
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra trang Dashboard bao gồm:

- Hiển thị các elements chính của dashboard
- Navigation buttons hoạt động đúng
- Thông tin user hiển thị
- Statistics và recent expenses
- Responsive design
- Logout functionality

## 📝 Danh Sách Test Cases

### 1. **DASH-TC-001**: Dashboard Page Elements

- **Mô tả**: Kiểm tra các elements chính của trang dashboard
- **Steps**:
  1. Truy cập `/dashboard`
  2. Kiểm tra heading "Dashboard" hiển thị
  3. Kiểm tra welcome message hiển thị
- **Expected**: Dashboard page load thành công với các elements chính

### 2. **DASH-TC-002**: Navigation Buttons

- **Mô tả**: Kiểm tra các navigation buttons
- **Steps**:
  1. Truy cập `/dashboard`
  2. Kiểm tra button "Expenses" hiển thị
  3. Kiểm tra button "Categories" hiển thị
- **Expected**: Tất cả navigation buttons hiển thị

### 3. **DASH-TC-003**: Navigate to Expenses

- **Mô tả**: Kiểm tra navigation đến trang Expenses
- **Steps**:
  1. Truy cập `/dashboard`
  2. Click button "Expenses"
  3. Kiểm tra URL chuyển đến `/expenses`
- **Expected**: Navigate thành công đến expenses page

### 4. **DASH-TC-004**: Navigate to Categories

- **Mô tả**: Kiểm tra navigation đến trang Categories
- **Steps**:
  1. Truy cập `/dashboard`
  2. Click button "Categories"
  3. Kiểm tra URL chuyển đến `/categories`
- **Expected**: Navigate thành công đến categories page

### 5. **DASH-TC-005**: Logout Functionality

- **Mô tả**: Kiểm tra chức năng logout
- **Steps**:
  1. Truy cập `/dashboard`
  2. Tìm logout button
  3. Click logout button (nếu có)
  4. Kiểm tra redirect về login page
- **Expected**: Logout thành công và redirect về login

### 6. **DASH-TC-006**: User Information Display

- **Mô tả**: Kiểm tra hiển thị thông tin user
- **Steps**:
  1. Truy cập `/dashboard`
  2. Tìm element hiển thị email user
  3. Kiểm tra email hiển thị đúng format
- **Expected**: User email hiển thị đúng

### 7. **DASH-TC-007**: Expense Statistics

- **Mô tả**: Kiểm tra hiển thị thống kê expenses
- **Steps**:
  1. Truy cập `/dashboard`
  2. Tìm statistics cards
  3. Kiểm tra cards hiển thị
- **Expected**: Statistics cards hiển thị với data

### 8. **DASH-TC-008**: Recent Expenses

- **Mô tả**: Kiểm tra hiển thị recent expenses
- **Steps**:
  1. Truy cập `/dashboard`
  2. Tìm section "Recent Expenses"
  3. Kiểm tra section hiển thị
- **Expected**: Recent expenses section hiển thị

### 9. **DASH-TC-009**: Mobile Responsiveness

- **Mô tả**: Kiểm tra responsive design trên mobile
- **Steps**:
  1. Set viewport mobile (375x667)
  2. Truy cập `/dashboard`
  3. Kiểm tra dashboard heading vẫn hiển thị
- **Expected**: Dashboard responsive trên mobile

## 🔧 Test Data

### Dashboard Elements

```javascript
const dashboardElements = {
  heading: "Dashboard",
  welcomeMessage: "Welcome",
  expensesButton: "Expenses",
  categoriesButton: "Categories",
  logoutButton: "Logout",
  userEmail: "@", // Pattern để tìm email
  statsCards: "[data-testid='stat-card']",
  recentExpenses: "Recent Expenses",
};
```

### Viewport Sizes

```javascript
const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
};
```

## 🎭 Test Scenarios

### Happy Path

1. User đã đăng nhập → Truy cập dashboard
2. Dashboard hiển thị đầy đủ thông tin
3. User click navigation buttons → Navigate thành công
4. User logout → Redirect về login

### Error Scenarios

1. User chưa đăng nhập → Redirect về login
2. Dashboard không load → Show error message
3. Navigation buttons không hoạt động → Show error

## 📊 Expected Results

- **Total Test Cases**: 9
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% dashboard functionality
- **Performance**: Dashboard load trong < 3 giây

## 🚨 Known Issues

- Test cases giả định user đã authenticated
- Một số elements có thể không tồn tại nếu chưa implement
- Mobile responsiveness test có thể không chính xác trên tất cả devices

## 📝 Notes

- Tests sử dụng conditional checks (`if (await element.isVisible())`)
- Screenshots có thể được capture cho debugging
- Tests có thể chạy parallel
- Cần mock authentication state cho tests

## 🔗 Dependencies

- Authentication system phải hoạt động
- Navigation system phải được implement
- Statistics API phải có data
- Responsive CSS phải được implement
