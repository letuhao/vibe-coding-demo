# 07_Performance_Spec.md - Đặc Tả Kịch Bản Test Performance & Accessibility

## 📋 Thông Tin Cơ Bản

- **ID**: `PERF-001`
- **Tên File**: `performance.spec.ts`
- **Mô Tả**: Kịch bản test cho Performance và Accessibility của ứng dụng
- **Mục Tiêu**: Kiểm tra performance metrics, accessibility và cross-browser compatibility
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra các khía cạnh performance và accessibility:

- Page load performance
- Performance metrics (DOM, Load time)
- Large dataset handling
- Accessibility compliance (WCAG)
- Cross-browser compatibility
- Mobile responsiveness
- Touch targets và gestures

## 📝 Danh Sách Test Cases

### Performance Tests

### 1. **PERF-TC-001**: Page Load Time

- **Mô tả**: Kiểm tra thời gian load page trong giới hạn cho phép
- **Steps**:
  1. Record start time
  2. Navigate to `http://localhost:5173/`
  3. Record end time
  4. Calculate load time
  5. Assert load time < 3000ms
- **Expected**: Page load trong < 3 giây

### 2. **PERF-TC-002**: Performance Metrics

- **Mô tả**: Kiểm tra các performance metrics chi tiết
- **Steps**:
  1. Navigate to `http://localhost:5173/`
  2. Extract performance metrics:
     - DOM Content Loaded time
     - Load Complete time
     - Total time
  3. Assert metrics trong giới hạn
- **Expected**:
  - DOM Content Loaded < 1000ms
  - Load Complete < 2000ms
  - Total time < 3000ms

### 3. **PERF-TC-003**: Large Dataset Handling

- **Mô tả**: Kiểm tra xử lý dataset lớn hiệu quả
- **Steps**:
  1. Mock API với 1000 expenses
  2. Record start time
  3. Navigate to `/expenses`
  4. Record end time
  5. Assert load time < 5000ms
- **Expected**: Handle large dataset trong < 5 giây

### Accessibility Tests

### 4. **A11Y-TC-001**: Heading Hierarchy

- **Mô tả**: Kiểm tra heading hierarchy đúng chuẩn
- **Steps**:
  1. Navigate to `http://localhost:5173/`
  2. Check H1 elements
  3. Check H2 elements
  4. Verify proper hierarchy
- **Expected**: Proper heading hierarchy (H1 → H2 → H3...)

### 5. **A11Y-TC-002**: Form Labels

- **Mô tả**: Kiểm tra form inputs có proper labels
- **Steps**:
  1. Navigate to `/login`
  2. Check email input có label
  3. Check password input có label
  4. Verify accessibility
- **Expected**: Tất cả form inputs có proper labels

### 6. **A11Y-TC-003**: Button Accessibility

- **Mô tả**: Kiểm tra button accessibility
- **Steps**:
  1. Navigate to `/login`
  2. Find login button
  3. Check button có proper role và accessible name
  4. Test focus state
- **Expected**: Button accessible và focusable

### 7. **A11Y-TC-004**: Keyboard Navigation

- **Mô tả**: Kiểm tra keyboard navigation
- **Steps**:
  1. Navigate to `/login`
  2. Press Tab multiple times
  3. Check focus moves correctly
  4. Verify focus on login button
- **Expected**: Keyboard navigation hoạt động đúng

### 8. **A11Y-TC-005**: Color Contrast

- **Mô tả**: Kiểm tra color contrast đủ tốt
- **Steps**:
  1. Navigate to `http://localhost:5173/`
  2. Check text elements
  3. Verify text không transparent
  4. Check contrast ratio
- **Expected**: Text có contrast đủ tốt (không transparent)

### 9. **A11Y-TC-006**: ARIA Attributes

- **Mô tả**: Kiểm tra ARIA attributes
- **Steps**:
  1. Navigate to `/login`
  2. Check email input có type="email"
  3. Check password input có type="password"
  4. Verify proper ARIA attributes
- **Expected**: Form inputs có proper ARIA attributes

### 10. **A11Y-TC-007**: Screen Reader Friendly

- **Mô tả**: Kiểm tra screen reader compatibility
- **Steps**:
  1. Navigate to `http://localhost:5173/`
  2. Check main heading (H1)
  3. Check main landmark
  4. Verify screen reader accessibility
- **Expected**: Content accessible cho screen readers

### Cross-Browser Compatibility Tests

### 11. **BROWSER-TC-001**: Chrome Compatibility

- **Mô tả**: Kiểm tra hoạt động trên Chrome
- **Steps**:
  1. Check browser name là 'chromium'
  2. Navigate to `http://localhost:5173/`
  3. Verify heading hiển thị
- **Expected**: App hoạt động trên Chrome

### 12. **BROWSER-TC-002**: Firefox Compatibility

- **Mô tả**: Kiểm tra hoạt động trên Firefox
- **Steps**:
  1. Check browser name là 'firefox'
  2. Navigate to `http://localhost:5173/`
  3. Verify heading hiển thị
- **Expected**: App hoạt động trên Firefox

### 13. **BROWSER-TC-003**: Safari Compatibility

- **Mô tả**: Kiểm tra hoạt động trên Safari
- **Steps**:
  1. Check browser name là 'webkit'
  2. Navigate to `http://localhost:5173/`
  3. Verify heading hiển thị
- **Expected**: App hoạt động trên Safari

### Mobile Responsiveness Tests

### 14. **MOBILE-TC-001**: Mobile Device Support

