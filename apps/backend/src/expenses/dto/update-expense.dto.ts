/**
 * @fileoverview Update Expense DTO - Expense update validation
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';

/**
 * DTO for updating an existing expense
 * All fields are optional, inherits validation from CreateExpenseDto
 */
export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
