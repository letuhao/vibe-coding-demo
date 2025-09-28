/**
 * @fileoverview Categories Service - Category management API service
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { apiService } from './api.service';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest, CategoryType } from '../types/expense.types';

/**
 * CategoriesService handles category management API calls
 * Provides methods for CRUD operations on categories
 */
export class CategoriesService {
  /**
   * Get all categories for the current user
   * @param type - Optional category type filter
   * @returns Promise with categories array
   */
  async getCategories(type?: CategoryType): Promise<Category[]> {
    const params = type ? { type } : {};
    const response = await apiService.get<{ data: Category[] }>('/categories', params);
    return response.data;
  }

  /**
   * Get category statistics
   * @returns Promise with category statistics
   */
  async getCategoryStats(): Promise<{ total: number; expense: number; income: number }> {
    const response = await apiService.get<{ data: { total: number; expense: number; income: number } }>('/categories/stats');
    return response.data;
  }

  /**
   * Get a specific category by ID
   * @param id - Category ID
   * @returns Promise with category details
   */
  async getCategory(id: string): Promise<Category> {
    const response = await apiService.get<{ data: Category }>(`/categories/${id}`);
    return response.data;
  }

  /**
   * Create a new category
   * @param categoryData - Category creation data
   * @returns Promise with created category
   */
  async createCategory(categoryData: CreateCategoryRequest): Promise<Category> {
    const response = await apiService.post<{ data: Category }>('/categories', categoryData);
    return response.data;
  }

  /**
   * Update an existing category
   * @param id - Category ID
   * @param categoryData - Category update data
   * @returns Promise with updated category
   */
  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<Category> {
    const response = await apiService.put<{ data: Category }>(`/categories/${id}`, categoryData);
    return response.data;
  }

  /**
   * Delete a category
   * @param id - Category ID
   * @returns Promise with success message
   */
  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ data: { message: string } }>(`/categories/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const categoriesService = new CategoriesService();
export default categoriesService;
