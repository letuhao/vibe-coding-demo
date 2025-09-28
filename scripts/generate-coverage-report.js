/**
 * @fileoverview Coverage report generator
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

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

function readCoverageFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    }
  } catch (error) {
    log(`Warning: Could not read coverage file ${filePath}: ${error.message}`, 'yellow')
  }
  return null
}

function generateCoverageReport() {
  log(`${colors.bright}${colors.blue}📊 Generating Coverage Report${colors.reset}`)
  log(`${colors.blue}================================${colors.reset}`)

  const coverageReport = {
    timestamp: new Date().toISOString(),
    summary: {
      statements: { total: 0, covered: 0, percentage: 0 },
      branches: { total: 0, covered: 0, percentage: 0 },
      functions: { total: 0, covered: 0, percentage: 0 },
      lines: { total: 0, covered: 0, percentage: 0 }
    },
    modules: {}
  }

  // Read backend coverage
  const backendCoveragePath = path.join(__dirname, '..', 'apps', 'backend', 'coverage', 'coverage-final.json')
  const backendCoverage = readCoverageFile(backendCoveragePath)
  
  if (backendCoverage) {
    log(`${colors.green}✅ Backend coverage found${colors.reset}`)
    coverageReport.modules.backend = {
      statements: { total: 0, covered: 0, percentage: 0 },
      branches: { total: 0, covered: 0, percentage: 0 },
      functions: { total: 0, covered: 0, percentage: 0 },
      lines: { total: 0, covered: 0, percentage: 0 }
    }

    // Process backend coverage data
    Object.values(backendCoverage).forEach(file => {
      if (file.s) {
        coverageReport.modules.backend.statements.total += file.s.total
        coverageReport.modules.backend.statements.covered += file.s.covered
      }
      if (file.b) {
        coverageReport.modules.backend.branches.total += file.b.total
        coverageReport.modules.backend.branches.covered += file.b.covered
      }
      if (file.f) {
        coverageReport.modules.backend.functions.total += file.f.total
        coverageReport.modules.backend.functions.covered += file.f.covered
      }
      if (file.l) {
        coverageReport.modules.backend.lines.total += file.l.total
        coverageReport.modules.backend.lines.covered += file.l.covered
      }
    })

    // Calculate percentages
    Object.keys(coverageReport.modules.backend).forEach(key => {
      const module = coverageReport.modules.backend[key]
      module.percentage = module.total > 0 ? Math.round((module.covered / module.total) * 100) : 0
    })
  } else {
    log(`${colors.yellow}⚠️  Backend coverage not found${colors.reset}`)
  }

  // Read frontend coverage
  const frontendCoveragePath = path.join(__dirname, '..', 'apps', 'frontend', 'coverage', 'coverage-final.json')
  const frontendCoverage = readCoverageFile(frontendCoveragePath)
  
  if (frontendCoverage) {
    log(`${colors.green}✅ Frontend coverage found${colors.reset}`)
    coverageReport.modules.frontend = {
      statements: { total: 0, covered: 0, percentage: 0 },
      branches: { total: 0, covered: 0, percentage: 0 },
      functions: { total: 0, covered: 0, percentage: 0 },
      lines: { total: 0, covered: 0, percentage: 0 }
    }

    // Process frontend coverage data
    Object.values(frontendCoverage).forEach(file => {
      if (file.s) {
        coverageReport.modules.frontend.statements.total += file.s.total
        coverageReport.modules.frontend.statements.covered += file.s.covered
      }
      if (file.b) {
        coverageReport.modules.frontend.branches.total += file.b.total
        coverageReport.modules.frontend.branches.covered += file.b.covered
      }
      if (file.f) {
        coverageReport.modules.frontend.functions.total += file.f.total
        coverageReport.modules.frontend.functions.covered += file.f.covered
      }
      if (file.l) {
        coverageReport.modules.frontend.lines.total += file.l.total
        coverageReport.modules.frontend.lines.covered += file.l.covered
      }
    })

    // Calculate percentages
    Object.keys(coverageReport.modules.frontend).forEach(key => {
      const module = coverageReport.modules.frontend[key]
      module.percentage = module.total > 0 ? Math.round((module.covered / module.total) * 100) : 0
    })
  } else {
    log(`${colors.yellow}⚠️  Frontend coverage not found${colors.reset}`)
  }

  // Calculate overall summary
  Object.values(coverageReport.modules).forEach(module => {
    coverageReport.summary.statements.total += module.statements.total
    coverageReport.summary.statements.covered += module.statements.covered
    coverageReport.summary.branches.total += module.branches.total
    coverageReport.summary.branches.covered += module.branches.covered
    coverageReport.summary.functions.total += module.functions.total
    coverageReport.summary.functions.covered += module.functions.covered
    coverageReport.summary.lines.total += module.lines.total
    coverageReport.summary.lines.covered += module.lines.covered
  })

  // Calculate overall percentages
  Object.keys(coverageReport.summary).forEach(key => {
    const summary = coverageReport.summary[key]
    summary.percentage = summary.total > 0 ? Math.round((summary.covered / summary.total) * 100) : 0
  })

  // Save report
  const reportPath = path.join(__dirname, '..', 'test-results', 'coverage-report.json')
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify(coverageReport, null, 2))

  // Display summary
  log(`\n${colors.bright}${colors.blue}📈 Coverage Summary${colors.reset}`)
  log(`${colors.blue}=================${colors.reset}`)
  
  Object.keys(coverageReport.modules).forEach(moduleName => {
    const module = coverageReport.modules[moduleName]
    log(`\n${colors.cyan}${moduleName.toUpperCase()}:${colors.reset}`)
    log(`  Statements: ${module.statements.covered}/${module.statements.total} (${module.statements.percentage}%)`)
    log(`  Branches:   ${module.branches.covered}/${module.branches.total} (${module.branches.percentage}%)`)
    log(`  Functions:  ${module.functions.covered}/${module.functions.total} (${module.functions.percentage}%)`)
    log(`  Lines:      ${module.lines.covered}/${module.lines.total} (${module.lines.percentage}%)`)
  })

  log(`\n${colors.bright}${colors.blue}OVERALL:${colors.reset}`)
  log(`  Statements: ${coverageReport.summary.statements.covered}/${coverageReport.summary.statements.total} (${coverageReport.summary.statements.percentage}%)`)
  log(`  Branches:   ${coverageReport.summary.branches.covered}/${coverageReport.summary.branches.total} (${coverageReport.summary.branches.percentage}%)`)
  log(`  Functions:  ${coverageReport.summary.functions.covered}/${coverageReport.summary.functions.total} (${coverageReport.summary.functions.percentage}%)`)
  log(`  Lines:      ${coverageReport.summary.lines.covered}/${coverageReport.summary.lines.total} (${coverageReport.summary.lines.percentage}%)`)

  log(`\n${colors.blue}Coverage report saved to: test-results/coverage-report.json${colors.reset}`)

  return coverageReport
}

if (require.main === module) {
  generateCoverageReport()
}

module.exports = { generateCoverageReport }
