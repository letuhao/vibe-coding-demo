/**
 * @fileoverview Expenses Store - Expense state management with Zustand
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { create } from 'zustand';
import type { 
  Expense, 
  CreateExpenseRequest, 
  UpdateExpenseRequest, 
  PaginatedResponse 
} from '../types/expense.types';
import { expensesService } from './expenses.service';
import type { ExpenseQueryParams, ExpenseStats } from '../types/expense.types';

/**
 * Expenses store state interface
 */
interface ExpensesState {
  /** Paginated expenses data */
  expenses: PaginatedResponse<Expense>;
  /** Loading state for expenses */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Expense statistics */
  stats: ExpenseStats | null;
  /** Expenses grouped by category */
  expensesByCategory: any[];
  /** Current query parameters */
  currentQuery: ExpenseQueryParams;
}

/**
 * Expenses store actions interface
 */
interface ExpensesActions {
  /** Fetch expenses with query parameters */
  fetchExpenses: (params?: ExpenseQueryParams) => Promise<void>;
  /** Fetch expense statistics */
  fetchStats: (startDate?: string, endDate?: string) => Promise<void>;
  /** Fetch expenses grouped by category */
  fetchExpensesByCategory: (startDate?: string, endDate?: string) => Promise<void>;
  /** Create a new expense */
  createExpense: (expenseData: CreateExpenseRequest) => Promise<void>;
  /** Update an existing expense */
  updateExpense: (id: string, expenseData: UpdateExpenseRequest) => Promise<void>;
  /** Delete an expense */
  deleteExpense: (id: string) => Promise<void>;
  /** Clear error message */
  clearError: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set current query parameters */
  setQuery: (query: ExpenseQueryParams) => void;
}

/**
 * Combined expenses store type
 */
type ExpensesStore = ExpensesState & ExpensesActions;

/**
 * Expenses store with Zustand
 * Manages expense state and actions
 */
export const useExpensesStore = create<ExpensesStore>((set, get) => ({
  // Initial state
  expenses: {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  },
  isLoading: false,
  error: null,
  stats: null,
  expensesByCategory: [],
  currentQuery: {},

  // Actions
  fetchExpenses: async (params?: ExpenseQueryParams) => {
    set({ isLoading: true, error: null });
    
    try {
      const expenses = await expensesService.getExpenses(params);
      set({ 
        expenses, 
        isLoading: false,
        currentQuery: params || {},
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch expenses',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchStats: async (startDate?: string, endDate?: string) => {
    try {
      const stats = await expensesService.getExpenseStats(startDate, endDate);
      set({ stats });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch expense statistics',
      });
      throw error;
    }
  },

  fetchExpensesByCategory: async (startDate?: string, endDate?: string) => {
    try {
      const expensesByCategory = await expensesService.getExpensesByCategory(startDate, endDate);
      set({ expensesByCategory });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch expenses by category',
      });
      throw error;
    }
  },

  createExpense: async (expenseData: CreateExpenseRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const newExpense = await expensesService.createExpense(expenseData);
      set(state => ({
        expenses: {
          ...state.expenses,
          data: [newExpense, ...state.expenses.data],
          pagination: {
            ...state.expenses.pagination,
            total: state.expenses.pagination.total + 1,
          },
        },
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create expense',
        isLoading: false,
      });
      throw error;
    }
  },

  updateExpense: async (id: string, expenseData: UpdateExpenseRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedExpense = await expensesService.updateExpense(id, expenseData);
      set(state => ({
        expenses: {
          ...state.expenses,
          data: state.expenses.data.map(expense => 
            expense.id === id ? updatedExpense : expense
          ),
        },
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update expense',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteExpense: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await expensesService.deleteExpense(id);
      set(state => ({
        expenses: {
          ...state.expenses,
          data: state.expenses.data.filter(expense => expense.id !== id),
          pagination: {
            ...state.expenses.pagination,
            total: state.expenses.pagination.total - 1,
          },
        },
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete expense',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setQuery: (query: ExpenseQueryParams) => {
    set({ currentQuery: query });
  },
}));
