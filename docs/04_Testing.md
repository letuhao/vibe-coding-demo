# 04_Testing.md

## Tổng quan
Testing strategy và implementation cho Expense Manager App, bao gồm Unit Tests, Integration Tests và E2E Tests.

---

## Testing Strategy

### Testing Pyramid
```
        /\
       /  \
      / E2E \     (5%) - End-to-End Tests
     /______\
    /        \
   /Integration\  (15%) - Integration Tests
  /____________\
 /              \
/   Unit Tests   \  (80%) - Unit Tests
/________________\
```

### Coverage Requirements
- **Unit Tests**: ≥ 70% code coverage
- **Integration Tests**: Critical API endpoints
- **E2E Tests**: Complete user journeys

---

## Unit Testing

### Framework Setup
```json
// package.json
{
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "jest": "^29.0.0",
    "supertest": "^6.0.0",
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.0.0"
  }
}
```

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

---

## Backend Unit Tests

### Service Layer Tests

**ExpenseService Tests:**
```typescript
// src/expenses/expenses.service.spec.ts
describe('ExpenseService', () => {
  let service: ExpenseService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: PrismaService,
          useValue: {
            expense: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn()
            }
          }
        }
      ]
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create expense successfully', async () => {
      const createExpenseDto = {
        amount: 50000,
        note: 'Lunch',
        date: '2024-01-15',
        categoryId: 'uuid'
      };
      const userId = 'user-uuid';
      const expectedExpense = { id: 'uuid', ...createExpenseDto };

      jest.spyOn(prismaService.expense, 'create').mockResolvedValue(expectedExpense);

      const result = await service.create(userId, createExpenseDto);

      expect(result).toEqual(expectedExpense);
      expect(prismaService.expense.create).toHaveBeenCalledWith({
        data: { ...createExpenseDto, userId }
      });
    });

    it('should throw error when amount is negative', async () => {
      const createExpenseDto = {
        amount: -1000,
        note: 'Invalid',
        date: '2024-01-15',
        categoryId: 'uuid'
      };

      await expect(service.create('user-uuid', createExpenseDto))
        .rejects.toThrow('Amount must be greater than 0');
    });
  });
});
```

---

## Frontend Unit Tests

### Component Tests

**ExpenseForm Tests:**
```typescript
// src/components/ExpenseForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseForm } from './ExpenseForm';

describe('ExpenseForm', () => {
  const mockOnSubmit = jest.fn();
  const mockCategories = [
    { id: '1', name: 'Food & Dining', type: 'EXPENSE' }
  ];

  it('should render form fields', () => {
    render(<ExpenseForm onSubmit={mockOnSubmit} categories={mockCategories} />);

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    render(<ExpenseForm onSubmit={mockOnSubmit} categories={mockCategories} />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '50000' } });
    fireEvent.change(screen.getByLabelText(/note/i), { target: { value: 'Lunch' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2024-01-15' } });
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: 50000,
        note: 'Lunch',
        date: '2024-01-15',
        categoryId: '1'
      });
    });
  });
});
```

---

## Integration Tests

### API Integration Tests

**Expense API Tests:**
```typescript
// test/expenses.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Expenses API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create test user and get token
    const authResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      });

    accessToken = authResponse.body.data.tokens.accessToken;
  });

  describe('POST /expenses', () => {
    it('should create expense', async () => {
      const createExpenseDto = {
        amount: 50000,
        note: 'Test expense',
        date: '2024-01-15',
        categoryId: 'category-uuid'
      };

      const response = await request(app.getHttpServer())
        .post('/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createExpenseDto)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.amount).toBe(50000);
    });
  });
});
```

---

## E2E Tests

### Playwright Setup

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
```

### E2E Test Scenarios

**User Registration Flow:**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');

    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="confirmPassword"]', 'password123');

    await page.click('[data-testid="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome');
  });
});
```

---

## Test Commands

### Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:integration": "jest --testPathPattern=integration",
    "test:unit": "jest --testPathPattern=unit"
  }
}
```

---

## Best Practices

### Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### Mocking Strategy
- Mock external dependencies
- Use real implementations for internal services
- Mock at the right level (service vs repository)

### Test Data
- Use factories for test data creation
- Clean up test data after each test
- Use meaningful test data that reflects real usage