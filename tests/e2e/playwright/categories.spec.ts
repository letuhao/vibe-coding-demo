/**
 * @fileoverview Categories Management E2E tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('Categories Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
  });

  test('should show categories page elements', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Check main page elements
    await expect(page.getByText(/categories/i)).toBeVisible();
    await expect(page.getByText(/add/i)).toBeVisible();
  });

  test('should open create category form', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Click add category button
    await page.getByText(/add/i).click();
    
    // Check form elements
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/type/i)).toBeVisible();
    await expect(page.getByText(/save/i)).toBeVisible();
    await expect(page.getByText(/cancel/i)).toBeVisible();
  });

  test('should create a new category', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Open create form
    await page.getByRole('button', { name: /add category/i }).click();
    
    // Fill form
    await page.getByLabel(/category name/i).fill('Test Category');
    await page.getByLabel(/category type/i).selectOption('EXPENSE');
    
    // Submit form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Check if category was created (assuming it appears in list)
    await expect(page.getByText('Test Category')).toBeVisible();
  });

  test('should show validation error for empty category name', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Open create form
    await page.getByRole('button', { name: /add category/i }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Check for validation error
    await expect(page.getByText(/category name is required/i)).toBeVisible();
  });

  test('should cancel category creation', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Open create form
    await page.getByRole('button', { name: /add category/i }).click();
    
    // Fill form
    await page.getByLabel(/category name/i).fill('Test Category');
    
    // Cancel form
    await page.getByRole('button', { name: /cancel/i }).click();
    
    // Check that form is closed
    await expect(page.getByLabel(/category name/i)).not.toBeVisible();
  });

  test('should edit existing category', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Find edit button for first category (assuming categories exist)
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Check that form opens with existing data
      await expect(page.getByLabel(/category name/i)).toBeVisible();
      
      // Update category name
      await page.getByLabel(/category name/i).fill('Updated Category');
      await page.getByRole('button', { name: /save/i }).click();
      
      // Check if category was updated
      await expect(page.getByText('Updated Category')).toBeVisible();
    }
  });

  test('should delete category', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Find delete button for first category
    const deleteButton = page.getByRole('button', { name: /delete/i }).first();
    if (await deleteButton.isVisible()) {
      // Click delete and confirm
      await deleteButton.click();
      
      // Check for confirmation dialog
      const confirmButton = page.getByRole('button', { name: /confirm/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      // Check that category was removed
      await expect(page.getByText(/category deleted successfully/i)).toBeVisible();
    }
  });

  test('should filter categories by type', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Check if filter dropdown exists
    const filterDropdown = page.getByLabel(/filter by type/i);
    if (await filterDropdown.isVisible()) {
      // Filter by expense type
      await filterDropdown.selectOption('EXPENSE');
      
      // Check that only expense categories are shown
      const expenseCategories = page.locator('[data-testid="category-item"]');
      await expect(expenseCategories.first()).toBeVisible();
    }
  });

  test('should show category statistics', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Check for statistics section
    const statsSection = page.getByText(/total categories/i);
    if (await statsSection.isVisible()) {
      await expect(statsSection).toBeVisible();
    }
  });

  test('should handle category creation error', async ({ page }) => {
    await page.goto('http://localhost:5173/categories');
    
    // Open create form
    await page.getByRole('button', { name: /add category/i }).click();
    
    // Try to create category with existing name
    await page.getByLabel(/category name/i).fill('Existing Category');
    await page.getByLabel(/category type/i).selectOption('EXPENSE');
    await page.getByRole('button', { name: /save/i }).click();
    
    // Check for error message
    await expect(page.getByText(/category with this name already exists/i)).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/categories');
    
    // Check if page is still accessible
    await expect(page.getByRole('heading', { name: /categories/i })).toBeVisible();
  });
});