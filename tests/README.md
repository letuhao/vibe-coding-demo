# Vibe Coding Demo - Test Suite

This directory contains comprehensive integration tests for the Expense Manager application.

## 📁 Test Structure

```
tests/
├── integration/          # Integration tests
│   ├── auth.test.js      # Authentication tests
│   ├── categories.test.js # Categories CRUD tests
│   └── expenses.test.js  # Expenses CRUD tests
├── unit/                 # Unit tests (future)
├── e2e/                  # End-to-end tests (future)
├── fixtures/             # Test data and fixtures
│   └── test-data.json    # Sample test data
├── utils/                # Test utilities
│   └── test-helper.js    # Common test helpers
├── run-all-tests.js      # Main test runner
└── package.json          # Test dependencies
```

## 🚀 Running Tests

### Prerequisites

1. **Start the Backend Server**:
   ```bash
   cd apps/backend
   npm run start:dev
   ```

2. **Install Test Dependencies**:
   ```bash
   cd tests
   npm install
   ```

### Run All Tests

```bash
npm test
```

### Run Individual Test Suites

```bash
# Authentication tests only
npm run test:auth

# Categories tests only
npm run test:categories

# Expenses tests only
npm run test:expenses
```

### Watch Mode (Auto-rerun on changes)

```bash
npm run test:watch
```

## 🧪 Test Coverage

### Authentication Tests
- ✅ User registration
- ✅ User login
- ✅ Get user profile
- ✅ Refresh token
- ✅ Invalid credentials handling
- ✅ Invalid registration data
- ✅ Unauthorized access

### Categories Tests
- ✅ Create category
- ✅ Get all categories
- ✅ Get categories with type filter
- ✅ Get category statistics
- ✅ Get specific category
- ✅ Update category
- ✅ Create duplicate category (error handling)
- ✅ Delete category

### Expenses Tests
- ✅ Create expense
- ✅ Get all expenses
- ✅ Get expenses with filters
- ✅ Get expense statistics
- ✅ Get expenses by category
- ✅ Get specific expense
- ✅ Update expense
- ✅ Create expense with invalid category (error handling)
- ✅ Delete expense

## 🔧 Test Configuration

### Environment Variables

- `API_URL`: Backend API URL (default: http://localhost:3000)
- `TIMEOUT`: Request timeout in ms (default: 10000)
- `RETRY_ATTEMPTS`: Number of retry attempts (default: 3)
- `RETRY_DELAY`: Delay between retries in ms (default: 1000)

### Test Data

Test data is defined in `fixtures/test-data.json` and includes:
- Sample users for authentication
- Sample categories for testing
- Sample expenses for testing
- Invalid data for error testing

## 📊 Test Results

The test runner provides detailed output including:
- Individual test results
- Error messages and stack traces
- Summary statistics
- Success rate percentage

## 🐛 Troubleshooting

### Common Issues

1. **Server Not Ready**:
   - Ensure backend is running on port 3000
   - Check if database is properly initialized

2. **Authentication Failures**:
   - Verify JWT configuration
   - Check if user registration is working

3. **Database Errors**:
   - Ensure Prisma migrations are applied
   - Check database connection

4. **Network Timeouts**:
   - Increase timeout in test configuration
   - Check if server is responding

### Debug Mode

Set `DEBUG=true` environment variable for verbose logging:

```bash
DEBUG=true npm test
```

## 🔄 Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Integration Tests
  run: |
    cd tests
    npm install
    npm test
```

## 📈 Adding New Tests

1. Create new test file in appropriate directory
2. Extend the base `TestHelper` class
3. Add test methods following naming convention
4. Update the main test runner if needed
5. Add test data to fixtures if required

## 🎯 Best Practices

- Use descriptive test names
- Test both success and error cases
- Clean up test data after each test
- Use meaningful assertions
- Group related tests together
- Keep tests independent and isolated
