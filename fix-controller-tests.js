const fs = require('fs');

// Fix expenses controller tests
const expensesFile = 'apps/backend/src/expenses/expenses.controller.spec.ts';
let content = fs.readFileSync(expensesFile, 'utf8');

// Replace all mock service calls to return raw data instead of wrapped response
content = content.replace(
  /mockExpensesService\.(\w+)\.mockResolvedValue\(expectedResult\);/g,
  'mockExpensesService.$1.mockResolvedValue(expectedResult.data);'
);

// Fix expected results to match controller response format
content = content.replace(
  /const expectedResult = \{\s*success: true,\s*message: '[^']+',\s*data: \{[\s\S]*?\},\s*\};/g,
  (match) => {
    // Extract the data part and create service result
    const dataMatch = match.match(/data: \{[\s\S]*?\}/);
    if (dataMatch) {
      const dataContent = dataMatch[0].replace('data: ', '');
      return `const serviceResult = ${dataContent};\n      const expectedResult = {\n        success: true,\n        message: '${match.match(/message: '([^']+)'/)[1]}',\n        data: serviceResult,\n      };`;
    }
    return match;
  }
);

fs.writeFileSync(expensesFile, content);

// Fix categories controller tests
const categoriesFile = 'apps/backend/src/categories/categories.controller.spec.ts';
content = fs.readFileSync(categoriesFile, 'utf8');

// Replace all mock service calls to return raw data instead of wrapped response
content = content.replace(
  /mockCategoriesService\.(\w+)\.mockResolvedValue\(expectedResult\);/g,
  'mockCategoriesService.$1.mockResolvedValue(expectedResult.data);'
);

// Fix expected results to match controller response format
content = content.replace(
  /const expectedResult = \{\s*success: true,\s*message: '[^']+',\s*data: \{[\s\S]*?\},\s*\};/g,
  (match) => {
    // Extract the data part and create service result
    const dataMatch = match.match(/data: \{[\s\S]*?\}/);
    if (dataMatch) {
      const dataContent = dataMatch[0].replace('data: ', '');
      return `const serviceResult = ${dataContent};\n      const expectedResult = {\n        success: true,\n        message: '${match.match(/message: '([^']+)'/)[1]}',\n        data: serviceResult,\n      };`;
    }
    return match;
  }
);

fs.writeFileSync(categoriesFile, content);

console.log('Controller tests fixed!');
