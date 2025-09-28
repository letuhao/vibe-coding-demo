/**
 * @fileoverview Expense Types - Expense related type definitions
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

/**
 * Category type enum
 */
export enum CategoryType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

/**
 * Category interface
 */
export interface Category {
  /** Category ID */
  id: string;
  /** Category name */
  name: string;
  /** Category type (expense or income) */
  type: CategoryType;
  /** User ID who owns this category */
  userId: string;
  /** Category creation timestamp */
  createdAt: string;
  /** Category last update timestamp */
  updatedAt: string;
}

/**
 * Expense interface
 */
export interface Expense {
  /** Expense ID */
  id: string;
  /** Expense amount */
  amount: number;
  /** Expense note/description */
  note?: string;
  /** Expense date */
  date: string;
  /** Category ID */
  categoryId: string;
  /** User ID who owns this expense */
  userId: string;
  /** Expense creation timestamp */
  createdAt: string;
  /** Expense last update timestamp */
  updatedAt: string;
  /** Category information */
  category?: Category;
}

/**
 * Create expense request
 */
export interface CreateExpenseRequest {
  /** Expense amount */
  amount: number;
  /** Expense note/description */
  note?: string;
  /** Expense date */
  date: string;
  /** Category ID */
  categoryId: string;
}

/**
 * Update expense request
 */
export interface UpdateExpenseRequest {
  /** Expense amount */
  amount?: number;
  /** Expense note/description */
  note?: string;
  /** Expense date */
  date?: string;
  /** Category ID */
  categoryId?: string;
}

/**
 * Create category request
 */
export interface CreateCategoryRequest {
  /** Category name */
  name: string;
  /** Category type */
  type: CategoryType;
}

/**
 * Update category request
 */
export interface UpdateCategoryRequest {
  /** Category name */
  name?: string;
  /** Category type */
  type?: CategoryType;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  /** Array of items */
  data: T[];
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of items */
    total: number;
    /** Total number of pages */
    totalPages: number;
    /** Whether there is a next page */
    hasNext: boolean;
    /** Whether there is a previous page */
    hasPrev: boolean;
  };
}
