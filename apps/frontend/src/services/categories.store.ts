/**
 * @fileoverview Categories Store - Category state management with Zustand
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { create } from 'zustand';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest, CategoryType } from '../types/expense.types';
import { categoriesService } from './categories.service';

/**
 * Categories store state interface
 */
interface CategoriesState {
  /** Array of categories */
  categories: Category[];
  /** Loading state for categories */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Category statistics */
  stats: {
    total: number;
    expense: number;
    income: number;
  } | null;
}

/**
 * Categories store actions interface
 */
interface CategoriesActions {
  /** Fetch all categories */
  fetchCategories: (type?: CategoryType) => Promise<void>;
  /** Fetch category statistics */
  fetchStats: () => Promise<void>;
  /** Create a new category */
  createCategory: (categoryData: CreateCategoryRequest) => Promise<void>;
  /** Update an existing category */
  updateCategory: (id: string, categoryData: UpdateCategoryRequest) => Promise<void>;
  /** Delete a category */
  deleteCategory: (id: string) => Promise<void>;
  /** Clear error message */
  clearError: () => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
}

/**
 * Combined categories store type
 */
type CategoriesStore = CategoriesState & CategoriesActions;

/**
 * Categories store with Zustand
 * Manages category state and actions
 */
export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  // Initial state
  categories: [],
  isLoading: false,
  error: null,
  stats: null,

  // Actions
  fetchCategories: async (type?: CategoryType) => {
    set({ isLoading: true, error: null });
    
    try {
      const categories = await categoriesService.getCategories(type);
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch categories',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchStats: async () => {
    try {
      const stats = await categoriesService.getCategoryStats();
      set({ stats });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch category statistics',
      });
      throw error;
    }
  },

  createCategory: async (categoryData: CreateCategoryRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const newCategory = await categoriesService.createCategory(categoryData);
      set(state => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create category',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id: string, categoryData: UpdateCategoryRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedCategory = await categoriesService.updateCategory(id, categoryData);
      set(state => ({
        categories: state.categories.map(cat => 
          cat.id === id ? updatedCategory : cat
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update category',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await categoriesService.deleteCategory(id);
      set(state => ({
        categories: state.categories.filter(cat => cat.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete category',
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
}));
