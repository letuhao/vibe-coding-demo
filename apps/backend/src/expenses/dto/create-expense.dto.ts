/**
 * @fileoverview Create Expense DTO - Expense creation validation
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { IsString, IsNumber, IsOptional, IsDateString, Min, MaxLength } from 'class-validator';

/**
 * DTO for creating a new expense
 * Validates expense amount, note, date, and category
 */
export class CreateExpenseDto {
  /**
   * Expense amount
   * Must be a positive number
   */
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  /**
   * Expense note/description
   * Optional string with max 500 characters
   */
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Note must not exceed 500 characters' })
  note?: string;

  /**
   * Expense date
   * Must be a valid date string
   */
  @IsDateString({}, { message: 'Date must be a valid date' })
  date: string;

  /**
   * Category ID
   * Must be a valid UUID string
   */
  @IsString()
  @IsString({ message: 'Category ID is required' })
  categoryId: string;
}
