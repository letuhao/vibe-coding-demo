/**
 * @fileoverview Expense Query DTO - Expense filtering and pagination
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { IsOptional, IsString, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for expense query parameters
 * Supports filtering, pagination, and sorting
 */
export class ExpenseQueryDto {
  /**
   * Page number for pagination
   * Default: 1, minimum: 1
   */
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  /**
   * Number of items per page
   * Default: 10, minimum: 1, maximum: 100
   */
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  /**
   * Category ID filter
   * Optional string to filter by category
   */
  @IsOptional()
  @IsString()
  categoryId?: string;

  /**
   * Start date filter
   * Optional date string for filtering expenses from this date
   */
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /**
   * End date filter
   * Optional date string for filtering expenses until this date
   */
  @IsOptional()
  @IsDateString()
  endDate?: string;

  /**
   * Search term for note field
   * Optional string to search in expense notes
   */
  @IsOptional()
  @IsString()
  search?: string;

  /**
   * Sort field
   * Optional string to specify sort field (amount, date, createdAt)
   */
  @IsOptional()
  @IsString()
  sortBy?: string = 'date';

  /**
   * Sort order
   * Optional string for sort order (asc, desc)
   */
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
