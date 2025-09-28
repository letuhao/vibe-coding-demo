/**
 * @fileoverview Categories Integration Tests - Categories API tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

const { TestHelper } = require('../utils/test-helper');

/**
 * Categories integration tests
 */
class CategoriesTests {
  constructor() {
    this.helper = new TestHelper();
    this.api = this.helper.createApiClient();
    this.authApi = null;
  }

  /**
   * Setup authenticated API client
   */
  async setupAuth() {
    await this.helper.setupTestUser();
    this.authApi = this.helper.createAuthClient();
  }

  /**
   * Test create category
   */
  async testCreateCategory() {
    await this.helper.test('Create Category', async () => {
      const categoryData = this.helper.generateTestData('category');
      
      const response = await this.authApi.post('/categories', categoryData);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assertHasProperty(response.data.data, 'id', 'Category should have id');
      this.helper.assertHasProperty(response.data.data, 'name', 'Category should have name');
      this.helper.assertHasProperty(response.data.data, 'type', 'Category should have type');
      
      this.helper.testData.categories.push(response.data.data);
      
      console.log(`   Category ID: ${response.data.data.id}`);
      console.log(`   Category Name: ${response.data.data.name}`);
      console.log(`   Category Type: ${response.data.data.type}`);
    });
  }

  /**
   * Test get categories
   */
  async testGetCategories() {
    await this.helper.test('Get Categories', async () => {
      const response = await this.authApi.get('/categories');
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assert(Array.isArray(response.data.data), true, 'Categories should be an array');
      
      console.log(`   Categories count: ${response.data.data.length}`);
    });
  }

  /**
   * Test get categories with type filter
   */
  async testGetCategoriesWithFilter() {
    await this.helper.test('Get Categories with Type Filter', async () => {
      const response = await this.authApi.get('/categories?type=EXPENSE');
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assert(Array.isArray(response.data.data), true, 'Categories should be an array');
      
      // Verify all returned categories are EXPENSE type
      const allExpenseType = response.data.data.every(cat => cat.type === 'EXPENSE');
      this.helper.assert(allExpenseType, true, 'All categories should be EXPENSE type');
      
      console.log(`   Expense categories count: ${response.data.data.length}`);
    });
  }

  /**
   * Test get category stats
   */
  async testGetCategoryStats() {
    await this.helper.test('Get Category Stats', async () => {
      const response = await this.authApi.get('/categories/stats');
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assertHasProperty(response.data.data, 'total', 'Stats should have total');
      this.helper.assertHasProperty(response.data.data, 'expense', 'Stats should have expense');
      this.helper.assertHasProperty(response.data.data, 'income', 'Stats should have income');
      
      console.log(`   Total categories: ${response.data.data.total}`);
      console.log(`   Expense categories: ${response.data.data.expense}`);
      console.log(`   Income categories: ${response.data.data.income}`);
    });
  }

  /**
   * Test get specific category
   */
  async testGetCategory() {
    await this.helper.test('Get Specific Category', async () => {
      if (this.helper.testData.categories.length === 0) {
        throw new Error('No categories available for testing');
      }
      
      const categoryId = this.helper.testData.categories[0].id;
      const response = await this.authApi.get(`/categories/${categoryId}`);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assert(response.data.data.id, categoryId, 'Category ID should match');
      
      console.log(`   Category ID: ${response.data.data.id}`);
      console.log(`   Category Name: ${response.data.data.name}`);
    });
  }

  /**
   * Test update category
   */
  async testUpdateCategory() {
    await this.helper.test('Update Category', async () => {
      if (this.helper.testData.categories.length === 0) {
        throw new Error('No categories available for testing');
      }
      
      const categoryId = this.helper.testData.categories[0].id;
      const updateData = {
        name: 'Updated Test Category',
      };
      
      const response = await this.authApi.patch(`/categories/${categoryId}`, updateData);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assert(response.data.data.name, updateData.name, 'Category name should be updated');
      
      console.log(`   Updated name: ${response.data.data.name}`);
    });
  }

  /**
   * Test create duplicate category
   */
  async testCreateDuplicateCategory() {
    await this.helper.test('Create Duplicate Category', async () => {
      if (this.helper.testData.categories.length === 0) {
        throw new Error('No categories available for testing');
      }
      
      const existingCategory = this.helper.testData.categories[0];
      
      try {
        await this.authApi.post('/categories', {
          name: existingCategory.name,
          type: existingCategory.type,
        });
        throw new Error('Should have failed with duplicate category');
      } catch (error) {
        if (error.response?.status === 409) {
          console.log(`   Correctly returned 409 Conflict`);
        } else {
          throw error;
        }
      }
    });
  }

  /**
   * Test delete category
   */
  async testDeleteCategory() {
    await this.helper.test('Delete Category', async () => {
      if (this.helper.testData.categories.length === 0) {
        throw new Error('No categories available for testing');
      }
      
      const categoryId = this.helper.testData.categories[0].id;
      const response = await this.authApi.delete(`/categories/${categoryId}`);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assertHasProperty(response.data.data, 'message', 'Response should have message');
      
      // Remove from test data
      this.helper.testData.categories = this.helper.testData.categories.filter(cat => cat.id !== categoryId);
      
      console.log(`   Delete message: ${response.data.data.message}`);
    });
  }

  /**
   * Run all categories tests
   */
  async runAll() {
    console.log('📁 Running Categories Integration Tests\n');
    console.log('=' .repeat(50));
    
    try {
      await this.setupAuth();
      await this.testCreateCategory();
      await this.testGetCategories();
      await this.testGetCategoriesWithFilter();
      await this.testGetCategoryStats();
      await this.testGetCategory();
      await this.testUpdateCategory();
      await this.testCreateDuplicateCategory();
      await this.testDeleteCategory();
      
      console.log('\n' + '=' .repeat(50));
      console.log('✅ All categories tests passed!');
      
    } catch (error) {
      console.log('\n❌ Categories tests failed:', error.message);
      throw error;
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const categoriesTests = new CategoriesTests();
  categoriesTests.runAll().catch(console.error);
}

module.exports = CategoriesTests;
