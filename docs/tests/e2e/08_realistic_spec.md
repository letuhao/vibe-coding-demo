# 08_Realistic_Spec.md - Đặc Tả Kịch Bản Test Realistic App Scenarios

## 📋 Thông Tin Cơ Bản

- **ID**: `REAL-001`
- **Tên File**: `realistic.spec.ts`
- **Mô Tả**: Kịch bản test dựa trên UI thực tế của ứng dụng
- **Mục Tiêu**: Kiểm tra các scenarios thực tế với real UI elements
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra các scenarios thực tế với UI elements thực sự:

- Load real pages với actual UI
- Form submission với real backend
- Error handling với real responses
- Navigation với real routing
- Network error scenarios
- Mobile responsiveness với real UI
- Screenshot capture cho debugging

## 📝 Danh Sách Test Cases

### 1. **REAL-TC-001**: Load Login Page with Real UI

- **Mô tả**: Kiểm tra load login page với UI thực tế
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Take screenshot for debugging
  4. Check actual form elements:
     - Email input (type="email")
     - Password input (type="password")
     - Submit button (type="submit")
  5. Check page title contains "Expense Manager"
- **Expected**: Login page load với real UI elements

### 2. **REAL-TC-002**: Load Register Page with Real UI

- **Mô tả**: Kiểm tra load register page với UI thực tế
- **Steps**:
  1. Navigate to `http://localhost:5173/register`
  2. Wait for network idle
  3. Take screenshot for debugging
  4. Check actual form elements:
     - Email input (type="email")
     - Password inputs (2 inputs type="password")
     - Submit button (type="submit")
- **Expected**: Register page load với real UI elements

### 3. **REAL-TC-003**: Handle Form Submission Without Errors

- **Mô tả**: Kiểm tra form submission không gây lỗi
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Fill form với test data:
     - Email: "test@example.com"
     - Password: "password123"
  4. Submit form
  5. Wait 2 seconds for response
  6. Take screenshot for debugging
  7. Check still on valid page (not error page)
- **Expected**: Form submission không crash app

### 4. **REAL-TC-004**: Navigate Between Pages

- **Mô tả**: Kiểm tra navigation giữa các pages
- **Steps**:
  1. Navigate to `/login` → Check email input visible
  2. Navigate to `/register` → Check email input visible
  3. Navigate to `/dashboard` → Should redirect to login
  4. Wait for network idle after each navigation
- **Expected**: Navigation hoạt động đúng và redirect logic work

### 5. **REAL-TC-005**: Show Proper Form Validation

- **Mô tả**: Kiểm tra form validation hiển thị đúng
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Try submit empty form
  4. Wait 1 second for validation
  5. Take screenshot for debugging
  6. Check form still visible (not crashed)
- **Expected**: Form validation hoạt động và không crash

### 6. **REAL-TC-006**: Handle Invalid Credentials Gracefully

- **Mô tả**: Kiểm tra xử lý invalid credentials không crash
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Fill form với invalid credentials:
     - Email: "invalid@example.com"
     - Password: "wrongpassword"
  4. Submit form
  5. Wait 3 seconds for response
  6. Take screenshot for debugging
  7. Check still on login page (not crashed)
- **Expected**: Invalid credentials không crash app

### 7. **REAL-TC-007**: Load Dashboard When Authenticated

- **Mô tả**: Kiểm tra dashboard redirect khi chưa authenticated
- **Steps**:
  1. Navigate to `http://localhost:5173/dashboard`
  2. Wait for network idle
  3. Should redirect to login
  4. Take screenshot for debugging
- **Expected**: Dashboard redirect to login khi chưa authenticated

### 8. **REAL-TC-008**: Mobile Responsiveness with Real UI

- **Mô tả**: Kiểm tra responsive design với real UI
- **Steps**:
  1. Set mobile viewport (375x667)
  2. Navigate to `http://localhost:5173/login`
  3. Wait for network idle
  4. Take screenshot for debugging
  5. Check form elements still visible on mobile:
     - Email input
     - Password input
     - Submit button
