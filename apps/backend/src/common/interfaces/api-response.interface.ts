/**
 * @fileoverview API Response Interface - Standard API response format
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

/**
 * Standard API response interface
 * @template T - Type of data being returned
 */
export interface ApiResponse<T = any> {
  /** Indicates if the request was successful */
  success: boolean;
  /** Response data */
  data?: T;
  /** Response message */
  message?: string;
  /** Response timestamp */
  timestamp?: string;
  /** Error details if any */
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

/**
 * Paginated response interface
 * @template T - Type of items in the paginated list
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
