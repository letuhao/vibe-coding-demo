/**
 * @fileoverview Test Runner - Run all integration tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

const { TestHelper } = require('./utils/test-helper');
const AuthTests = require('./integration/auth.test');
const CategoriesTests = require('./integration/categories.test');
const ExpensesTests = require('./integration/expenses.test');

/**
 * Main test runner
 */
class TestRunner {
  constructor() {
    this.helper = new TestHelper();
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: [],
    };
  }

  /**
   * Run a test suite
   * @param {string} name - Test suite name
   * @param {Function} testSuite - Test suite function
   */
  async runTestSuite(name, testSuite) {
    console.log(`\n🚀 Running ${name} Tests`);
    console.log('=' .repeat(60));
    
    try {
      await testSuite.runAll();
      this.results.passed++;
      this.results.details.push({ name, status: 'PASSED', error: null });
      console.log(`\n✅ ${name} Tests: PASSED`);
    } catch (error) {
      this.results.failed++;
      this.results.details.push({ name, status: 'FAILED', error: error.message });
      console.log(`\n❌ ${name} Tests: FAILED`);
      console.log(`   Error: ${error.message}`);
    }
    
    this.results.total++;
  }

  /**
   * Wait for server to be ready
   */
  async waitForServer() {
    console.log('⏳ Waiting for server to be ready...');
    try {
      await this.helper.waitForServer();
      console.log('✅ Server is ready!\n');
    } catch (error) {
      console.log('❌ Server is not ready. Please start the backend server first.');
      console.log('   Run: cd apps/backend && npm run start:dev');
      process.exit(1);
    }
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    
    console.log(`Total Test Suites: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Detailed Results:');
    this.results.details.forEach(detail => {
      const status = detail.status === 'PASSED' ? '✅' : '❌';
      console.log(`   ${status} ${detail.name}: ${detail.status}`);
      if (detail.error) {
        console.log(`      Error: ${detail.error}`);
      }
    });
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed! The application is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the errors above.');
    }
  }

  /**
   * Run all tests
   */
  async runAll() {
    console.log('🧪 Vibe Coding Demo - Integration Test Suite');
    console.log('=' .repeat(60));
    console.log('Testing Expense Manager API endpoints');
    console.log('=' .repeat(60));
    
    try {
      // Wait for server
      await this.waitForServer();
      
      // Run test suites
      await this.runTestSuite('Authentication', new AuthTests());
      await this.runTestSuite('Categories', new CategoriesTests());
      await this.runTestSuite('Expenses', new ExpensesTests());
      
      // Print summary
      this.printSummary();
      
      // Exit with appropriate code
      process.exit(this.results.failed === 0 ? 0 : 1);
      
    } catch (error) {
      console.log('\n💥 Test runner failed:', error.message);
      process.exit(1);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAll().catch(console.error);
}

module.exports = TestRunner;
