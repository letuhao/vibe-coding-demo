/**
 * @fileoverview Test Setup - Global test configuration
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.PORT = '3001';

// Mock console methods to reduce noise in tests
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  createMockUser: () => ({
    id: 'test-user-id',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  
  createMockCategory: () => ({
    id: 'test-category-id',
    name: 'Test Category',
    type: 'EXPENSE',
    userId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  
  createMockExpense: () => ({
    id: 'test-expense-id',
    amount: 100.50,
    note: 'Test expense',
    date: new Date(),
    categoryId: 'test-category-id',
    userId: 'test-user-id',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};
