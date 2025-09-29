# 10_Working_Spec.md - Đặc Tả Kịch Bản Test Working E2E Scenarios

## 📋 Thông Tin Cơ Bản

- **ID**: `WORK-001`
- **Tên File**: `working.spec.ts`
- **Mô Tả**: Kịch bản test dựa trên actual UI implementation
- **Mục Tiêu**: Kiểm tra các scenarios hoạt động với real UI
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra các scenarios hoạt động với UI thực tế:

- Load pages với actual implementation
- Form submission với real backend
- Error handling với real responses
- Navigation với real routing
- Session state management
- Form validation với real logic
- Network error handling
- Mobile responsiveness

## 📝 Danh Sách Test Cases

### 1. **WORK-TC-001**: Load Login Page Successfully

- **Mô tả**: Kiểm tra load login page thành công với real UI
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Check basic form elements:
     - Email input (type="email")
     - Password input (type="password")
     - Submit button (type="submit")
  4. Check page title contains "Expense Manager"
- **Expected**: Login page load thành công với real UI

### 2. **WORK-TC-002**: Load Register Page Successfully

- **Mô tả**: Kiểm tra load register page thành công với real UI
- **Steps**:
  1. Navigate to `http://localhost:5173/register`
  2. Wait for network idle
  3. Check form elements:
     - Email input (type="email")
     - Password inputs (2 inputs type="password")
     - Submit button (type="submit")
- **Expected**: Register page load thành công với real UI

### 3. **WORK-TC-003**: Handle Form Submission

- **Mô tả**: Kiểm tra form submission hoạt động với real backend
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Fill form:
     - Email: "test@example.com"
     - Password: "password123"
  4. Submit form
  5. Wait 2 seconds for response
  6. Check still on valid page (not error page)
- **Expected**: Form submission hoạt động và không crash

### 4. **WORK-TC-004**: Handle Invalid Credentials

- **Mô tả**: Kiểm tra xử lý invalid credentials với real backend
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Fill form với invalid credentials:
     - Email: "invalid@example.com"
     - Password: "wrongpassword"
  4. Submit form
  5. Wait 3 seconds for response
  6. Should still be on login page
- **Expected**: Invalid credentials được handle gracefully

### 5. **WORK-TC-005**: Navigate Between Pages

- **Mô tả**: Kiểm tra navigation giữa các pages với real routing
- **Steps**:
  1. Navigate to `/login` → Check email input visible
  2. Navigate to `/register` → Check email input visible
  3. Navigate to `/dashboard` → Should redirect to login
  4. Wait for network idle after each navigation
- **Expected**: Navigation hoạt động với real routing

### 6. **WORK-TC-006**: Handle Empty Form Submission

- **Mô tả**: Kiểm tra xử lý empty form submission
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Try submit empty form
  4. Wait 1 second for validation
  5. Check form still visible
- **Expected**: Empty form submission được handle gracefully

### 7. **WORK-TC-007**: Mobile Responsiveness

- **Mô tả**: Kiểm tra responsive design trên mobile devices
- **Steps**:
  1. Set mobile viewport (375x667)
  2. Navigate to `http://localhost:5173/login`
  3. Wait for network idle
  4. Check form elements still visible on mobile:
     - Email input
     - Password input
     - Submit button
- **Expected**: Real UI responsive trên mobile

### 8. **WORK-TC-008**: Handle Network Errors Gracefully

- **Mô tả**: Kiểm tra xử lý network errors không crash
- **Steps**:
  1. Simulate network failure (abort auth/login route)
  2. Navigate to `http://localhost:5173/login`
  3. Wait for network idle
  4. Fill form với valid data
  5. Submit form
  6. Wait 3 seconds for error
  7. Check page still functional
- **Expected**: Network errors không crash app

### 9. **WORK-TC-009**: Load All Main Pages

- **Mô tả**: Kiểm tra tất cả main pages có thể load
- **Steps**:
  1. Test các pages:
     - `/login`
     - `/register`
     - `/dashboard`
     - `/categories`
     - `/expenses`
  2. For each page:
     - Navigate to URL
     - Wait for network idle
     - Check page loads without errors
     - Check page has basic structure
- **Expected**: Tất cả main pages load thành công

### 10. **WORK-TC-010**: Handle Form Validation

- **Mô tả**: Kiểm tra form validation với real logic
- **Steps**:
  1. Navigate to `http://localhost:5173/register`
  2. Wait for network idle
  3. Try submit form với mismatched passwords:
     - Email: "test@example.com"
     - Password: "password123"
     - Confirm Password: "different123"
  4. Submit form
  5. Wait 2 seconds for validation
  6. Check form still visible
- **Expected**: Form validation hoạt động với real logic

### 11. **WORK-TC-011**: Maintain Session State

- **Mô tả**: Kiểm tra session state được maintain
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Fill form với valid data
  4. Navigate away và back:
     - Go to `/register`
     - Go back to `/login`
  5. Check form still functional
