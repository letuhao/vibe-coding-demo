/**
 * @fileoverview Run all E2E tests with comprehensive reporting
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting comprehensive E2E test suite...\n');

const testSuites = [
  { name: 'Basic Tests', file: 'basic.spec.ts' },
  { name: 'Authentication Flow', file: 'auth.spec.ts' },
  { name: 'Dashboard Tests', file: 'dashboard.spec.ts' },
  { name: 'Categories Management', file: 'categories.spec.ts' },
  { name: 'Expenses Management', file: 'expenses.spec.ts' },
  { name: 'API Integration', file: 'api.spec.ts' },
  { name: 'Performance & Accessibility', file: 'performance.spec.ts' }
];

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  suites: []
};

async function runTestSuite(suite) {
  console.log(`📋 Running ${suite.name}...`);
  
  try {
    const startTime = Date.now();
    
    // Run individual test suite
    const output = execSync(
      `npx playwright test ${suite.file} --reporter=line --timeout=60000`,
      { 
        cwd: __dirname,
        encoding: 'utf8',
        stdio: 'pipe'
      }
    );
    
    const duration = Date.now() - startTime;
    const lines = output.split('\n');
    const passedMatch = lines.find(line => line.includes('passed'));
    const failedMatch = lines.find(line => line.includes('failed'));
    
    const passed = passedMatch ? parseInt(passedMatch.match(/(\d+) passed/)?.[1] || '0') : 0;
    const failed = failedMatch ? parseInt(failedMatch.match(/(\d+) failed/)?.[1] || '0') : 0;
    
    results.total += passed + failed;
    results.passed += passed;
    results.failed += failed;
    
    results.suites.push({
      name: suite.name,
      passed,
      failed,
      duration: `${(duration / 1000).toFixed(2)}s`,
      status: failed === 0 ? '✅ PASSED' : '❌ FAILED'
    });
    
    console.log(`   ${failed === 0 ? '✅' : '❌'} ${suite.name}: ${passed} passed, ${failed} failed (${(duration / 1000).toFixed(2)}s)\n`);
    
  } catch (error) {
    console.log(`   ❌ ${suite.name}: FAILED - ${error.message}\n`);
    results.suites.push({
      name: suite.name,
      passed: 0,
      failed: 1,
      duration: '0s',
      status: '❌ FAILED'
    });
    results.total += 1;
    results.failed += 1;
  }
}

async function runAllTests() {
  console.log('🔧 Setting up test environment...\n');
  
  // Check if frontend is running
  try {
    const response = await fetch('http://localhost:5173/');
    if (!response.ok) {
      throw new Error('Frontend server not running');
    }
    console.log('✅ Frontend server is running\n');
  } catch (error) {
    console.log('❌ Frontend server is not running. Please start it first:\n');
    console.log('   cd apps/frontend && npm run dev\n');
    process.exit(1);
  }
  
  // Run each test suite
  for (const suite of testSuites) {
    await runTestSuite(suite);
  }
  
  // Generate summary report
  console.log('📊 E2E Test Results Summary');
  console.log('=' .repeat(50));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`);
  
  console.log('📋 Test Suite Details:');
  console.log('-'.repeat(50));
  results.suites.forEach(suite => {
    console.log(`${suite.status} ${suite.name}: ${suite.passed} passed, ${suite.failed} failed (${suite.duration})`);
  });
  
  // Save results to file
  const reportPath = path.join(__dirname, 'e2e-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed results saved to: ${reportPath}`);
  
  // Generate HTML report
  try {
    console.log('\n🌐 Generating HTML report...');
    execSync('npx playwright show-report', { cwd: __dirname, stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Could not open HTML report automatically');
  }
  
  // Exit with appropriate code
  if (results.failed > 0) {
    console.log('\n❌ Some tests failed. Check the output above for details.');
    process.exit(1);
  } else {
    console.log('\n🎉 All E2E tests passed successfully!');
    process.exit(0);
  }
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

runAllTests().catch(console.error);
