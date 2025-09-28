/**
 * @fileoverview Expenses Integration Tests - Expenses API tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

const { TestHelper } = require('../utils/test-helper');

/**
 * Expenses integration tests
 */
class ExpensesTests {
  constructor() {
    this.helper = new TestHelper();
    this.api = this.helper.createApiClient();
    this.authApi = null;
  }

  /**
   * Setup authenticated API client and test data
   */
  async setupAuth() {
    await this.helper.setupTestUser();
    this.authApi = this.helper.createAuthClient();
    
    // Create a test category first
    const categoryData = this.helper.generateTestData('category');
    const categoryResponse = await this.authApi.post('/categories', categoryData);
    this.helper.testData.categories.push(categoryResponse.data.data);
  }

  /**
   * Test create expense
   */
  async testCreateExpense() {
    await this.helper.test('Create Expense', async () => {
      const expenseData = this.helper.generateTestData('expense');
      expenseData.categoryId = this.helper.testData.categories[0].id;
      
      const response = await this.authApi.post('/expenses', expenseData);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assertHasProperty(response.data.data, 'id', 'Expense should have id');
      this.helper.assertHasProperty(response.data.data, 'amount', 'Expense should have amount');
      this.helper.assertHasProperty(response.data.data, 'category', 'Expense should have category');
      
      this.helper.testData.expenses.push(response.data.data);
      
      console.log(`   Expense ID: ${response.data.data.id}`);
      console.log(`   Amount: $${response.data.data.amount}`);
      console.log(`   Category: ${response.data.data.category.name}`);
    });
  }

  /**
   * Test get expenses
   */
  async testGetExpenses() {
    await this.helper.test('Get Expenses', async () => {
      const response = await this.authApi.get('/expenses');
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assertHasProperty(response.data, 'pagination', 'Response should have pagination');
      this.helper.assert(Array.isArray(response.data.data), true, 'Expenses should be an array');
      
      console.log(`   Expenses count: ${response.data.data.length}`);
      console.log(`   Total pages: ${response.data.pagination.totalPages}`);
    });
  }

  /**
   * Test get expenses with filters
   */
  async testGetExpensesWithFilters() {
    await this.helper.test('Get Expenses with Filters', async () => {
      const categoryId = this.helper.testData.categories[0].id;
      const response = await this.authApi.get(`/expenses?categoryId=${categoryId}&limit=5`);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assert(Array.isArray(response.data.data), true, 'Expenses should be an array');
      
      // Verify all returned expenses belong to the filtered category
      const allMatchCategory = response.data.data.every(expense => expense.categoryId === categoryId);
      this.helper.assert(allMatchCategory, true, 'All expenses should match the filtered category');
      
      console.log(`   Filtered expenses count: ${response.data.data.length}`);
    });
  }

  /**
   * Test get expense stats
   */
  async testGetExpenseStats() {
    await this.helper.test('Get Expense Stats', async () => {
      const response = await this.authApi.get('/expenses/stats');
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assertHasProperty(response.data.data, 'totalExpenses', 'Stats should have totalExpenses');
      this.helper.assertHasProperty(response.data.data, 'totalAmount', 'Stats should have totalAmount');
      this.helper.assertHasProperty(response.data.data, 'averageAmount', 'Stats should have averageAmount');
      
      console.log(`   Total expenses: ${response.data.data.totalExpenses}`);
      console.log(`   Total amount: $${response.data.data.totalAmount}`);
      console.log(`   Average amount: $${response.data.data.averageAmount}`);
    });
  }

  /**
   * Test get expenses by category
   */
  async testGetExpensesByCategory() {
    await this.helper.test('Get Expenses by Category', async () => {
      const response = await this.authApi.get('/expenses/by-category');
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assert(Array.isArray(response.data.data), true, 'Data should be an array');
      
      console.log(`   Categories with expenses: ${response.data.data.length}`);
    });
  }

  /**
   * Test get specific expense
   */
  async testGetExpense() {
    await this.helper.test('Get Specific Expense', async () => {
      if (this.helper.testData.expenses.length === 0) {
        throw new Error('No expenses available for testing');
      }
      
      const expenseId = this.helper.testData.expenses[0].id;
      const response = await this.authApi.get(`/expenses/${expenseId}`);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assert(response.data.data.id, expenseId, 'Expense ID should match');
      
      console.log(`   Expense ID: ${response.data.data.id}`);
      console.log(`   Amount: $${response.data.data.amount}`);
    });
  }

  /**
   * Test update expense
   */
  async testUpdateExpense() {
    await this.helper.test('Update Expense', async () => {
      if (this.helper.testData.expenses.length === 0) {
        throw new Error('No expenses available for testing');
      }
      
      const expenseId = this.helper.testData.expenses[0].id;
      const updateData = {
        amount: 50.00,
        note: 'Updated test expense',
      };
      
      const response = await this.authApi.patch(`/expenses/${expenseId}`, updateData);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assert(response.data.data.amount, updateData.amount, 'Expense amount should be updated');
      this.helper.assert(response.data.data.note, updateData.note, 'Expense note should be updated');
      
      console.log(`   Updated amount: $${response.data.data.amount}`);
      console.log(`   Updated note: ${response.data.data.note}`);
    });
  }

  /**
   * Test create expense with invalid category
   */
  async testCreateExpenseWithInvalidCategory() {
    await this.helper.test('Create Expense with Invalid Category', async () => {
      try {
        await this.authApi.post('/expenses', {
          amount: 25.50,
          note: 'Test expense',
          date: new Date().toISOString().split('T')[0],
          categoryId: 'invalid-category-id',
        });
        throw new Error('Should have failed with invalid category');
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
   * Test delete expense
   */
  async testDeleteExpense() {
    await this.helper.test('Delete Expense', async () => {
      if (this.helper.testData.expenses.length === 0) {
        throw new Error('No expenses available for testing');
      }
      
      const expenseId = this.helper.testData.expenses[0].id;
      const response = await this.authApi.delete(`/expenses/${expenseId}`);
      
      this.helper.assertHasProperty(response.data, 'data', 'Response should have data');
      this.helper.assertHasProperty(response.data.data, 'message', 'Response should have message');
      
      // Remove from test data
      this.helper.testData.expenses = this.helper.testData.expenses.filter(expense => expense.id !== expenseId);
      
      console.log(`   Delete message: ${response.data.data.message}`);
    });
  }

  /**
   * Run all expenses tests
   */
  async runAll() {
    console.log('💰 Running Expenses Integration Tests\n');
    console.log('=' .repeat(50));
    
    try {
      await this.setupAuth();
      await this.testCreateExpense();
      await this.testGetExpenses();
      await this.testGetExpensesWithFilters();
      await this.testGetExpenseStats();
      await this.testGetExpensesByCategory();
      await this.testGetExpense();
      await this.testUpdateExpense();
      await this.testCreateExpenseWithInvalidCategory();
      await this.testDeleteExpense();
      
      console.log('\n' + '=' .repeat(50));
      console.log('✅ All expenses tests passed!');
      
    } catch (error) {
      console.log('\n❌ Expenses tests failed:', error.message);
      throw error;
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const expensesTests = new ExpensesTests();
  expensesTests.runAll().catch(console.error);
}

module.exports = ExpensesTests;
