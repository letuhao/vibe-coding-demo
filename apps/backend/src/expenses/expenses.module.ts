/**
 * @fileoverview Expenses Module - Expense management module configuration
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';

/**
 * ExpensesModule provides expense management functionality
 * Includes CRUD operations for user expenses with filtering and pagination
 */
@Module({
  providers: [ExpensesService],
  controllers: [ExpensesController],
  exports: [ExpensesService],
})
export class ExpensesModule {}
