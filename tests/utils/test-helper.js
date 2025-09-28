/**
 * @fileoverview Test Helper Utilities - Common testing utilities
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

const axios = require('axios');

/**
 * Test configuration
 */
const CONFIG = {
  BASE_URL: process.env.API_URL || 'http://localhost:3000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * Test helper class
 */
class TestHelper {
  constructor() {
    this.authToken = '';
    this.refreshToken = '';
    this.userId = '';
    this.testData = {
      categories: [],
      expenses: [],
    };
  }

  /**
   * Create axios instance with default config
   * @returns {Object} Axios instance
   */
  createApiClient() {
    return axios.create({
      baseURL: CONFIG.BASE_URL,
      timeout: CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create authenticated axios instance
   * @returns {Object} Authenticated axios instance
   */
  createAuthClient() {
    const client = this.createApiClient();
    
    client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });

    return client;
  }

  /**
   * Test wrapper with retry logic
   * @param {string} name - Test name
   * @param {Function} testFn - Test function
   * @param {Object} options - Test options
   */
  async test(name, testFn, options = {}) {
    const { retries = CONFIG.RETRY_ATTEMPTS, delay = CONFIG.RETRY_DELAY } = options;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`\n🧪 Testing: ${name} (Attempt ${attempt}/${retries})`);
        await testFn();
        console.log(`✅ PASSED: ${name}`);
        return;
      } catch (error) {
        console.log(`❌ FAILED: ${name} (Attempt ${attempt}/${retries})`);
        console.log(`   Error: ${error.message}`);
        
        if (attempt === retries) {
          if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
          }
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Setup test user
   * @returns {Object} User data
   */
  async setupTestUser() {
    const api = this.createApiClient();
    
    // Try to register a new user
    try {
      const response = await api.post('/auth/register', {
        email: `test-${Date.now()}@example.com`,
        password: 'Test123456',
        confirmPassword: 'Test123456',
      });
      
      this.authToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      this.userId = response.data.user.id;
      
      console.log(`   Test user created: ${response.data.user.email}`);
      return response.data.user;
    } catch (error) {
      // If registration fails, try to login with existing user
      if (error.response?.status === 409) {
        const response = await api.post('/auth/login', {
          email: 'test@example.com',
          password: 'Test123456',
        });
        
        this.authToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        this.userId = response.data.user.id;
        
        console.log(`   Using existing test user: ${response.data.user.email}`);
        return response.data.user;
      }
      throw error;
    }
  }

  /**
   * Cleanup test data
   */
  async cleanup() {
    if (!this.authToken) return;
    
    const api = this.createAuthClient();
    
    try {
      // Delete all test expenses
      for (const expense of this.testData.expenses) {
        try {
          await api.delete(`/expenses/${expense.id}`);
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
      
      // Delete all test categories
      for (const category of this.testData.categories) {
        try {
          await api.delete(`/categories/${category.id}`);
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
      
      console.log('   Test data cleaned up');
    } catch (error) {
      console.log('   Cleanup failed:', error.message);
    }
  }

  /**
   * Wait for server to be ready
   * @param {number} maxAttempts - Maximum attempts
   * @param {number} delay - Delay between attempts
   */
  async waitForServer(maxAttempts = 30, delay = 1000) {
    const api = this.createApiClient();
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await api.get('/health');
        console.log('   Server is ready');
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error('Server is not ready after maximum attempts');
        }
        console.log(`   Waiting for server... (${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Generate test data
   * @param {string} type - Data type
   * @returns {Object} Test data
   */
  generateTestData(type) {
    const timestamp = Date.now();
    
    switch (type) {
      case 'category':
        return {
          name: `Test Category ${timestamp}`,
          type: 'EXPENSE',
        };
      
      case 'expense':
        return {
          amount: Math.random() * 100 + 10,
          note: `Test expense ${timestamp}`,
          date: new Date().toISOString().split('T')[0],
          categoryId: this.testData.categories[0]?.id || '',
        };
      
      case 'user':
        return {
          email: `test-${timestamp}@example.com`,
          password: 'Test123456',
          confirmPassword: 'Test123456',
        };
      
      default:
        return {};
    }
  }

  /**
   * Assert helper
   * @param {*} actual - Actual value
   * @param {*} expected - Expected value
   * @param {string} message - Assertion message
   */
  assert(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}: Expected ${expected}, got ${actual}`);
    }
  }

  /**
   * Assert array length
   * @param {Array} array - Array to check
   * @param {number} expectedLength - Expected length
   * @param {string} message - Assertion message
   */
  assertLength(array, expectedLength, message) {
    if (array.length !== expectedLength) {
      throw new Error(`${message}: Expected length ${expectedLength}, got ${array.length}`);
    }
  }

  /**
   * Assert object has property
   * @param {Object} obj - Object to check
   * @param {string} property - Property name
   * @param {string} message - Assertion message
   */
  assertHasProperty(obj, property, message) {
    if (!(property in obj)) {
      throw new Error(`${message}: Object missing property '${property}'`);
    }
  }
}

module.exports = { TestHelper, CONFIG };
