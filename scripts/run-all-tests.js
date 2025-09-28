/**
 * @fileoverview Comprehensive test runner for all test suites
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command, cwd, description) {
  log(`\n${colors.cyan}🔄 ${description}...${colors.reset}`)
  try {
    const output = execSync(command, { 
      cwd, 
      stdio: 'pipe',
      encoding: 'utf8'
    })
    log(`${colors.green}✅ ${description} completed${colors.reset}`)
    return { success: true, output }
  } catch (error) {
    log(`${colors.red}❌ ${description} failed${colors.reset}`)
    log(`${colors.red}Error: ${error.message}${colors.reset}`)
    return { success: false, error: error.message }
  }
}

function generateTestReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      successRate: 0
    },
    suites: results
  }

  // Calculate summary
  results.forEach(result => {
    report.summary.total += result.total || 0
    report.summary.passed += result.passed || 0
    report.summary.failed += result.failed || 0
  })

  report.summary.successRate = report.summary.total > 0 
    ? Math.round((report.summary.passed / report.summary.total) * 100)
    : 0

  // Write report to file
  const reportPath = path.join(__dirname, '..', 'test-results', 'test-report.json')
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  return report
}

async function main() {
  log(`${colors.bright}${colors.blue}🚀 Starting Comprehensive Test Suite${colors.reset}`)
  log(`${colors.blue}===============================================${colors.reset}`)

  const results = []

  // 1. Backend Unit Tests
  const backendResult = runCommand(
    'npm run test:unit:cov',
    path.join(__dirname, '..', 'apps', 'backend'),
    'Backend Unit Tests'
  )
  results.push({
    name: 'Backend Unit Tests',
    success: backendResult.success,
    total: backendResult.success ? 'N/A' : 'N/A',
    passed: backendResult.success ? 'N/A' : 'N/A',
    failed: backendResult.success ? 'N/A' : 'N/A'
  })

  // 2. Frontend Unit Tests
  const frontendResult = runCommand(
    'npm run test:run',
    path.join(__dirname, '..', 'apps', 'frontend'),
    'Frontend Unit Tests'
  )
  results.push({
    name: 'Frontend Unit Tests',
    success: frontendResult.success,
    total: frontendResult.success ? 'N/A' : 'N/A',
    passed: frontendResult.success ? 'N/A' : 'N/A',
    failed: frontendResult.success ? 'N/A' : 'N/A'
  })

  // 3. Integration Tests
  const integrationResult = runCommand(
    'npm test',
    path.join(__dirname, '..', 'tests'),
    'Integration Tests'
  )
  results.push({
    name: 'Integration Tests',
    success: integrationResult.success,
    total: integrationResult.success ? 'N/A' : 'N/A',
    passed: integrationResult.success ? 'N/A' : 'N/A',
    failed: integrationResult.success ? 'N/A' : 'N/A'
  })

  // 4. E2E Tests (optional - requires running servers)
  const runE2E = process.argv.includes('--e2e')
  if (runE2E) {
    const e2eResult = runCommand(
      'npm test',
      path.join(__dirname, '..', 'tests', 'e2e'),
      'E2E Tests'
    )
    results.push({
      name: 'E2E Tests',
      success: e2eResult.success,
      total: e2eResult.success ? 'N/A' : 'N/A',
      passed: e2eResult.success ? 'N/A' : 'N/A',
      failed: e2eResult.success ? 'N/A' : 'N/A'
    })
  }

  // Generate and display report
  const report = generateTestReport(results)
  
  log(`\n${colors.bright}${colors.blue}📊 Test Results Summary${colors.reset}`)
  log(`${colors.blue}========================${colors.reset}`)
  
  results.forEach(result => {
    const status = result.success ? `${colors.green}✅ PASSED${colors.reset}` : `${colors.red}❌ FAILED${colors.reset}`
    log(`${result.name}: ${status}`)
  })

  log(`\n${colors.bright}${colors.blue}📈 Overall Success Rate: ${report.summary.successRate}%${colors.reset}`)
  log(`${colors.blue}Report saved to: test-results/test-report.json${colors.reset}`)

  // Exit with appropriate code
  const allPassed = results.every(result => result.success)
  process.exit(allPassed ? 0 : 1)
}

// Handle command line arguments
if (process.argv.includes('--help')) {
  log(`${colors.bright}Usage: node run-all-tests.js [options]${colors.reset}`)
  log(`${colors.blue}Options:${colors.reset}`)
  log(`  --e2e     Include E2E tests (requires running servers)`)
  log(`  --help    Show this help message`)
  process.exit(0)
}

main().catch(error => {
  log(`${colors.red}❌ Test runner failed: ${error.message}${colors.reset}`)
  process.exit(1)
})
