/**
 * @fileoverview Expenses Service - Expense management API service
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { apiService } from './api.service';
import type { 
  Expense, 
  CreateExpenseRequest, 
  UpdateExpenseRequest, 
  PaginatedResponse 
} from '../types/expense.types';

/**
 * Expense query parameters interface
 */
export interface ExpenseQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Expense statistics interface
 */
export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  averageAmount: number;
  thisMonthExpenses: number;
  thisMonthAmount: number;
}

/**
 * ExpensesService handles expense management API calls
 * Provides methods for CRUD operations on expenses with filtering and pagination
 */
export class ExpensesService {
  /**
   * Get all expenses for the current user with filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated expenses
   */
  async getExpenses(params?: ExpenseQueryParams): Promise<PaginatedResponse<Expense>> {
    const response = await apiService.get<{ data: Expense[]; pagination: any }>('/expenses', params);
    return {
      data: response.data,
      pagination: response.pagination,
    };
  }

  /**
   * Get expense statistics
   * @param startDate - Optional start date for statistics
   * @param endDate - Optional end date for statistics
   * @returns Promise with expense statistics
   */
  async getExpenseStats(startDate?: string, endDate?: string): Promise<ExpenseStats> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiService.get<{ data: ExpenseStats }>('/expenses/stats', params);
    return response.data;
  }

  /**
   * Get expenses grouped by category
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Promise with expenses grouped by category
   */
  async getExpensesByCategory(startDate?: string, endDate?: string): Promise<any[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiService.get<{ data: any[] }>('/expenses/by-category', params);
    return response.data;
  }

  /**
   * Get a specific expense by ID
   * @param id - Expense ID
   * @returns Promise with expense details
   */
  async getExpense(id: string): Promise<Expense> {
    const response = await apiService.get<{ data: Expense }>(`/expenses/${id}`);
    return response.data;
  }

  /**
   * Create a new expense
   * @param expenseData - Expense creation data
   * @returns Promise with created expense
   */
  async createExpense(expenseData: CreateExpenseRequest): Promise<Expense> {
    const response = await apiService.post<{ data: Expense }>('/expenses', expenseData);
    return response.data;
  }

  /**
   * Update an existing expense
   * @param id - Expense ID
   * @param expenseData - Expense update data
   * @returns Promise with updated expense
   */
  async updateExpense(id: string, expenseData: UpdateExpenseRequest): Promise<Expense> {
    const response = await apiService.put<{ data: Expense }>(`/expenses/${id}`, expenseData);
    return response.data;
  }

  /**
   * Delete an expense
   * @param id - Expense ID
   * @returns Promise with success message
   */
  async deleteExpense(id: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ data: { message: string } }>(`/expenses/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const expensesService = new ExpensesService();
export default expensesService;
