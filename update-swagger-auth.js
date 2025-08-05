#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Controllers that need to be updated (REST API controllers, not microservice controllers)
const controllersToUpdate = [
  'src/modules/customer/controllers/customer.controller.ts',
  'src/modules/branch/controllers/branch.controller.ts',
  'src/modules/region/controllers/region.controller.ts',
  'src/modules/employee/controllers/employee.controller.ts',
  'src/modules/geotree/controllers/geotree.controller.ts',
  'src/modules/warehouse/controllers/warehouse.controller.ts',
  'src/modules/sales-item/controllers/sales-item.controller.ts',
  'src/modules/salesman/controllers/salesman.controller.ts',
  'src/modules/province/controllers/province.controller.ts',
  'src/modules/city/controllers/city.controller.ts',
  'src/modules/district/controllers/district.controller.ts',
  'src/modules/sub-district/controllers/sub-district.controller.ts',
  'src/modules/organization/controllers/organization.controller.ts',
  'src/modules/position/controllers/position.controller.ts',
  'src/modules/supplier/controllers/supplier.controller.ts',
  'src/modules/sales-order/controllers/sales-order.controller.ts',
  'src/modules/sales-order-types/controllers/sales-order-types.controller.ts',
  'src/modules/fppr-sales-types/controllers/fppr-sales-types.controller.ts',
  'src/modules/fppr-types/controllers/fppr-types.controller.ts',
  'src/modules/ap-invoice-types/controllers/ap-invoice-types.controller.ts',
  // Add more controllers as needed
];

function updateController(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipping ${filePath} - file not found`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // Skip if already has AuthSwagger import
    if (content.includes('AuthSwagger')) {
      console.log(`Skipping ${filePath} - already updated`);
      return;
    }

    // Add AuthSwagger import if not present
    if (!content.includes('import { AuthSwagger }')) {
      // Find the last import from decorators
      const decoratorImportRegex = /import.*from.*decorators.*\.decorator';/g;
      const matches = [...content.matchAll(decoratorImportRegex)];

      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        const importToAdd = `import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';`;
        content =
          content.substring(0, lastMatch.index + lastMatch[0].length) +
          '\n' +
          importToAdd +
          content.substring(lastMatch.index + lastMatch[0].length);
      }
    }

    // Replace methods that don't have @Public() with @AuthSwagger()
    // Look for GET, POST, PUT, DELETE methods without @Public()
    const methodRegex =
      /@(Get|Post|Put|Delete)\([^)]*\)\s*(?![\s\S]*?@Public\(\))([\s\S]*?)@ApiOperation/g;

    content = content.replace(methodRegex, (match, httpMethod, middle) => {
      // Check if already has @AuthSwagger() or @ApiBearerAuth
      if (
        match.includes('@AuthSwagger()') ||
        match.includes('@ApiBearerAuth')
      ) {
        return match;
      }

      // Insert @AuthSwagger() after the HTTP method decorator
      return `@${httpMethod}(${match.match(/@(?:Get|Post|Put|Delete)\(([^)]*)\)/)[1]})\n  @AuthSwagger()\n  @ApiOperation`;
    });

    // Write the updated content
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

// Update all controllers
console.log('Starting bulk update of controllers...');
controllersToUpdate.forEach(updateController);
console.log('Bulk update completed!');