- **Expected**: Real UI responsive trên mobile

### 9. **REAL-TC-009**: Handle Network Errors Gracefully

- **Mô tả**: Kiểm tra xử lý network errors không crash
- **Steps**:
  1. Simulate network failure (abort auth/login route)
  2. Navigate to `http://localhost:5173/login`
  3. Wait for network idle
  4. Fill form với valid data
  5. Submit form
  6. Wait 3 seconds for error
  7. Take screenshot for debugging
  8. Check page still functional
- **Expected**: Network errors không crash app

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
};
```

### Viewport Sizes

```javascript
const viewports = {
  mobile: { width: 375, height: 667 },
  desktop: { width: 1920, height: 1080 },
};
```

### Screenshot Paths

```javascript
const screenshots = {
  login: "test-results/realistic-login.png",
  register: "test-results/realistic-register.png",
  submit: "test-results/realistic-submit.png",
  validation: "test-results/realistic-validation.png",
  invalidCredentials: "test-results/realistic-invalid-credentials.png",
  dashboardRedirect: "test-results/realistic-dashboard-redirect.png",
  mobile: "test-results/realistic-mobile.png",
  networkError: "test-results/realistic-network-error.png",
};
```

## 🎭 Test Scenarios

### Real UI Scenarios

1. **Page Loading**: Real pages load → UI elements visible
2. **Form Interaction**: Real forms work → No crashes
3. **Navigation**: Real routing → Correct redirects
4. **Validation**: Real validation → Proper feedback

### Error Handling Scenarios

1. **Invalid Data**: Invalid input → Graceful handling
2. **Network Issues**: Network failure → App still functional
3. **Authentication**: Unauthenticated access → Proper redirects

### Mobile Scenarios

1. **Responsive Design**: Mobile viewport → UI adapts
2. **Touch Interface**: Mobile interaction → Works properly
3. **Performance**: Mobile performance → Acceptable

## 📊 Expected Results

- **Total Test Cases**: 9
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% realistic scenarios
- **Performance**: Each test completes trong < 10 giây
- **Screenshots**: Debug screenshots captured

## 🚨 Known Issues

- Tests phụ thuộc vào real backend server
- Screenshots có thể không consistent
- Network error simulation có thể không stable
- Mobile responsiveness có thể vary trên different devices

## 📝 Notes

- Tests sử dụng real UI elements thay vì mocked content
- Screenshots được capture cho debugging purposes
- Tests wait for network idle để ensure page fully loaded
- Tests check app không crash trong error scenarios

## 🔗 Dependencies

- Real backend server phải running
- Real frontend build phải available
- Network simulation capabilities
- Screenshot capture functionality

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

### Screenshot Capture

```javascript
await page.screenshot({ path: "test-results/realistic-login.png" });
```

### Network Error Simulation

```javascript
await page.route("**/auth/login", (route) => route.abort());
```

### Form Submission

```javascript
await page.fill('input[type="email"]', "test@example.com");
await page.fill('input[type="password"]', "password123");
await page.click('button[type="submit"]');
await page.waitForTimeout(2000);
```

### Mobile Testing

```javascript
await page.setViewportSize({ width: 375, height: 667 });
await page.goto("http://localhost:5173/login");
await page.waitForLoadState("networkidle");
```

## 🎯 Business Rules

### Real UI Requirements

1. Pages phải load với real UI elements
2. Forms phải work với real backend
3. Navigation phải work với real routing
4. Error handling phải graceful

### Performance Requirements

1. Page load trong reasonable time
2. Form submission responsive
3. Error handling không block UI
4. Mobile performance acceptable

### Debugging Requirements

1. Screenshots captured cho debugging
2. Error scenarios logged
3. Network issues documented
4. Performance metrics tracked

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

### Mobile Support

- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Performance acceptable
- [ ] UI elements accessible
