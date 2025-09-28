/**
 * @fileoverview Auth Integration Tests - Authentication API tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

const { TestHelper } = require('../utils/test-helper');

/**
 * Auth integration tests
 */
class AuthTests {
  constructor() {
    this.helper = new TestHelper();
    this.api = this.helper.createApiClient();
  }

  /**
   * Test user registration
   */
  async testRegistration() {
    await this.helper.test('User Registration', async () => {
      const userData = this.helper.generateTestData('user');
      
      const response = await this.api.post('/auth/register', userData);
      
      this.helper.assertHasProperty(response.data, 'user', 'Response should have user');
      this.helper.assertHasProperty(response.data, 'accessToken', 'Response should have accessToken');
      this.helper.assertHasProperty(response.data, 'refreshToken', 'Response should have refreshToken');
      
      this.helper.authToken = response.data.accessToken;
      this.helper.refreshToken = response.data.refreshToken;
      this.helper.userId = response.data.user.id;
      
      console.log(`   User ID: ${this.helper.userId}`);
      console.log(`   Email: ${response.data.user.email}`);
    });
  }

  /**
   * Test user login
   */
  async testLogin() {
    await this.helper.test('User Login', async () => {
      const response = await this.api.post('/auth/login', {
        email: 'test@example.com',
        password: 'Test123456',
      });
      
      this.helper.assertHasProperty(response.data, 'user', 'Response should have user');
      this.helper.assertHasProperty(response.data, 'accessToken', 'Response should have accessToken');
      this.helper.assertHasProperty(response.data, 'refreshToken', 'Response should have refreshToken');
      
      this.helper.authToken = response.data.accessToken;
      this.helper.refreshToken = response.data.refreshToken;
      this.helper.userId = response.data.user.id;
      
      console.log(`   User ID: ${this.helper.userId}`);
      console.log(`   Email: ${response.data.user.email}`);
    });
  }

  /**
   * Test get user profile
   */
  async testGetProfile() {
    await this.helper.test('Get User Profile', async () => {
      const authApi = this.helper.createAuthClient();
      
      const response = await authApi.get('/auth/profile');
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assertHasProperty(response.data.data, 'id', 'User should have id');
      this.helper.assertHasProperty(response.data.data, 'email', 'User should have email');
      
      console.log(`   Profile ID: ${response.data.data.id}`);
      console.log(`   Profile Email: ${response.data.data.email}`);
    });
  }

  /**
   * Test refresh token
   */
  async testRefreshToken() {
    await this.helper.test('Refresh Token', async () => {
      const response = await this.api.post('/auth/refresh', {
        refreshToken: this.helper.refreshToken,
      });
      
      this.helper.assertHasProperty(response.data, 'accessToken', 'Response should have accessToken');
      
      this.helper.authToken = response.data.accessToken;
      
      console.log(`   New token received: ${this.helper.authToken ? 'Yes' : 'No'}`);
    });
  }

  /**
   * Test invalid credentials
   */
  async testInvalidCredentials() {
    await this.helper.test('Invalid Login Credentials', async () => {
      try {
        await this.api.post('/auth/login', {
          email: 'invalid@example.com',
          password: 'wrongpassword',
        });
        throw new Error('Should have failed with invalid credentials');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`   Correctly returned 401 Unauthorized`);
        } else {
          throw error;
        }
      }
    });
  }

  /**
   * Test invalid registration data
   */
  async testInvalidRegistration() {
    await this.helper.test('Invalid Registration Data', async () => {
      try {
        await this.api.post('/auth/register', {
          email: 'invalid-email',
          password: '123',
          confirmPassword: '456',
        });
        throw new Error('Should have failed with invalid data');
      } catch (error) {
        if (error.response?.status === 400) {
          console.log(`   Correctly returned 400 Bad Request`);
        } else {
          throw error;
        }
      }
    });
  }

  /**
   * Test unauthorized access
   */
  async testUnauthorizedAccess() {
    await this.helper.test('Unauthorized Access', async () => {
      try {
        await this.api.get('/categories');
        throw new Error('Should have failed without authentication');
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`   Correctly returned 401 Unauthorized`);
        } else {
          throw error;
        }
      }
    });
  }

  /**
   * Run all auth tests
   */
  async runAll() {
    console.log('🔐 Running Authentication Integration Tests\n');
    console.log('=' .repeat(50));
    
    try {
      await this.testRegistration();
      await this.testLogin();
      await this.testGetProfile();
      await this.testRefreshToken();
      await this.testInvalidCredentials();
      await this.testInvalidRegistration();
      await this.testUnauthorizedAccess();
      
      console.log('\n' + '=' .repeat(50));
      console.log('✅ All authentication tests passed!');
      
    } catch (error) {
      console.log('\n❌ Authentication tests failed:', error.message);
      throw error;
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const authTests = new AuthTests();
  authTests.runAll().catch(console.error);
}

module.exports = AuthTests;
