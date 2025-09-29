# 09_Simple_Spec.md - Đặc Tả Kịch Bản Test Simple App Functionality

## 📋 Thông Tin Cơ Bản

- **ID**: `SIMPLE-001`
- **Tên File**: `simple.spec.ts`
- **Mô Tả**: Kịch bản test đơn giản để verify basic functionality
- **Mục Tiêu**: Kiểm tra các chức năng cơ bản nhất của ứng dụng
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra các chức năng cơ bản nhất:

- Application loading
- Basic page elements
- Form submission
- Page navigation
- Error message display
- Basic functionality verification

## 📝 Danh Sách Test Cases

### 1. **SIMPLE-TC-001**: Load the Application

- **Mô tả**: Kiểm tra ứng dụng có thể load được
- **Steps**:
  1. Navigate to `http://localhost:5173/`
  2. Wait for network idle
  3. Check page loads without errors
  4. Verify page title exists
  5. Take screenshot for debugging
- **Expected**: Application load thành công với valid title

### 2. **SIMPLE-TC-002**: Show Login Page Elements

- **Mô tả**: Kiểm tra login page có basic elements
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Check basic form elements:
     - Email input (type="email")
     - Password input (type="password")
     - Submit button (type="submit")
  4. Take screenshot for debugging
- **Expected**: Login page có basic form elements

### 3. **SIMPLE-TC-003**: Show Register Page Elements

- **Mô tả**: Kiểm tra register page có basic elements
- **Steps**:
  1. Navigate to `http://localhost:5173/register`
  2. Wait for network idle
  3. Check basic form elements:
     - Email input (type="email")
     - Password inputs (2 inputs type="password")
     - Submit button (type="submit")
  4. Take screenshot for debugging
- **Expected**: Register page có basic form elements

### 4. **SIMPLE-TC-004**: Handle Form Submission

- **Mô tả**: Kiểm tra form submission hoạt động
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Fill form:
     - Email: "test@example.com"
     - Password: "password123"
  4. Submit form
  5. Wait 2 seconds for response
  6. Take screenshot for debugging
- **Expected**: Form submission không crash app

### 5. **SIMPLE-TC-005**: Navigate Between Pages

- **Mô tả**: Kiểm tra navigation giữa các pages
- **Steps**:
  1. Navigate to `/login` → Check email input visible
  2. Navigate to `/register` → Check email input visible
  3. Navigate to `/dashboard` → Should redirect to login
  4. Wait for network idle after each navigation
- **Expected**: Navigation hoạt động và redirect logic work

### 6. **SIMPLE-TC-006**: Show Error Messages

- **Mô tả**: Kiểm tra error messages hiển thị
- **Steps**:
  1. Navigate to `http://localhost:5173/login`
  2. Wait for network idle
  3. Try submit empty form
  4. Wait 1 second for validation/error
  5. Check for error messages or validation
  6. Take screenshot for debugging
  7. Log page content for debugging
- **Expected**: Error handling hoạt động (có thể không có specific errors)

## 🔧 Test Data

### Basic Selectors

```javascript
const basicSelectors = {
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  submitButton: 'button[type="submit"]',
  errorElements:
    '[class*="error"], [class*="invalid"], .text-red-500, .text-red-600',
};
```

### Test Credentials

```javascript
const testCredentials = {
  email: "test@example.com",
  password: "password123",
};
```

### Screenshot Paths

```javascript
const screenshots = {
  load: "test-results/simple-load.png",
  login: "test-results/simple-login.png",
  register: "test-results/simple-register.png",
  submit: "test-results/simple-submit.png",
  errors: "test-results/simple-errors.png",
};
```

## 🎭 Test Scenarios

### Basic Functionality Scenarios

1. **App Loading**: Application starts → Basic functionality works
2. **Page Navigation**: Pages load → Elements visible
3. **Form Interaction**: Forms work → No crashes
4. **Error Handling**: Errors handled → App stable

### Simple Validation Scenarios

1. **Empty Form**: Submit empty form → Some response
2. **Basic Input**: Fill basic data → Form accepts
3. **Navigation**: Move between pages → Works correctly

## 📊 Expected Results

- **Total Test Cases**: 6
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% basic functionality
- **Performance**: Each test completes trong < 5 giây

## 🚨 Known Issues

- Tests có thể pass ngay cả khi không có specific error messages
- Screenshots có thể không consistent
- Error detection có thể không comprehensive
- Tests focus vào basic functionality thay vì detailed validation

## 📝 Notes

- Tests sử dụng simple selectors và basic checks
- Screenshots captured cho debugging
- Tests không expect specific error messages
- Tests focus vào app không crash thay vì specific behavior

## 🔗 Dependencies

- Application phải running
- Basic HTML structure phải exist
- Form elements phải be present
- Navigation phải work

## 🛠️ Technical Implementation

### Basic Page Loading

```javascript
await page.goto("http://localhost:5173/");
await page.waitForLoadState("networkidle");

// Check basic functionality
const title = await page.title();
expect(title).toBeTruthy();
```

### Element Visibility Check

```javascript
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

### Error Detection

```javascript
const errorMessages = page.locator(
  '[class*="error"], [class*="invalid"], .text-red-500, .text-red-600'
);
const errorCount = await errorMessages.count();

// Log for debugging
const pageContent = await page.content();
console.log("Page content length:", pageContent.length);
```

### Screenshot Capture

```javascript
await page.screenshot({ path: "test-results/simple-load.png" });
```

## 🎯 Business Rules

### Basic Functionality Requirements

1. Application phải load được
2. Pages phải accessible
3. Forms phải work
4. Navigation phải function
5. App không được crash

### Error Handling Requirements

1. App phải handle errors gracefully
2. User phải get some feedback
3. App phải remain functional
4. No critical crashes allowed

## 🔄 Integration Points

### Basic App Integration

- Tests verify app can start
- Tests check basic page structure
- Tests validate form functionality
- Tests ensure navigation works

### Error Handling Integration

- Tests check error scenarios
- Tests verify app stability
- Tests ensure user feedback
- Tests validate graceful degradation

## 📋 Test Checklist

### Application Loading

- [ ] App starts successfully
- [ ] Pages load without errors
- [ ] Basic structure present
- [ ] No critical JavaScript errors

### Page Elements

- [ ] Login page has form elements
- [ ] Register page has form elements
- [ ] Submit buttons present
- [ ] Input fields accessible

### Form Functionality

- [ ] Forms can be filled
- [ ] Forms can be submitted
- [ ] No crashes on submission
- [ ] Basic validation works

### Navigation

- [ ] Pages can be navigated
- [ ] Redirects work correctly
- [ ] Protected routes protected
- [ ] No navigation errors

### Error Handling

- [ ] Errors don't crash app
- [ ] Some error feedback provided
- [ ] App remains functional
- [ ] User experience maintained

## 🎯 Success Criteria

### Minimum Viable Tests

1. **App Loads**: Application starts và basic functionality works
2. **Pages Work**: All main pages accessible
3. **Forms Work**: Forms can be filled và submitted
4. **Navigation Works**: Can move between pages
5. **No Crashes**: App doesn't crash trong basic operations
6. **Error Handling**: App handles errors gracefully

### Debugging Support

1. **Screenshots**: Captured cho debugging
2. **Logging**: Page content logged
3. **Error Detection**: Basic error detection
4. **Performance**: Basic performance check