- **Mô tả**: Kiểm tra hoạt động trên mobile devices
- **Steps**:
  1. Set mobile viewport (375x667)
  2. Navigate to `http://localhost:5173/`
  3. Verify page accessible
- **Expected**: App hoạt động trên mobile

### 15. **MOBILE-TC-002**: Touch Targets

- **Mô tả**: Kiểm tra touch targets đủ lớn
- **Steps**:
  1. Set mobile viewport (375x667)
  2. Navigate to `/login`
  3. Check login button size
  4. Verify minimum 44px height
- **Expected**: Touch targets ≥ 44px (minimum size)

### 16. **MOBILE-TC-003**: Mobile Gestures

- **Mô tả**: Kiểm tra mobile gestures
- **Steps**:
  1. Set mobile viewport (375x667)
  2. Navigate to `http://localhost:5173/`
  3. Test tap gesture
  4. Verify response
- **Expected**: Mobile gestures hoạt động

## 🔧 Test Data

### Performance Thresholds

```javascript
const performanceThresholds = {
  pageLoadTime: 3000, // 3 seconds
  domContentLoaded: 1000, // 1 second
  loadComplete: 2000, // 2 seconds
  largeDatasetTime: 5000, // 5 seconds
  touchTargetSize: 44, // 44px minimum
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

### Large Dataset Mock

```javascript
const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
  id: i.toString(),
  amount: Math.random() * 1000,
  note: `Expense ${i}`,
  date: new Date().toISOString(),
  categoryId: "1",
}));
```

## 🎭 Test Scenarios

### Performance Scenarios

1. **Fast Loading**: Page load nhanh → Under threshold
2. **Large Data**: Handle large dataset → Efficient processing
3. **Resource Optimization**: Minimal resource usage → Good metrics

### Accessibility Scenarios

1. **Screen Reader**: Content accessible → Proper structure
2. **Keyboard Navigation**: Tab navigation → Works correctly
3. **Color Contrast**: Text readable → Sufficient contrast
4. **Form Labels**: Inputs labeled → Proper accessibility

### Cross-Browser Scenarios

1. **Chrome**: Modern browser → Full functionality
2. **Firefox**: Alternative browser → Compatible
3. **Safari**: WebKit browser → Compatible

### Mobile Scenarios

1. **Responsive Design**: Mobile viewport → Adapts correctly
2. **Touch Interface**: Touch targets → Adequate size
3. **Mobile Gestures**: Touch interactions → Work properly

## 📊 Expected Results

- **Total Test Cases**: 16
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% performance và accessibility
- **Performance**: All metrics trong threshold
- **Accessibility**: WCAG 2.1 AA compliance

## 🚨 Known Issues

- Performance metrics có thể vary trên different machines
- Cross-browser tests phụ thuộc vào browser configuration
- Mobile tests có thể không chính xác trên all devices
- Accessibility tests có thể cần manual verification

## 📝 Notes

- Tests sử dụng Playwright performance APIs
- Tests có thể chạy trên multiple browsers
- Tests validate web standards compliance
- Tests ensure good user experience

## 🔗 Dependencies

- Playwright browser engines
- Performance measurement APIs
- Accessibility testing tools
- Cross-browser testing infrastructure

## 🛠️ Technical Implementation

### Performance Measurement

```javascript
const startTime = Date.now();
await page.goto("http://localhost:5173/");
const loadTime = Date.now() - startTime;
expect(loadTime).toBeLessThan(3000);

// Detailed metrics
const metrics = await page.evaluate(() => {
  const navigation = performance.getEntriesByType("navigation")[0];
  return {
    domContentLoaded:
      navigation.domContentLoadedEventEnd -
      navigation.domContentLoadedEventStart,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    totalTime: navigation.loadEventEnd - navigation.fetchStart,
  };
});
```

### Accessibility Testing

```javascript
// Check heading hierarchy
const h1 = page.locator("h1");
const h2 = page.locator("h2");
await expect(h1.first()).toBeVisible();

// Check form labels
const emailInput = page.getByLabel(/email/i);
await expect(emailInput).toBeVisible();

// Check button accessibility
const loginButton = page.getByRole("button", { name: /login/i });
await expect(loginButton).toBeVisible();
await loginButton.focus();
await expect(loginButton).toBeFocused();
```

### Cross-Browser Testing

```javascript
test("should work in Chrome", async ({ page, browserName }) => {
  if (browserName === "chromium") {
    await page.goto("http://localhost:5173/");
    await expect(page.getByRole("heading")).toBeVisible();
  }
});
```

### Mobile Testing

```javascript
// Set mobile viewport
await page.setViewportSize({ width: 375, height: 667 });

// Check touch target size
const loginButton = page.getByRole("button", { name: /login/i });
const box = await loginButton.boundingBox();
expect(box.height).toBeGreaterThanOrEqual(44);
```

## 🎯 Business Rules

### Performance Requirements

1. Page load time < 3 seconds
2. DOM ready < 1 second
3. Large datasets < 5 seconds
4. Smooth user interactions
5. Minimal resource usage

### Accessibility Requirements

1. WCAG 2.1 AA compliance
2. Screen reader compatible
3. Keyboard navigation support
4. Sufficient color contrast
5. Proper semantic structure

### Cross-Browser Requirements

1. Chrome compatibility
2. Firefox compatibility
3. Safari compatibility
4. Consistent functionality
5. No browser-specific bugs

### Mobile Requirements

1. Responsive design
2. Touch-friendly interface
3. Adequate touch targets
4. Mobile gesture support
5. Performance on mobile devices
