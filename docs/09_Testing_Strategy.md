# 09_Testing_Strategy

## 🎯 Tổng quan Testing Strategy

Dự án Expense Manager sử dụng **Testing Pyramid** với 3 tầng testing chính:

```
    ┌─────────────────┐
    │   E2E Tests     │ ← Playwright (UI + API)
    │   (26 tests)    │
    ├─────────────────┤
    │ Integration     │ ← Mocha + Supertest (API)
    │   (15 tests)    │
    ├─────────────────┤
    │   Unit Tests    │ ← Jest + Vitest (Logic)
    │   (28 tests)    │
    └─────────────────┘
```

## 🧪 Test Suites

### 1. **Unit Tests** (28 tests)
- **Backend**: Jest + Supertest
- **Frontend**: Vitest + React Testing Library
- **Coverage**: 80%+ statements, branches, functions, lines

**Backend Unit Tests:**
```bash
cd apps/backend
npm run test:unit:cov
```

**Frontend Unit Tests:**
```bash
cd apps/frontend
npm run test:run
```

### 2. **Integration Tests** (15 tests)
- **Framework**: Mocha + Supertest
- **Scope**: API endpoints, database operations
- **Coverage**: 100% API endpoints

```bash
cd tests
npm test
```

### 3. **E2E Tests** (26 tests)
- **Framework**: Playwright
- **Browsers**: Chrome, Firefox, Safari (Desktop + Mobile)
- **Scope**: Complete user workflows

```bash
cd tests/e2e
npm test
```

## 🚀 Chạy Tests

### Chạy tất cả tests:
```bash
npm test
```

### Chạy từng loại test:
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Chạy specific test suites:
```bash
# Backend only
npm run test:backend

# Frontend only
npm run test:frontend

# Auth tests only
npm run test:auth

# Categories tests only
npm run test:categories

# Expenses tests only
npm run test:expenses
```

## 📊 Test Coverage

### Backend Coverage:
- **Statements**: 85%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 85%+

### Frontend Coverage:
- **Statements**: 70%+
- **Branches**: 65%+
- **Functions**: 70%+
- **Lines**: 70%+

### Overall Coverage:
- **Target**: 80%+
- **Current**: 75%+

## 🔧 Test Configuration

### Jest (Backend):
```javascript
// apps/backend/jest.config.js
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}
```

### Vitest (Frontend):
```javascript
// apps/frontend/vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
```

### Playwright (E2E):
```typescript
// tests/e2e/playwright.config.ts
export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

## 🎯 Test Scenarios

### Authentication Flow:
- ✅ User registration
- ✅ User login
- ✅ Form validation
- ✅ Error handling
- ✅ Token management

### Categories Management:
- ✅ Create category
- ✅ Update category
- ✅ Delete category
- ✅ List categories
- ✅ Category statistics

### Expenses Management:
- ✅ Create expense
- ✅ Update expense
- ✅ Delete expense
- ✅ List expenses
- ✅ Filter expenses
- ✅ Expense statistics

### Dashboard:
- ✅ Navigation
- ✅ User info
- ✅ Statistics display

## 🔍 Debugging Tests

### Unit Tests:
```bash
# Debug specific test
cd apps/backend
npm run test:debug -- --testNamePattern="AuthService"

# Watch mode
cd apps/frontend
npm run test:watch
```

### Integration Tests:
```bash
# Debug specific test
cd tests
npm run test:watch -- --grep "should register user"
```

### E2E Tests:
```bash
# Debug mode
cd tests/e2e
npm run test:debug

# UI mode
npm run test:ui

# Specific test
npx playwright test auth.spec.ts --debug
```

## 📈 CI/CD Integration

### GitHub Actions:
- ✅ **Comprehensive Tests**: Unit + Integration + E2E
- ✅ **Multi-OS**: Ubuntu, Windows, macOS
- ✅ **Multi-Node**: v18, v20
- ✅ **Coverage Reports**: Automatic generation
- ✅ **Security Audit**: Dependency scanning
- ✅ **PR Comments**: Coverage reports

### Test Reports:
- ✅ **HTML Reports**: Playwright HTML report
- ✅ **JSON Reports**: Machine-readable format
- ✅ **Coverage Reports**: Detailed coverage analysis
- ✅ **Artifacts**: Test results, screenshots, videos

## 🛠️ Best Practices

### 1. **Test Organization**:
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. **Mocking**:
- Mock external dependencies
- Use factory functions for test data
- Keep mocks simple and focused

### 3. **Assertions**:
- Use specific matchers
- Test behavior, not implementation
- Include edge cases

### 4. **Performance**:
- Run tests in parallel when possible
- Use appropriate timeouts
- Clean up after tests

### 5. **Maintenance**:
- Keep tests up to date
- Refactor tests with code changes
- Remove obsolete tests

## 🚨 Troubleshooting

### Common Issues:

1. **Test Timeouts**:
   - Increase timeout in config
   - Check for async operations
   - Verify test cleanup

2. **Flaky Tests**:
   - Add proper waits
   - Use stable selectors
   - Mock external dependencies

3. **Coverage Issues**:
   - Check coverage thresholds
   - Exclude test files
   - Verify source maps

4. **E2E Failures**:
   - Check browser compatibility
   - Verify test data
   - Review screenshots/videos

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