- **Expected**: Session state được maintain correctly

## 🔧 Test Data

### Real UI Selectors

```javascript
const realSelectors = {
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  submitButton: 'button[type="submit"]',
  pageTitle: "title",
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
    email: "invalid@example.com",
    password: "wrongpassword",
  },
  mismatched: {
    email: "test@example.com",
    password: "password123",
    confirmPassword: "different123",
  },
};
```

### Page URLs

```javascript
const pageUrls = [
  "http://localhost:5173/login",
  "http://localhost:5173/register",
  "http://localhost:5173/dashboard",
  "http://localhost:5173/categories",
  "http://localhost:5173/expenses",
];
```

### Viewport Sizes

```javascript
const viewports = {
  mobile: { width: 375, height: 667 },
  desktop: { width: 1920, height: 1080 },
};
```

## 🎭 Test Scenarios

### Working UI Scenarios

1. **Page Loading**: Real pages load → UI elements visible
2. **Form Interaction**: Real forms work → No crashes
3. **Navigation**: Real routing → Correct behavior
4. **Validation**: Real validation → Proper feedback

### Error Handling Scenarios

1. **Invalid Data**: Invalid input → Graceful handling
2. **Network Issues**: Network failure → App functional
3. **Empty Forms**: Empty submission → Proper validation

### Session Management Scenarios

1. **State Persistence**: Session state → Maintained correctly
2. **Navigation**: Page changes → State preserved
3. **Form Data**: Form data → Handled properly

## 📊 Expected Results

- **Total Test Cases**: 11
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% working scenarios
- **Performance**: Each test completes trong < 10 giây

## 🚨 Known Issues

- Tests phụ thuộc vào real backend server
- Network error simulation có thể không stable
- Session state tests có thể không comprehensive
- Mobile responsiveness có thể vary trên different devices

## 📝 Notes

- Tests sử dụng real UI elements và actual implementation
- Tests focus vào app functionality thay vì specific error messages
- Tests verify app stability và basic operations
- Tests ensure real-world scenarios work

## 🔗 Dependencies

- Real backend server phải running
- Real frontend build phải available
- Network simulation capabilities
- Session management system

## 🛠️ Technical Implementation

### Real Page Loading

```javascript
await page.goto("http://localhost:5173/login");
await page.waitForLoadState("networkidle");

// Check real elements
await expect(page.locator('input[type="email"]')).toBeVisible();
await expect(page.locator('input[type="password"]')).toBeVisible();
await expect(page.locator('button[type="submit"]')).toBeVisible();
```

### Form Submission

```javascript
await page.fill('input[type="email"]', "test@example.com");
await page.fill('input[type="password"]', "password123");
await page.click('button[type="submit"]');
await page.waitForTimeout(2000);
```

### Network Error Simulation

```javascript
await page.route("**/auth/login", (route) => route.abort());
```

### Mobile Testing

```javascript
await page.setViewportSize({ width: 375, height: 667 });
await page.goto("http://localhost:5173/login");
await page.waitForLoadState("networkidle");
```

### Page Validation

```javascript
const currentUrl = page.url();
expect(currentUrl).toMatch(/localhost:5173/);

const body = await page.locator("body").textContent();
expect(body).toBeTruthy();
```

## 🎯 Business Rules

### Working App Requirements

1. App phải load với real UI
2. Forms phải work với real backend
3. Navigation phải work với real routing
4. Error handling phải graceful

### Session Management Requirements

1. Session state phải được maintain
2. Form data phải được handle properly
3. Navigation phải preserve state
4. User experience phải consistent

### Performance Requirements

1. Pages phải load trong reasonable time
2. Form submission phải responsive
3. Error handling không block UI
4. Mobile performance acceptable

## 🔄 Integration Points

### Real Backend Integration

- Tests use real API endpoints
- Tests handle real responses
- Tests validate real error handling
- Tests check real authentication flow

### Real Frontend Integration

- Tests use real UI components
- Tests validate real form behavior
- Tests check real navigation
- Tests verify real responsive design

### Session Management Integration

- Tests verify session persistence
- Tests check state management
- Tests validate user experience
- Tests ensure data consistency

## 📋 Test Checklist

### Page Loading

- [ ] Real pages load successfully
- [ ] UI elements visible
- [ ] No JavaScript errors
- [ ] Network requests complete

### Form Handling

- [ ] Forms submit without crashes
- [ ] Validation works properly
- [ ] Error messages display
- [ ] Loading states show

### Navigation

- [ ] Page navigation works
- [ ] Redirects function correctly
- [ ] Authentication flow works
- [ ] Protected routes protected

### Error Handling

- [ ] Invalid data handled gracefully
- [ ] Network errors don't crash app
- [ ] Authentication errors handled
- [ ] User feedback provided

### Session Management

- [ ] Session state maintained
- [ ] Form data preserved
- [ ] Navigation preserves state
- [ ] User experience consistent

### Mobile Support

- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Performance acceptable
- [ ] UI elements accessible
