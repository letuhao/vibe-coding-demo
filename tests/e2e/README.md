# E2E Tests với Playwright

## 🎯 Mục đích
End-to-End testing cho Expense Manager App sử dụng Playwright.

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
cd tests/e2e
npm install

# Cài đặt Playwright browsers
npx playwright install
```

## 🧪 Chạy Tests

```bash
# Chạy tất cả tests
npm test

# Chạy với UI
npm run test:ui

# Chạy với browser hiển thị
npm run test:headed

# Debug mode
npm run test:debug

# Xem report
npm run test:report
```

## 📁 Cấu trúc

```
tests/e2e/
├── playwright/
│   ├── auth.spec.ts          # Authentication tests
│   ├── dashboard.spec.ts     # Dashboard tests
│   ├── categories.spec.ts    # Categories management tests
│   └── expenses.spec.ts      # Expenses management tests
├── playwright.config.ts      # Playwright configuration
└── package.json
```

## 🔧 Cấu hình

### Browsers được test:
- ✅ Chrome (Desktop)
- ✅ Firefox (Desktop)  
- ✅ Safari (Desktop)
- ✅ Chrome (Mobile)
- ✅ Safari (Mobile)

### Features:
- ✅ Auto-start backend & frontend
- ✅ Screenshot on failure
- ✅ Video recording on failure
- ✅ Trace on retry
- ✅ HTML report
- ✅ JSON report

## 📊 Test Coverage

### Authentication Flow:
- ✅ Login form validation
- ✅ Register form validation
- ✅ Navigation between auth pages

### Dashboard:
- ✅ Welcome message
- ✅ Navigation links
- ✅ User info display

### Categories:
- ✅ Add category form
- ✅ Validation errors
- ✅ Categories list
- ✅ Statistics display

### Expenses:
- ✅ Add expense form
- ✅ Validation errors
- ✅ Expenses list
- ✅ Statistics display
- ✅ Filters

## 🐛 Debugging

```bash
# Debug specific test
npx playwright test auth.spec.ts --debug

# Debug specific browser
npx playwright test --project=chromium --debug

# Run with trace
npx playwright test --trace=on
```

## 📈 CI/CD

Tests tự động chạy trên:
- ✅ Push to main/develop
- ✅ Pull requests
- ✅ Multiple browsers
- ✅ Mobile devices

## 🔍 Best Practices

1. **Page Object Model**: Tạo page objects cho complex pages
2. **Data Test IDs**: Sử dụng `data-testid` cho stable selectors
3. **Wait Strategies**: Sử dụng `waitFor` thay vì `sleep`
4. **Mock Data**: Mock API responses khi cần
5. **Screenshots**: Tự động capture screenshots khi fail
