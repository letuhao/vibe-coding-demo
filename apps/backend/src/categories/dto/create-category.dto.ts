/**
 * @fileoverview Create Category DTO - Category creation validation
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { IsString, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { CategoryType } from '@prisma/client';

/**
 * DTO for creating a new category
 * Validates category name and type
 */
export class CreateCategoryDto {
  /**
   * Category name
   * Must be a non-empty string with max 50 characters
   */
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  @MaxLength(50, { message: 'Category name must not exceed 50 characters' })
  name: string;

  /**
   * Category type (expense or income)
   * Must be a valid CategoryType enum value
   */
  @IsEnum(CategoryType, { message: 'Category type must be either EXPENSE or INCOME' })
  type: CategoryType;
}
