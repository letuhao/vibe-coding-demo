# 06_Basic_Spec.md - Đặc Tả Kịch Bản Test Basic App Functionality

## 📋 Thông Tin Cơ Bản

- **ID**: `BASIC-001`
- **Tên File**: `basic.spec.ts`
- **Mô Tả**: Kịch bản test cho các chức năng cơ bản của ứng dụng
- **Mục Tiêu**: Kiểm tra HTML rendering, JavaScript execution và form interactions
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra các chức năng cơ bản của ứng dụng web:

- HTML page loading
- Meta tags configuration
- JavaScript execution
- Form interactions
- Basic DOM manipulation
- Event handling

## 📝 Danh Sách Test Cases

### 1. **BASIC-TC-001**: Load Simple HTML Page

- **Mô tả**: Kiểm tra load một HTML page đơn giản
- **Steps**:
  1. Set content HTML với basic structure
  2. Kiểm tra page title chứa "Expense Manager"
  3. Kiểm tra heading "Expense Manager" hiển thị
- **Expected**: Page load thành công với title và heading đúng

### 2. **BASIC-TC-002**: Proper Meta Tags

- **Mô tả**: Kiểm tra meta tags được cấu hình đúng
- **Steps**:
  1. Set content HTML với meta tags
  2. Kiểm tra viewport meta tag có content đúng
  3. Kiểm tra charset meta tag
- **Expected**: Meta tags được cấu hình đúng:
  - Viewport: "width=device-width, initial-scale=1.0"
  - Charset: "UTF-8"

### 3. **BASIC-TC-003**: JavaScript Execution

- **Mô tả**: Kiểm tra JavaScript có thể execute đúng
- **Steps**:
  1. Set content HTML với JavaScript code
  2. Wait for JavaScript execution
  3. Kiểm tra element được update bởi JavaScript
- **Expected**: JavaScript execute thành công và update DOM

### 4. **BASIC-TC-004**: Form Interactions

- **Mô tả**: Kiểm tra form interactions và event handling
- **Steps**:
  1. Set content HTML với form
  2. Fill form với test data
  3. Submit form
  4. Kiểm tra result được hiển thị
- **Expected**: Form interaction hoạt động đúng và result hiển thị

## 🔧 Test Data

### HTML Content Templates

```html
<!-- Basic Page Template -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Expense Manager</title>
  </head>
  <body>
    <h1>Expense Manager</h1>
    <p>Welcome to the Expense Manager application</p>
  </body>
</html>

<!-- Form Template -->
<form id="test-form">
  <input type="email" id="email" placeholder="Email" required />
  <input type="password" id="password" placeholder="Password" required />
  <button type="submit">Submit</button>
</form>
<div id="result"></div>
```

### JavaScript Code

```javascript
// Basic DOM manipulation
document.getElementById("test").textContent = "JavaScript works!";

// Form submission handler
document.getElementById("test-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  document.getElementById("result").textContent =
    "Form submitted with: " + email;
});
```

### Test Form Data

```javascript
const formData = {
  email: "test@example.com",
  password: "password123",
};
```

## 🎭 Test Scenarios

### HTML Rendering Scenarios

1. **Basic HTML**: Simple HTML structure → Render correctly
2. **Meta Tags**: Proper meta tags → Configure correctly
3. **Title**: Page title → Display correctly

### JavaScript Execution Scenarios

1. **DOM Manipulation**: JavaScript update DOM → Element updated
2. **Event Handling**: Form submission → Event triggered
3. **Async Operations**: Wait for execution → Complete successfully

### Form Interaction Scenarios

1. **Form Fill**: Fill form fields → Values set correctly
2. **Form Submit**: Submit form → Handler executed
3. **Form Validation**: Required fields → Validation works

## 📊 Expected Results

- **Total Test Cases**: 4
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% basic web functionality
- **Performance**: Mỗi test hoàn thành trong < 2 giây

## 🚨 Known Issues

- Tests sử dụng static HTML content thay vì real app
- JavaScript execution test có thể không stable
- Form interaction test phụ thuộc vào event handling
- Meta tags test có thể không comprehensive

## 📝 Notes

- Tests sử dụng `page.setContent()` để set HTML content
- Tests không phụ thuộc vào real server
- Tests có thể chạy offline
- Tests validate basic web standards

## 🔗 Dependencies

- Playwright browser engine
- JavaScript execution environment
- DOM manipulation capabilities
- Event handling system

## 🛠️ Technical Implementation

### HTML Content Setting

```javascript
await page.setContent(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Manager</title>
  </head>
  <body>
    <h1>Expense Manager</h1>
    <p>Welcome to the Expense Manager application</p>
  </body>
  </html>
`);
```

### JavaScript Execution Waiting

```javascript
await page.waitForFunction(() => {
  const element = document.getElementById("test");
  return element && element.textContent === "JavaScript works!";
});
```

### Form Interaction

```javascript
// Fill form
await page.fill("#email", "test@example.com");
await page.fill("#password", "password123");

// Submit form
await page.click('button[type="submit"]');

// Check result
await expect(
  page.getByText("Form submitted with: test@example.com")
).toBeVisible();
```

## 🎯 Business Rules

### Web Standards Compliance

1. HTML phải valid và semantic
2. Meta tags phải được cấu hình đúng
3. JavaScript phải execute không có errors
4. Forms phải handle events đúng cách
5. DOM manipulation phải hoạt động

### Performance Requirements

1. HTML rendering phải nhanh
2. JavaScript execution phải không block UI
3. Form interactions phải responsive
4. Event handling phải efficient

## 🔄 Integration Points

### Browser Compatibility

- Tests validate basic web functionality
- Tests ensure cross-browser compatibility
- Tests verify JavaScript execution
- Tests check DOM manipulation

### Web Standards

- HTML5 compliance
- CSS3 support
- JavaScript ES6+ features
- Responsive design principles

## 📋 Test Checklist

### HTML Structure

- [ ] DOCTYPE declaration
- [ ] HTML lang attribute
- [ ] Meta charset
- [ ] Meta viewport
- [ ] Title tag
- [ ] Semantic HTML elements

### JavaScript Functionality

- [ ] DOM manipulation
- [ ] Event handling
- [ ] Form submission
- [ ] Async operations
- [ ] Error handling

### Form Interactions

- [ ] Input validation
- [ ] Form submission
- [ ] Event listeners
- [ ] Data handling
- [ ] User feedback
