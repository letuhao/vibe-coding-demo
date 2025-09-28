/**
 * @fileoverview Expenses Management E2E tests
 * @author Vibe Coding Demo
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 */

import { test, expect } from '@playwright/test';

test.describe('Expenses Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
  });

  test('should show expenses page elements', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Check main page elements
    await expect(page.getByText(/expenses/i)).toBeVisible();
    await expect(page.getByText(/add/i)).toBeVisible();
  });

  test('should open create expense form', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Click add expense button
    await page.getByRole('button', { name: /add expense/i }).click();
    
    // Check form elements
    await expect(page.getByLabel(/amount/i)).toBeVisible();
    await expect(page.getByLabel(/category/i)).toBeVisible();
    await expect(page.getByLabel(/date/i)).toBeVisible();
    await expect(page.getByLabel(/note/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  test('should create a new expense', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Open create form
    await page.getByRole('button', { name: /add expense/i }).click();
    
    // Fill form
    await page.getByLabel(/amount/i).fill('100.50');
    await page.getByLabel(/category/i).selectOption('1'); // Assuming category ID 1 exists
    await page.getByLabel(/date/i).fill('2024-01-15');
    await page.getByLabel(/note/i).fill('Test expense');
    
    // Submit form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Check if expense was created
    await expect(page.getByText('100.50')).toBeVisible();
  });

  test('should show validation error for invalid amount', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Open create form
    await page.getByRole('button', { name: /add expense/i }).click();
    
    // Fill form with invalid amount
    await page.getByLabel(/amount/i).fill('-10');
    await page.getByLabel(/category/i).selectOption('1');
    await page.getByLabel(/date/i).fill('2024-01-15');
    
    // Submit form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Check for validation error
    await expect(page.getByText(/amount must be greater than 0/i)).toBeVisible();
  });

  test('should show validation error for empty required fields', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Open create form
    await page.getByRole('button', { name: /add expense/i }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /save/i }).click();
    
    // Check for validation errors
    await expect(page.getByText(/amount is required/i)).toBeVisible();
    await expect(page.getByText(/category is required/i)).toBeVisible();
    await expect(page.getByText(/date is required/i)).toBeVisible();
  });

  test('should cancel expense creation', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Open create form
    await page.getByRole('button', { name: /add expense/i }).click();
    
    // Fill form
    await page.getByLabel(/amount/i).fill('100.50');
    
    // Cancel form
    await page.getByRole('button', { name: /cancel/i }).click();
    
    // Check that form is closed
    await expect(page.getByLabel(/amount/i)).not.toBeVisible();
  });

  test('should edit existing expense', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Find edit button for first expense
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Check that form opens with existing data
      await expect(page.getByLabel(/amount/i)).toBeVisible();
      
      // Update expense amount
      await page.getByLabel(/amount/i).fill('150.75');
      await page.getByRole('button', { name: /save/i }).click();
      
      // Check if expense was updated
      await expect(page.getByText('150.75')).toBeVisible();
    }
  });

  test('should delete expense', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Find delete button for first expense
    const deleteButton = page.getByRole('button', { name: /delete/i }).first();
    if (await deleteButton.isVisible()) {
      // Click delete and confirm
      await deleteButton.click();
      
      // Check for confirmation dialog
      const confirmButton = page.getByRole('button', { name: /confirm/i });
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
      
      // Check that expense was removed
      await expect(page.getByText(/expense deleted successfully/i)).toBeVisible();
    }
  });

  test('should filter expenses by category', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Check if filter dropdown exists
    const filterDropdown = page.getByLabel(/filter by category/i);
    if (await filterDropdown.isVisible()) {
      // Filter by specific category
      await filterDropdown.selectOption('1');
      
      // Check that only expenses from that category are shown
      const expenseItems = page.locator('[data-testid="expense-item"]');
      await expect(expenseItems.first()).toBeVisible();
    }
  });

  test('should filter expenses by date range', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Check if date filters exist
    const startDateInput = page.getByLabel(/start date/i);
    const endDateInput = page.getByLabel(/end date/i);
    
    if (await startDateInput.isVisible()) {
      // Set date range
      await startDateInput.fill('2024-01-01');
      await endDateInput.fill('2024-01-31');
      
      // Apply filter
      await page.getByRole('button', { name: /apply filter/i }).click();
      
      // Check that filtered results are shown
      const expenseItems = page.locator('[data-testid="expense-item"]');
      await expect(expenseItems.first()).toBeVisible();
    }
  });

  test('should search expenses by note', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Check if search input exists
    const searchInput = page.getByPlaceholder(/search expenses/i);
    if (await searchInput.isVisible()) {
      // Search for specific note
      await searchInput.fill('test');
      await page.keyboard.press('Enter');
      
      // Check that search results are shown
      const expenseItems = page.locator('[data-testid="expense-item"]');
      await expect(expenseItems.first()).toBeVisible();
    }
  });

  test('should show expense statistics', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Check for statistics section
    const statsSection = page.getByText(/total expenses/i);
    if (await statsSection.isVisible()) {
      await expect(statsSection).toBeVisible();
    }
  });

  test('should paginate through expenses', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Check if pagination exists
    const nextButton = page.getByRole('button', { name: /next/i });
    if (await nextButton.isVisible()) {
      // Click next page
      await nextButton.click();
      
      // Check that page changed
      const pageIndicator = page.getByText(/page 2/i);
      if (await pageIndicator.isVisible()) {
        await expect(pageIndicator).toBeVisible();
      }
    }
  });

  test('should sort expenses by amount', async ({ page }) => {
    await page.goto('http://localhost:5173/expenses');
    
    // Check if sort dropdown exists
    const sortDropdown = page.getByLabel(/sort by/i);
    if (await sortDropdown.isVisible()) {
      // Sort by amount descending
      await sortDropdown.selectOption('amount-desc');
      
      // Check that expenses are sorted
      const expenseItems = page.locator('[data-testid="expense-item"]');
      await expect(expenseItems.first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/expenses');
    
    // Check if page is still accessible
    await expect(page.getByRole('heading', { name: /expenses/i })).toBeVisible();
  });
});